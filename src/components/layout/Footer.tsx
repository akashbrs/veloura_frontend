import { Link } from 'react-router-dom';
import { toastService } from '@/services/toastService';
import { FiInstagram, FiTwitter, FiArrowUpRight } from 'react-icons/fi';

const Footer = () => (
    <footer className="bg-white border-t border-[#e8e8e8]" style={{ fontFamily: 'var(--vx-font-body)' }}>

        {/* ── Main Grid */}
        <div className="vx-container py-14 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6">

                {/* Brand Column */}
                <div className="md:col-span-4">
                    <Link to="/" className="inline-block text-2xl font-bold tracking-[0.15em] text-[#0a0a0a] mb-5" style={{ fontFamily: 'var(--vx-font-brand)' }}>
                        VELOURA
                    </Link>
                    <p className="text-[#9a9a9a] text-sm leading-relaxed max-w-xs mb-8">
                        Modern Indian fashion for those who move with intention. Premium quality, timeless design.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Instagram" className="w-8 h-8 border border-[#e8e8e8] rounded-full flex items-center justify-center text-[#9a9a9a] hover:text-[#0a0a0a] hover:border-[#0a0a0a] transition-colors">
                            <FiInstagram strokeWidth={1.5} className="w-3.5 h-3.5" />
                        </a>
                        <a href="#" aria-label="Twitter" className="w-8 h-8 border border-[#e8e8e8] rounded-full flex items-center justify-center text-[#9a9a9a] hover:text-[#0a0a0a] hover:border-[#0a0a0a] transition-colors">
                            <FiTwitter strokeWidth={1.5} className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Shop Links */}
                <div className="md:col-span-2 md:col-start-6">
                    <p className="text-[10px] tracking-widest uppercase font-semibold text-[#9a9a9a] mb-5">Shop</p>
                    <ul className="flex flex-col gap-3">
                        {[
                            { label: 'Men', to: '/shop?category=Men' },
                            { label: 'Women', to: '/shop?category=Women' },
                            { label: 'Kids', to: '/shop?category=Kids' },
                            { label: 'Sale', to: '/sale' },
                        ].map(l => (
                            <li key={l.to}>
                                <Link to={l.to} className="text-sm text-[#3d3d3d] hover:text-[#0a0a0a] transition-colors font-medium">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support Links */}
                <div className="md:col-span-2">
                    <p className="text-[10px] tracking-widest uppercase font-semibold text-[#9a9a9a] mb-5">Support</p>
                    <ul className="flex flex-col gap-3">
                        {[
                            { label: 'FAQ', to: '/support/faq' },
                            { label: 'Shipping & Returns', to: '/support/shipping' },
                            { label: 'Size Guide', to: '/support/size-guide' },
                            { label: 'Contact Us', to: '/support/contact' },
                        ].map(l => (
                            <li key={l.to}>
                                <Link to={l.to} className="text-sm text-[#3d3d3d] hover:text-[#0a0a0a] transition-colors font-medium">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="md:col-span-3">
                    <p className="text-[10px] tracking-widest uppercase font-semibold text-[#9a9a9a] mb-4">Stay Updated</p>
                    <p className="text-xs text-[#9a9a9a] mb-4 leading-relaxed">
                        New drops and exclusive offers, straight to your inbox.
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); toastService.success('Thanks for subscribing!', { label: 'Shop New Drops', path: '/shop' }); }} className="flex gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 text-xs bg-[#f5f5f5] border border-transparent rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder:text-[#9a9a9a] text-[#0a0a0a]"
                        />
                        <button type="submit" className="px-4 py-2.5 bg-[#0a0a0a] text-white rounded-xl hover:bg-[#3d3d3d] transition-colors flex-shrink-0">
                            <FiArrowUpRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>
        </div>

        {/* ── Bottom Bar */}
        <div className="border-t border-[#e8e8e8]">
            <div className="vx-container py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs text-[#9a9a9a]">
                    &copy; {new Date().getFullYear()} VELOURA. All rights reserved.
                </p>
                <div className="flex gap-6">
                    {[
                        { label: 'Privacy Policy', to: '/legal/privacy' },
                        { label: 'Terms of Service', to: '/legal/terms' },
                    ].map(l => (
                        <Link key={l.to} to={l.to} className="text-xs text-[#9a9a9a] hover:text-[#0a0a0a] transition-colors">
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    </footer>
);

export default Footer;
