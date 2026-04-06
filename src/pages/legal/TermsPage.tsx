import { motion } from 'framer-motion';

const TermsPage = () => {
    return (
        <div className="bg-[#fcfbf9] min-h-screen pt-32 pb-20">
            <div className="vx-container max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#f0eeec] rounded-[2.5rem] p-10 md:p-16 shadow-sm"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#f0eeec] text-[#a0a09e] text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                        Legal Agreement
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-8 tracking-tight italic">Terms of Service</h1>

                    <div className="prose prose-neutral max-w-none text-[#666] leading-relaxed">
                        <p className="text-lg font-medium text-[#1a1a1a] mb-8">
                            Welcome to VELOURA. By using our services, you agree to the following terms and conditions.
                        </p>

                        <h3 className="text-[#1a1a1a] font-bold text-xl mt-12 mb-4">1. Acceptance of Terms</h3>
                        <p>By accessing or using the VELOURA website, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>

                        <h3 className="text-[#1a1a1a] font-bold text-xl mt-12 mb-4">2. Product Availability</h3>
                        <p>We strive for accuracy but do not guarantee that all product descriptions or prices are error-free. We reserve the right to correct errors and cancel orders if necessary.</p>

                        <h3 className="text-[#1a1a1a] font-bold text-xl mt-12 mb-4">3. Intellectual Property</h3>
                        <p>All content on this site, including designs, text, and images, is the property of VELOURA and protected by international copyright laws.</p>

                        <div className="mt-16 p-8 bg-[#f8f7f5] rounded-3xl border border-[#f0eeec]">
                            <p className="text-sm italic mb-0">
                                Contact <span className="text-[#1a1a1a] font-bold">legal@VELOURA.com</span> for inquiries regarding these terms.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsPage;
