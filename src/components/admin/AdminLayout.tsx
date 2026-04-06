import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/slices/authSlice';
import type { AppDispatch } from '@/redux';
import { FiHome, FiBox, FiUsers, FiShoppingBag, FiLogOut, FiActivity } from 'react-icons/fi';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: FiActivity },
        { name: 'Products', href: '/admin/products', icon: FiBox },
        { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
        { name: 'Users', href: '/admin/users', icon: FiUsers },
    ];

    return (
        <div className="min-h-screen bg-[#f2f0ed] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="h-20 flex items-center justify-center border-b border-[#f2f0ed]">
                    <Link to="/" className="text-xl font-bold tracking-[0.2em] font-serif uppercase">
                        VELOURA
                    </Link>
                </div>

                <div className="px-5 py-6">
                    <p className="text-[10px] tracking-widest text-[#999] uppercase mb-4 font-semibold px-3">
                        Management
                    </p>
                    <nav className="flex flex-col gap-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-black text-white shadow-md'
                                        : 'text-[#666] hover:text-black hover:bg-[#f8f8f8]'
                                        }`}
                                >
                                    <Icon className={isActive ? 'text-white' : 'text-[#888]'} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-5 border-t border-[#f2f0ed]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FiLogOut />
                        Sign Out
                    </button>
                    <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-[#666] hover:bg-[#f8f8f8] hover:text-black transition-colors">
                        <FiHome />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
