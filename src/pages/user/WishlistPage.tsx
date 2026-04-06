import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toastService } from '@/services/toastService';
import { fetchWishlist, removeFromWishlist, moveWishlistToCart, moveAllWishlistToCart } from '@/redux/slices/wishlistSlice';
import { fetchCart } from '@/redux/slices/cartSlice';
import type { AppDispatch, RootState } from '@/redux';
import type { WishlistProduct } from '@/redux/slices/wishlistSlice';

/* ─── Skeleton Card ─────────────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="bg-[#eee] aspect-[3/4] rounded-lg mb-4" />
        <div className="h-3 bg-[#eee] rounded w-1/3 mb-2" />
        <div className="h-4 bg-[#eee] rounded w-2/3 mb-2" />
        <div className="h-4 bg-[#eee] rounded w-1/4 mb-4" />
        <div className="h-10 bg-[#eee] rounded" />
    </div>
);

/* ─── Wishlist Card ──────────────────────────────────────────────────────── */
interface WishlistCardProps {
    product: WishlistProduct;
    onRemove: (id: string) => void;
    onAddToBag: (product: WishlistProduct) => void;
    isAddedToBag: boolean;
}

const WishlistCard = ({ product, onRemove, onAddToBag, isAddedToBag }: WishlistCardProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="group relative bg-white"
        >
            {/* Remove button */}
            <button
                onClick={() => onRemove(product.productId)}
                className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#999] hover:text-[#0a0a0a] hover:bg-white transition-all shadow-sm"
                aria-label="Remove from wishlist"
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
                </svg>
            </button>

            {/* Product image */}
            <Link to={`/product/${product.productId}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#f5f4f2] mb-4 cursor-pointer">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            {/* Brand */}
            {product.brand && (
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999] mb-1">
                    {product.brand}
                </p>
            )}

            {/* Product name */}
            <Link to={`/product/${product.productId}`}>
                <h3 className="text-sm font-semibold text-[#0a0a0a] uppercase tracking-wide leading-tight mb-1.5 line-clamp-2 hover:underline cursor-pointer">
                    {product.name}
                </h3>
            </Link>

            {/* Price */}
            <p className="text-sm font-bold text-[#0a0a0a] mb-4">
                ₹{product.price?.toLocaleString('en-IN')}
            </p>

            {/* Add to Bag CTA */}
            <motion.button
                onClick={() => onAddToBag(product)}
                disabled={isAddedToBag}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isAddedToBag
                    ? 'bg-[#2d6a2e] text-white cursor-default'
                    : 'bg-[#0a0a0a] text-white hover:bg-[#333]'
                    }`}
            >
                {isAddedToBag ? '✓ Added to Bag' : 'Add to Bag'}
            </motion.button>
        </motion.div>
    );
};

/* ─── WishlistPage ───────────────────────────────────────────────────────── */
const WishlistPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { items: wishlistItems, loading } = useSelector((state: RootState) => state.wishlist);
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { items: cartItems } = useSelector((state: RootState) => state.cart);

    const [addedToBag, setAddedToBag] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, userInfo]);

    /* ── Check which wishlist items are already in the cart ──────────────── */
    useEffect(() => {
        const inCart = new Set<string>();
        cartItems.forEach((item) => {
            if (item.product) inCart.add(item.product);
        });
        setAddedToBag(inCart);
    }, [cartItems]);

    /* ── Handlers ─────────────────────────────────────────────────────────── */
    const handleRemove = async (productId: string) => {
        const res = await dispatch(removeFromWishlist(productId));
        if (res.meta.requestStatus === 'fulfilled') {
            toastService.info('Removed from wishlist');
        }
    };

    const handleAddToBag = async (product: WishlistProduct) => {
        if (!product || !product.productId) {
            console.error("Invalid product object", product);
            toastService.error("Unable to move undefined product to bag");
            return;
        }

        const res = await dispatch(moveWishlistToCart({
            productId: product.productId,
            size: 'M',
            quantity: 1,
        }));
        if (res.meta.requestStatus === 'fulfilled') {
            toastService.success(`${product.name} moved to bag!`, [
                { label: 'View Cart', path: '/cart' },
                { label: 'Checkout', path: '/checkout' }
            ], product.productId, `${product.name} moved`);
            dispatch(fetchCart());
            setAddedToBag((prev) => new Set(prev).add(product.productId));
        }
    };

    const handleMoveAllToBag = async () => {
        const res = await dispatch(moveAllWishlistToCart('M'));
        if (res.meta.requestStatus === 'fulfilled') {
            toastService.success('All items moved to bag!', { label: 'View Cart', path: '/cart' });
            dispatch(fetchCart());
        }
    };

    /* ── Not logged in ─────────────────────────────────────────────────────── */
    if (!userInfo) {
        return (
            <div className="pt-32 pb-24 min-h-screen bg-white">
                <div className="max-w-[1300px] mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight mb-4">Wishlist</h1>
                    <p className="text-[#999] mb-8">Please log in to view your wishlist</p>
                    <Link
                        to="/login?redirect=/wishlist"
                        className="inline-block bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#333] transition-colors"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-24 min-h-screen bg-white">
            <div className="max-w-[1300px] mx-auto px-6">

                {/* ═══ Header ═══════════════════════════════════════════════ */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0a0a0a] tracking-tight">
                        Wishlist
                        {wishlistItems.length > 0 && (
                            <span className="text-[#999] font-normal ml-2">({wishlistItems.length})</span>
                        )}
                    </h1>

                    {wishlistItems.length > 0 && (
                        <motion.button
                            onClick={handleMoveAllToBag}
                            whileTap={{ scale: 0.97 }}
                            className="text-xs font-bold uppercase tracking-[0.15em] text-[#0a0a0a] border border-[#0a0a0a] px-6 py-2.5 hover:bg-[#0a0a0a] hover:text-white transition-colors"
                        >
                            Move all to Bag
                        </motion.button>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e5e5e5] mb-8" />

                {/* ═══ Loading ═════════════════════════════════════════════ */}
                {loading && wishlistItems.length === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* ═══ Empty State ═════════════════════════════════════════ */}
                {!loading && wishlistItems.length === 0 && (
                    <div className="text-center py-20">
                        {/* Heart icon */}
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f5f4f2] flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-[#0a0a0a] mb-3">
                            Your Wishlist is Empty
                        </h2>
                        <p className="text-sm text-[#999] mb-8 max-w-sm mx-auto">
                            Save items you love to your wishlist.
                            Review them anytime and easily move them to your bag.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#333] transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {/* ═══ Wishlist Grid ═══════════════════════════════════════ */}
                {wishlistItems.length > 0 && (
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
                        >
                            {wishlistItems.map((product) => (
                                <WishlistCard
                                    key={product.productId}
                                    product={product}
                                    onRemove={handleRemove}
                                    onAddToBag={handleAddToBag}
                                    isAddedToBag={addedToBag.has(product.productId)}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
