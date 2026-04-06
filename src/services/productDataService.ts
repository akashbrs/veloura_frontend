import api from '@/services/api';
import type { Product } from '@/types';
import { STYLE_FILTER_REGISTRY } from '@/utils/filterProducts';

/* ─── Local Product Cache ────────────────────────────────────────────────── */
let cachedProducts: Product[] | null = null;

/**
 * Load the static product catalog from public/data/products.json.
 * Caches the result for subsequent calls.
 */
async function loadLocalProducts(): Promise<Product[]> {
    if (cachedProducts) return cachedProducts;

    try {
        const res = await fetch('/data/products.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        cachedProducts = data.products || [];
        return cachedProducts!;
    } catch (err) {
        console.error('[ProductDataService] Failed to load local products:', err);
        return [];
    }
}

/* ─── Client-Side Filtering ──────────────────────────────────────────────── */

function applyStyleFilter(products: Product[], style: string): Product[] {
    const def = STYLE_FILTER_REGISTRY[style];
    if (!def) return products;

    return products.filter(p => {
        if (def.bestseller && !p.isBestseller) return false;
        if (def.newDrop && !p.isNewDrop) return false;
        if (def.subcategory && p.subcategory !== def.subcategory) return false;
        if (def.isOnSale && !p.isOnSale) return false;

        if (def.seasons && def.seasons.length > 0) {
            if (!p.season || !def.seasons.includes(p.season)) {
                if (!def.tags || !def.tags.length) return false;
            }
        }

        if (def.tags && def.tags.length > 0 && p.styleTags && p.styleTags.length > 0) {
            const matches = def.tags.some(t => p.styleTags!.includes(t));
            if (matches) return true;
            if (def.seasons && p.season && def.seasons.includes(p.season)) return true;
            return false;
        }
        return true;
    });
}

type SortKey = 'price_asc' | 'price_desc' | 'discount' | 'rating' | 'numReviews' | 'new' | string;

function applySort(products: Product[], sort?: string): Product[] {
    if (!sort) return products;
    const sorted = [...products];
    switch (sort as SortKey) {
        case 'price_asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'discount':
            return sorted.sort((a, b) => {
                const discA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
                const discB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
                return discB - discA;
            });
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'numReviews':
            return sorted.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
        case 'new':
            return sorted.sort((a, b) => {
                if (a.isNewDrop && !b.isNewDrop) return -1;
                if (!a.isNewDrop && b.isNewDrop) return 1;
                return 0;
            });
        default:
            return sorted;
    }
}

function filterLocalProducts(
    allProducts: Product[],
    params: Record<string, any>
): { products: Product[]; page: number; pages: number } {
    let filtered = [...allProducts];

    // Category
    if (params.category && params.category !== 'All') {
        const cat = params.category.charAt(0).toUpperCase() + params.category.slice(1).toLowerCase();
        filtered = filtered.filter(p => p.category === cat);
    }

    // Keyword search
    if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(kw))
        );
    }

    // Style filter
    if (params.style) {
        filtered = applyStyleFilter(filtered, params.style);
    }

    // Price range
    if (params.price_gte) {
        filtered = filtered.filter(p => p.price >= Number(params.price_gte));
    }
    if (params.price_lte && Number(params.price_lte) !== Infinity) {
        filtered = filtered.filter(p => p.price <= Number(params.price_lte));
    }

    // Sort
    filtered = applySort(filtered, params.sort);

    // Pagination
    const limit = Number(params.limit) || 8;
    const page = Number(params.page) || 1;
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
        products: paginated,
        page,
        pages: totalPages
    };
}

/* ─── Public API ─────────────────────────────────────────────────────────── */

/**
 * Fetch product list — exclusively uses local JSON since new backend doesn't support products yet.
 */
export async function fetchProducts(params: Record<string, any> = {}): Promise<any> {
    const allProducts = await loadLocalProducts();
    return filterLocalProducts(allProducts, params);
}

/**
 * Fetch a single product by ID — exclusively uses local JSON.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
    const allProducts = await loadLocalProducts();
    const product = allProducts.find(p => p._id === id || (p as any).id === id);
    return product || null;
}
