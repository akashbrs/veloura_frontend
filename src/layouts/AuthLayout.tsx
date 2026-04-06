import { Outlet } from 'react-router-dom';

/**
 * AuthLayout — a stripped-down shell for login/signup pages.
 * No Header, no Footer. The page itself manages its own ambient wrapper
 * and the compact footer embedded inside LoginPage.
 */
const AuthLayout = () => (
    <div className="min-h-screen bg-[#f2f0ed]">
        <Outlet />
    </div>
);

export default AuthLayout;
