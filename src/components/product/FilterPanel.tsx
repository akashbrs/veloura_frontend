import { motion } from 'framer-motion';

const FilterPanel = ({ isFilterOpen, setIsFilterOpen }: { isFilterOpen: boolean, setIsFilterOpen: (b: boolean) => void }) => {
    return (
        <>
            {/* Mobile Filter Overlay */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}

            {/* Filter Sidebar */}
            <motion.div
                initial={false}
                animate={{ width: isFilterOpen ? 'w-64' : '0px', opacity: isFilterOpen ? 1 : 0 }}
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-xl lg:shadow-none overflow-y-auto lg:overflow-visible transition-all duration-300 ease-in-out ${isFilterOpen ? 'w-72 p-6 border-r border-gray-100' : 'w-0 lg:w-64 lg:p-6 lg:border-r lg:border-gray-100'}`}
            >
                <div className={!isFilterOpen && 'lg:block hidden' ? 'block' : 'hidden lg:block'}>
                    <div className="flex justify-between items-center mb-6 lg:hidden">
                        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-900">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                        <div className="space-y-3">
                            {['All', 'Men', 'Women', 'Kids', 'Accessories'].map((category) => (
                                <label key={category} className="flex items-center group cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 transition duration-150 ease-in-out" />
                                    <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Price Range</h3>
                        <div className="space-y-4">
                            <input type="range" min="0" max="500" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>₹0</span>
                                <span>₹5,000+</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        Apply Filters
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default FilterPanel;
