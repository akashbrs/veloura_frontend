import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

/**
 * VELOURA Scroll Reveal Hook
 * Applies data-animate class transitions when elements enter viewport.
 * Usage: attach ref to container, add `data-animate` to children.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
    const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const targets = el.querySelectorAll('[data-animate]');
        targets.forEach((t) => {
            (t as HTMLElement).style.opacity = '0';
            (t as HTMLElement).style.transform = 'translateY(32px)';
            (t as HTMLElement).style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target as HTMLElement;
                        const delay = target.dataset.delay || '0';
                        setTimeout(() => {
                            target.style.opacity = '1';
                            target.style.transform = 'translateY(0)';
                        }, parseInt(delay));
                        if (once) observer.unobserve(target);
                    }
                });
            },
            { threshold, rootMargin }
        );

        targets.forEach((t) => observer.observe(t));
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return ref;
}

/**
 * Single element scroll reveal hook.
 */
export function useReveal(delay = 0) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    return ref;
}
