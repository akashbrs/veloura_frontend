import { motion } from 'framer-motion';

const PrivacyPage = () => {
    return (
        <div className="bg-[#fcfbf9] min-h-screen pt-32 pb-20">
            <div className="vx-container max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#f0eeec] rounded-[2.5rem] p-10 md:p-16 shadow-sm"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#f0eeec] text-[#a0a09e] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                        Legal Policy
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-8 tracking-tight italic">Privacy Policy</h1>

                    <div className="prose prose-neutral max-w-none text-[#666] leading-relaxed">
                        <p className="text-lg font-medium text-[#1a1a1a] mb-8">
                            At VELOURA, we respect your privacy as much as we value your style. This policy explains how we handle your data.
                        </p>

                        <h3 className="text-[#1a1a1a] font-bold text-xl mt-12 mb-4">1. Data Collection</h3>
                        <p>We collect information you provide directly to us: name, email, shipping address, and payment details when you make a purchase. We also collect browsing behavior to improve your experience.</p>

                        <h3 className="text-[#1a1a1a] font-bold text-xl mt-12 mb-4">2. Size Preferences</h3>
                        <p>Your size preferences are stored securely and used exclusively to provide "Smart Recommendations" across the platform. This data is never shared with third parties.</p>

                        <h3 className="text-[#1a1a1a] font-bold text-xl mt-12 mb-4">3. Security</h3>
                        <p>We implement industry-standard encryption (SSL) to protect your transaction data and personal information.</p>

                        <div className="mt-16 p-8 bg-[#f8f7f5] rounded-3xl border border-[#f0eeec]">
                            <p className="text-sm italic mb-0">
                                Last Updated: February 2026. For questions regarding your data, please contact <span className="text-[#1a1a1a] font-bold">privacy@VELOURA.com</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPage;
