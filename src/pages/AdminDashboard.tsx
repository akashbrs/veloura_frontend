import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '@/redux/slices/productSlice';
import { listUsers } from '@/redux/slices/authSlice';
import { listAllOrders } from '@/redux/slices/orderSlice';
import SecurityTab from '@/components/admin/SecurityTab';
import type { AppDispatch, RootState } from '@/redux';
import type { Product } from '@/types';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'security'>('products');

    const { userInfo, users } = useSelector((state: RootState) => state.auth);
    const { products: rawProducts } = useSelector((state: RootState) => state.products);
    const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts as any)?.products || [];
    const { allOrders, loading: loadingOrders } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/login');
        } else {
            dispatch(listProducts(''));
            dispatch(listUsers());
            dispatch(listAllOrders());
        }
    }, [navigate, userInfo, dispatch]);

    if (!userInfo || userInfo.role !== 'admin') return null;

    // Derived stats
    const totalSales = allOrders.reduce((acc, order) => {
        if (order.paymentStatus !== 'Paid' && order.status !== 'delivered') return acc;
        const val = order.totalPrice || order.totalAmount;
        if (val) return acc + val;
        // Fallback
        const sub = (order.orderItems || []).reduce((a, i) => a + (Number(i.price || 0) * Number(i.quantity || i.qty || 1)), 0);
        const ship = sub > 1000 ? 0 : 99;
        const tax = Math.round(sub * 0.18);
        return acc + (sub + ship + tax);
    }, 0);
    const totalOrders = allOrders.length;
    const totalUsers = users.length;
    const totalProducts = products.length;

    return (
        <div className="min-h-screen pt-24 pb-24 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-2">Manage products, orders, and users.</p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Sales</h3>
                        <p className="text-3xl font-bold text-gray-900">₹{Math.round(totalSales).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-indigo-500">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-green-500">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Products</h3>
                        <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
                    </div>
                </div>

                {/* Management Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-white'}`}>
                            Products ({totalProducts})
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-white'}`}>
                            Orders ({totalOrders})
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-white'}`}>
                            Users ({totalUsers})
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-900 hover:bg-white'}`}>
                            Security
                        </button>
                    </div>

                    <div className="p-6 overflow-x-auto">
                        {activeTab === 'products' && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase">
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Name</th>
                                        <th className="py-3 px-4">Price</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Brand</th>
                                        <th className="py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p: Product) => (
                                        <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-xs font-mono text-gray-500">{p._id.substring(0, 8)}</td>
                                            <td className="py-3 px-4 font-medium">{p.name}</td>
                                            <td className="py-3 px-4">₹{p.price.toLocaleString('en-IN')}</td>
                                            <td className="py-3 px-4">{p.category}</td>
                                            <td className="py-3 px-4">{p.brand}</td>
                                            <td className="py-3 px-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'orders' && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase">
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">User</th>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Total</th>
                                        <th className="py-3 px-4">Paid</th>
                                        <th className="py-3 px-4">Delivered</th>
                                        <th className="py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingOrders ? (
                                        <tr><td colSpan={7} className="text-center py-4">Loading orders...</td></tr>
                                    ) : allOrders.map(order => (
                                        <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-xs font-mono text-gray-500">{order._id.substring(0, 8)}</td>
                                            <td className="py-3 px-4">{typeof order.user === 'object' ? (order.user?.name || order.user?.username) : 'Customer'}</td>
                                            <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                            <td className="py-3 px-4 font-bold">
                                                ₹{Math.round(
                                                    order.totalAmount || order.totalPrice || 
                                                    ((order.orderItems || []).reduce((a, i) => a + (Number(i.price || 0) * Number(i.quantity || i.qty || 1)), 0) * 1.18 + 
                                                    (order.orderItems?.reduce((a, i) => a + (Number(i.price || 0) * Number(i.quantity || i.qty || 1)), 0) > 1000 ? 0 : 99))
                                                ).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-3 px-4">{order.paymentStatus === 'Paid' ? '✅' : '❌'}</td>
                                            <td className="py-3 px-4">{order.deliveryStatus === 'Delivered' ? '✅' : '❌'}</td>
                                            <td className="py-3 px-4">
                                                <button onClick={() => navigate(`/account/orders/${order._id}`)} className="text-blue-600 hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'users' && (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase">
                                        <th className="py-3 px-4">ID</th>
                                        <th className="py-3 px-4">Username</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-xs font-mono text-gray-500">{u._id.substring(0, 8)}</td>
                                            <td className="py-3 px-4 font-medium">{u.username}</td>
                                            <td className="py-3 px-4"><a href={`mailto:${u.email}`} className="text-blue-600 hover:underline">{u.email}</a></td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'security' && (
                            <SecurityTab />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
