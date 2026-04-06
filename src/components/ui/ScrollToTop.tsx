import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Instantly scrolls to the top of the page on every route change,
 * including query string changes (?style=summer, ?category=Men, etc.).
 * Place this once inside <Router>, outside of <Routes>.
 */
const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
