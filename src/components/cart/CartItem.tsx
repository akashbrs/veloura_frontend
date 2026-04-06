import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
    item: CartItemType;
    updateQty: (id: string, qty: number, size?: string) => void;
    removeItem: (id: string, size?: string) => void;
}

const CartItem = ({ item, updateQty, removeItem }: CartItemProps) => {
    const qty = item.quantity || 1;

    return (
        <div className="relative flex gap-6 md:gap-10 py-10">
            {/* Remove (×) button — top right */}
            <button
                onClick={() => removeItem(item.product, item.size)}
                className="absolute top-8 right-0 w-8 h-8 flex items-center justify-center text-[#999] hover:text-[#0a0a0a] transition-colors"
                aria-label="Remove item"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="2" y1="2" x2="14" y2="14" /><line x1="14" y1="2" x2="2" y2="14" />
                </svg>
            </button>

            {/* Product image */}
            <Link
                to={`/product/${item.product}`}
                className="w-[140px] h-[170px] md:w-[180px] md:h-[220px] flex-shrink-0 bg-[#f5f4f2] rounded-lg overflow-hidden block hover:opacity-90 transition-opacity"
            >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                />
            </Link>

            {/* Product details */}
            <div className="flex-1 pr-8 min-w-0">
                {/* Name */}
                <Link to={`/product/${item.product}`} className="block group">
                    <h3 className="text-lg md:text-xl font-bold text-[#0a0a0a] uppercase tracking-wide leading-tight group-hover:text-blue-600 transition-colors">
                        {item.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-[#0a0a0a] text-base font-bold">
                        ₹ {item.price.toLocaleString('en-IN')}
                    </p>
                    {item.originalPrice && item.originalPrice > item.price && (
                        <>
                            <p className="text-[#999] text-sm line-through">
                                ₹ {item.originalPrice.toLocaleString('en-IN')}
                            </p>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                SALE
                            </span>
                        </>
                    )}
                </div>

                {/* Color & Size selectors */}
                <div className="flex items-center gap-4 mt-5">
                    {/* Color indicator + dropdown */}
                    <div className="flex items-center gap-2 border border-[#e0e0e0] rounded px-3 py-1.5">
                        <span
                            className="w-5 h-5 rounded-full border border-[#ddd] flex-shrink-0"
                            style={{ backgroundColor: '#333' }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#333]">
                            Black
                        </span>
                        <svg className="w-3 h-3 text-[#999] ml-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 4.5 L6 7.5 L9 4.5" />
                        </svg>
                    </div>

                    {/* Size dropdown */}
                    <div className="flex items-center gap-2 border border-[#e0e0e0] rounded px-3 py-1.5">
                        <span className="text-xs font-semibold text-[#333]">
                            {item.size || 'M'}
                        </span>
                        <svg className="w-3 h-3 text-[#999]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 4.5 L6 7.5 L9 4.5" />
                        </svg>
                    </div>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-0 mt-5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0a0a0a] mr-4">
                        Quantity
                    </span>
                    <button
                        onClick={() => updateQty(item.product, Math.max(1, qty - 1), item.size)}
                        disabled={qty <= 1}
                        className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-[#0a0a0a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                    >
                        −
                    </button>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={qty}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.15 }}
                            className="w-8 h-8 flex items-center justify-center border border-[#0a0a0a] text-sm font-bold text-[#0a0a0a] rounded-sm"
                        >
                            {qty}
                        </motion.span>
                    </AnimatePresence>
                    <button
                        onClick={() => updateQty(item.product, Math.min(item.stock || 10, qty + 1), item.size)}
                        disabled={qty >= (item.stock || 10)}
                        className="w-8 h-8 flex items-center justify-center text-[#666] hover:text-[#0a0a0a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
