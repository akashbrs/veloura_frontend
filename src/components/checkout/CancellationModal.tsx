import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle, FiCheck } from 'react-icons/fi';

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, note: string) => void;
    loading: boolean;
}

const REASONS = [
    'Changed my mind',
    'Ordered wrong item / size',
    'Found a better price elsewhere',
    'Delivery time is too long',
    'Duplicate order',
    'Other'
];

const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
    const [step, setStep] = useState(1); // 1: Confirmation, 2: Reason
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');

    const handleNext = () => setStep(2);
    const handleSubmit = () => {
        if (!reason) return;
        onConfirm(reason, note);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden font-sans"
                    >
                        <div className="p-8 sm:p-10">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-[#aaa] hover:text-[#0a0a0a] transition-colors"
                            >
                                <FiX size={20} />
                            </button>

                            {step === 1 ? (
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-2">
                                        <FiAlertTriangle size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight mb-3 italic">Confirm Cancellation?</h2>
                                        <p className="text-sm text-[#777] leading-relaxed">
                                            Are you sure you want to cancel this order? This action is permanent and cannot be reversed once confirmed.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            onClick={handleNext}
                                            className="flex-1 py-4 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/10"
                                        >
                                            Continue to Cancel
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="flex-1 py-4 bg-[#f8f7f5] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#efeeec] transition-all"
                                        >
                                            Keep Order
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight mb-2 italic">Why are you cancelling?</h2>
                                        <p className="text-[10px] text-[#aaa] font-bold uppercase tracking-widest">Select a reason to help us improve</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {REASONS.map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setReason(r)}
                                                className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all flex items-center justify-between group
                                                    ${reason === r
                                                        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                                        : 'border-[#f0eeec] bg-white text-[#777] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}`}
                                            >
                                                <span className="text-xs font-bold uppercase tracking-wider">{r}</span>
                                                {reason === r && <FiCheck size={14} />}
                                            </button>
                                        ))}
                                    </div>

                                    {reason === 'Other' && (
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Tell us more (optional)..."
                                            className="w-full h-24 p-4 bg-[#f8f7f5] border-2 border-transparent rounded-xl text-xs focus:border-[#1a1a1a] focus:bg-white outline-none transition-all resize-none font-medium"
                                        />
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading || !reason}
                                            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2
                                                ${!reason || loading ? 'bg-[#eee] text-[#aaa] cursor-not-allowed' : 'bg-[#1a1a1a] text-white hover:bg-[#333] shadow-xl shadow-black/10'}`}
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                'Complete Cancellation'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 py-4 bg-[#f8f7f5] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#efeeec] transition-all"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CancellationModal;
