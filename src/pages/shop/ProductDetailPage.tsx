import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiChevronDown, FiClock, FiTruck, FiPackage, FiCalendar, FiCheck } from 'react-icons/fi';
import { toastService } from '@/services/toastService';
import SizeGuideModal from '@/components/product/SizeGuideModal';

import { getProductDetails, clearProductDetails } from '@/redux/slices/productSlice';
import { addCartItem, addGuestItem } from '@/redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import type { AppDispatch, RootState } from '@/redux';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Utility                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sub-components                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

/** Full-colour + half-star aware rating stars */
const Stars = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
    const dim = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => {
                const filled = i <= Math.floor(rating);
                const half = !filled && i <= rating + 0.5;
                return (
                    <svg key={i} className={`${dim} ${filled || half ? 'text-amber-400' : 'text-[#e0e0e0]'}`}
                        viewBox="0 0 24 24" fill={filled || half ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                );
            })}
        </div>
    );
};



/** Countdown urgency timer — resets at midnight */
const UrgencyTimer = () => {
    const getSecondsUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };
    const [secs, setSecs] = useState(getSecondsUntilMidnight);
    useEffect(() => {
        const t = setInterval(() => setSecs(s => (s <= 0 ? getSecondsUntilMidnight() : s - 1)), 1000);
        return () => clearInterval(t);
    }, []);
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return (
        <div className="flex items-center gap-2 text-[13px] text-[#5a5a5a] bg-[#fafaf9] border border-[#ebebeb] rounded-xl px-3.5 py-2.5">
            <FiClock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Order in <span className="font-bold text-[#0a0a0a] tabular-nums">{h}:{m}:{s}</span> for next-day delivery</span>
        </div>
    );
};

/** Synthetic review data */
const dummyReviews = [
    { id: 1, name: "Rahul Sharma", rating: 5, comment: "Excellent quality and perfect fitting. Worth the price!", date: "2 days ago", verified: true },
    { id: 2, name: "Amit Verma", rating: 4, comment: "Fabric is very comfortable and looks premium.", date: "5 days ago", verified: true },
    { id: 3, name: "Neha Kapoor", rating: 5, comment: "Loved the design. Delivery was also very fast.", date: "1 week ago", verified: true },
    { id: 4, name: "Rohit Singh", rating: 4, comment: "Good product but size runs slightly large.", date: "2 weeks ago", verified: false },
    { id: 5, name: "Priya Mehta", rating: 5, comment: "Amazing style and very comfortable.", date: "3 weeks ago", verified: true },
    { id: 6, name: "Vikram Desai", rating: 3, comment: "The color is slightly different from the picture, but quality is decent.", date: "1 month ago", verified: true },
    { id: 7, name: "Anjali Rao", rating: 5, comment: "Absolutely love it! Fits like a glove and the material is super soft.", date: "1 month ago", verified: true },
    { id: 8, name: "Suresh Kumar", rating: 4, comment: "Nice everyday wear. Took a bit longer to arrive.", date: "1 month ago", verified: false },
    { id: 9, name: "Sneha Patil", rating: 5, comment: "Purchased this as a gift, and they loved it. Highly recommended.", date: "2 months ago", verified: true },
    { id: 10, name: "Karan Johar", rating: 4, comment: "Great fit. Will definitely buy more colors.", date: "2 months ago", verified: true },
    { id: 11, name: "Rajesh Iyer", rating: 3, comment: "Average product, nothing too special. Gets the job done.", date: "3 months ago", verified: true },
    { id: 12, name: "Meera Reddy", rating: 5, comment: "Perfect for summer. Very breathable and looks stylish.", date: "3 months ago", verified: true },
    { id: 13, name: "Aditya Jain", rating: 4, comment: "Good value for money. Survived multiple washes without shrinking.", date: "4 months ago", verified: true },
    { id: 14, name: "Nisha Singh", rating: 5, comment: "My new favorite! The minimalist design is exactly what I wanted.", date: "5 months ago", verified: true },
    { id: 15, name: "Mohan Das", rating: 3, comment: "Decent, but the stitching could be better.", date: "6 months ago", verified: false }
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Page                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { productDetails: backendProduct, loading: backendLoading, error: backendError } = useSelector((s: RootState) => s.products);
    const { userInfo } = useSelector((s: RootState) => s.auth);
    const wishlistItems = useSelector((s: RootState) => (s as any).wishlist?.items || []);

    /* ── Resolve: Backend first ── */
    const product: any = backendProduct;

    const loading = backendLoading;
    // Normalise raw MongoDB/server errors into friendly messages
    const error = backendError
        ? (backendError.toLowerCase().includes('cast to objectid') || backendError.toLowerCase().includes('cast to object id')
            ? 'Product not found. Please try again.'
            : backendError)
        : null;

    // Guard: only dispatch when id looks like a real MongoDB ObjectId.
    const fetchedIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!id) {
            navigate('/shop');
            return;
        }

        // Always clear stale backend data when ID changes (prevents previous product leaking)
        dispatch(clearProductDetails());

        if (fetchedIdRef.current === id) return; // already in-flight or done
        fetchedIdRef.current = id;

        dispatch(getProductDetails(id));
        return () => { dispatch(clearProductDetails()); fetchedIdRef.current = null; };
    }, [dispatch, id, navigate]);

    /* ── Image gallery ─────────────────────────────────────────────────────── */
    // Use existing images array; pad to 3–4 views by reusing the same URL
    const images = useMemo(() => {
        if (!product) return [];
        const base = (product as any).images || [(product as any).image || ''];
        if (base.length >= 3) return base.slice(0, 4);
        // Duplicate with crop variants to simulate multi-angle gallery
        return [
            base[0],
            base[0]?.replace('w=800', 'w=800&crop=faces'),
            base[0],
        ].filter(Boolean);
    }, [product]);

    const [activeImg, setActiveImg] = useState(0);
    useEffect(() => setActiveImg(0), [id]);

    /* ── UI state ──────────────────────────────────────────────────────────── */
    const [selectedSize, setSize] = useState('');
    const qty = 1; // always add 1 at a time (no qty stepper in this layout)
    const [lightbox, setLightbox] = useState(false);
    const [sizeModal, setSizeModal] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const [showAllReviews, setShowAllReviews] = useState(false);
    const visibleReviews = showAllReviews
        ? dummyReviews
        : dummyReviews.slice(0, 3);

    /* ── Accordion State ───────────────────────────────────────────────────── */
    const [openSection, setOpenSection] = useState<string | null>(null);
    const toggleSection = (section: string) => {
        setOpenSection(prev => (prev === section ? null : section));
    };

    useEffect(() => {
        const sizes: string[] = (product as any)?.sizes ?? [];
        if (product?.recommendedSize) {
            setSize(product.recommendedSize);
        } else if (sizes.length && !selectedSize) {
            setSize(sizes[0]);
        }
    }, [product, product?.recommendedSize]);

    /* ── Wishlist state ────────────────────────────────────────────────────── */
    const productId = (product as any)?._id || id;
    const isWishlisted = useMemo(
        () => wishlistItems.some((p: any) => (p.productId || p.product || p._id || p.id) === productId),
        [wishlistItems, productId]
    );

    const toggleWishlist = async () => {
        if (!userInfo) { toastService.error('Sign in to save items'); navigate('/login'); return; }
        if (!product) return;

        const productId = (product as any)?._id || id;
        if (!productId) return;

        if (isWishlisted) {
            await dispatch(removeFromWishlist(productId as string));
            toastService.info('Removed from wishlist');
        } else {
            await dispatch(addToWishlist({
                productId: productId as string,
                name: product.name,
                price: product.price,
                image: images[0],
                category: product.category
            }));
        }
    };

    /* ── Cart handler ──────────────────────────────────────────────────────── */
    const addToCartHandler = async () => {
        if (!selectedSize) { setSizeError(true); toastService.error('Please select a size'); return; }
        setSizeError(false);

        if (!productId) {
            toastService.error("Invalid product ID");
            return;
        }

        const cartItem = {
            product: productId as string,
            name: product.name,
            image: images[0],
            price: product.price,
            quantity: qty,
            size: selectedSize,
            stock: product.stock ?? 10
        };

        // If not logged in OR if it's a local-only slug (prevents backend 400 Cast Error)
        if (!userInfo) {
            dispatch(addGuestItem(cartItem));
            toastService.success(`${product.name} added to cart!`, { label: 'View Cart', path: '/cart' });
            return;
        }

        const res = await dispatch(addCartItem({
            product: productId as string,
            quantity: qty,
            size: selectedSize,
            name: product.name,
            image: images[0],
            price: product.price,
            stock: product.stock ?? 10,
            category: product.category,
            description: product.description
        }));

        if (res.meta.requestStatus === 'fulfilled') {
            toastService.success(`${product.name} added to cart!`, [
                { label: 'View Cart', path: '/cart' },
                { label: 'Checkout', path: '/checkout' }
            ], productId as string, `${product.name} added`);
        } else {
            toastService.error((res.payload as string) || 'Failed to add to cart', 'cart-error');
        }
    };


    /* ── Rating breakdown (dynamically computed) ──────────────────────────── */
    const totalReviews = dummyReviews.length;
    let averageObjRating = 0;
    if (totalReviews > 0) {
        const sum = dummyReviews.reduce((acc, r) => acc + r.rating, 0);
        averageObjRating = Math.round((sum / totalReviews) * 10) / 10;
    }
    const displayRating = averageObjRating.toFixed(1);

    const breakdown = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        dummyReviews.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) {
                counts[r.rating - 1]++;
            }
        });
        return counts.reverse(); // [5★, 4★, 3★, 2★, 1★]
    }, []);

    /* ── Guards ────────────────────────────────────────────────────────────── */
    if (!id) return null; // useEffect handles the redirect; render nothing in the meantime
    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center pt-24">
            <div className="w-10 h-10 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (error && !product) return (
        <div className="min-h-screen bg-white pt-32 max-w-xl mx-auto px-4">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Link to="/shop" className="text-sm underline underline-offset-2">← Back to Shop</Link>
        </div>
    );
    if (!product) return null;

    const sizes: string[] = (product as any)?.sizes ?? [];
    const inStock = (product?.stock ?? 0) > 0;

    /* ─────────────────────────────────────────────────────────────────────── */
    /*  Render                                                                  */
    /* ─────────────────────────────────────────────────────────────────────── */
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}
            className="bg-white min-h-screen pt-20 pb-28 md:pb-16">

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[11px] text-[#9a9a9a] tracking-widest uppercase mb-8 pt-4">
                    <Link to="/" className="hover:text-[#0a0a0a] transition-colors">Home</Link>
                    <span>›</span>
                    <Link to={`/shop?category=${product.category}`} className="hover:text-[#0a0a0a] transition-colors">{product.category}</Link>
                    <span>›</span>
                    <span className="text-[#0a0a0a] font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                {/* ── Two-column layout ─────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* ══ LEFT — Single image ══════════════════════════════════════════ */}
                    <div>
                        {/* Main image */}
                        <div className="relative rounded-2xl overflow-hidden bg-[#f5f4f2] cursor-zoom-in"
                            onClick={() => setLightbox(true)}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImg}
                                    src={images[activeImg]}
                                    alt={product.name}
                                    className="w-full object-contain"
                                    style={{ maxHeight: '74vh' }}
                                    initial={{ opacity: 0, scale: 1.03 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>

                            {/* Badge */}
                            {(product as any)?.badge && (
                                <div className="absolute top-4 left-4">
                                    <span className="text-[9px] font-bold tracking-widest uppercase bg-[#0a0a0a] text-white px-3 py-1.5 rounded-full">
                                        {(product as any).badge}
                                    </span>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ══ RIGHT — Product info (sticky desktop) ══════════════════════ */}
                    <div className="lg:sticky lg:top-[88px] lg:self-start space-y-5">

                        {/* Category label */}
                        <div>
                            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#9a9a9a]">
                                {product.category}{(product as any)?.subcategory ? ` · ${(product as any).subcategory}` : ''}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-[1.75rem] md:text-3xl font-bold text-[#0a0a0a] tracking-tight leading-snug">
                            {product.name}
                        </h1>

                        {/* Rating row */}
                        <div className="flex items-center gap-2.5">
                            <Stars rating={averageObjRating} size="sm" />
                            <span className="text-xs text-[#9a9a9a]">{displayRating} · {totalReviews} reviews</span>
                        </div>

                        {/* Price Area */}
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-[#0a0a0a]">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-xl text-[#9a9a9a] line-through font-medium decoration-[#9a9a9a]/40">
                                            ₹{product.originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-[#9a9a9a] font-medium uppercase tracking-widest">Incl. of all taxes</p>
                            </div>

                            {product.isOnSale && product.originalPrice && (
                                <div className="inline-flex items-center gap-2 bg-[#fff0f0] border border-[#ffdfdf] px-3 py-1.5 rounded-full">
                                    <span className="text-[10px] font-black text-[#c00000] uppercase tracking-wider">
                                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                                    </span>
                                    <div className="w-px h-3 bg-[#c00000]/20" />
                                    <span className="text-[11px] font-bold text-[#c00000]">
                                        Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                            {(product as any).recommendedSize && (
                                <p className="mt-3 text-sm text-[#5a5a5a] bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                                    <FiCheck className="w-4 h-4" />
                                    Recommended for you: <span className="font-semibold">{(product as any).recommendedSize}</span>
                                </p>
                            )}
                        </div>

                        {/* Urgency timer */}
                        <UrgencyTimer />

                        <div className="h-px bg-[#ebebeb]" />

                        {/* Size selector */}
                        {sizes.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex flex-col gap-1">
                                        <p className={`text-xs font-bold tracking-widest uppercase ${sizeError ? 'text-red-500' : 'text-[#0a0a0a]'}`}>
                                            Select Size {selectedSize && <span className="font-normal normal-case tracking-normal text-[#9a9a9a]">— {selectedSize}</span>}
                                        </p>
                                        {/* Smart Recommendation Badge */}
                                        {(product as any).recommendedSize && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-1.5"
                                            >
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 border border-violet-100 rounded-md">
                                                    <FiCheck className="w-2.5 h-2.5 text-violet-600" />
                                                    <span className="text-[10px] font-bold text-violet-700 uppercase tracking-tighter">
                                                        Recommended for you: {product.recommendedSize}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <button
                                        className="text-[10px] text-[#9a9a9a] underline underline-offset-2 hover:text-[#0a0a0a] transition-colors"
                                        onClick={() => setSizeModal(true)}
                                    >
                                        Size Guide
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((s: string) => {
                                        const isRecommended = product.recommendedSize === s;
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => { setSize(s); setSizeError(false); }}
                                                className={`relative min-w-[52px] h-10 px-3 rounded-full text-xs font-semibold border-2 transition-all duration-200
                                                    ${selectedSize === s
                                                        ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                                                        : 'bg-white text-[#3a3a3a] border-[#e0e0e0] hover:border-[#0a0a0a]'
                                                    }
                                                    ${isRecommended && selectedSize !== s ? 'border-violet-200 bg-violet-50/30' : ''}`}
                                            >
                                                {s}
                                                {isRecommended && (
                                                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm shadow-violet-200">
                                                        <FiCheck size={8} className="text-white" />
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {sizeError && (
                                    <p className="text-xs text-red-500 mt-2">Please select a size to continue</p>
                                )}
                                {userInfo && !product.recommendedSize && (
                                    (() => {
                                        // Simple logic to check if user has ANY preference that MIGHT apply to this product
                                        const hasPref = userInfo.sizePreferences && (
                                            userInfo.sizePreferences?.men?.tshirt ||
                                            userInfo.sizePreferences?.men?.shirt ||
                                            userInfo.sizePreferences?.men?.jeans ||
                                            userInfo.sizePreferences?.men?.shoes
                                        );
                                        return hasPref ? (
                                            <p className="text-[10px] text-[#9a9a9a] mt-3 italic">
                                                ★ Your saved size is currently unavailable for this item.
                                            </p>
                                        ) : null;
                                    })()
                                )}
                            </div>
                        )}


                        {/* CTA Buttons */}
                        {inStock ? (
                            <div className="flex items-stretch gap-3">
                                <motion.button
                                    onClick={addToCartHandler}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 py-3.5 bg-[#0a0a0a] text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-[#333] transition-colors duration-200"
                                >
                                    <FiShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </motion.button>

                                {/* Wishlist heart */}
                                <motion.button
                                    onClick={toggleWishlist}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                    className="w-12 h-12 flex-shrink-0 rounded-2xl border-2 border-[#e0e0e0] hover:border-red-400 flex items-center justify-center transition-colors duration-200"
                                >
                                    <FiHeart
                                        className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#5a5a5a]'}`}
                                        fill={isWishlisted ? 'currentColor' : 'none'}
                                    />
                                </motion.button>
                            </div>
                        ) : (
                            <button disabled className="w-full py-3.5 bg-[#e0e0e0] text-[#9a9a9a] rounded-2xl font-semibold text-sm cursor-not-allowed">
                                Out of Stock
                            </button>
                        )}


                        {/* Accordions */}
                        <div className="border-t border-[#ebebeb] mt-2">
                            {/* Description Section */}
                            <div className="border-b border-[#ebebeb]">
                                <button
                                    className="w-full flex justify-between items-center py-4 group"
                                    onClick={() => toggleSection("description")}
                                >
                                    <span className="text-sm font-semibold text-[#0a0a0a] tracking-wide">Description & Fit</span>
                                    <FiChevronDown className={`w-4 h-4 text-[#9a9a9a] group-hover:text-[#0a0a0a] transition-all duration-300 ${openSection === "description" ? "rotate-180" : ""}`} />
                                </button>
                                <div
                                    className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
                                    style={{
                                        maxHeight: openSection === "description" ? "500px" : "0",
                                        opacity: openSection === "description" ? 1 : 0
                                    }}
                                >
                                    <div className="pb-5 text-sm text-[#5a5a5a] leading-relaxed space-y-1.5">
                                        <p>{product.description || 'Crafted for modern expression, this piece blends refined craftsmanship with everyday comfort.'}</p>
                                        <p><span className="font-medium text-[#0a0a0a]">Material:</span> 100% Premium French Terry Cotton (400 GSM heavyweight)</p>
                                        <p><span className="font-medium text-[#0a0a0a]">Fit:</span> Relaxed tailored silhouette — structured yet comfortable</p>
                                        <p><span className="font-medium text-[#0a0a0a]">Care:</span> Machine wash cold, 30°C. Do not bleach.</p>
                                        <p><span className="font-medium text-[#0a0a0a]">Origin:</span> Designed in India</p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Section */}
                            <div className="border-b border-[#ebebeb]">
                                <button
                                    className="w-full flex justify-between items-center py-4 group"
                                    onClick={() => toggleSection("shipping")}
                                >
                                    <span className="text-sm font-semibold text-[#0a0a0a] tracking-wide">Shipping</span>
                                    <FiChevronDown className={`w-4 h-4 text-[#9a9a9a] group-hover:text-[#0a0a0a] transition-all duration-300 ${openSection === "shipping" ? "rotate-180" : ""}`} />
                                </button>
                                <div
                                    className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
                                    style={{
                                        maxHeight: openSection === "shipping" ? "500px" : "0",
                                        opacity: openSection === "shipping" ? 1 : 0
                                    }}
                                >
                                    <div className="pb-5 text-sm text-[#5a5a5a] leading-relaxed">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-start gap-2.5">
                                                <FiTruck className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Discount</p>
                                                    <p className="text-sm font-medium text-[#0a0a0a]">Disc 50%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <FiPackage className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Package</p>
                                                    <p className="text-sm font-medium text-[#0a0a0a]">Regular Package</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <FiClock className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Delivery Time</p>
                                                    <p className="text-sm font-medium text-[#0a0a0a]">3–4 Working Days</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2.5">
                                                <FiCalendar className="w-4 h-4 text-[#6a6a6a] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">Estimation Arrive</p>
                                                    <p className="text-sm font-medium text-[#0a0a0a]">10–12 Oct 2025</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* ── Ratings & Reviews ──────────────────────────────────────────────── */}
                <section className="mt-20 pt-12 border-t border-[#ebebeb]">
                    <h2 className="text-2xl font-bold text-[#0a0a0a] tracking-tight mb-10">Rating &amp; Reviews</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
                        {/* Left — aggregate score */}
                        <div className="space-y-5">
                            <div className="flex items-end gap-2">
                                <span className="text-[72px] font-black text-[#0a0a0a] leading-none tracking-tight">
                                    {displayRating}
                                </span>
                                <div className="pb-2">
                                    <span className="text-lg text-[#9a9a9a] font-light">/ 5</span>
                                    <p className="text-xs text-[#9a9a9a] mt-0.5">{totalReviews} Reviews</p>
                                </div>
                            </div>
                            <Stars rating={averageObjRating} size="md" />

                            {/* Breakdown bars */}
                            <div className="space-y-2">
                                {breakdown.map((count, idx) => {
                                    const starLabel = 5 - idx;
                                    const total = Math.max(totalReviews, 1);
                                    const pct = Math.round((count / total) * 100);
                                    return (
                                        <div key={starLabel} className="flex items-center gap-2">
                                            <span className="text-xs text-amber-400 w-3">{starLabel}</span>
                                            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                            <div className="flex-1 h-1.5 bg-[#ebebeb] rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-amber-400 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-[#9a9a9a] w-5 text-right">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right — review cards */}
                        <div className="space-y-6">
                            {visibleReviews.length === 0 ? (
                                <div className="mt-6 text-center py-10 border border-dashed border-gray-300 rounded-xl">
                                    <p className="text-[#5a5a5a] text-sm">Be the first to review this product.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mt-6 space-y-4">
                                        {visibleReviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold">{review.name}</span>
                                                        {review.verified && (
                                                            <span className="text-[10px] text-green-700 bg-green-100/80 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                                                                <FiCheck className="w-2.5 h-2.5" /> Verified Purchase
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-500">{review.date}</span>
                                                </div>

                                                <div className="text-yellow-500 mb-2">
                                                    {"★".repeat(review.rating)}
                                                    {"☆".repeat(5 - review.rating)}
                                                </div>

                                                <p className="text-gray-700 text-sm">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {dummyReviews.length > 3 && (
                                        <div className="mt-4 text-center">
                                            <button
                                                onClick={() => setShowAllReviews(!showAllReviews)}
                                                className="text-sm font-medium text-black underline hover:text-gray-600 transition-colors duration-200"
                                            >
                                                {showAllReviews ? "Show Less Reviews" : "Show More Reviews"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* ── Sticky mobile CTA ─────────────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#ebebeb] px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex-1">
                    <p className="text-xs text-[#9a9a9a] truncate">{product.name}</p>
                    <p className="text-sm font-bold text-[#0a0a0a]">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                <motion.button
                    onClick={toggleWishlist}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 flex-shrink-0 rounded-xl border-2 border-[#e0e0e0] flex items-center justify-center">
                    <FiHeart className={`w-[18px] h-[18px] ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#5a5a5a]'}`} fill={isWishlisted ? 'currentColor' : 'none'} />
                </motion.button>
                <motion.button
                    onClick={addToCartHandler}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 px-6 h-11 bg-[#0a0a0a] text-white rounded-xl font-semibold text-sm flex items-center gap-2">
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                </motion.button>
            </div>

            {/* ── Lightbox ──────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}>
                        <motion.img
                            src={images[activeImg]} alt={product.name}
                            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                        <button onClick={() => setLightbox(false)}
                            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Size Guide Modal ─────────────────────────────────────────────── */}
            <SizeGuideModal isOpen={sizeModal} onClose={() => setSizeModal(false)} />
        </motion.div>
    );
};

export default ProductDetailPage;
