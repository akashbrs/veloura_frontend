import { FiTruck, FiRefreshCw, FiShield, FiClock } from 'react-icons/fi';

const ShippingPage = () => {
    return (
        <div className="pt-32 pb-24 bg-[#fafaf9]">
            <div className="vx-container max-w-4xl">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#999] mb-4">Policy</p>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] mb-4">Shipping & Returns</h1>
                    <p className="text-sm text-[#777]">Transparent policies for a worry-free shopping experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-3xl border border-[#eee] shadow-sm">
                        <div className="w-12 h-12 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-6">
                            <FiTruck className="w-6 h-6 text-[#1a1a1a]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Fast & Reliable Shipping</h2>
                        <ul className="space-y-4 text-sm text-[#777] leading-relaxed">
                            <li>• Free standard shipping on all orders above ₹1,999.</li>
                            <li>• Standard Delivery: 3-5 business days across major cities.</li>
                            <li>• Express Delivery: 1-2 business days (available in select metros).</li>
                            <li>• Fully trackable door-to-door service with real-time updates.</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-[#eee] shadow-sm">
                        <div className="w-12 h-12 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-6">
                            <FiRefreshCw className="w-6 h-6 text-[#1a1a1a]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">Hassle-Free Returns</h2>
                        <ul className="space-y-4 text-sm text-[#777] leading-relaxed">
                            <li>• 7-day return window from the date of delivery.</li>
                            <li>• Easy online return requests via your VELOURA account.</li>
                            <li>• Quality check completed within 48 hours of pick-up.</li>
                            <li>• Refunds processed directly to your original payment method.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] p-10 md:p-14 rounded-[2rem] text-white">
                    <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">Do I pay for return shipping?</h4>
                            <p className="text-base text-white/80 leading-relaxed font-light">No, we offer complimentary return pickups for all orders within India. Just ensure the tags are intact and the product is unused.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">What items are non-returnable?</h4>
                            <p className="text-base text-white/80 leading-relaxed font-light">For hygiene reasons, masks, innerwear, and certain personal care items are non-returnable. Sale items purchased with a 50% or deeper discount are final sale.</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">How long does the refund take?</h4>
                            <p className="text-base text-white/80 leading-relaxed font-light">Once the product reaches our warehouse and passes QC, the refund is initiated within 2 business days. Bank processing may take another 3-5 days.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <FiShield className="w-5 h-5 mx-auto text-[#1a1a1a] mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">Secure Transit</p>
                    </div>
                    <div className="text-center">
                        <FiClock className="w-5 h-5 mx-auto text-[#1a1a1a] mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">24-Hour Dispatch</p>
                    </div>
                    <div className="text-center">
                        <FiTruck className="w-5 h-5 mx-auto text-[#1a1a1a] mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">India-Wide Reach</p>
                    </div>
                    <div className="text-center">
                        <FiRefreshCw className="w-5 h-5 mx-auto text-[#1a1a1a] mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">Easy Exchanges</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
