// PromoBanner — Marquee scrolling announcement strip (VELOURA style)
const MARQUEE_TEXT = [
    'UP TO 40% OFF',
    'FREE SHIPPING OVER $75',
    'NEW SS 2026 COLLECTION',
    'RETURNS WITHIN 30 DAYS',
    'UP TO 40% OFF',
    'FREE SHIPPING OVER $75',
    'NEW SS 2026 COLLECTION',
    'RETURNS WITHIN 30 DAYS',
];

const PromoBanner = () => (
    <div className="bg-[#0a0a0a] text-white overflow-hidden py-4 select-none">
        <div className="vx-marquee-track">
            {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
                <span key={i} className="flex items-center gap-0" style={{ minWidth: 'max-content' }}>
                    <span className="vx-label text-white/90 px-8 tracking-[0.25em]">{text}</span>
                    <span className="text-white/20 text-[10px]">◆</span>
                </span>
            ))}
        </div>
    </div>
);

export default PromoBanner;
