import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
    FiCheck, FiPackage, FiTruck, FiClock,
    FiMapPin, FiCopy,
    FiChevronRight, FiArrowRight, FiMail,
    FiCreditCard, FiPrinter, FiRotateCcw, FiActivity, FiX
} from 'react-icons/fi';
import { getOrderDetails, reorderItems, cancelOrder } from '@/redux/slices/orderSlice';
import { listProducts } from '@/redux/slices/productSlice';
import { toastService } from '@/services/toastService';
import CancelOrderModal from '@/components/common/CancelOrderModal';
import type { AppDispatch, RootState } from '@/redux';

/* ─── Components ─────────────────────────────────────────────────── */

const FiHome = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

/* ─── Delivery Timeline Config ─────────────────────────────────────── */
const TIMELINE_STEPS = [
    { key: 'processing', label: 'Order Placed', icon: FiClock },
    { key: 'confirmed', label: 'Confirmed', icon: FiCheck },
    { key: 'shipped', label: 'Shipped', icon: FiPackage },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiHome },
];

const STATUS_CONFIG = {
    processing: { color: '#8b5cf6' }, // Purple
    confirmed: { color: '#3b82f6' },  // Blue
    shipped: { color: '#f59e0b' },    // Amber
    out_for_delivery: { color: '#10b981' }, // Emerald
    delivered: { color: '#059669' },  // Green
    cancelled: { color: '#ef4444' },  // Red
};

/* ─── Item Card Component ─────────────────────────────────────────── */
// Removed OrderItemCard in favor of inline rendering for better layout control

/* ─── Main Page Component ────────────────────────────────────────── */
const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [copiedId, setCopiedId] = useState(false);
    const [confettiTriggered, setConfettiTriggered] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleCancelOrder = async (reason: string, note: string) => {
        if (!order?._id) return;
        try {
            await dispatch(cancelOrder({ id: order._id, reason, note })).unwrap();
            toastService.success('Order cancelled successfully');
            setShowCancelModal(false);
            dispatch(getOrderDetails(order._id));
        } catch (err: any) {
            toastService.error(err || 'Failed to cancel order');
        }
    };

    const { orderDetails: order, loading, error } = useSelector((s: RootState) => s.orders);
    const { products } = useSelector((s: RootState) => s.products);

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
            dispatch(listProducts(''));
        }
    }, [dispatch, id]);

    // Celebrate once on mount
    useEffect(() => {
        if (!loading && order && !confettiTriggered) {
            const end = Date.now() + 1.2 * 1000;
            const colors = ['#10b981', '#34d399', '#ffffff'];

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 45,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 45,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
            setConfettiTriggered(true);
        }
    }, [loading, order, confettiTriggered]);

    // Fallback calculation for missing price data
    const prices = useMemo(() => {
        if (!order) return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
        
        // If the fields already exist and are non-zero, use them
        if (order.itemsPrice && (order.totalAmount || order.totalPrice)) {
            return {
                subtotal: order.itemsPrice,
                shipping: order.shippingPrice || 0,
                tax: order.taxPrice || 0,
                total: order.totalAmount || order.totalPrice
            };
        }

        // Otherwise, calculate on the fly
        const sub = (order.orderItems || []).reduce((acc: number, item: any) => {
            const p = Number(item.price || 0);
            const q = Number(item.quantity || item.qty || 1);
            return acc + (p * q);
        }, 0);
        const ship = sub > 1000 ? 0 : 99;
        const tx = Math.round(sub * 0.18);
        const tot = sub + ship + tx;
        
        return { subtotal: sub, shipping: ship, tax: tx, total: tot };
    }, [order]);

    // Removed auto-redirect to allow users to manage invoices at their own pace

    // Logic: Pull items from same category, exclude current items
    const recommendations = useMemo(() => {
        if (!products.length || !order?.orderItems?.length) return [];
        const purchasedIds = new Set(order.orderItems.map((i: any) => i.product?._id || i.product));
        const purchasedCats = new Set(order.orderItems.flatMap((i: any) => i.product?.category ? [i.product.category] : []));

        return products
            .filter(p => !purchasedIds.has(p._id) && (purchasedCats.has(p.category) || !purchasedCats.size))
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
    }, [products, order]);

    const handleCopyId = () => {
        if (order?._id) {
            navigator.clipboard.writeText(order._id);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
            toastService.info('Order ID copied');
        }
    };


    const handleReorder = async () => {
        if (!order) return;
        try {
            await dispatch(reorderItems(order._id)).unwrap();
            toastService.success('All items added to cart!');
            navigate('/cart');
        } catch (err: any) {
            toastService.error(err || 'Failed to reorder');
        }
    };

    const handleDownloadInvoice = () => {
        if (!order) return;

        const itemsHtml = (order.orderItems || []).map((item: any) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${item.name || 'Product'}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.size || 'N/A'}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Invoice - ${order._id}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1a1a1a; padding: 50px; line-height: 1.5; background: #fff; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; border-bottom: 2px solid #000; padding-bottom: 30px; }
                    .logo-container { display: flex; align-items: center; gap: 15px; }
                    .logo-img { height: 40px; width: auto; }
                    .logo-text { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; color: #000; }
                    .invoice-info { text-align: right; font-size: 13px; color: #666; }
                    .invoice-info strong { color: #000; display: block; font-size: 14px; margin-bottom: 4px; }
                    .details-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 50px; }
                    .section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #aaa; margin-bottom: 12px; }
                    .address-box { font-size: 14px; color: #444; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    th { text-align: left; padding: 12px; border-bottom: 2px solid #1a1a1a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #000; }
                    .totals-wrapper { display: flex; justify-content: flex-end; }
                    .totals-table { width: 300px; }
                    .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; color: #666; }
                    .grand-total { border-top: 2px solid #000; margin-top: 15px; padding-top: 15px; color: #000; font-weight: 900; font-size: 22px; }
                    .footer { margin-top: 100px; padding-top: 30px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #aaa; }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-container">
                        ${window.location.origin ? `<img src="${window.location.origin}/Logo.png" alt="Logo" class="logo-img" onerror="this.style.display='none'">` : ''}
                        <div class="logo-text">VELOURA</div>
                    </div>
                    <div class="invoice-info">
                        <strong>PURCHASE INVOICE</strong>
                        #${order._id.toUpperCase()}<br>
                        Ref: VEL-${order._id.slice(-6).toUpperCase()}<br>
                        Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                <div class="details-grid">
                    <div>
                        <div class="section-title">Shipping To</div>
                        <div class="address-box">
                            <strong style="color: #000; font-size: 16px;">${order.shippingAddress?.name || 'Customer'}</strong><br>
                            ${order.shippingAddress?.addressLine1 || ''}<br>
                            ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.postalCode || ''}<br>
                            Ph: ${order.shippingAddress?.phone || 'N/A'}
                        </div>
                    </div>
                    <div>
                        <div class="section-title">Transaction Details</div>
                        <div class="address-box">
                            Method: <strong style="color: #000;">${order.paymentMethod || 'Razorpay Online'}</strong><br>
                            Status: <strong style="color: #1a1a1a;">SUCCESS / PAID</strong><br>
                            Gateway: <strong style="color: #000;">razorpay_gateway_v2</strong>
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style="text-align: center;">Size</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="totals-wrapper">
                    <div class="totals-table">
                        <div class="total-row"><span>Items Price</span> <span>₹${(prices.subtotal).toLocaleString('en-IN')}</span></div>
                        <div class="total-row"><span>Shipping Charges</span> <span style="color: #10b981; font-weight: 700;">${prices.shipping === 0 ? 'FREE' : `₹${prices.shipping.toLocaleString('en-IN')}`}</span></div>
                        <div class="total-row"><span>Tax (GST 18%)</span> <span>₹${(prices.tax).toLocaleString('en-IN')}</span></div>
                        <div class="total-row grand-total"><span>Final Total</span> <span>₹${(prices.total).toLocaleString('en-IN')}</span></div>
                    </div>
                </div>

                <div class="footer">
                    This is an electronically generated document by VELOURA By PrimeWave Organisation.<br>
                    No physical signature required. Support: help@veloura.com | +91 1800-VELOURA
                </div>

                <div class="no-print" style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()" style="padding: 12px 24px; background: #000; color: #fff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Print Now</button>
                    <p style="margin-top: 15px; font-size: 11px; color: #666;">If the print dialog doesn't open automatically, please click the button above.</p>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.focus();
                            window.print();
                        }, 800);
                    };
                </script>
            </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank', 'width=850,height=900,toolbar=0,scrollbars=1');
        
        if (!printWindow) {
            toastService.error('Popup blocked. Please allow popups to view the invoice.');
        }

        // Cleanup: revoke the object URL after a while so it doesn't leak memory
        setTimeout(() => URL.revokeObjectURL(url), 60000); // 1 minute is plenty
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <p className="text-red-500 text-sm mb-6 font-medium">{error || 'Order not found'}</p>
                    <Link to="/profile" className="inline-block bg-[#0a0a0a] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#333] transition-colors rounded-full">
                        Return to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const getStatus = () => {
        const raw = (order.status || 'processing').toLowerCase();
        const map: Record<string, string> = {
            'processing': 'processing',
            'order placed': 'processing',
            'pending': 'processing',
            'confirmed': 'confirmed',
            'shipped': 'shipped',
            'outfordelivery': 'outfordelivery',
            'out for delivery': 'outfordelivery',
            'delivered': 'delivered'
        };
        const normalized = map[raw] || 'processing';
        if (!map[raw]) console.warn(`Unknown status encountered: ${raw}, defaulting to processing.`);
        return normalized;
    };
    const status = getStatus();

    // Simulated Tracking ID
    const trackingId = order.trackingId || `VEL${(order._id || '').slice(-8).toUpperCase()}IND`;

    const getProgressPrecent = (s: string) => {
        const index = TIMELINE_STEPS.findIndex(step => step.key === s);
        if (index === -1) return 0;
        return ((index + 1) / TIMELINE_STEPS.length) * 100;
    };

    return (
        <div className="min-h-screen bg-[#f8f7f5] pt-24 pb-24 selection:bg-[#1a1a1a] selection:text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Order Summary Header ───────────────────────────────── */}
                <div className="bg-white rounded-[2.5rem] border border-[#f0eeec] shadow-sm p-8 md:p-10 mb-8 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f8f7f5] rounded-bl-full -mr-20 -mt-20 z-0 transition-transform duration-700 group-hover:scale-110" />

                    <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                            <div>
                                <Link to="/profile" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa] hover:text-[#1a1a1a] transition-all mb-6">
                                    <FiChevronRight className="rotate-180" />
                                    Account Hub
                                </Link>
                                <div className="flex items-center gap-4 mb-2 flex-wrap">
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1a1a1a]">Order #{order._id.slice(-8).toUpperCase()}</h1>
                                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2"
                                        style={{
                                            color: status === 'cancelled' ? '#ef4444' : ((STATUS_CONFIG as any)[status]?.color || '#1a1a1a'),
                                            backgroundColor: `${status === 'cancelled' ? '#ef4444' : ((STATUS_CONFIG as any)[status]?.color || '#1a1a1a')}15`
                                        }}>
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status === 'cancelled' ? '#ef4444' : ((STATUS_CONFIG as any)[status]?.color || '#1a1a1a') }} />
                                        {status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                {status === 'cancelled' && (
                                    <div className="flex items-center gap-3 text-red-500 font-bold text-[10px] uppercase tracking-widest mb-6 bg-red-50 w-fit px-4 py-2 rounded-xl border border-red-100 italic">
                                        <FiX size={14} /> Reason: {order.cancellationReason || 'User Request'}
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-[#aaa] font-medium mt-1">
                                    <span className="flex items-center gap-2"><FiClock size={14} /> Placed on {date}</span>
                                    <span className="w-1 h-1 rounded-full bg-[#ccc]" />
                                    <span className="flex items-center gap-2 cursor-pointer hover:text-[#1a1a1a] transition-colors" onClick={handleCopyId}>
                                        {copiedId ? <FiCheck size={13} className="text-emerald-500" /> : <FiCopy size={13} />} {trackingId}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-[#f0eeec] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:border-[#1a1a1a] transition-all shadow-sm"
                                >
                                    <FiPrinter className="w-4 h-4" />
                                    Invoice
                                </button>
                                {status === 'delivered' && (
                                    <button
                                        onClick={handleReorder}
                                        className="flex items-center gap-2 px-8 py-3.5 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#333] transition-all shadow-xl shadow-black/10"
                                    >
                                        <FiRotateCcw className="w-4 h-4" />
                                        Reorder
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Progress Bar */}
                        <div className="max-w-2xl">
                            <div className="flex justify-between items-end mb-3 font-mono">
                                <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">Tracking Progress</span>
                                <span className="text-xs font-bold text-[#1a1a1a]">{getProgressPrecent(status).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#f8f7f5] rounded-full overflow-hidden border border-[#f0eeec]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getProgressPrecent(status)}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-[#1a1a1a]"
                                />
                            </div>
                            <div className="mt-6 pt-6 border-t border-[#f8f7f5] flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-[11px] font-bold text-[#aaa] uppercase tracking-widest italic">
                                    Don't forget to download your purchase invoice above.
                                </p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2 bg-[#1a1a1a] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#333] transition-all shadow-lg shadow-black/5"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Left Column (65%) ──────────────────────────────────── */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Product List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-[#f0eeec] shadow-sm overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-[#f8f7f5] flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">Items for Dispatch</h3>
                                <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest">{(order.orderItems || []).length} Product(s)</span>
                            </div>

                            <div className="divide-y divide-[#f8f7f5]">
                                {(order.orderItems || []).map((item: any, i: number) => (
                                    <div key={i} className="p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start group/item">
                                        <div className="w-32 h-40 rounded-2xl overflow-hidden bg-[#f8f7f5] flex-shrink-0 border border-[#f0eeec]">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105" />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 block">Premium Collection</p>
                                                    <h4 className="text-lg font-bold text-[#1a1a1a] leading-tight mb-1">{item.name}</h4>
                                                    <p className="text-xs text-[#aaa] font-medium">SKU: VELOURA-{item.product?._id?.slice(-6).toUpperCase() || 'NEW'}</p>
                                                </div>
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-1">Item total</p>
                                                    <p className="text-lg font-black text-[#1a1a1a]">₹{(Number(item.price || 0) * Number(item.quantity || item.qty || 1)).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#f8f7f5]">
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-1">Selected Size</p>
                                                    <p className="text-xs font-bold text-[#1a1a1a]">{item.size || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-1">Quantity</p>
                                                    <p className="text-xs font-bold text-[#1a1a1a]">{item.quantity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-1">Price / Unit</p>
                                                    <p className="text-xs font-bold text-[#1a1a1a]">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Dispatch Destination */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[2.5rem] border border-[#f0eeec] shadow-sm p-8"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#f8f7f5] flex items-center justify-center text-[#1a1a1a]">
                                        <FiMapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">Dispatch Destination</h3>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-base font-bold text-[#1a1a1a] mb-2">{order.shippingAddress?.name || 'N/A'}</p>
                                    <div className="space-y-1">
                                        <p className="text-sm text-[#444] font-medium leading-relaxed">{order.shippingAddress?.addressLine1 || 'N/A'}</p>
                                        <p className="text-sm text-[#444] font-bold">{order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} – {order.shippingAddress?.postalCode || ''}</p>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-[#f8f7f5] flex items-center gap-3">
                                        <FiMail className="text-[#ccc] w-4 h-4" />
                                        <p className="text-xs font-bold text-[#1a1a1a]">{order.shippingAddress?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Order Timeline (Upgrade Journey) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-[2.5rem] border border-[#f0eeec] shadow-sm p-8"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#f8f7f5] flex items-center justify-center text-[#1a1a1a]">
                                            <FiActivity className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">Journey Flow</h3>
                                    </div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Est. {new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                                </div>

                                <div className="flex flex-col gap-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-[#f0eeec]">
                                    {TIMELINE_STEPS.map((step, idx) => {
                                        const stepIndex = TIMELINE_STEPS.findIndex(s => s.key === status);
                                        // Default to the first step (0) if the order exists and isn't cancelled
                                        const activeStepIdx = stepIndex === -1 ? 0 : stepIndex;
                                        
                                        const isActive = idx <= activeStepIdx && status !== 'cancelled';
                                        const isCurrent = idx === activeStepIdx && status !== 'cancelled';

                                        return (
                                            <div key={idx} className="flex gap-6 relative z-10">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-700 bg-white
                                                    ${isActive ? 'border-[#1a1a1a] text-[#1a1a1a] shadow-md' : 'border-[#f0eeec] text-[#ccc]'}`}>
                                                    {isCurrent ? <div className="w-2 h-2 rounded-full bg-[#1a1a1a] animate-ping" /> : (isActive ? <FiCheck className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#eee]" />)}
                                                </div>
                                                <div className="py-2">
                                                    <h4 className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-[#1a1a1a]' : 'text-[#bbb]'}`}>{step.label}</h4>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Right Column (35%) ─────────────────────────────────── */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Price Breakdown Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] border border-[#f0eeec] p-10 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2 border border-emerald-100 italic shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    PAID
                                </span>
                            </div>

                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa] mb-12 flex items-center gap-2">
                                <FiCreditCard className="w-4 h-4" />
                                Price Breakdown
                            </h3>

                            <div className="space-y-5 font-medium text-xs">
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-[#aaa] font-medium tracking-wide">Base Subtotal</span>
                                    <span className="text-[#1a1a1a] font-bold tracking-tight">₹{prices.subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-[#aaa] font-medium tracking-wide">Shipping & Handling</span>
                                    <span className="text-emerald-600 font-black italic">
                                        {prices.shipping === 0 ? 'FREE' : `₹${prices.shipping.toLocaleString('en-IN')}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-[#aaa] font-medium tracking-wide">GST (18%)</span>
                                    <span className="text-[#1a1a1a] font-bold tracking-tight">₹{prices.tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="mt-8 pt-8 border-t border-[#f8f7f5]">
                                    <p className="text-[10px] font-bold tracking-widest text-[#aaa] uppercase mb-4 font-mono">Invoice Settlement</p>
                                    <p className="text-6xl font-black tracking-tighter text-[#1a1a1a] italic leading-none">
                                        ₹{prices.total.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Actions Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#1a1a1a] rounded-[2.5rem] p-8 text-white shadow-xl shadow-black/10"
                        >
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">Order Actions</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {status === 'delivered' && (
                                    <button onClick={handleReorder} className="flex items-center justify-between w-full px-5 py-4 bg-white/10 hover:bg-white/15 rounded-2xl transition-all group">
                                        <div className="flex items-center gap-3">
                                            <FiRotateCcw className="text-emerald-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Reorder Items</span>
                                        </div>
                                        <FiChevronRight className="text-white/20 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                                <button onClick={handleDownloadInvoice} className="flex items-center justify-between w-full px-5 py-4 bg-white/10 hover:bg-white/15 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <FiPrinter className="text-blue-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Digital Invoice</span>
                                    </div>
                                    <FiChevronRight className="text-white/20 group-hover:translate-x-1 transition-transform" />
                                </button>
                                {['processing', 'confirmed'].includes(status) && (
                                    <button 
                                        onClick={() => setShowCancelModal(true)}
                                        className="flex items-center justify-between w-full px-5 py-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all group border border-red-500/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FiX className="text-red-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-red-500 text-left">Cancel Order</span>
                                        </div>
                                        <FiChevronRight className="text-red-500/20 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                                <Link to="/contact" className="flex items-center justify-between w-full px-5 py-4 bg-white/10 hover:bg-white/15 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <FiMail className="text-[#aaa]" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Contact Support</span>
                                    </div>
                                    <FiChevronRight className="text-white/20 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Professional Support Message */}
                        <div className="px-8 text-center">
                            <p className="text-[10px] text-[#ccc] font-medium leading-relaxed italic">
                                VELOURA concierge services are available 24/7 for tailored logistics assistance. Reference ID: {order._id.slice(-6)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                {recommendations.length > 0 && (
                    <div className="mt-20 border-t border-[#f0eeec] pt-20">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tight mb-2 italic">Curated for You</h3>
                                <p className="text-[10px] text-[#aaa] font-bold uppercase tracking-[0.2em]">Based on your recent purchase</p>
                            </div>
                            <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] flex items-center gap-2 group border-b border-[#1a1a1a] pb-1">
                                Explore Collection <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {recommendations.map(product => (
                                <Link key={product._id} to={`/product/${product._id}`} className="group block">
                                    <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden mb-5 relative shadow-sm border border-[#f0eeec] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/5 group-hover:-translate-y-2">
                                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                        <div className="absolute top-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-[#1a1a1a] shadow-lg">
                                                <FiArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-1 text-center">
                                        <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-1.5 transition-colors group-hover:text-emerald-600 truncate">{product.name}</h4>
                                        <p className="text-[13px] font-black text-[#1a1a1a] tracking-tight italic">₹{product.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CancelOrderModal
                open={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
            />
        </div>
    );
};

export default OrderPage;
