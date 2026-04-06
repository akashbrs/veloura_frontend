import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toastService } from '@/services/toastService';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addGuestItem, addCartItem } from '@/redux/slices/cartSlice';
import type { AppDispatch, RootState } from '@/redux';
import type { Product } from '@/types';

// Star rating — supports half-stars visually via gradient trick
const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
    <div className="flex items-center gap-1.5 mt-2">
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => {
                const filled = rating >= star;
                const half = !filled && rating >= star - 0.5;
                return (
                    <span key={star} className="relative w-3.5 h-3.5 inline-block">
                        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-[#e8e8e8] fill-current absolute inset-0">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {(filled || half) && (
                            <svg
                                viewBox="0 0 20 20"
                                className="w-3.5 h-3.5 fill-[#0a0a0a] absolute inset-0"
                                style={half ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        )}
                    </span>
                );
            })}
        </div>
        <span className="text-[11px] text-[#9a9a9a]">({reviews})</span>
    </div>
);

const CATEGORY_FALLBACKS: Record<string, string> = {
    'Men': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80',
    'Women': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    'Kids': 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=80'
};

const VeloraProductCard = ({ product }: { product: Product }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

    const isInWishlist = wishlistItems.some((item: any) => item.productId === (product._id || (product as any).id));

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userInfo) {
            navigate('/login');
            return;
        }

        const productId = product._id || (product as any).id;
        if (isInWishlist) {
            dispatch(removeFromWishlist(productId));
            toastService.info('Removed from wishlist');
        } else {
            dispatch(addToWishlist({
                productId: productId,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || CATEGORY_FALLBACKS[product.category],
                category: product.category
            }));
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = product._id || (product as any).id;
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
            // Guest OR local-only product — add to localStorage (avoids /api/cart/add 400 for slugs)
            dispatch(addGuestItem(cartItem));
            toastService.success(`${product.name} added to cart!`, [
                { label: 'View Cart', path: '/cart' },
                { label: 'Checkout', path: '/checkout' }
            ], productId, `${product.name} added`);
        } else {
            // Logged in + valid backend product — add via API
            dispatch(addCartItem({
                product: productId,
                quantity: 1,
                size: 'M',
                name: product.name,
                image: product.images?.[0] || CATEGORY_FALLBACKS[product.category],
                price: product.price,
                category: product.category,
                description: product.description
            }) as any).then((res: any) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toastService.success(`${product.name} added to bag!`, [
                        { label: 'View Bag', path: '/cart' },
                        { label: 'Checkout', path: '/checkout' }
                    ], productId, `${product.name} added`);
                } else {
                    toastService.error(res.payload || 'Failed to add to cart');
                }
            });
        }
    };

    const [imgError, setImgError] = useState(false);
    const imageUrl = imgError ? CATEGORY_FALLBACKS[product.category] : (product.images?.[0] || CATEGORY_FALLBACKS[product.category]);

    return (
        <div className="group relative">
            {/* Image container */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f5f5f5] mb-4">
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    onError={() => {
                        console.warn(`[Image Error] Failed to load image for ${product._id || (product as any).id}. Using fallback.`);
                        setImgError(true);
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />

                {/* Badge Container */}
                <div className="absolute top-3 left-3 z-10">
                    {product.isOnSale && product.originalPrice && (
                        <div className="bg-[#fff0f0] text-[#c00000] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight shadow-sm border border-[#ffdfdf]">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                    )}
                </div>

                {/* Wishlist button — always visible on mobile, hover on desktop */}
                <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-all ${isInWishlist ? 'text-red-500' : 'text-[#9a9a9a] md:opacity-0 group-hover:opacity-100'}`}
                >
                    <FiHeart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>

                {/* Hover action row — slides up from bottom */}
                <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-[#0a0a0a]/90 backdrop-blur-sm text-white py-2.5 rounded-full vx-label flex items-center justify-center gap-1.5 hover:bg-[#0a0a0a] transition-colors"
                    >
                        <FiShoppingCart className="w-3.5 h-3.5" strokeWidth={2} />
                        Add to Bag
                    </button>
                    <Link
                        to={`/product/${product._id || (product as any).id}`}
                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0a0a0a] hover:bg-white transition-colors flex-shrink-0"
                    >
                        <FiEye className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Info */}
            <div>
                <p className="text-[11px] text-[#9a9a9a] vx-label mb-1">{product.subcategory || product.category}</p>
                <Link to={`/product/${product._id || (product as any).id}`} className="block">
                    <h3
                        className="font-semibold text-[#0a0a0a] text-sm leading-snug tracking-tight hover:opacity-60 transition-opacity line-clamp-1"
                        style={{ fontFamily: 'var(--vx-font-display)' }}
                    >
                        {product.name}
                    </h3>
                </Link>
                <StarRating rating={product.rating} reviews={product.numReviews || (product as any).reviews || 0} />
                <div className="mt-2 flex items-center gap-2">
                    <span className="font-semibold text-[#0a0a0a] text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[12px] text-[#9a9a9a] line-through font-normal">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VeloraProductCard;
