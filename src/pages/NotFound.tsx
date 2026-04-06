import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <h1 className="text-[12rem] font-black leading-none text-[#1a1a1a]/5 tracking-tighter select-none">
                        404
                    </h1>
                    <div className="mt--20">
                        <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">Lost in the Collection?</h2>
                        <p className="text-[#9a9a9a] leading-relaxed mb-10">
                            The page you're looking for might have been moved, deleted, or never existed in the first place.
                        </p>
                    </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold hover:bg-[#333] transition-all shadow-lg shadow-black/10"
                    >
                        <FiArrowLeft /> Back to Home
                    </Link>
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-[#e8e8e8] text-[#1a1a1a] rounded-2xl font-bold hover:border-[#1a1a1a] transition-all"
                    >
                        <FiShoppingBag /> Explore Shop
                    </Link>
                </div>

                <p className="mt-12 text-[10px] uppercase tracking-widest font-bold text-[#ccc]">
                    Error Code: VXR-404-NOTFOUND
                </p>
            </div>
        </div>
    );
};

export default NotFound;
