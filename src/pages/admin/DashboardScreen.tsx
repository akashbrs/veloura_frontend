import { useState, useEffect } from 'react';
import api from '@/services/api';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const DashboardScreen = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
                setLoading(false);
            } catch (err: any) {
                toast.error('Failed to load dashboard stats');
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Real-time performance metrics</p>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-500 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FiTrendingUp className="text-2xl" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">₹{stats?.totalRevenue?.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-500 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <FiShoppingBag className="text-2xl" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.totalOrders}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-500 transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <FiUsers className="text-2xl" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Users</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.totalUsers}</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-500 transition-all duration-300">
                    <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                        <FiClock className="text-2xl" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Pending Orders</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.pendingOrders}</p>
                </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden">
                <div className="flex items-center space-x-2 mb-6 text-red-600">
                    <FiAlertCircle className="text-xl" />
                    <h2 className="text-lg font-extrabold tracking-tight">Inventory Alerts</h2>
                </div>
                {stats?.lowStockProducts?.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {stats.lowStockProducts.map((p: any) => (
                            <div key={p._id} className="py-4 flex justify-between items-center group">
                                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.name}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} LEFT`}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-4">All products are healthy in stock.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardScreen;
