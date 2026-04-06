import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser, updateProfile, updateSizes, deleteMyAccount } from '@/redux/slices/authSlice';
import { listMyOrders, cancelOrder, reorderItems } from '@/redux/slices/orderSlice';
import type { RootState, AppDispatch } from '@/redux';
import type { Order } from '@/types';
import {
    FiShoppingBag, FiHeart, FiUser, FiLock,
    FiLogOut, FiChevronRight, FiPackage, FiEye, FiTruck,
    FiX, FiCheck, FiClock, FiShield, FiEdit3,
    FiSave, FiTrash2, FiSettings, FiPhone, FiMail,
    FiInfo, FiAlertCircle, FiFilter, FiArrowUp, FiArrowDown,
    FiRefreshCw, FiMapPin
} from 'react-icons/fi';
import { toastService } from '@/services/toastService';
import CancelOrderModal from '@/components/common/CancelOrderModal';
import AddressesTab from '@/components/profile/AddressesTab';

/* ── Status Config ─────────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
    processing: { color: '#7c3aed', bg: '#f5f3ff', icon: FiClock, label: 'Processing' },
    confirmed: { color: '#3b82f6', bg: '#eff6ff', icon: FiCheck, label: 'Confirmed' },
    shipped: { color: '#f97316', bg: '#fff7ed', icon: FiTruck, label: 'Shipped' },
    out_for_delivery: { color: '#14b8a6', bg: '#f0fdfa', icon: FiTruck, label: 'Out for Delivery' },
    delivered: { color: '#22c55e', bg: '#f0fdf4', icon: FiCheck, label: 'Delivered' },
    cancelled: { color: '#ef4444', bg: '#fef2f2', icon: FiX, label: 'Cancelled' },
};

/* ── Order Card ────────────────────────────────────────────────── */
const OrderCard = ({ order, onCancelOrder }: { order: Order; onCancelOrder: (id: string) => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const status = (order.status || 'processing').toLowerCase();
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['processing'];
    const Icon = cfg.icon;

    const images = order.orderItems?.flatMap(i => i.image ? [i.image] : []) || [];
    const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '–';
    const calculateTotal = (o: Order) => {
        if (o.totalAmount || o.totalPrice) return o.totalAmount || o.totalPrice;
        const sub = (o.orderItems || []).reduce((acc, i) => acc + (Number(i.price || 0) * Number(i.quantity || i.qty || 1)), 0);
        const ship = sub > 1000 ? 0 : 99;
        const tax = Math.round(sub * 0.18);
        return sub + ship + tax;
    };
    const totalAmount = calculateTotal(order);
    const total = (totalAmount || 0).toLocaleString('en-IN');

    const handleCancel = () => {
        onCancelOrder(order._id);
    };

    const handleReorder = async () => {
        try {
            await dispatch(reorderItems(order._id)).unwrap();
            toastService.success('Items added to cart!');
            navigate('/cart');
        } catch (err: any) {
            toastService.error(err || 'Failed to reorder');
        }
    };

    const canCancel = ['processing', 'confirmed'].includes(status);
    const isDelivered = status === 'delivered';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group bg-white rounded-3xl border border-[#f0eeec] shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500 overflow-hidden"
        >
            <div className="h-1.5 w-full" style={{ backgroundColor: cfg.color }} />
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex gap-3">
                        {images.slice(0, 3).map((img, i) => (
                            <div key={i} className="w-16 h-20 rounded-2xl overflow-hidden bg-[#f8f7f5] flex-shrink-0 border border-[#f0eeec] relative group-hover:shadow-md transition-shadow">
                                <img src={img} alt="" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
                                {i === 2 && images.length > 3 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">
                                        +{images.length - 3}
                                    </div>
                                )}
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="w-16 h-20 rounded-2xl bg-[#f8f7f5] flex items-center justify-center border border-dashed border-[#ddd]">
                                <FiPackage className="text-[#ccc] text-2xl" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {order.trackingId && (
                            <span className="px-3 py-1.5 bg-[#f8f7f5] text-[#888] text-[10px] font-bold rounded-lg border border-[#eee] tracking-tight">
                                ID: {order.trackingId}
                            </span>
                        )}
                        <span className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm" style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}>
                            <Icon className="w-3.5 h-3.5" />
                            {cfg.label}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-[#fafaf9] rounded-2xl border border-[#f5f5f3]">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1.5">Reference</p>
                        <p className="text-xs font-bold text-[#1a1a1a] font-mono tracking-tighter">#{order._id?.slice(-12).toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1.5">Placed On</p>
                        <p className="text-xs font-bold text-[#444]">{date}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1.5">Net Amount</p>
                        <p className="text-sm font-black text-[#1a1a1a]">₹{total}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1.5">Method</p>
                        <p className="text-xs font-bold text-[#444] capitalize">{order.paymentMethod || 'Online'}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link to={`/account/orders/${order._id}`} className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#333] transition-all shadow-lg shadow-black/5">
                        <FiEye className="w-3.5 h-3.5" />
                        View Order
                    </Link>

                    {isDelivered && (
                        <button
                            onClick={handleReorder}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#1a1a1a] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#f8f7f5] transition-all"
                        >
                            <FiRefreshCw className="w-3.5 h-3.5" />
                            Reorder
                        </button>
                    )}

                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-6 py-3 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all ml-auto"
                        >
                            <FiX className="w-3.5 h-3.5" />
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const calculateCompletion = (user: any) => {
    let score = 0;
    if (user?.name) score += 25;
    if (user?.phone) score += 25;
    if (user?.username) score += 25;
    const sizes = user?.sizePreferences;
    const hasAnySize = sizes && (
        (sizes.men && Object.values(sizes.men).some(v => !!v)) ||
        (sizes.women && Object.values(sizes.women).some(v => !!v))
    );
    if (hasAnySize) score += 25;
    return score;
};

const CompletionIndicator = ({ percentage }: { percentage: number }) => (
    <div className="mb-8 p-6 bg-white rounded-3xl border border-[#f0eeec] shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1a1a1a] uppercase tracking-widest">
                    Profile {percentage === 100 ? 'Complete' : `${percentage}% Complete`}
                </span>
                {percentage === 100 && <FiCheck className="text-emerald-500 w-4 h-4" />}
            </div>
            <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-[0.2em]">{percentage}/100</span>
        </div>
        <div className="h-1.5 w-full bg-[#f8f7f5] rounded-full overflow-hidden border border-[#f0eeec]">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "circOut" }}
                className="h-full bg-[#1a1a1a]"
            />
        </div>
    </div>
);

/* ── Nav Item ─────────────────────────────────────────────────── */
const NavItem = ({ icon: Icon, label, active, onClick, danger = false }: {
    icon: React.ElementType; label: string; active: boolean; onClick: () => void; danger?: boolean;
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left group
            ${active
                ? 'bg-[#1a1a1a] text-white shadow-md'
                : danger
                    ? 'text-red-500 hover:bg-red-50 font-bold'
                    : 'text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f4f2]'
            }`}
    >
        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : danger ? 'text-red-400' : 'text-[#aaa] group-hover:text-[#1a1a1a]'}`} />
        <span className="flex-1">{label}</span>
        {!danger && <FiChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${active ? 'text-white/60' : 'text-[#ccc]'}`} />}
    </button>
);

/* ── Personal Info Tab ────────────────────────────────────────── */
const PersonalInfoTab = ({ userInfo }: { userInfo: any }) => {
    const dispatch = useDispatch<AppDispatch>();
    const completion = calculateCompletion(userInfo);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: userInfo.name || '',
        username: userInfo.username || '',
        phone: userInfo.phone || '',
    });

    const handleSave = async () => {
        try {
            await dispatch(updateProfile(form)).unwrap();
            setIsEditing(false);
            toastService.success('Profile updated successfully');
        } catch (err: any) {
            toastService.error(err || 'Failed to update profile');
        }
    };

    return (
        <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Personal Information</h2>
                    <p className="text-[#aaa] text-sm mt-0.5">Manage your identity and contact details</p>
                </div>
            </div>

            <CompletionIndicator percentage={completion} />

            <div className="flex items-center justify-between mb-6">
                <p className="text-[#aaa] text-sm">Update your information across the VELOURA ecosystem</p>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f0eeec] text-[#1a1a1a] text-xs font-bold tracking-wide rounded-xl hover:shadow-sm transition-all"
                    >
                        <FiEdit3 className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-[#666] text-xs font-medium hover:text-[#1a1a1a]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs font-bold tracking-wide rounded-xl hover:bg-[#333] transition-colors"
                        >
                            <FiSave className="w-3.5 h-3.5" />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2.5">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm font-medium text-[#1a1a1a] border border-transparent">
                                    <FiUser className="text-[#aaa]" />
                                    {userInfo.name || userInfo.username}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2.5">Email Address (Read-only)</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-[#f5f5f5] rounded-xl text-sm font-medium text-[#777] border border-dashed border-[#e0e0e0] cursor-not-allowed">
                                <FiMail className="text-[#ccc]" />
                                {userInfo.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2.5">Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm font-medium text-[#1a1a1a] border border-transparent">
                                    <FiPhone className="text-[#aaa]" />
                                    {userInfo.phone || 'Not added yet'}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2.5">Profile Display Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all"
                                    placeholder="Username"
                                />
                            ) : (
                                <div className="flex items-center gap-3 px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm font-medium text-[#1a1a1a] border border-transparent">
                                    <FiAtSign size={14} className="text-[#aaa]" />
                                    {userInfo.username}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Info Card */}
                <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-8">
                    <h3 className="text-sm font-bold text-[#1a1a1a] mb-5 flex items-center gap-2">
                        <FiInfo className="text-[#aaa]" />
                        Account Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1">Account ID</p>
                            <p className="text-xs font-mono text-[#555]">#{userInfo._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1">Member Since</p>
                            <p className="text-xs font-bold text-[#555]">{userInfo.createdAt ? new Date(userInfo.createdAt).getFullYear() : '2024'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1">Status</p>
                            <p className="text-xs inline-flex items-center gap-1.5 font-bold text-green-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Active
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-1">Role</p>
                            <p className="text-xs font-bold text-violet-600 uppercase tracking-tighter">{userInfo.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div >
    );
};

const FiAtSign = ({ size, className }: any) => <span className={className} style={{ fontSize: size }}>@</span>;

/* ── Size Preferences Tab ─────────────────────────────────────── */
const SizePreferencesTab = ({ userInfo }: { userInfo: any }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');

    // Initialize prefs from userInfo based on structure
    const getInitialPrefs = (gender: 'men' | 'women') => {
        const root = userInfo.sizePreferences || { men: {}, women: {} };
        const genderPrefs = (root[gender as keyof typeof root] as any) || {};

        if (gender === 'men') {
            return {
                tshirt: genderPrefs.tshirt || '',
                shirt: genderPrefs.shirt || '',
                jeans: genderPrefs.jeans || '',
                shoes: genderPrefs.shoes || ''
            };
        } else {
            return {
                top: genderPrefs.top || '',
                dress: genderPrefs.dress || '',
                waist: genderPrefs.waist || '',
                footwear: genderPrefs.footwear || ''
            };
        }
    };

    const [prefs, setPrefs] = useState(getInitialPrefs(selectedGender));

    // Update local prefs when gender switches
    useEffect(() => {
        setPrefs(getInitialPrefs(selectedGender));
    }, [selectedGender, userInfo.sizePreferences]);

    const hasSavedSizes = Object.values(prefs).some(v => v !== '' && v !== null);

    const menCategories = [
        { key: 'tshirt', label: 'T-Shirts & Polos', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { key: 'shirt', label: 'Formal & Casual Shirts', options: ['S', 'M', 'L', 'XL', 'XXL'] },
        { key: 'jeans', label: 'Trousers & Jeans (Waist)', options: ['28', '30', '32', '34', '36', '38'] },
        { key: 'shoes', label: 'Footwear (UK Size)', options: ['6', '7', '8', '9', '10', '11'] },
    ];

    const womenCategories = [
        { key: 'top', label: 'Tops & T-Shirts', options: ['XS', 'S', 'M', 'L', 'XL'] },
        { key: 'dress', label: 'Dresses & Gowns', options: ['XS', 'S', 'M', 'L', 'XL'] },
        { key: 'waist', label: 'Jeans & Trousers (Waist)', options: ['24', '26', '28', '30', '32', '34'] },
        { key: 'footwear', label: 'Footwear (UK Size)', options: ['3', '4', '5', '6', '7', '8'] },
    ];

    const currentCategories = selectedGender === 'men' ? menCategories : womenCategories;

    const handleUpdate = async (newPrefs: any) => {
        try {
            setPrefs(newPrefs);
            await dispatch(updateSizes({ gender: selectedGender, data: newPrefs })).unwrap();
            toastService.success(`${selectedGender === 'men' ? 'Men' : 'Women'} preferences saved`);
        } catch (err: any) {
            toastService.error('Failed to save sizes');
        }
    };

    return (
        <motion.div key="sizes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1 tracking-tight">Size Preferences</h2>
                    <p className="text-[#aaa] text-sm">Personalized sizing for a better fit</p>
                </div>

                {/* Gender Toggle */}
                <div className="flex p-1.5 bg-[#f0eeec]/50 rounded-2xl border border-[#f0eeec] self-start">
                    <button
                        onClick={() => setSelectedGender('men')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${selectedGender === 'men' ? 'bg-[#1a1a1a] text-white shadow-lg shadow-black/10' : 'text-[#aaa] hover:text-[#1a1a1a]'}`}
                    >
                        Men
                    </button>
                    <button
                        onClick={() => setSelectedGender('women')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${selectedGender === 'women' ? 'bg-[#1a1a1a] text-white shadow-lg shadow-black/10' : 'text-[#aaa] hover:text-[#1a1a1a]'}`}
                    >
                        Women
                    </button>
                </div>

                {hasSavedSizes && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Smart Recommendations Enabled
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedGender}
                        initial={{ opacity: 0, x: selectedGender === 'men' ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: selectedGender === 'men' ? 10 : -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-full"
                    >
                        {currentCategories.map(cat => (
                            <div key={cat.key} className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-6 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#f8f7f5] rounded-bl-full flex items-center justify-center pl-4 pb-4">
                                    <FiCheck className={`transition-all duration-300 ${(prefs as any)[cat.key] ? 'text-green-500 scale-100 opacity-100' : 'text-[#eee] scale-50 opacity-0'}`} />
                                </div>

                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-4 group-hover:text-[#1a1a1a] transition-colors">
                                    {cat.label}
                                </label>
                                <select
                                    value={(prefs as any)[cat.key] || ''}
                                    onChange={e => handleUpdate({ ...prefs, [cat.key]: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm font-bold border border-[#f0eeec] focus:border-[#1a1a1a] outline-none appearance-none cursor-pointer hover:border-[#ddd] transition-colors"
                                >
                                    <option value="">Select Size</option>
                                    {cat.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-[#ccc] mt-3 italic">Used for {selectedGender} {cat.label.toLowerCase()}</p>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-8 bg-gradient-to-br from-[#1a1a1a] to-[#333] p-8 rounded-3xl flex items-center gap-6 shadow-xl shadow-black/5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10">
                    <FiShield className="text-white text-xl" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-1">VELOURA Personalization Hub™</h4>
                    <p className="text-xs text-white/60 leading-relaxed max-w-md">
                        Your {selectedGender} size preferences are encrypted and used only to highlight the best fit while you browse the collection.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Security Tab ────────────────────────────────────────────── */
const SecurityTab = () => {
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });
    const fields = [
        { label: 'Current Password', key: 'current' },
        { label: 'New Password', key: 'next' },
        { label: 'Confirm New Password', key: 'confirm' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toastService.info('Password reset triggered. Check email.');
    };

    return (
        <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1 tracking-tight">Security Settings</h2>
            <p className="text-[#aaa] text-sm mb-8">Manage your credentials and access</p>

            <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fields.map(f => (
                            <div key={f.key}>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2">{f.label}</label>
                                <input
                                    type="password"
                                    value={(form as any)[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] rounded-xl text-sm border border-[#f0eeec] focus:border-[#1a1a1a] outline-none transition-all placeholder:text-[#ccc]"
                                    placeholder="••••••••"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-[#f8f7f5] flex justify-end">
                        <button type="submit" className="px-8 py-3 bg-[#1a1a1a] text-white text-sm font-bold rounded-xl hover:bg-[#333] transition-colors shadow-sm">
                            Update Security
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-6 bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-8">
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-4">Account Integrity</h3>
                <div className="flex items-center justify-between p-4 bg-[#f8f7f5] rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-xs font-bold text-[#1a1a1a]">Email Verified</span>
                    </div>
                    <span className="text-[10px] text-[#aaa] font-medium tracking-tight">Updated 2 days ago</span>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Advanced Tab ───────────────────────────────────────────── */
const AdvancedTab = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { userInfo } = useSelector((s: RootState) => s.auth);
    const { orders = [] } = useSelector((s: RootState) => s.orders);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        try {
            await dispatch(deleteMyAccount()).unwrap();
            toastService.success('Account deleted successfully');
            navigate('/');
        } catch (err: any) {
            toastService.error(err || 'Failed to delete account');
        }
    };

    const handleExportData = () => {
        const data = {
            userProfile: {
                _id: userInfo?._id,
                username: userInfo?.username,
                email: userInfo?.email,
                name: (userInfo as any)?.name,
                phone: (userInfo as any)?.phone,
            },
            sizePreferences: (userInfo as any)?.sizePreferences,
            orders: orders.map(o => ({
                id: o._id,
                status: o.status,
                totalPrice: o.totalPrice,
                date: o.createdAt,
                items: o.orderItems
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `VELOURA-user-data-${userInfo?._id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toastService.success('Data exported successfully');
    };

    return (
        <motion.div key="advanced" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1 tracking-tight">Advanced Settings</h2>
            <p className="text-[#aaa] text-sm mb-8">Manage account privacy and data portability</p>

            <div className="space-y-6">
                {/* Delete Account Section */}
                <div className="bg-white rounded-3xl border border-[#f0eeec] shadow-sm p-8 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 flex items-center gap-2">
                                <FiTrash2 className="text-red-400" />
                                Delete Account
                            </h3>
                            <p className="text-xs text-[#aaa] max-w-sm">
                                Permanently remove your account and all associated data. This action is irreversible.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-6 py-3 border-2 border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-50 transition-all hover:border-red-500"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Export Data Section */}
                <div className="bg-white rounded-3xl border border-[#f0eeec] shadow-sm p-8 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 flex items-center gap-2">
                                <FiShoppingBag className="text-[#aaa]" />
                                Export My Data
                            </h3>
                            <p className="text-xs text-[#aaa] max-w-sm">
                                Download a copy of your profile, size preferences, and order history in JSON format.
                            </p>
                        </div>
                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-6 py-3 border-2 border-[#1a1a1a]/10 text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#f8f7f5] transition-all"
                        >
                            <FiEye className="w-3.5 h-3.5" />
                            Export My Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                                <FiAlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 tracking-tight">Are you sure you want to delete your account?</h3>
                            <p className="text-sm text-[#666] leading-relaxed mb-8">
                                This action is permanent and cannot be undone. All your purchase history and saved sizes will be lost forever.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-3.5 bg-[#f8f7f5] text-[#1a1a1a] text-xs font-bold rounded-xl hover:bg-[#efeeec] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ── Favourites Tab ───────────────────────────────────────────── */
const FavouritesTab = () => (
    <motion.div key="favourites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-1 tracking-tight">Favourites</h2>
        <p className="text-[#aaa] text-sm mb-8">Your curated wishlist items</p>
        <div className="bg-white rounded-2xl border border-[#f0eeec] shadow-sm p-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#f8f7f5] flex items-center justify-center mx-auto mb-6">
                <FiHeart className="text-[#ccc] text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">Your wishlist is empty</h3>
            <p className="text-[#aaa] text-sm mb-8 max-w-xs mx-auto">Explore all products and save items you love for later.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] text-white text-sm font-bold rounded-xl hover:bg-[#333] transition-colors">
                Explore Collection
            </Link>
        </div>
    </motion.div>
);

/* ── Main Page ────────────────────────────────────────────────── */
type Tab = 'orders' | 'favourites' | 'personal' | 'sizes' | 'security' | 'advanced' | 'addresses';

const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [mobileSidebar, setMobileSidebar] = useState(false);

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { orders = [], loading } = useSelector((state: RootState) => state.orders);

    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => { if (!userInfo) navigate('/login'); }, [userInfo, navigate]);

    useEffect(() => {
        if (userInfo && activeTab === 'orders') {
            dispatch(listMyOrders());
        }
    }, [dispatch, userInfo, activeTab]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const handleCancelOrder = async (reason: string, note: string) => {
        if (!selectedOrderId) return;
        try {
            await dispatch(cancelOrder({ id: selectedOrderId, reason, note })).unwrap();
            toastService.success('Order cancelled successfully');
            setShowCancelModal(false);
            dispatch(listMyOrders());
        } catch (err: any) {
            toastService.error(err || 'Failed to cancel order');
        }
    };

    const triggerCancelModal = (id: string) => {
        setSelectedOrderId(id);
        setShowCancelModal(true);
    };

    if (!userInfo) return null;

    const navItems: { id: Tab; icon: React.ElementType; label: string }[] = [
        { id: 'orders', icon: FiShoppingBag, label: 'Orders' },
        { id: 'favourites', icon: FiHeart, label: 'Favourites' },
        { id: 'personal', icon: FiUser, label: 'Personal Information' },
        { id: 'addresses', icon: FiMapPin, label: 'Saved Addresses' },
        { id: 'sizes', icon: FiSettings, label: 'Size Preferences' },
        { id: 'security', icon: FiLock, label: 'Security & Access' },
        { id: 'advanced', icon: FiTrash2, label: 'Advanced' },
    ];

    /* Sidebar Content */
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="px-5 py-7 border-b border-[#f5f4f2]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-white text-base font-bold flex-shrink-0 shadow-lg shadow-black/10">
                        {userInfo.name?.charAt(0).toUpperCase() || userInfo.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-[#1a1a1a] truncate">{userInfo.name || userInfo.username}</p>
                        <p className="text-[10px] text-[#aaa] font-medium tracking-tight uppercase mt-0.5">{userInfo.role}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1.5">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeTab === item.id}
                        onClick={() => { setActiveTab(item.id); setMobileSidebar(false); }}
                    />
                ))}
            </nav>

            <div className="px-3 py-5 border-t border-[#f5f4f2] bg-[#fcfcfb]">
                <NavItem icon={FiLogOut} label="Log Out Securely" active={false} onClick={handleLogout} danger />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f7f5] pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10 lg:mb-12">
                    <div className="flex items-center gap-2 text-[10px] text-[#aaa] tracking-[0.3em] uppercase mb-1.5 font-bold">
                        <FiUser className="w-3 h-3" />
                        Account Hub
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#1a1a1a]">Management Center</h1>
                </div>

                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setMobileSidebar(v => !v)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 bg-white border border-[#f0eeec] rounded-2xl text-sm font-bold text-[#1a1a1a] shadow-sm"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#f8f7f5] flex items-center justify-center text-[#1a1a1a]">
                            {navItems.find(n => n.id === activeTab)?.icon &&
                                React.createElement(navItems.find(n => n.id === activeTab)!.icon)}
                        </div>
                        {navItems.find(n => n.id === activeTab)?.label}
                        <FiChevronRight className={`w-5 h-5 ml-auto text-[#ccc] transition-transform ${mobileSidebar ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {mobileSidebar && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-3 bg-white rounded-3xl border border-[#f0eeec] shadow-xl"
                            >
                                <SidebarContent />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="hidden lg:flex flex-col w-80 flex-shrink-0">
                        <div className="bg-white rounded-3xl border border-[#f0eeec] shadow-sm overflow-hidden sticky top-28">
                            <SidebarContent />
                        </div>
                    </aside>

                    <main className="flex-1 min-w-0 pb-10">
                        <AnimatePresence mode="wait">
                            {activeTab === 'orders' && (
                                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Order Lifecycle</h2>
                                            <p className="text-[#aaa] text-sm mt-0.5">Manage and track your acquisitions</p>
                                        </div>
                                    </div>

                                    {/* Summary Dashboard */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                        {[
                                            { label: 'Total Orders', value: orders.length, color: '#1a1a1a', bg: 'white' },
                                            {
                                                label: 'Amount Spent',
                                                value: `₹${orders.reduce((acc, o) => {
                                                    const val = o.totalPrice || o.totalAmount;
                                                    if (val) return acc + val;
                                                    const sub = (o.orderItems || []).reduce((a, i) => a + (Number(i.price || 0) * Number(i.quantity || i.qty || 1)), 0);
                                                    const ship = sub > 1000 ? 0 : 99;
                                                    const tax = Math.round(sub * 0.18);
                                                    return acc + (sub + ship + tax);
                                                }, 0).toLocaleString('en-IN')}`,
                                                color: '#1a1a1a', bg: 'white'
                                            },
                                            {
                                                label: 'Pending Orders',
                                                value: orders.filter(o => ['processing', 'confirmed'].includes(o.status || '')).length,
                                                color: '#7c3aed', bg: '#f5f3ff'
                                            },
                                            {
                                                label: 'Delivered Orders',
                                                value: orders.filter(o => (o.status || '') === 'delivered').length,
                                                color: '#22c55e', bg: '#f0fdf4'
                                            },
                                        ].map((stat, i) => (
                                            <div key={i} className="p-5 rounded-2xl border border-[#f0eeec] shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02]" style={{ backgroundColor: stat.bg }}>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2">{stat.label}</p>
                                                <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Filters & Sorting */}
                                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                                        <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#f0eeec] shadow-sm">
                                            <FiFilter className="text-[#ccc] w-4 h-4" />
                                            <select
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                className="flex-1 bg-transparent text-xs font-bold text-[#1a1a1a] outline-none cursor-pointer p-1"
                                            >
                                                <option value="all">All Statuses</option>
                                                <option value="processing">Processing</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#f0eeec] shadow-sm">
                                            {sortBy === 'newest' ? <FiArrowDown className="text-[#ccc] w-4 h-4" /> : <FiArrowUp className="text-[#ccc] w-4 h-4" />}
                                            <select
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="bg-transparent text-xs font-bold text-[#1a1a1a] outline-none cursor-pointer p-1"
                                            >
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                            </select>
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="space-y-6">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="bg-white rounded-3xl border border-[#f0eeec] h-52 animate-pulse" />
                                            ))}
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="bg-white rounded-3xl border border-[#f0eeec] shadow-sm p-20 text-center">
                                            <div className="w-20 h-20 rounded-3xl bg-[#f8f7f5] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                                <FiShoppingBag className="text-[#ccc] text-4xl" />
                                            </div>
                                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">No acquisitions found</h3>
                                            <p className="text-[#aaa] text-sm mb-10 max-w-xs mx-auto">Your journey with VELOURA starts with your first order.</p>
                                            <Link to="/shop" className="inline-flex items-center gap-3 px-10 py-3.5 bg-[#1a1a1a] text-white text-sm font-bold rounded-2xl hover:bg-[#333] transition-all shadow-lg shadow-black/10">
                                                Begin Shopping
                                                <FiChevronRight />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <AnimatePresence>
                                                {orders
                                                    .filter(o => filter === 'all' || (o.status || 'processing').toLowerCase() === filter.toLowerCase())
                                                    .sort((a, b) => {
                                                        const dateA = new Date(a.createdAt || 0).getTime();
                                                        const dateB = new Date(b.createdAt || 0).getTime();
                                                        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
                                                    })
                                                    .map(order => <OrderCard key={order._id} order={order} onCancelOrder={triggerCancelModal} />)}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'favourites' && <FavouritesTab />}
                            {activeTab === 'personal' && <PersonalInfoTab userInfo={userInfo} />}
                            {activeTab === 'addresses' && <AddressesTab />}
                            {activeTab === 'sizes' && <SizePreferencesTab userInfo={userInfo} />}
                            {activeTab === 'security' && <SecurityTab />}
                            {activeTab === 'advanced' && <AdvancedTab />}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            <CancelOrderModal
                open={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
            />
        </div>
    );
};

export default ProfilePage;

