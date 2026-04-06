import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';

const HeroSection = () => {
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const elements = [imgRef, headlineRef, subRef, ctaRef, statsRef];

        elements.forEach((ref, index) => {
            if (!ref.current) return;

            ref.current.style.opacity = '0';
            ref.current.style.transform = 'translateY(30px)';
            ref.current.style.transition =
                `opacity 900ms cubic-bezier(0.16,1,0.3,1) ${index * 120}ms,
                 transform 900ms cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`;

            setTimeout(() => {
                if (!ref.current) return;
                ref.current.style.opacity = '1';
                ref.current.style.transform = 'translateY(0)';
            }, 100 + index * 120);
        });
    }, []);

    return (
        <section className="relative h-screen overflow-hidden bg-[#0a0a0a]">

            {/* Background */}
            <div ref={imgRef} className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=2070&auto=format&fit=crop"
                    alt="VELOURA premium fashion editorial"
                    className="w-full h-full object-cover object-center opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">

                {/* Main Section (Slightly Up) */}
                <div className="flex-1 flex items-start pt-20 md:pt-24">
                    <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
                        <div className="max-w-2xl flex flex-col gap-6">

                            {/* Headline */}
                            <h1
                                ref={headlineRef}
                                className="vx-display text-white leading-[0.88]"
                                style={{ fontSize: 'clamp(2.6rem, 6.5vw, 6.5rem)' }}
                            >
                                Dress<br />
                                With<br />
                                Purpose.
                            </h1>

                            {/* Subheading */}
                            <p
                                ref={subRef}
                                className="text-white/55 text-base md:text-lg max-w-md leading-relaxed font-light"
                            >
                                Modern Indian fashion crafted for clarity, confidence,
                                and timeless expression.
                            </p>

                            {/* CTA Buttons */}
                            <div
                                ref={ctaRef}
                                className="flex flex-col sm:flex-row gap-3 pt-2"
                            >
                                <Link
                                    to="/shop?category=Men"
                                    className="vx-btn vx-btn-primary"
                                >
                                    Shop Men
                                    <FiArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    to="/shop?category=Women"
                                    className="vx-btn vx-btn-outline !text-white !border-white/30 hover:!bg-white hover:!text-[#0a0a0a]"
                                >
                                    Explore Women
                                </Link>
                            </div>

                            {/* Stats */}
                            <div
                                ref={statsRef}
                                className="pt-8 mt-2 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md"
                            >
                                {[
                                    { num: '10K+', label: 'Happy Customers' },
                                    { num: '500+', label: 'Unique Styles' },
                                    { num: '4.9★', label: 'Avg. Rating' },
                                ].map((stat) => (
                                    <div key={stat.num}>
                                        <p
                                            className="text-white font-black text-xl md:text-2xl tracking-tight"
                                            style={{ fontFamily: 'var(--vx-font-display)' }}
                                        >
                                            {stat.num}
                                        </p>
                                        <p className="vx-label text-white/35">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="flex flex-col items-center gap-1.5 pb-8">
                    <p className="vx-label text-white/25 tracking-widest">Scroll</p>
                    <FiArrowDown className="w-4 h-4 text-white/25 animate-bounce" />
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
