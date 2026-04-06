import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiPackage, FiLayers, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getProductDetails, updateProduct, resetProductState, clearProductDetails } from '@/redux/slices/productSlice';
import type { AppDispatch, RootState } from '@/redux';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        price: 0,
        description: '',
        category: '',
        stock: 0,
        image: '',
        isActive: true
    });

    const { productDetails: product, loading, success } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (success) {
            dispatch(resetProductState());
            dispatch(clearProductDetails());
            toast.success('Product updated successfully');
            navigate('/admin/product-list');
        } else {
            if (!product || product._id !== productId) {
                dispatch(getProductDetails(productId!));
            } else {
                setForm({
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    stock: product.stock || 0,
                    image: product.images?.[0] || '',
                    isActive: product.isActive !== false
                });
            }
        }
    }, [dispatch, productId, product, success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            ...form,
            images: [form.image] // Wrap single image in array for backend compatibility
        }));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/admin/product-list" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors">
                <FiArrowLeft />
                <span>Back to Products</span>
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Edit Product</h1>
                    <p className="text-gray-500 text-sm mt-1">Update specifications and inventory data</p>
                </div>

                <form onSubmit={submitHandler} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Product Name</label>
                            <div className="relative">
                                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Premium Cotton Oversized Tee"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Inventory Count</label>
                            <div className="relative">
                                <FiPackage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                            <div className="relative">
                                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Image URL</label>
                            <div className="relative">
                                <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="image"
                                    value={form.image}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Visibility (isActive) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Visibility</label>
                            <label className="relative flex items-center cursor-pointer mt-4">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={form.isActive}
                                    onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">{form.isActive ? 'Active (Visible)' : 'Hidden'}</span>
                            </label>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center space-x-2 bg-gray-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200"
                        >
                            <FiSave className="text-xl" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditScreen;
