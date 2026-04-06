import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { listProducts, deleteProduct, createProduct, resetProductState } from '@/redux/slices/productSlice';
import type { AppDispatch, RootState } from '@/redux';
import type { Product } from '@/types';

const ProductListScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { products: rawProducts, loading, success } = useSelector((state: RootState) => state.products);
    const products = Array.isArray(rawProducts) ? rawProducts : (rawProducts as any)?.products || [];

    useEffect(() => {
        dispatch(listProducts('')); // Pass empty string to satisfy arg requirement
        if (success) {
            dispatch(resetProductState());
        }
    }, [dispatch, success]);

    const deleteHandler = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const createProductHandler = async () => {
        try {
            const resultAction = await dispatch(createProduct());
            if (createProduct.fulfilled.match(resultAction)) {
                const newProduct = resultAction.payload;
                navigate(`/admin/product/${newProduct._id}/edit`);
            }
        } catch (err: any) {
            toast.error('Failed to create product');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products Management</h1>
                    <p className="text-gray-500 mt-2">Manage your catalog, stock and pricing</p>
                </div>
                <button
                    onClick={createProductHandler}
                    className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200"
                >
                    <FiPlus />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product: Product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.images?.[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">ID: {product._id?.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2 h-2 rounded-full ${(product.stock ?? 0) > 10 ? 'bg-green-500' : (product.stock ?? 0) > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                            <span className={(product.stock ?? 0) === 0 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                                                {product.stock ?? 0} Units
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                to={`/admin/product/${product._id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit Product"
                                            >
                                                <FiEdit2 className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => deleteHandler(product._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete Product"
                                            >
                                                <FiTrash2 className="w-5 h-5" />
                                            </button>
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

export default ProductListScreen;
