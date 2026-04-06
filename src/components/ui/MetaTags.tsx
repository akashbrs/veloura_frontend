import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MetaTags = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'VELOURA By PrimeWave Organisation';
        let description = 'Discover modern Indian fashion for men, women, and kids at VELOURA By PrimeWave Organisation. High-quality essentials and timeless designs.';

        if (path === '/') {
            title = 'VELOURA By PrimeWave Organisation';
        } else if (path.startsWith('/shop')) {
            title = 'Shop the Collection – VELOURA';
        } else if (path.startsWith('/sale')) {
            title = 'Sale: Limited Time Offers – VELOURA By PrimeWave Organisation';
        } else if (path.startsWith('/support/faq')) {
            title = 'FAQs – Support – VELOURA';
        } else if (path.startsWith('/support/contact')) {
            title = 'Contact Us – Support – VELOURA';
        } else if (path.startsWith('/legal/privacy')) {
            title = 'Privacy Policy – VELOURA';
        } else if (path.startsWith('/profile')) {
            title = 'My Profile – Account – VELOURA';
        }

        document.title = title;

        // Update meta description if exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
    }, [location]);

    return null;
};

export default MetaTags;
