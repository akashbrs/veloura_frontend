import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo } from 'react-icons/fi';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SIZE_DATA = [
    { size: 'S', chest: '38"', length: '27"', shoulder: '17.5"', sleeve: '8"' },
    { size: 'M', chest: '40"', length: '28"', shoulder: '18.5"', sleeve: '8.5"' },
    { size: 'L', chest: '42"', length: '29"', shoulder: '19.5"', sleeve: '9"' },
    { size: 'XL', chest: '44"', length: '30"', shoulder: '20.5"', sleeve: '9.5"' },
];

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white z-[201] rounded-[2rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-[#eee] flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Size Guide</h2>
                                <p className="text-[10px] text-[#999] uppercase tracking-widest mt-1">Measurements in Inches</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full border border-[#eee] flex items-center justify-center hover:bg-[#f5f5f5] transition-colors">
                                <FiX className="w-4 h-4 text-[#1a1a1a]" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Table */}
                            <div className="overflow-hidden rounded-2xl border border-[#eee] mb-8">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-[#fcfcfc] border-b border-[#eee]">
                                        <tr>
                                            <th className="px-5 py-4 font-bold text-[#1a1a1a]">Size</th>
                                            <th className="px-5 py-4 font-bold text-[#1a1a1a]">Chest</th>
                                            <th className="px-5 py-4 font-bold text-[#1a1a1a]">Length</th>
                                            <th className="px-5 py-4 font-bold text-[#1a1a1a]">Shoulder</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eee]">
                                        {SIZE_DATA.map((row) => (
                                            <tr key={row.size} className="hover:bg-[#fafaf9] transition-colors">
                                                <td className="px-5 py-4 font-bold text-[#1a1a1a]">{row.size}</td>
                                                <td className="px-5 py-4 text-[#777]">{row.chest}</td>
                                                <td className="px-5 py-4 text-[#777]">{row.length}</td>
                                                <td className="px-5 py-4 text-[#777]">{row.shoulder}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* How to Measure */}
                            <div className="bg-[#fafaf9] p-6 rounded-2xl border border-[#eee]">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiInfo className="w-4 h-4 text-[#1a1a1a]" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">How to Measure</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-[#999] uppercase mb-1">Chest</p>
                                        <p className="text-xs text-[#777] leading-relaxed">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-[#999] uppercase mb-1">Length</p>
                                        <p className="text-xs text-[#777] leading-relaxed">Measure from the highest point of the shoulder down to the hem.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 bg-[#fcfcfc] border-t border-[#eee] flex justify-center">
                            <p className="text-[11px] text-[#999] italic italic">All measurements are approximate and may vary by +/- 0.5 inches</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SizeGuideModal;
