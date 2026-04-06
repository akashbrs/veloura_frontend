export type { Product, StyleTag } from '@/backup/data/types';
export { menProducts } from '@/backup/data/menProducts';
export { womenProducts } from '@/backup/data/womenProducts';
export { kidsProducts } from '@/backup/data/kidsProducts';

import type { Product, StyleTag } from '@/backup/data/types';
import { menProducts } from '@/backup/data/menProducts';
import { womenProducts } from '@/backup/data/womenProducts';
import { kidsProducts } from '@/backup/data/kidsProducts';

/* ─── Style tag enrichment ────────────────────────────────────────────────────
 * We assign styleTags, season, isBestseller, and isNewDrop based on
 * subcategory rules and badge field, so we don't need to change individual
 * product objects. Add new subcategory mappings here as the catalog grows.
 * ─────────────────────────────────────────────────────────────────────────── */

type SubcategoryRule = {
    styleTags: StyleTag[];
    season?: 'summer' | 'winter' | 'all';
};

const SUBCATEGORY_RULES: Record<string, SubcategoryRule> = {
    'T-Shirts': { styleTags: ['lightweight', 'breathable', 'summer', 'casual'], season: 'summer' },
    'Tops': { styleTags: ['lightweight', 'breathable', 'summer', 'casual'], season: 'summer' },
    'Dresses': { styleTags: ['lightweight', 'breathable', 'summer', 'casual', 'party', 'ethnic'], season: 'summer' },
    'Skirts': { styleTags: ['lightweight', 'summer', 'casual', 'party'], season: 'summer' },
    'Footwear': { styleTags: ['casual'], season: 'all' },
    'Sneakers': { styleTags: ['casual'], season: 'all' },
    'Accessories': { styleTags: ['casual', 'seasonal', 'ethnic'], season: 'all' },
    'Formal Shirts': { styleTags: ['formal', 'breathable'], season: 'all' },
    'Jeans': { styleTags: ['casual'], season: 'all' },
    'Hoodies': { styleTags: ['knitwear', 'winter', 'casual'], season: 'winter' },
    'Jackets': { styleTags: ['jackets', 'outerwear', 'winter'], season: 'winter' },
    'Blazers': { styleTags: ['formal', 'party', 'jackets', 'outerwear', 'seasonal'], season: 'all' },
};

function enrichProduct(p: Product): Product {
    const rule = SUBCATEGORY_RULES[p.subcategory];
    return {
        ...p,
        styleTags: rule?.styleTags ?? ['casual'],
        season: rule?.season ?? 'all',
        isBestseller: p.badge === '' && (p.reviews || 0) > 200,   // high-review items without a badge are organic bestsellers
        isNewDrop: p.badge === 'NEW' || p.isNewDrop,
    };
}

const raw: Product[] = [...menProducts, ...womenProducts, ...kidsProducts];
export const allProducts: Product[] = raw.map(enrichProduct);
