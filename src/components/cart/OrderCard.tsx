import { Link } from 'react-router-dom';
import type { Order } from '@/types';

const OrderCard = ({ order }: { order: Order }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50">
                <div>
                    <p className="text-sm text-gray-500">Order Placed</p>
                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium text-gray-900">₹{Math.round(order.totalAmount || order.totalPrice).toLocaleString('en-IN')}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium text-gray-900 font-mono text-sm max-w-[120px] truncate">#{order._id}</p>
                </div>
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                    <Link
                        to={`/account/orders/${order._id}`}
                        className="w-full sm:w-auto text-sm bg-white border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors block text-center"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 sm:mb-0">
                        Status: <span className={order.deliveryStatus === 'Delivered' ? 'text-green-600' : 'text-blue-600'}>{order.deliveryStatus || 'Processing'}</span>
                    </h3>
                </div>

                <div className="flex flex-wrap gap-4">
                    {order.orderItems.slice(0, 4).map((item: any, index: number) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50 group">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    ))}
                    {order.orderItems.length > 4 && (
                        <div className="w-20 h-20 rounded-lg border border-gray-100 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500">+{order.orderItems.length - 4} more</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
