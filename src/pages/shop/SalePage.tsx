import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronDown } from 'react-icons/fi';
import VeloraProductCard from '@/components/product/VeloraProductCard';
import { listProducts } from '@/redux/slices/productSlice';
import type { AppDispatch, RootState } from '@/redux';

const SORTS = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Highest Discount', value: 'discount' },
    { label: 'Top Rated', value: 'rating' },
] as const;

type SortKey = typeof SORTS[number]['value'];

const SalePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [sort, setSort] = useState<SortKey>('featured');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const { products, loading } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        dispatch(listProducts({
            style: 'sale',
            sort: sort !== 'featured' ? sort : undefined,
            limit: 40 // Larger limit for sale page is fine
        }));
    }, [dispatch, sort]);

    // Use Redux catalog
    const saleProducts = Array.isArray(products) ? products : [];
    const displayedProducts = saleProducts;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center pt-24">
                <div className="w-10 h-10 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (saleProducts.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-8">
                <h1 className="text-4xl font-bold text-[#0a0a0a] mb-4" style={{ fontFamily: 'var(--vx-font-display)' }}>
                    No current promotions.
                </h1>
                <p className="text-[#9a9a9a] text-lg">Check back soon for our next seasonal edit.</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-28 pb-24">
            {/* Header */}
            <div className="vx-container mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e8e8e8] pb-10">
                    <div className="flex flex-col">
                        <p className="vx-label text-red-500 font-bold mb-3 tracking-[0.2em]">Seasonal Edit</p>
                        <h1 className="text-5xl md:text-6xl font-black text-[#0a0a0a] tracking-tighter leading-none mb-4" style={{ fontFamily: 'var(--vx-font-display)' }}>
                            The Sale
                        </h1>
                        <p className="text-lg text-[#9a9a9a] max-w-md">
                            Selected styles at special prices. Limited-time reductions on selected pieces.
                        </p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8">
                        <span className="text-sm font-bold text-[#0a0a0a] uppercase tracking-widest">
                            {saleProducts.length} Sale Items
                        </span>

                        {/* Sort */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 vx-label text-[#0a0a0a] border border-[#e8e8e8] px-5 py-3 rounded-full hover:border-[#0a0a0a] transition-colors"
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                {SORTS.find(s => s.value === sort)?.label}
                                <FiChevronDown className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-14 w-52 bg-white border border-[#e8e8e8] rounded-2xl py-2 shadow-xl z-20"
                                    >
                                        {SORTS.map(s => (
                                            <button
                                                key={s.value}
                                                onClick={() => { setSort(s.value); setShowSortMenu(false); }}
                                                className={`v-full block text-left px-5 py-3 text-sm transition-colors w-full ${sort === s.value ? 'bg-[#f5f5f5] text-[#0a0a0a] font-bold' : 'text-[#9a9a9a] hover:bg-[#f5f5f5] hover:text-[#0a0a0a]'}`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="vx-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {displayedProducts.map((product) => (
                        <VeloraProductCard key={product._id || (product as any).id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalePage;
