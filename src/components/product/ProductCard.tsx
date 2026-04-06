import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toastService } from '@/services/toastService';
import { addToWishlist, removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addGuestItem, addCartItem } from '@/redux/slices/cartSlice';
import type { AppDispatch, RootState } from '@/redux';

interface ProductProps {
    product: {
        _id?: string;
        id?: string;
        name: string;
        image?: string;
        images?: string[];
        price: number;
        originalPrice?: number;
        isOnSale?: boolean;
        category: string;
        rating: number;
        numReviews: number;
        description?: string;
        stock?: number;
    };
}

/* ─── Category fallback images for local products ────────────────────────── */
const CATEGORY_FALLBACKS: Record<string, string> = {
    'Men': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80',
    'Women': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    'Kids': 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=80'
};

const ProductCard = ({ product }: ProductProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

    const productId = (product._id || product.id || '') as string;
    const isInWishlist = wishlistItems.some((item: any) => item.productId === productId);
    const productImage = product.image || product.images?.[0] || CATEGORY_FALLBACKS[product.category];

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userInfo) {
            navigate('/login');
            return;
        }

        if (isInWishlist) {
            dispatch(removeFromWishlist(productId));
            toastService.info('Removed from wishlist');
        } else {
            dispatch(addToWishlist({
                productId: productId,
                name: product.name,
                price: product.price,
                image: productImage,
                category: product.category
            }));
        }
    };

    const handleAddToBag = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const isMongoId = /^[a-f\d]{24}$/i.test(productId ?? '');
        const cartItem = {
            product: productId,
            name: product.name,
            image: productImage,
            price: product.price,
            quantity: 1,
            size: 'M',
            stock: product.stock ?? 10,
        };

        if (!userInfo || !isMongoId) {
            // Guest OR local-only — add to localStorage
            dispatch(addGuestItem(cartItem));
            toastService.success(`${product.name} added to bag!`, [
                { label: 'View Bag', path: '/cart' },
                { label: 'Checkout', path: '/checkout' }
            ], productId, `${product.name} added`);
        } else {
            // Logged in + valid backend product — add to database via API
            dispatch(addCartItem({
                ...cartItem,
                category: product.category,
                description: product.description
            }) as any).then((res: any) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toastService.success(`${product.name} added to cart!`, [
                        { label: 'View Cart', path: '/cart' },
                        { label: 'Checkout', path: '/checkout' }
                    ], productId, `${product.name} added`);
                } else {
                    toastService.error(res.payload || 'Failed to add to cart');
                }
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
        >
            <div className="relative aspect-auto h-64 overflow-hidden bg-gray-100">
                <Link to={`/product/${productId}`}>
                    <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                </Link>
                <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-colors z-10 ${isInWishlist
                        ? 'text-pink-500 hover:text-pink-600'
                        : 'text-gray-400 hover:text-pink-500'
                        }`}
                >
                    <FiHeart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute top-4 left-4 z-10">
                    {product.isOnSale && product.originalPrice && (
                        <div className="bg-[#fff0f0] text-[#c00000] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight shadow-sm border border-[#ffdfdf]">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <button
                        onClick={handleAddToBag}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 shadow-lg">
                        <FiShoppingCart className="h-5 w-5" />
                        <span>Add to Bag</span>
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex flex-col items-end mb-2">
                    <Link to={`/product/${productId}`} className="block w-full">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex flex-col items-end mt-1">
                        <span className="text-lg font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <>
                                <span className="text-sm font-normal text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] font-bold text-[#c00000] mt-0.5">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-1 mb-4 mt-auto">
                    {[...Array(5)].map((_, i) => (
                        <FiStar
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">({product.numReviews})</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
