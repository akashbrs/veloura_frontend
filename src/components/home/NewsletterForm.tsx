import { FiArrowRight } from 'react-icons/fi';
import { toastService } from '@/services/toastService';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const NewsletterForm = () => {
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    return (
        <section ref={sectionRef} className="vx-section bg-[#0a0a0a]">
            <div className="vx-container">
                <div className="max-w-2xl mx-auto text-center" data-animate>
                    <p className="vx-label text-white/30 mb-6">Newsletter</p>
                    <h2
                        className="vx-heading text-white mb-6"
                        style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
                    >
                        Join the Inner Circle
                    </h2>
                    <p className="text-white/40 mb-10 text-lg font-light leading-relaxed">
                        Exclusive drops, member-only offers, and curated style content delivered directly to you.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            toastService.success('Thanks for subscribing!', { label: 'Shop New Drops', path: '/shop' });
                        }}
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                        data-animate
                        data-delay="100"
                    >
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
                            required
                        />
                        <button
                            type="submit"
                            className="vx-btn vx-btn-primary bg-white text-[#0a0a0a] hover:bg-[#f5f5f5] flex-shrink-0"
                        >
                            Subscribe <FiArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="mt-6 text-xs text-white/20" data-animate data-delay="200">
                        No spam. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterForm;
