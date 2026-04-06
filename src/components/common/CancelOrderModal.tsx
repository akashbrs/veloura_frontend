import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface CancelOrderModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string, note: string) => void;
}

const REASONS = [
    { value: 'ordered_by_mistake', label: 'Ordered by mistake' },
    { value: 'found_cheaper', label: 'Found cheaper elsewhere' },
    { value: 'delivery_too_slow', label: 'Delivery taking too long' },
    { value: 'changed_mind', label: 'Changed my mind' },
    { value: 'other', label: 'Other' },
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ open, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');

    if (!open) return null;

    const handleConfirm = () => {
        if (!reason) return;
        onConfirm(reason, note);
        // Reset state for next use
        setReason('');
        setNote('');
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl border border-[#f0eeec]"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 text-[#aaa] hover:text-[#1a1a1a] transition-colors"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                            <FiAlertCircle size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2 tracking-tight">Cancel Order</h2>
                        <p className="text-sm text-[#666] leading-relaxed mb-8">
                            We're sorry to see you cancel. Please tell us the reason so we can improve our service.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2">
                                    Reason for cancellation *
                                </label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] border border-[#f0eeec] rounded-xl text-sm text-[#1a1a1a] outline-none transition-all focus:border-[#1a1a1a] appearance-none cursor-pointer"
                                >
                                    <option value="">Select a reason</option>
                                    {REASONS.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-2">
                                    Additional details (optional)
                                </label>
                                <textarea
                                    placeholder="Tell us more about why you're cancelling..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#f8f7f5] border border-[#f0eeec] rounded-xl text-sm text-[#1a1a1a] outline-none transition-all focus:border-[#1a1a1a] min-h-[100px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <button
                                onClick={onClose}
                                className="px-6 py-3.5 bg-[#f8f7f5] text-[#1a1a1a] text-xs font-bold rounded-xl hover:bg-[#efeeec] transition-colors uppercase tracking-widest font-bold"
                            >
                                Nevermind
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!reason}
                                className={`px-6 py-3.5 text-white text-xs font-bold rounded-xl transition-all shadow-lg uppercase tracking-widest font-bold
                                    ${reason 
                                        ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                                        : 'bg-red-300 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CancelOrderModal;
