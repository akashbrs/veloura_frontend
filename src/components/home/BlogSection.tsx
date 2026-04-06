import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const POSTS = [
    {
        id: 1,
        category: 'Style Guide',
        date: 'Oct 12, 2026',
        title: 'Building a Minimalist Wardrobe',
        excerpt: 'The foundational pieces every modern closet needs and how to style them endlessly.',
        image: 'https://images.unsplash.com/photo-1550614000-4b95d4ed79fa?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 2,
        category: 'Sustainability',
        date: 'Oct 5, 2026',
        title: 'Why Fabric Choice Matters',
        excerpt: 'Organic cotton, linen, Tencel — the materials that are better for you and the planet.',
        image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=1964&auto=format&fit=crop',
    },
    {
        id: 3,
        category: 'Seasonal',
        date: 'Sep 28, 2026',
        title: 'Summer to Fall Transition',
        excerpt: 'Master the art of layering and adapt your warm-weather staples for cooler months.',
        image: 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=2097&auto=format&fit=crop',
    },
];

const BlogSection = () => {
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    return (
        <section ref={sectionRef} className="vx-section bg-white border-t border-[#e8e8e8]">
            <div className="vx-container">

                <div className="flex justify-between items-end mb-14" data-animate>
                    <div>
                        <p className="vx-label text-[#9a9a9a] mb-3">Journal</p>
                        <h2 className="vx-heading text-[#0a0a0a]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                            Style &amp; Stories
                        </h2>
                    </div>
                    <Link to="/blog" className="hidden md:inline-flex items-center gap-2 vx-label text-[#0a0a0a] hover:opacity-50 transition-opacity border-b border-[#0a0a0a] pb-0.5">
                        All Articles <FiArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {POSTS.map((post, i) => (
                        <article
                            key={post.id}
                            className="group cursor-pointer"
                            data-animate
                            data-delay={`${i * 100}`}
                        >
                            {/* Image */}
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-[#f5f5f5] vx-img-zoom">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="vx-label text-[#0a0a0a]">{post.category}</span>
                                <span className="w-1 h-1 rounded-full bg-[#e8e8e8]" />
                                <span className="text-xs text-[#9a9a9a]">{post.date}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-[#0a0a0a] tracking-tight mb-3 leading-tight group-hover:opacity-50 transition-opacity" style={{ fontFamily: 'var(--vx-font-display)' }}>
                                {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-sm text-[#9a9a9a] leading-relaxed mb-5 font-light">{post.excerpt}</p>

                            <span className="inline-flex items-center gap-2 vx-label text-[#0a0a0a] group-hover:opacity-50 transition-opacity">
                                Read Article <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default BlogSection;
