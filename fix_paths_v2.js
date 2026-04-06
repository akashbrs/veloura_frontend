import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'src');

const replacements = [
    // Core aliases
    { from: /@\/components\/services\//g, to: '@/services/' },
    { from: /@\/components\/redux\//g, to: '@/redux/' },
    { from: /@\/components\/types/g, to: '@/types' },
    { from: /@\/components\/hooks\//g, to: '@/hooks/' },
    { from: /@\/components\/utils\//g, to: '@/utils/' },
    { from: /@\/components\/pages\//g, to: '@/pages/' },

    // UI components
    { from: /@\/components\/CustomToast/g, to: '@/components/ui/CustomToast' },
    { from: /@\/components\/PageLoader/g, to: '@/components/ui/PageLoader' },
    { from: /@\/components\/ScrollToTop/g, to: '@/components/ui/ScrollToTop' },
    { from: /@\/components\/MetaTags/g, to: '@/components/ui/MetaTags' },
    { from: /@\/components\/PromoBanner/g, to: '@/components/ui/PromoBanner' },

    // Layout components
    { from: /@\/components\/Header/g, to: '@/components/layout/Header' },
    { from: /@\/components\/Footer/g, to: '@/components/layout/Footer' },

    // Product components
    { from: /@\/components\/ProductCard/g, to: '@/components/product/ProductCard' },
    { from: /@\/components\/VeloraProductCard/g, to: '@/components/product/VeloraProductCard' },
    { from: /@\/components\/ProductGrid/g, to: '@/components/product/ProductGrid' },
    { from: /@\/components\/ProductGridSection/g, to: '@/components/product/ProductGridSection' },
    { from: /@\/components\/FilterPanel/g, to: '@/components/product/FilterPanel' },
    { from: /@\/components\/SizeGuideModal/g, to: '@/components/product/SizeGuideModal' },

    // Cart/Checkout components
    { from: /@\/components\/CartItem/g, to: '@/components/cart/CartItem' },
    { from: /@\/components\/OrderCard/g, to: '@/components/cart/OrderCard' },
    { from: /@\/components\/CancellationModal/g, to: '@/components/checkout/CancellationModal' },

    // Home components
    { from: /@\/components\/HeroSection/g, to: '@/components/home/HeroSection' },
    { from: /@\/components\/FeaturedSlider/g, to: '@/components/home/FeaturedSlider' },
    { from: /@\/components\/BlogSection/g, to: '@/components/home/BlogSection' },
    { from: /@\/components\/BrandValueStrip/g, to: '@/components/home/BrandValueStrip' },
    { from: /@\/components\/CategoryShowcase/g, to: '@/components/home/CategoryShowcase' },
    { from: /@\/components\/NewsletterForm/g, to: '@/components/home/NewsletterForm' },
    { from: /@\/components\/TestimonialSection/g, to: '@/components/home/TestimonialSection' },
    { from: /@\/components\/TestimonialsSection/g, to: '@/components/home/TestimonialsSection' },
    { from: /@\/components\/VideoSection/g, to: '@/components/home/VideoSection' },

    // Pages
    { from: /@\/pages\/HomePage/g, to: '@/pages/shop/HomePage' },
    { from: /@\/pages\/ShopPage/g, to: '@/pages/shop/ShopPage' },
    { from: /@\/pages\/SalePage/g, to: '@/pages/shop/SalePage' },
    { from: /@\/pages\/ProductDetailPage/g, to: '@/pages/shop/ProductDetailPage' },
    { from: /@\/pages\/LoginPage/g, to: '@/pages/user/LoginPage' },
    { from: /@\/pages\/ProfilePage/g, to: '@/pages/user/ProfilePage' },
    { from: /@\/pages\/WishlistPage/g, to: '@/pages/user/WishlistPage' },
    { from: /@\/pages\/CartPage/g, to: '@/pages/checkout/CartPage' },
    { from: /@\/pages\/CheckoutPage/g, to: '@/pages/checkout/CheckoutPage' },
    { from: /@\/pages\/OrderPage/g, to: '@/pages/checkout/OrderPage' },
];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });
    return arrayOfFiles;
}

const files = getAllFiles(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    replacements.forEach(r => {
        content = content.replace(r.from, r.to);
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log(`Successfully fixed absolute import paths in ${changedFiles} files.`);
