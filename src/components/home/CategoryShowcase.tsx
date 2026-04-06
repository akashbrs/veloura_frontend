import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CATEGORIES = [
    {
        num: '01',
        label: 'Men',
        title: 'The Modern Gentleman',
        sub: 'Elevated staples designed for everyday refinement. Tailored cuts. Premium fabrics. Timeless silhouettes.',
        cta: "Shop Men's Collection →",
        to: '/shop?category=Men',
        image: 'https://i.pinimg.com/1200x/ee/04/0e/ee040ee0f079ee174d9225b12a476ddb.jpg',
        reverse: false,
        imgHeight: 'md:h-[600px]',
    },
    {
        num: '02',
        label: 'Women',
        title: 'Modern Femininity',
        sub: 'Fluid silhouettes and refined textures crafted for confident expression.',
        cta: "Shop Women's Collection →",
        to: '/shop?category=Women',
        image: 'https://plus.unsplash.com/premium_photo-1689371952452-c88c72464115?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        reverse: true,
        imgHeight: 'md:h-[600px]',
    },
    {
        num: '03',
        label: 'Kids',
        title: 'Dressed to Explore',
        sub: "Premium comfort and fearless colour for the little ones who don't sit still.",
        cta: "Shop Kids' Collection →",
        to: '/shop?category=Kids',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1972&auto=format&fit=crop',
        reverse: false,
        imgHeight: 'md:h-[600px]',
    },
];

const CategoryShowcase = () => {
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    return (
        <section ref={sectionRef} className="bg-white">
            {CATEGORIES.map((cat) => (
                <div
                    key={cat.num}
                    className="border-t border-[#e8e8e8]"
                    data-animate
                >
                    <div className="vx-container">
                        <div className={`flex flex-col ${cat.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-0 py-20 lg:py-28`}>

                            {/* ── Image Side */}
                            <div className={`w-full md:w-1/2 h-[55vw] ${cat.imgHeight || 'md:h-[600px]'} max-h-[700px] overflow-hidden rounded-2xl group vx-img-zoom flex-shrink-0`}>
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full object-cover object-center"
                                    loading="lazy"
                                />
                            </div>

                            {/* ── Text Side */}
                            <div className={`w-full md:w-1/2 ${cat.reverse ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'} pt-10 md:pt-0`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="vx-label text-[#9a9a9a]">{cat.num}</span>
                                    <span className="vx-label text-[#9a9a9a]">{cat.label}</span>
                                </div>
                                <h2
                                    className="vx-heading text-[#0a0a0a] mb-6"
                                    style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                                >
                                    {cat.title}
                                </h2>
                                <p className="text-[#9a9a9a] text-lg leading-relaxed mb-10 max-w-sm font-light">
                                    {cat.sub}
                                </p>
                                <Link
                                    to={cat.to}
                                    className="inline-flex items-center gap-3 vx-label text-[#0a0a0a] hover:opacity-50 transition-opacity group"
                                >
                                    <span>{cat.cta}</span>
                                    <span className="w-8 h-8 border border-[#0a0a0a] rounded-full flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:text-white transition-colors">
                                        <FiArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default CategoryShowcase;
