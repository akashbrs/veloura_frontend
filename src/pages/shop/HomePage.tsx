import HeroSection from '@/components/home/HeroSection';
import BrandValueStrip from '@/components/home/BrandValueStrip';
import FeaturedSlider from '@/components/home/FeaturedSlider';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import ProductGridSection from '@/components/product/ProductGridSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterForm from '@/components/home/NewsletterForm';

/**
 * VELOURA — Landing Page
 *
 * Refined scroll flow:
 *   Hero → Brand Value Strip → Edit of the Week → Men / Women / Kids →
 *   New Arrivals Grid → Testimonials → Newsletter
 *
 * Removed: PromoBanner, VideoSection, BlogSection (decluttered for premium feel)
 */
const HomePage = () => (
    <main>
        <HeroSection />
        <BrandValueStrip />
        <FeaturedSlider />
        <CategoryShowcase />
        <ProductGridSection />
        <TestimonialsSection />
        <NewsletterForm />
    </main>
);

export default HomePage;
