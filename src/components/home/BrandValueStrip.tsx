import { useScrollReveal } from '@/hooks/useScrollReveal';
import { FiBox, FiFeather, FiHeart } from 'react-icons/fi';

const PILLARS = [
    {
        icon: FiBox,
        title: 'Premium Quality',
        sub: 'Fabrics sourced from the finest mills. Built to last beyond seasons.',
    },
    {
        icon: FiFeather,
        title: 'Indian Craft',
        sub: 'Modern silhouettes rooted in traditional craftsmanship and heritage.',
    },
    {
        icon: FiHeart,
        title: 'Everyday Comfort',
        sub: 'Designs that move with you — from boardroom to weekend brunch.',
    },
];

const BrandValueStrip = () => {
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    return (
        <section ref={sectionRef} className="bg-white border-y border-[#e8e8e8]">
            <div className="vx-container py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16" data-animate>
                    {PILLARS.map((p, i) => (
                        <div
                            key={p.title}
                            className="flex flex-col items-center text-center"
                            data-animate
                            data-delay={`${i * 100}`}
                        >
                            <div className="w-12 h-12 rounded-full border border-[#e8e8e8] flex items-center justify-center mb-5">
                                <p.icon className="w-5 h-5 text-[#0a0a0a]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-semibold text-[#0a0a0a] text-sm tracking-tight mb-2" style={{ fontFamily: 'var(--vx-font-display)' }}>
                                {p.title}
                            </h3>
                            <p className="text-[#9a9a9a] text-sm leading-relaxed max-w-[260px] font-light">
                                {p.sub}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandValueStrip;
