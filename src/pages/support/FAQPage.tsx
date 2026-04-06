import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQS = [
    {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-5 business days across India. Remote locations may take up to 7 days. You will receive a tracking link via email as soon as your order is dispatched."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 7-day hassle-free return policy for all unworn and unwashed items with tags intact. Returns can be initiated through your profile dashboard."
    },
    {
        question: "Do you ship internationally?",
        answer: "Currently, we ship within India only. We are working on expanding our reach to international fashion enthusiasts soon!"
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you will receive an email and SMS with the tracking ID and a link to our tracking partner's website."
    },
    {
        question: "Are the colors on the website accurate?",
        answer: "We strive to display product colors as accurately as possible. However, due to variations in monitor settings, the actual color may slightly differ."
    },
    {
        question: "Can I cancel my order?",
        answer: "Orders can be cancelled within 2 hours of placement. Go to your My Orders section or contact our support team immediately."
    }
];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#eee] last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-sm font-semibold text-[#1a1a1a] tracking-tight group-hover:text-[#555] transition-colors">
                    {question}
                </span>
                <div className={`w-6 h-6 rounded-full border border-[#eee] flex items-center justify-center transition-all ${isOpen ? 'bg-[#1a1a1a] border-[#1a1a1a]' : ''}`}>
                    {isOpen ? <FiMinus className="w-3 h-3 text-white" /> : <FiPlus className="w-3 h-3 text-[#1a1a1a]" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-sm text-[#777] leading-relaxed max-w-2xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQPage = () => {
    return (
        <div className="pt-32 pb-24 bg-white">
            <div className="vx-container max-w-3xl">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#999] mb-4">Support</p>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] mb-4">Frequently Asked Questions</h1>
                    <p className="text-sm text-[#777]">Everything you need to know about our products and services.</p>
                </div>

                <div className="bg-white border border-[#eee] rounded-3xl p-4 md:p-8">
                    {FAQS.map((faq, i) => (
                        <FAQItem key={i} {...faq} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-[#777] mb-6">Still have questions?</p>
                    <a
                        href="/support/contact"
                        className="inline-block px-10 py-4 bg-[#1a1a1a] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#333] transition-all"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
