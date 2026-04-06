import { FiPlay } from 'react-icons/fi';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const VideoSection = () => {
    const sectionRef = useScrollReveal() as React.RefObject<HTMLElement>;

    return (
        <section ref={sectionRef} className="relative h-[75vh] min-h-[500px] max-h-[850px] overflow-hidden bg-[#0a0a0a]">

            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1964&auto=format&fit=crop"
                alt="Brand Story"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/60" />

            {/* Content — centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6" data-animate>
                <p className="vx-label text-white/40 mb-6">Our Story</p>
                <h2
                    className="vx-heading text-white mb-10 max-w-2xl"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                >
                    The Art of<br />Everyday Luxury
                </h2>

                {/* Play Button */}
                <button className="group relative w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-colors duration-500">
                    <div className="absolute inset-0 rounded-full bg-white/10 scale-75 group-hover:scale-100 transition-transform duration-500" />
                    <FiPlay className="w-7 h-7 ml-1 relative z-10" strokeWidth={1.5} />
                    {/* Pulse ring */}
                    <div className="absolute inset-[-25%] border border-white/20 rounded-full animate-ping opacity-40" />
                </button>
            </div>

        </section>
    );
};

export default VideoSection;
