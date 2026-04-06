import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ContactPage = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Thank you for reaching out! We'll get back to you within 24 hours.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="pt-32 pb-24 bg-white">
            <div className="vx-container max-w-6xl">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#999] mb-4">Connect</p>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] mb-4">Contact Us</h1>
                    <p className="text-sm text-[#777]">We're here to help you with anything you need.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <div>
                            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 tracking-tight">Support Channels</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 border border-[#eee] rounded-full flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                                        <FiMail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Email Us</p>
                                        <p className="text-base text-[#1a1a1a] font-medium">support@VELOURA.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 border border-[#eee] rounded-full flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                                        <FiPhone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Call Us</p>
                                        <p className="text-base text-[#1a1a1a] font-medium">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 border border-[#eee] rounded-full flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                                        <FiMapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-1">Corporate Office</p>
                                        <p className="text-base text-[#1a1a1a] font-medium leading-relaxed">
                                            VELOURA Studio, 4th Floor<br />
                                            Jubilee Hills, Road No. 36<br />
                                            Hyderabad, Telangana 500033
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[#f8f8f7] rounded-3xl border border-[#eee]">
                            <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">Service Hours</h3>
                            <div className="space-y-2 text-sm text-[#777]">
                                <div className="flex justify-between"><span>Mon - Sat</span><span>9 AM - 8 PM</span></div>
                                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-3 block">Full Name</label>
                                    <input required type="text" placeholder="John Doe" className="w-full bg-[#fcfcfc] border border-[#eee] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-3 block">Email Address</label>
                                    <input required type="email" placeholder="john@example.com" className="w-full bg-[#fcfcfc] border border-[#eee] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-3 block">Subject</label>
                                <select className="w-full bg-[#fcfcfc] border border-[#eee] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors appearance-none">
                                    <option>Order Inquiry</option>
                                    <option>Return/Exchange Request</option>
                                    <option>Quality Issue</option>
                                    <option>Bulk/Business Inquiry</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#999] mb-3 block">Message</label>
                                <textarea required rows={5} placeholder="How can we help you today?" className="w-full bg-[#fcfcfc] border border-[#eee] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#333] transition-all">
                                Send Message <FiArrowUpRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
