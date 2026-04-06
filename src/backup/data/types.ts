export type StyleTag =
    | 'lightweight'
    | 'breathable'
    | 'summer'
    | 'winter'
    | 'jackets'
    | 'outerwear'
    | 'formal'
    | 'casual'
    | 'party'
    | 'ethnic'
    | 'seasonal'
    | 'knitwear';

export interface Product {
    id: string;
    _id?: string;
    name: string;
    category: 'Men' | 'Women' | 'Kids';
    subcategory: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    isOnSale?: boolean;
    rating: number;
    reviews?: number;
    numReviews?: number;
    badge: 'NEW' | 'SALE' | 'LIMITED' | '';
    sizes: string[];
    description: string;
    images: string[];
    season?: 'summer' | 'winter' | 'all';
    styleTags?: StyleTag[];
    isBestseller?: boolean;
    isNewDrop?: boolean;
}
