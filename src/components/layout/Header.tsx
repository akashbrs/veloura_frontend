import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown, FiHeart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/authSlice';
import type { RootState, AppDispatch } from '@/redux';

const NAV_LINKS = [
    { label: 'Men', to: '/shop?category=Men' },
    { label: 'Women', to: '/shop?category=Women' },
    { label: 'Kids', to: '/shop?category=Kids' },
    { label: 'Sale', to: '/sale' },
];

const Header = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { items: cartItems } = useSelector((state: RootState) => state.cart);
    const wishlistItems = useSelector((state: RootState) => (state as any).wishlist?.items || []);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname, location.search]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const logoutHandler = () => {
        dispatch(logoutUser());
        setDropdownOpen(false);
        navigate('/login');
    };

    const cartItemCount = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
    const wishlistCount = wishlistItems.length;

    // Navbar is transparent (over hero) only on the homepage AND before the user scrolls.
    // On every other page it is always opaque so it never disappears against white content.
    const isHome = location.pathname === '/';
    const isTransparent = isHome && !scrolled;

    const headerBg = isTransparent
        ? 'bg-transparent'
        : 'bg-white/98 backdrop-blur-md shadow-[0_1px_0_0_#e8e8e8]';
    const headerPy = scrolled ? 'py-3' : 'py-5';
    const textColor = isTransparent ? 'text-white' : 'text-[#0a0a0a]';

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${headerBg} ${headerPy}`}>
                <div className="vx-container">
                    <div className="flex items-center justify-between gap-8">

                        {/* ── Left Nav */}
                        <nav className="hidden md:flex items-center gap-8 flex-1">
                            {NAV_LINKS.slice(0, 2).map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`vx-label transition-opacity duration-200 hover:opacity-50 ${textColor}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* ── Logo (Center) */}
                        <Link
                            to="/"
                            className={`text-2xl font-bold tracking-[0.15em] flex-shrink-0 transition-colors ${textColor}`}
                            style={{ fontFamily: 'var(--vx-font-brand)' }}
                        >
                            VELOURA
                        </Link>

                        {/* ── Right Nav + Icons */}
                        <div className="hidden md:flex items-center justify-end gap-8 flex-1">
                            {NAV_LINKS.slice(2).map(link => {
                                const isActive = location.pathname === link.to;
                                const isSale = link.label === 'Sale';
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`vx-label transition-all duration-200 hover:opacity-100 ${isSale ? 'text-[#B91C1C] font-black' : textColor} ${isActive ? (isSale ? 'border-b-2 border-[#B91C1C] pb-1' : 'opacity-100') : 'opacity-60'} hover:opacity-100`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className={`w-px h-4 bg-current opacity-20 ${textColor}`} />
                            <button onClick={() => navigate('/shop')} className={`${textColor} hover:opacity-50 transition-opacity`}>
                                <FiSearch className="w-[18px] h-[18px]" strokeWidth={1.5} />
                            </button>
                            {userInfo ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className={`flex items-center gap-1.5 ${textColor} hover:opacity-50 transition-opacity`}
                                    >
                                        <FiUser className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                        <FiChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-5 w-48 bg-white border border-[#e8e8e8] rounded-2xl py-2 shadow-xl z-50">
                                            <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-5 py-3 text-sm text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors font-medium">My Profile</Link>
                                            {userInfo.role === 'admin' && (
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-5 py-3 text-sm text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors font-medium">Dashboard</Link>
                                            )}
                                            <div className="h-px bg-[#e8e8e8] mx-2 my-1" />
                                            <button onClick={logoutHandler} className="block w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className={`${textColor} hover:opacity-50 transition-opacity`}>
                                    <FiUser className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                </Link>
                            )}
                            <Link to="/wishlist" className={`${textColor} hover:opacity-50 transition-opacity relative`}>
                                <FiHeart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/cart" className={`${textColor} hover:opacity-50 transition-opacity relative`}>
                                <FiShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#0a0a0a] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* ── Mobile Hamburger & Icons */}
                        <div className="flex md:hidden items-center gap-5">
                            <Link to="/wishlist" className={`${textColor} hover:opacity-50 transition-opacity relative`}>
                                <FiHeart className="w-5 h-5" strokeWidth={1.5} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/cart" className={`${textColor} hover:opacity-50 transition-opacity relative`}>
                                <FiShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#0a0a0a] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`${textColor} transition-opacity hover:opacity-50`}
                            >
                                {mobileMenuOpen
                                    ? <FiX className="w-6 h-6" strokeWidth={1.5} />
                                    : <FiMenu className="w-6 h-6" strokeWidth={1.5} />
                                }
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            {/* ── Mobile Full-Screen Menu — z-[60] keeps it below the navbar's z-[70] close button */}
            <div className={`fixed inset-0 z-[60] bg-[#0a0a0a] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col justify-between p-8 pt-28 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <nav className="flex flex-col gap-2">
                    {NAV_LINKS.map((link, i) => {
                        const isSale = link.label === 'Sale';
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-[clamp(2.5rem,8vw,5rem)] font-black tracking-tighter leading-none hover:opacity-40 transition-all duration-500 ${isSale ? 'text-[#B91C1C]' : 'text-white'} ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ fontFamily: 'var(--vx-font-display)', transitionDelay: mobileMenuOpen ? `${i * 60}ms` : '0ms' }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                    {!userInfo ? (
                        <Link to="/login" className="vx-label text-white/60">Login / Register</Link>
                    ) : (
                        <>
                            <Link to="/profile" className="vx-label text-white/60">My Profile</Link>
                            <button onClick={logoutHandler} className="vx-label text-red-400 text-left">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
