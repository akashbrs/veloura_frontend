import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TESTIMONIALS = [
    {
        id: 1,
        quote: "Completely transformed my wardrobe. The quality is unmatched and the fit is always perfect. I get compliments every single day.",
        name: "Sarah Jenkins",
        role: "Creative Director, London",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah",
    },
    {
        id: 2,
        quote: "I've been searching for premium minimalist basics for years. Finally found everything I need here. Exceptional craftsmanship.",
        name: "Michael Chen",
        role: "Architect, New York",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Michael",
    },
    {
        id: 3,
        quote: "The shopping experience is seamless and delivery is incredibly fast. But what keeps me loyal is how confident I feel wearing these.",
        name: "Emily Rodriguez",
        role: "Interior Designer, Madrid",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Emily",
    },
    {
        id: 4,
        quote: "VELOURA is my first choice for ethnic fusion. The fabric quality is breathable and the colors stay vibrant even after multiple washes.",
        name: "Aditya Verma",
        role: "Product Manager, Bangalore",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Aditya",
    },
    {
        id: 5,
        quote: "Luxury feel at a fraction of the cost. The packaging alone felt like opening a high-end designer gift. Highly recommend the kurtas!",
        name: "Ananya Iyer",
        role: "Marketing Head, Mumbai",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Ananya",
    },
    {
        id: 6,
        quote: "Excellent attention to detail. The stitching is flawless. Hard to find this level of quality in mass-market brands these days.",
        name: "David Wilson",
        role: "Stylist, Milan",
        rating: 4,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=David",
    },
    {
        id: 7,
        quote: "Finally, a brand that understands modern Indian silhouettes. It's sophisticated without being overly traditional. Perfect for office wear.",
        name: "Preeya Das",
        role: "Journalist, Delhi",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Preeya",
    },
    {
        id: 8,
        quote: "Fastest exchange process I've ever experienced. Had a sizing issue, and it was resolved within 24 hours. Incredible service!",
        name: "Rohan Khanna",
        role: "Entrepreneur, Pune",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Rohan",
    },
    {
        id: 9,
        quote: "The winter collection hoodies are so comfortable. Heavyweight cotton that actually keeps you warm. Best investment this year.",
        name: "Kevin Peterson",
        role: "Software Engineer, Seattle",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Kevin",
    },
    {
        id: 10,
        quote: "I love the values behind VELOURA. Sustainable, ethical, and beautiful designs. It feels good to support such a conscious brand.",
        name: "Sonia Gupta",
        role: "NGO Founder, Chennai",
        rating: 5,
        image: "https://api.dicebear.com/7.x/personas/svg?seed=Sonia",
    }
];

const TestimonialsSection = () => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<any>(null);

    const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

    useEffect(() => {
        if (!isPaused) {
            timerRef.current = setInterval(next, 5000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPaused]);

    // Show 3 at once on desktop, 1 on mobile
    const getVisibleItems = () => {
        const items = [];
        for (let i = 0; i < 3; i++) {
            items.push(TESTIMONIALS[(index + i) % TESTIMONIALS.length]);
        }
        return items;
    };

    return (
        <section className="vx-section bg-[#fafaf9] overflow-hidden">
            <div className="vx-container">

                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <p className="vx-label text-[#9a9a9a] mb-4">Real Experiences</p>
                        <h2 className="vx-heading text-[#0a0a0a]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                            What Our Community Is Saying
                        </h2>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                        <button
                            onClick={prev}
                            className="w-12 h-12 rounded-full border border-[#eee] flex items-center justify-center hover:bg-[#0a0a0a] hover:text-white transition-all group"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="w-12 h-12 rounded-full border border-[#eee] flex items-center justify-center hover:bg-[#0a0a0a] hover:text-white transition-all group"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {getVisibleItems().map((t) => (
                                <motion.div
                                    key={`${t.id}-${index}`}
                                    layout
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="bg-white border border-[#eee] rounded-[2.5rem] p-10 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Stars */}
                                    <div className="flex gap-0.5 mb-8">
                                        {[...Array(5)].map((_, idx) => (
                                            <FiStar
                                                key={idx}
                                                className={`w-3.5 h-3.5 ${idx < t.rating ? 'fill-amber-400 text-amber-400' : 'text-[#eee]'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="text-[#3d3d3d] text-lg leading-relaxed mb-10 flex-grow font-light tracking-tight italic">
                                        "{t.quote}"
                                    </blockquote>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 pt-8 border-t border-[#f5f5f5]">
                                        <img
                                            src={t.image}
                                            alt={t.name}
                                            className="w-12 h-12 rounded-full bg-[#f5f5f5] object-cover flex-shrink-0"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-[#0a0a0a] tracking-tight">{t.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-[#9a9a9a] font-bold">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-12">
                    {TESTIMONIALS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1 rounded-full transition-all duration-500 ${(i >= index && i < index + 3) || (index > TESTIMONIALS.length - 3 && i < (index + 3) % TESTIMONIALS.length)
                                ? 'w-8 bg-[#0a0a0a]'
                                : 'w-2 bg-[#eee]'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TestimonialsSection;
