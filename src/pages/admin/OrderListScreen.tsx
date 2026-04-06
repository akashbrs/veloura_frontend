import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { listAllOrders, updateOrderToShipped, updateOrderToDelivered, resetOrderState } from '@/redux/slices/orderSlice';
import type { AppDispatch, RootState } from '@/redux';
import { Link } from 'react-router-dom';

const OrderListScreen = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { allOrders, loading, success } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(listAllOrders());
        if (success) {
            dispatch(resetOrderState());
        }
    }, [dispatch, success]);

    const shipHandler = (id: string) => {
        if (window.confirm('Mark this order as Shipped?')) {
            dispatch(updateOrderToShipped(id));
        }
    };

    const deliverHandler = (id: string) => {
        if (window.confirm('Mark this order as Delivered?')) {
            dispatch(updateOrderToDelivered(id));
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders Management</h1>
                <p className="text-gray-500 mt-2">Monitor global sales and update fulfillment status</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Paid</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">
                                            {typeof order.user === 'object' ? (order.user?.name || order.user?.username) : 'Guest'}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            {typeof order.user === 'object' ? order.user?.email : ''}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        ₹{(order.totalAmount || order.totalPrice || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${(order.status || order.deliveryStatus) === 'delivered' ? 'bg-green-100 text-green-600' :
                                            (order.status || order.deliveryStatus) === 'shipped' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {order.status || order.deliveryStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                to={`/account/orders/${order._id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <FiEye className="w-5 h-5" />
                                            </Link>

                                            {((order.status || order.deliveryStatus) === 'processing' || (order.status || order.deliveryStatus) === 'confirmed') && order.paymentStatus === 'Paid' && (
                                                <button
                                                    onClick={() => shipHandler(order._id)}
                                                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                                                    title="Mark as Shipped"
                                                >
                                                    <FiTruck className="w-5 h-5" />
                                                </button>
                                            )}

                                            {(order.status || order.deliveryStatus) === 'shipped' && (
                                                <button
                                                    onClick={() => deliverHandler(order._id)}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                    title="Mark as Delivered"
                                                >
                                                    <FiCheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderListScreen;
