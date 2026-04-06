import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCart, addCartItem, removeCartItem, removeGuestItem, updateGuestItem } from '@/redux/slices/cartSlice';
import type { AppDispatch, RootState } from '@/redux';
import CartItem from '@/components/cart/CartItem';

const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { items: cartItems, loading } = useSelector((state: RootState) => state.cart);
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchCart());
        }
    }, [dispatch, userInfo]);

    /* ── Handlers ─────────────────────────────────────────────────────────── */
    const updateQty = (id: string, newQty: number, size?: string) => {
        const item = cartItems.find(i => i.product === id && i.size === size);
        if (!item) return;
        const delta = newQty - (item.quantity || 1);
        if (delta === 0) return;

        if (userInfo) {
            dispatch(addCartItem({
                product: id,
                quantity: delta,
                size: size || 'M',
            }));
        } else {
            dispatch(updateGuestItem({ product: id, quantity: newQty, size }));
        }
    };

    const handleRemoveItem = async (productId: string, size?: string) => {
        try {
            if (userInfo) {
                await dispatch(removeCartItem({ product: productId, size })).unwrap();
            } else {
                dispatch(removeGuestItem({ product: productId, size }));
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    /* ── Price calculations ────────────────────────────────────────────────── */
    const { subtotal, originalSubtotal } = cartItems.reduce((acc, item) => ({
        subtotal: acc.subtotal + (item.quantity || 1) * item.price,
        originalSubtotal: acc.originalSubtotal + (item.quantity || 1) * (item.originalPrice || item.price),
    }), { subtotal: 0, originalSubtotal: 0 });

    const totalSavings = originalSubtotal - subtotal;
    const total = subtotal; // Sales tax is included




    return (
        <div className="pt-28 pb-24 min-h-screen bg-white">
            <div className="max-w-[1200px] mx-auto px-6">

                {/* Loading */}
                {loading && cartItems.length === 0 && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0a0a0a] border-t-transparent" />
                    </div>
                )}

                {/* Empty state */}
                {!loading && cartItems.length === 0 ? (
                    <div className="text-center py-20">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0a0a0a] tracking-tight mb-3">
                            Your Cart is Empty
                        </h1>
                        <p className="text-[#999] text-sm mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link
                            to="/shop"
                            className="inline-block bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#333] transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : cartItems.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                        {/* ═══ LEFT — Cart Items (70%) ═══════════════════════════════ */}
                        <div className="w-full lg:w-[65%]">
                            <AnimatePresence>
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={`${item.product}-${item.size}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <CartItem
                                            item={item}
                                            updateQty={updateQty}
                                            removeItem={() => handleRemoveItem(item.product, item.size)}
                                        />
                                        {/* Divider */}
                                        {index < cartItems.length - 1 && (
                                            <div className="h-px bg-[#e5e5e5]" />
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {/* Bottom divider after last item */}
                            <div className="h-px bg-[#e5e5e5]" />
                        </div>

                        {/* ═══ RIGHT — Order Summary (30%) ═══════════════════════════ */}
                        <div className="w-full lg:w-[35%] lg:sticky lg:top-[100px]">
                            <div className="bg-[#f8f8f8] border border-[#e8e8e8] p-8">

                                {/* Item list */}
                                <div className="space-y-3 pb-5 border-b border-[#e0e0e0]">
                                    {cartItems.map((item, index) => (
                                        <div
                                            key={`${item.product}-${item.size}-${index}`}
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a] leading-tight flex-1 min-w-0">
                                                {item.name}
                                                {(item.quantity || 1) > 1 && (
                                                    <span className="text-[#999] font-normal ml-1">×{item.quantity}</span>
                                                )}
                                            </span>
                                            <span className="text-xs font-semibold text-[#0a0a0a] whitespace-nowrap">
                                                ₹{((item.quantity || 1) * item.price).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Sales tax */}
                                <div className="flex justify-between items-center py-4 border-b border-[#e0e0e0]">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a]">
                                        Sales Tax
                                    </span>
                                    <span className="text-xs text-[#999] italic">
                                        included
                                    </span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex justify-between items-center py-4 border-b border-[#e0e0e0]">
                                        <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                                            Total Savings
                                        </span>
                                        <span className="text-xs font-bold text-green-600">
                                            − ₹{totalSavings.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-center pt-5 pb-6">
                                    <span className="text-sm font-bold uppercase tracking-wider text-[#0a0a0a]">
                                        Total
                                    </span>
                                    <span className="text-lg font-bold text-[#0a0a0a]">
                                        ₹{total.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {/* Checkout button */}
                                <motion.button
                                    onClick={() => navigate('/checkout')}
                                    disabled={cartItems.length === 0}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-[#0a0a0a] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#222] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Proceed to Checkout
                                </motion.button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
