import type { Product } from '@/types';

/* ─── Style filter registry ─────────────────────────────────────────────────
 * Each key is the URL ?style= value.
 * Add new entries here to support new banners — no code changes elsewhere needed.
 * ─────────────────────────────────────────────────────────────────────────── */
export interface StyleFilterDef {
    /** Human-readable label shown in the "Filtered by:" badge */
    label: string;
    /** Optional: restrict to certain categories */
    categories?: string[];
    /** Match products whose season equals one of these */
    seasons?: string[];
    /** Match products whose styleTags intersect with these */
    tags?: string[];
    /** If true, only show bestsellers */
    bestseller?: boolean;
    /** If true, only show new drops */
    newDrop?: boolean;
    /** If set, only show products from this subcategory */
    subcategory?: string;
    /** If true, only show products on sale */
    isOnSale?: boolean;
}

export const STYLE_FILTER_REGISTRY: Record<string, StyleFilterDef> = {
    casual: {
        label: 'Casual',
        tags: ['casual'],
    },
    party: {
        label: 'Party',
        tags: ['party'],
    },
    formal: {
        label: 'Formal',
        tags: ['formal'],
    },
    ethnic: {
        label: 'Ethnic',
        tags: ['ethnic'],
    },
    summer: {
        label: 'Summer Edit',
        seasons: ['summer'],
        tags: ['lightweight', 'breathable', 'summer'],
    },
    jackets: {
        label: 'Jackets & Outerwear',
        tags: ['jackets', 'outerwear'],
        subcategory: 'Jackets',
    },
    bestseller: {
        label: 'Bestsellers',
        bestseller: true,
    },
    new: {
        label: 'New Drops',
        newDrop: true,
    },
    winter: {
        label: 'Winter Edit',
        seasons: ['winter'],
        tags: ['winter', 'knitwear'],
    },
    knitwear: {
        label: 'Knitwear',
        tags: ['knitwear'],
    },
    // SS 2026 = seasonal (new-season items with the seasonal tag)
    ss2026: {
        label: 'SS 2026',
        tags: ['seasonal'],
    },
    sale: {
        label: 'End of Season Sale',
        isOnSale: true,
    },
};

/* ─── Core filter utility ────────────────────────────────────────────────── */

export interface FilterOptions {
    category?: string;           // 'Men' | 'Women' | 'Kids' | 'All'
    style?: string;              // key from STYLE_FILTER_REGISTRY
    priceMin?: number;
    priceMax?: number;
}

/**
 * Returns filtered product list.
 * Order of operations: category → style → price.
 * Sorting is handled separately in the component.
 */
export function filterProducts(products: Product[], opts: FilterOptions): Product[] {
    let list = Array.isArray(products) ? [...products] : [];

    // 1. Category
    if (opts.category && opts.category !== 'All') {
        list = list.filter(p => p.category === opts.category);
    }

    // 2. Style
    if (opts.style) {
        const def = STYLE_FILTER_REGISTRY[opts.style];
        if (def) {
            list = list.filter(p => {
                // Bestseller flag
                if (def.bestseller && !p.isBestseller) return false;
                // New drop flag
                if (def.newDrop && !p.isNewDrop) return false;
                // Subcategory
                if (def.subcategory && p.subcategory !== def.subcategory) return false;
                // Sale filter
                if (def.isOnSale && !p.isOnSale) return false;
                // Season match
                if (def.seasons && def.seasons.length > 0) {
                    if (!p.season || !def.seasons.includes(p.season)) {
                        // Don't hard-exclude if season field missing — check tags below
                        if (!def.tags || !def.tags.length) return false;
                    }
                }
                // Tag intersection
                if (def.tags && def.tags.length > 0 && p.styleTags && p.styleTags.length > 0) {
                    const matches = def.tags.some(t => p.styleTags!.includes(t as any));
                    if (matches) return true;
                    // If we matched season, still include even without tag match
                    if (def.seasons && p.season && def.seasons.includes(p.season)) return true;
                    return false;
                }
                return true;
            });
        }
    }

    // 3. Price range
    if (opts.priceMin !== undefined) list = list.filter(p => p.price >= opts.priceMin!);
    if (opts.priceMax !== undefined && opts.priceMax !== Infinity) {
        list = list.filter(p => p.price < opts.priceMax!);
    }

    return list;
}

/** Lookup a style label for display, returns undefined if key unknown */
export function getStyleLabel(style: string): string | undefined {
    return STYLE_FILTER_REGISTRY[style]?.label;
}
