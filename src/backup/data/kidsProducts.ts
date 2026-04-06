import type { Product } from '@/backup/data/types';

// ✅ 20 UNIQUE image URLs — each image matches its product description.
// No URL reused across this file, menProducts.ts, or womenProducts.ts.
export const kidsProducts: Product[] = [

    // ── T-SHIRTS (6) ──────────────────────────────────────────────────────────
    {
        id: 'kid-001', name: 'Graphic Dino Print Tee', category: 'Kids', subcategory: 'T-Shirts',
        price: 1499, rating: 4.5, reviews: 145, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: '100% soft cotton with a bold dino print. Durable and machine washable.',
        images: ['https://images.unsplash.com/photo-1760808573791-f2b3e6cf44d1?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-002', name: 'Classic Stripe Long-Sleeve Tee', category: 'Kids', subcategory: 'T-Shirts',
        price: 1119, originalPrice: 1599, discountPercentage: 30, isOnSale: true, rating: 4.4, reviews: 148, badge: 'SALE',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: 'Classic stripe in soft combed cotton with a relaxed fit.',
        images: ['https://plus.unsplash.com/premium_photo-1755534537397-c72659a0a70c?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-003', name: 'Essential Crew Tee 3-Pack', category: 'Kids', subcategory: 'T-Shirts',
        price: 1999, rating: 4.3, reviews: 286, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: '180 GSM combed cotton crew tees in three classic colours.',
        images: ['https://images.unsplash.com/photo-1711934047742-44a49e7225b9?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-004', name: 'Rainbow Unicorn Graphic Tee', category: 'Kids', subcategory: 'T-Shirts',
        price: 1699, rating: 4.6, reviews: 162, badge: 'NEW',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: 'Bright rainbow unicorn print on 100% organic cotton. Soft and gentle.',
        images: ['https://images.unsplash.com/photo-1760026506462-f4e0647a88c9?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-005', name: 'Waffle-Knit Thermal Top', category: 'Kids', subcategory: 'T-Shirts',
        price: 1799, rating: 4.4, reviews: 113, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: 'Cotton waffle knit long-sleeve. Lightweight warmth for layering.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2_T4vDK3vlDJxMYB34Qt2dBJd_BG7IWN3uQ&s']
    },
    {
        id: 'kid-006', name: 'Pull-On Cotton Shorts', category: 'Kids', subcategory: 'T-Shirts',
        price: 1499, rating: 4.3, reviews: 198, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        description: 'Elasticated waist cotton shorts with side pockets. Playground-ready.',
        images: ['https://m.media-amazon.com/images/I/51yD2pcRqYL.jpg']
    },

    // ── HOODIES (4) ──────────────────────────────────────────────────────────
    {
        id: 'kid-007', name: 'Fleece Zip-Up Hoodie', category: 'Kids', subcategory: 'Hoodies',
        price: 2299, rating: 4.5, reviews: 156, badge: '',
        sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
        description: 'Anti-pill polar fleece with a full-zip and two hand pockets.',
        images: ['https://images.unsplash.com/photo-1588932250351-36235af5c0f0?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-008', name: 'Tie-Dye Pullover Hoodie', category: 'Kids', subcategory: 'Hoodies',
        price: 1399, originalPrice: 1999, discountPercentage: 30, isOnSale: true, rating: 4.4, reviews: 165, badge: 'SALE',
        sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'],
        description: 'Spiral tie-dye on a midweight French terry. Every piece is unique.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReExE6w8yDbDL3BETI7OqcUi8iy0TBE9H7Ig&s']
    },
    {
        id: 'kid-009', name: 'Rainbow Sweatshirt', category: 'Kids', subcategory: 'Hoodies',
        price: 1259, originalPrice: 1799, discountPercentage: 30, isOnSale: true, rating: 4.7, reviews: 110, badge: 'SALE',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
        description: 'Bright rainbow graphic on a soft French terry sweatshirt.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBmu6mrfXzmPfOeeFWjwZ1Y1qY2W7UBoWFag&s']
    },
    {
        id: 'kid-010', name: 'Cable Knit Cardigan', category: 'Kids', subcategory: 'Hoodies',
        price: 2199, rating: 4.6, reviews: 89, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        description: 'Cosy cable-knit button-up cardigan for chilly evenings.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT590fnVI25CFQGkbAn8GC1nIVeK22PBeL69w&s']
    },

    // ── DRESSES (4) ──────────────────────────────────────────────────────────
    {
        id: 'kid-011', name: 'Tutu Party Dress', category: 'Kids', subcategory: 'Dresses',
        price: 2299, rating: 4.7, reviews: 87, badge: 'NEW',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        description: 'Layered tulle skirt with a velvet bodice. Perfect for birthdays.',
        images: ['https://images.unsplash.com/photo-1759313560222-b73784cd42f6?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-012', name: 'Floral Smock Dress', category: 'Kids', subcategory: 'Dresses',
        price: 2199, rating: 4.7, reviews: 94, badge: '',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        description: 'Liberty-print cotton voile with elasticated smocking at chest.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRWEJGKJQJwgs_gle1tZGH448KA2xAYl82Ww&s']
    },
    {
        id: 'kid-013', name: 'Sequin Star Party Dress', category: 'Kids', subcategory: 'Dresses',
        price: 2499, rating: 4.8, reviews: 61, badge: 'LIMITED',
        sizes: ['3-4Y', '5-6Y', '7-8Y'],
        description: 'All-over sequin star pattern with a velvet sash bow at the back.',
        images: ['https://images.unsplash.com/photo-1765947385050-de05b045b6ed?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-014', name: 'Cotton Sun Dress', category: 'Kids', subcategory: 'Dresses',
        price: 1259, originalPrice: 1799, discountPercentage: 30, isOnSale: true, rating: 4.5, reviews: 109, badge: 'SALE',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        description: 'Breezy 100% cotton sun dress with adjustable straps and a smocked back.',
        images: ['https://houseofauromo.com/cdn/shop/files/001A0119.jpg?v=1713076165&width=1946']
    },
    // ── SNEAKERS (3) ─────────────────────────────────────────────────────────
    {
        id: 'kid-015', name: 'LED Light-Up Sneakers', category: 'Kids', subcategory: 'Sneakers',
        price: 1999, rating: 4.6, reviews: 263, badge: '',
        sizes: ['4', '5', '6', '7', '8', '9'],
        description: 'Breathable mesh with LED light-up soles and velcro closure.',
        images: ['https://images.unsplash.com/photo-1583979365152-173a8f14181b?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-016', name: 'Classic High-Top Canvas', category: 'Kids', subcategory: 'Sneakers',
        price: 2199, rating: 4.7, reviews: 201, badge: '',
        sizes: ['4', '5', '6', '7', '8', '9', '10'],
        description: 'Durable canvas high-top with rubber toecap. Playground classic.',
        images: ['https://images.unsplash.com/photo-1742390887563-4d8d2a673ae7?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-017', name: 'Canvas Slip-On Shoes', category: 'Kids', subcategory: 'Sneakers',
        price: 1189, originalPrice: 1699, discountPercentage: 30, isOnSale: true, rating: 4.4, reviews: 188, badge: 'SALE',
        sizes: ['4', '5', '6', '7', '8', '9'],
        description: 'Elastic-gusset canvas slip-ons. No laces, no fuss.',
        images: ['https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2026/JANUARY/14/YElUr2uF_65e0ddfea3104850b530efdf9326c854.jpg']
    },

    // ── ACCESSORIES (3) ──────────────────────────────────────────────────────
    {
        id: 'kid-018', name: 'Mesh Trucker Cap', category: 'Kids', subcategory: 'Accessories',
        price: 1499, rating: 4.4, reviews: 109, badge: '',
        sizes: ['ONE SIZE'],
        description: '5-panel mesh-back trucker with an adjustable snapback closure.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFrTPsx9d9HCxKTXZ2bPl2h03y1l__QvQFxw&s']
    },
    {
        id: 'kid-019', name: 'Wide-Brim Bucket Hat', category: 'Kids', subcategory: 'Accessories',
        price: 1499, rating: 4.4, reviews: 137, badge: '',
        sizes: ['ONE SIZE'],
        description: 'Wide-brim bucket in UPF 50+ cotton canvas with chin strap.',
        images: ['https://images.unsplash.com/photo-1749816220966-128ce22f5381?w=800&auto=format&fit=crop&q=80']
    },
    {
        id: 'kid-020', name: 'Pom-Pom Beanie', category: 'Kids', subcategory: 'Accessories',
        price: 1599, rating: 4.7, reviews: 167, badge: '',
        sizes: ['ONE SIZE'],
        description: 'Double-layered rib knit with a matching oversized pom-pom on top.',
        images: ['https://images.unsplash.com/photo-1578019857395-bcfccf0ffb30?w=800&auto=format&fit=crop&q=80']
    },
];
