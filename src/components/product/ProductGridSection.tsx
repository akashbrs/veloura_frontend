import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useDispatch, useSelector } from 'react-redux';
import { toastService } from '@/services/toastService';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addGuestItem, addCartItem } from '@/redux/slices/cartSlice';
import { fetchProducts as fetchProductsFromService } from '@/services/productDataService';
import type { AppDispatch, RootState } from '@/redux';
import type { Product } from '@/types';

/* ─── Category filter tabs ───────────────────────────────────────────────── */
const FILTERS = ['All', 'Men', 'Women', 'Kids'] as const;
type Filter = typeof FILTERS[number];

/* ─── Category badge colours ─────────────────────────────────────────────── */
const BADGE: Record<string, string> = {
    Men: 'bg-[#f0f0f0] text-[#0a0a0a]',
    Women: 'bg-[#faf0f5] text-[#8b4a6e]',
    Kids: 'bg-[#f0f7f0] text-[#2e6e3e]',
};

/* ─── Category fallback images for local products ────────────────────────── */
const CATEGORY_FALLBACKS: Record<string, string> = {
    'Men': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80',
    'Women': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    'Kids': 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=80'
};

/* ─── Section ────────────────────────────────────────────────────────────── */
const ProductGridSection = () => {
    // Component State Localized as requested
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Filter>('All');
    const [loading, setLoading] = useState(true);

    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

    // Fetch Products — API first, local JSON fallback
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProductsFromService({
                    sort: 'new',
                    limit: 8,
                    category: category !== 'All' ? category : undefined,
                });
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                toastService.error("Unable to load new arrivals");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [category]);

    // Reset pagination when category changes
    const handleCategorySelect = (f: Filter) => {
        setCategory(f);
    };

    const handleWishlistToggle = (e: React.MouseEvent, product: any, isInWishlist: boolean) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userInfo) {
            navigate('/login');
            return;
        }

        const productId = product._id || product.id;

        if (isInWishlist) {
            dispatch(removeFromWishlist(productId));
            toastService.info('Removed from wishlist');
        } else {
            dispatch(addToWishlist({
                productId: productId,
                name: product.name,
                image: product.images?.[0] || CATEGORY_FALLBACKS[product.category],
                price: product.price,
                category: product.category
            }));
        }
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const productId = product._id || product.id;
        const isMongoId = /^[a-f\d]{24}$/i.test(productId ?? '');

        const cartItem = {
            product: productId,
            name: product.name,
            image: product.images?.[0] || CATEGORY_FALLBACKS[product.category],
            price: product.price,
            quantity: 1,
            size: 'M',
            stock: product.stock ?? 10,
        };

        if (!userInfo || !isMongoId) {
            // Guest or Local-only product
            dispatch(addGuestItem(cartItem));
            toastService.success(`${product.name} added to bag!`, [
                { label: 'View Bag', path: '/cart' },
                { label: 'Checkout', path: '/checkout' }
            ], productId, `${product.name} added`);
        } else {
            // Logged in + Mongo ID
            dispatch(addCartItem({
                ...cartItem,
                category: product.category
            }) as any).then((res: any) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toastService.success(`${product.name} added to cart!`, [
                        { label: 'View Cart', path: '/cart' },
                        { label: 'Checkout', path: '/checkout' }
                    ], productId, `${product.name} added`);
                } else {
                    toastService.error(res.payload || 'Failed to add to cart');
                }
            });
        }
    };

    return (
        <section ref={sectionRef} className="vx-section bg-[#f5f5f5] min-h-[600px]">
            <div className="vx-container">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12" data-animate>
                    <div>
                        <p className="vx-label text-[#9a9a9a] mb-3">New Season</p>
                        <h2 className="vx-heading text-[#0a0a0a]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                            New Arrivals
                        </h2>
                        <p className="text-[#9a9a9a] text-sm font-light mt-2">
                            Fresh picks from across all collections.
                        </p>
                    </div>

                    {/* Category filter tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => handleCategorySelect(f)}
                                className={`vx-label px-6 py-2.5 rounded-full transition-all duration-200 text-xs ${category === f
                                    ? 'bg-[#0a0a0a] text-white'
                                    : 'bg-white text-[#9a9a9a] hover:text-[#0a0a0a] border border-transparent hover:border-[#e0e0e0]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Status (Loading / Empty / Grid) */}
                {loading ? (
                    <div className="flex justify-center items-center py-20 min-h-[400px]">
                        <div className="w-10 h-10 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 min-h-[400px] bg-white rounded-3xl" data-animate>
                        <p className="text-3xl font-black text-[#0a0a0a] mb-2" style={{ fontFamily: 'var(--vx-font-display)' }}>
                            No products found
                        </p>
                        <p className="text-[#9a9a9a] text-sm">Check back later for new arrivals.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-animate data-delay="100">
                        {products.map((product: Product, idx: number) => {
                            const productId = (product as any)._id || product.id || `p-${idx}`;
                            const isInWishlist = wishlistItems.some(item => item.productId === productId);

                            return (
                                <Link
                                    key={productId}
                                    to={`/product/${productId}`}
                                    className="group block"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#e8e8e8] mb-3">
                                        <img
                                            src={product.images?.[0] || CATEGORY_FALLBACKS[product.category]}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                            loading="lazy"
                                        />

                                        {/* Hover tint */}
                                        <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/10 transition-all duration-300" />

                                        {/* Action bar */}
                                        <div className="absolute bottom-3 inset-x-3 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                aria-label="Add to cart"
                                                onClick={e => handleAddToCart(e, product)}
                                                className="flex-1 bg-white/95 backdrop-blur-sm text-[#0a0a0a] py-2 rounded-full vx-label flex items-center justify-center gap-1.5 hover:bg-[#0a0a0a] hover:text-white transition-colors text-[10px]"
                                            >
                                                <FiShoppingCart className="w-3 h-3" strokeWidth={2} />
                                                Add to Bag
                                            </button>
                                            <button
                                                aria-label={isInWishlist ? "Remove from wishlist" : "Save"}
                                                onClick={e => handleWishlistToggle(e, product, isInWishlist)}
                                                className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isInWishlist
                                                    ? 'bg-white text-red-500 hover:bg-gray-100'
                                                    : 'bg-white/95 text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white'
                                                    }`}
                                            >
                                                <FiHeart className={`w-3 h-3 ${isInWishlist ? 'fill-current' : ''}`} strokeWidth={2} />
                                            </button>
                                        </div>

                                        {/* Category badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={`vx-label text-[9px] px-2.5 py-1 rounded-full ${BADGE[product.category] ?? 'bg-white/80 text-[#0a0a0a]'}`}>
                                                {product.category?.toUpperCase() || 'GENERAL'}
                                            </span>
                                        </div>

                                        {/* NEW badge if applicable */}
                                        {(product.isNewDrop || product.badge === 'NEW') && (
                                            <div className="absolute top-3 right-3">
                                                <span className="vx-label text-[9px] px-2.5 py-1 rounded-full bg-[#0a0a0a] text-white">
                                                    NEW
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Name + Price */}
                                    <div className="flex items-start justify-between gap-2 px-0.5">
                                        <p className="font-medium text-[#0a0a0a] text-sm tracking-tight leading-snug">
                                            {product.name}
                                        </p>
                                        <p className="font-semibold text-[#0a0a0a] text-sm flex-shrink-0">
                                            ₹{product.price?.toLocaleString('en-IN') || 0}
                                        </p>
                                    </div>

                                    {/* Subcategory label */}
                                    <p className="text-[#9a9a9a] text-xs mt-0.5 px-0.5">{product.subcategory || product.category}</p>
                                </Link>
                            )
                        })}
                    </div>
                )}



                <div className="mt-12 text-center" data-animate data-delay="200">
                    <Link to="/shop" className="vx-btn vx-btn-outline inline-flex items-center gap-2 group">
                        View Full Collection 
                        <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default ProductGridSection;
