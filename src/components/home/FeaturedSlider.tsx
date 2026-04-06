import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/* ── Product data — matching tone, lighting, and studio aesthetic ────────── */
const FEATURED = {
    hero: {
        id: 'f-hero',
        name: 'The Summer Edit',
        price: 4999,
        tag: 'NEW DROP',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
        to: '/shop?style=summer',
    },
    curated: [
        {
            id: 'f1',
            name: 'Oversized Studio Jacket',
            price: 4299,
            tag: 'NEW DROP',
            image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop',
            to: '/shop?category=Men&style=jackets',
        },
        {
            id: 'f2',
            name: 'Ribbed Knit Midi Dress',
            price: 2799,
            tag: 'BESTSELLER',
            image: 'https://images.unsplash.com/photo-1763637896841-cd5a1bb18208?q=80&w=1983&auto=format&fit=crop',
            to: '/shop?category=Women&style=bestseller',
        },
        {
            id: 'f3',
            name: 'Linen Wide-Leg Trousers',
            price: 3299,
            tag: 'SS 2026',
            image: 'https://images.unsplash.com/photo-1652953338313-3b22738e9558?q=80&w=1780&auto=format&fit=crop',
            to: '/shop?category=Women&style=ss2026',
        },
    ],
};

/* ── Reusable product card ─────────────────────────────────────────────── */
type CardProps = {
    name: string;
    price: number;
    tag: string;
    image: string;
    to: string;
    aspectClass?: string;
};

const EditCard = ({ name, price, tag, image, to, aspectClass = 'aspect-[3/4]' }: CardProps) => (
    <Link
        to={to}
        className="group block relative overflow-hidden rounded-2xl bg-[#f0eeeb]"
    >
        {/* Tag */}
        <div className="absolute top-4 left-4 z-10">
            <span className="vx-label text-[#0a0a0a] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px]">
                {tag}
            </span>
        </div>

        {/* Image */}
        <div className={`${aspectClass} overflow-hidden`}>
            <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                loading="lazy"
            />
        </div>

        {/* Hover overlay with info */}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0a0a0a]/70 via-[#0a0a0a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-white font-semibold tracking-tight text-sm">{name}</p>
                    <p className="text-white/70 text-sm">₹{price.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FiArrowRight className="w-4 h-4 text-[#0a0a0a]" />
                </div>
            </div>
        </div>
    </Link>
);

/* ── Main Section ──────────────────────────────────────────────────────── */
const FeaturedSlider = () => {
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    return (
        <section ref={sectionRef} className="bg-white py-24 lg:py-32">
            <div className="vx-container">

                {/* ── Header with divider */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6" data-animate>
                    <div>
                        <p className="vx-label text-[#9a9a9a] mb-3">Curated Selection</p>
                        <h2 className="vx-heading text-[#0a0a0a]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                            Edit of the Week
                        </h2>
                        <p className="text-[#9a9a9a] text-base font-light max-w-md mt-2">
                            Handpicked essentials that define the season.
                        </p>
                    </div>
                    <Link
                        to="/shop"
                        className="hidden md:inline-flex items-center gap-2 vx-label text-[#0a0a0a] hover:opacity-50 transition-opacity pb-0.5 border-b border-[#0a0a0a]"
                    >
                        View All <FiArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e8e8e8] mb-10" data-animate />

                {/* ── Magazine Layout: Hero image top + 3 curated below ──────── */}

                {/* Hero banner — full-width landscape */}
                <div data-animate data-delay="100">
                    <EditCard
                        {...FEATURED.hero}
                        aspectClass="aspect-[21/9] md:aspect-[21/8]"
                    />
                </div>

                {/* 3 equal curated cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6" data-animate data-delay="200">
                    {FEATURED.curated.map(p => (
                        <EditCard key={p.id} {...p} aspectClass="aspect-[3/4]" />
                    ))}
                </div>

                {/* Mobile "View All" */}
                <div className="mt-10 text-center md:hidden" data-animate data-delay="300">
                    <Link to="/shop" className="vx-btn vx-btn-outline">
                        View All <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedSlider;
