import ProductCard from '@/components/product/ProductCard';

const ProductGrid = ({ products }: { products: any[] }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
