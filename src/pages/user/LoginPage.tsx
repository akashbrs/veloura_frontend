import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError, resetAuthState } from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux';
import { toastService } from '@/services/toastService';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';


/* ─── Google Icon ───────────────────────────────────────────────────────── */
const GoogleIcon = () => (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

/* ─── Password Strength ─────────────────────────────────────────────────── */
const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
};
const STRENGTH_META = [
    { label: '', color: '#e5e7eb' },
    { label: 'Weak', color: '#ef4444' },
    { label: 'Fair', color: '#f59e0b' },
    { label: 'Good', color: '#84cc16' },
    { label: 'Strong', color: '#22c55e' },
    { label: 'Excellent', color: '#10b981' },
];

const StrengthBar = ({ password }: { password: string }) => {
    if (!password) return null;
    const score = getStrength(password);
    const meta = STRENGTH_META[score];
    return (
        <div className="mt-2.5 space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                    <motion.div
                        key={i}
                        className="h-[3px] flex-1 rounded-full"
                        animate={{ backgroundColor: i <= score ? meta.color : '#e5e7eb' }}
                        transition={{ duration: 0.35 }}
                    />
                ))}
            </div>
            <p className="text-[10px] tracking-widest uppercase font-medium" style={{ color: meta.color }}>
                {meta.label}
            </p>
        </div>
    );
};

/* ─── Floating Input ────────────────────────────────────────────────────── */
interface InputProps {
    id: string; label: string; type?: string; value: string;
    onChange: (v: string) => void; required?: boolean; autoComplete?: string;
    suffix?: React.ReactNode; error?: string;
}
const FloatInput = ({ id, label, type = 'text', value, onChange, required, autoComplete, suffix, error }: InputProps) => {
    const [focused, setFocused] = useState(false);
    const lifted = focused || value.length > 0;
    return (
        <div className="relative">
            <div className={`relative flex items-center border-b-2 transition-all duration-300 bg-transparent
                ${error ? 'border-red-400' : focused ? 'border-[#0a0a0a]' : 'border-[#d0d0d0]'}`}>
                <div className="relative flex-1 pt-5 pb-1.5">
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        required={required}
                        autoComplete={autoComplete}
                        placeholder=" "
                        className="w-full bg-transparent text-[#0a0a0a] text-sm outline-none peer"
                        style={
                            type === 'password'
                                ? ({ WebkitTextSecurity: "disc" } as React.CSSProperties)
                                : undefined
                        }
                    />
                    <label htmlFor={id} className={`absolute left-0 pointer-events-none select-none font-medium transition-all duration-200
                        ${lifted ? 'top-0 text-[9px] tracking-widest uppercase' : 'top-1/2 -translate-y-1/2 text-sm'}
                        ${error ? 'text-red-400' : lifted && focused ? 'text-[#0a0a0a]' : 'text-[#aaa]'}`}>
                        {label}
                    </label>
                </div>
                {suffix && <div className="pb-1.5 pl-2">{suffix}</div>}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-1 text-xs text-red-500">{error}</motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ─── Left panel content per mode ──────────────────────────────────────── */
const LEFT_CONTENT = {
    login: {
        image: 'https://images.unsplash.com/photo-1727107044939-6c9f6ba6d147?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        eyebrow: 'Welcome back',
        quote: '"Style is a way to say who you are without having to speak."',
        sub: 'Timeless essentials crafted for modern living.',
    },
    register: {
        image: 'https://i.pinimg.com/1200x/62/97/07/629707def5f171efe1903e7bba0aa84c.jpg',
        eyebrow: 'Join VELOURA',
        quote: '"Your wardrobe. Your statement. Your story."',
        sub: 'Discover elevated everyday wear, curated just for you.',
    },
};

/* ─── Main Page ─────────────────────────────────────────────────────────── */
const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [remember, setRemember] = useState(false);

    const [usernameErr, setUsernameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [pwErr, setPwErr] = useState('');
    const [cpwErr, setCpwErr] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, loading, error, success } = useSelector((s: RootState) => s.auth);
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const switchMode = useCallback((toLogin: boolean) => {
        setIsLogin(toLogin);
        setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
        setUsernameErr(''); setEmailErr(''); setPwErr(''); setCpwErr('');
        setShowPw(false); setShowCpw(false);
    }, []);

    // Switch to login mode on successful registration
    useEffect(() => {
        if (success) {
            toastService.success('Registration successful! Please sign in.');
            switchMode(true);
            dispatch(resetAuthState());
        }
    }, [success, switchMode, dispatch]);

    useEffect(() => { if (userInfo) navigate(redirect); }, [userInfo, navigate, redirect]);
    useEffect(() => { if (error) { toastService.error(error); dispatch(clearError()); } }, [error, dispatch]);

    const validate = () => {
        let ok = true;
        if (!isLogin && !username.trim()) { setUsernameErr('Username is required'); ok = false; } else setUsernameErr('');
        if (!isLogin && !/\S+@\S+\.\S+/.test(email)) { setEmailErr('Enter a valid email'); ok = false; } else setEmailErr('');
        if (isLogin && !username.trim()) { setUsernameErr('Username is required'); ok = false; } else setUsernameErr('');
        if (password.length < 6) { setPwErr('At least 6 characters required'); ok = false; } else setPwErr('');
        if (!isLogin && password !== confirmPassword) { setCpwErr('Passwords do not match'); ok = false; } else setCpwErr('');
        return ok;
    };

    const canSubmit = isLogin
        ? !!username && password.length >= 6
        : !!username && !!email && password.length >= 6 && confirmPassword === password;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const safeUsername = username.trim();
        if (isLogin) dispatch(login({ username: safeUsername, password }));
        else dispatch(register({ username: safeUsername, email: email.trim(), password }));
    };

    // 1. Check for errors from OAuth redirect
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const loginError = queryParams.get('error');

        if (loginError) {
            toastService.error('Google authentication failed. Please try again.');
            // Clear the error from URL
            navigate('/login', { replace: true });
        }
    }, [location.search, navigate]);

    const handleGoogleSignIn = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        window.location.href = `${apiUrl}/auth/google`;
    };

    const panel = LEFT_CONTENT[isLogin ? 'login' : 'register'];

    return (
        /* Full-screen wrapper */
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2f0ed] px-4 py-10 font-sans">

            {/* Google Font injection */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
                .font-serif-luxury { font-family: 'Cormorant Garamond', Georgia, serif; }
                .font-sans-luxury  { font-family: 'Inter', system-ui, sans-serif; }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex min-h-[600px] font-sans-luxury"
            >
                {/* ── LEFT PANEL ────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? 'left-login' : 'left-reg'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden md:flex relative w-1/2 flex-col justify-between p-12 overflow-hidden"
                    >
                        {/* Background image */}
                        <div className="absolute inset-0">
                            <img
                                src={panel.image}
                                alt="VELOURA editorial"
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />
                        </div>

                        {/* Brand + eyebrow */}
                        <div className="relative z-10">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-medium mb-2">
                                {panel.eyebrow}
                            </p>
                            <Link to="/" className="text-white text-xl font-bold tracking-[0.2em] font-sans-luxury">
                                VELOURA
                            </Link>
                        </div>

                        {/* Quote block */}
                        <div className="relative z-10">
                            <blockquote className="font-serif-luxury text-white leading-relaxed mb-4"
                                style={{ fontSize: 'clamp(1.3rem, 2vw, 1.85rem)', lineHeight: 1.35 }}>
                                {panel.quote}
                            </blockquote>
                            <p className="text-white/55 text-sm font-light leading-relaxed max-w-xs">
                                {panel.sub}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* ── RIGHT PANEL ───────────────────────────────────────────── */}
                <div className="flex-1 flex flex-col justify-center px-8 sm:px-10 py-10 overflow-y-auto">

                    {/* Mobile brand */}
                    <div className="md:hidden text-center mb-8">
                        <Link to="/" className="text-xl font-bold tracking-[0.2em] text-[#0a0a0a]">VELOURA</Link>
                    </div>

                    {/* Mode toggle — minimal underline style */}
                    <div className="flex gap-8 mb-8 border-b border-[#ebebeb]">
                        {[{ label: 'Sign In', login: true }, { label: 'Create Account', login: false }].map(({ label, login: isL }) => {
                            const active = isL ? isLogin : !isLogin;
                            return (
                                <button key={label} onClick={() => switchMode(isL)}
                                    className={`pb-3 text-xs font-semibold tracking-widest uppercase relative transition-colors duration-200 ${active ? 'text-[#0a0a0a]' : 'text-[#bbb] hover:text-[#555]'}`}>
                                    {label}
                                    {active && (
                                        <motion.div layoutId="auth-tab-line"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0a0a0a] rounded-full"
                                            transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Heading */}
                    <AnimatePresence mode="wait">
                        <motion.div key={isLogin ? 'h-login' : 'h-reg'}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }} className="mb-5">
                            <h1 className="font-serif-luxury text-[#0a0a0a] leading-tight mb-1"
                                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                                {isLogin ? 'Welcome Back' : 'Join VELOURA'}
                            </h1>
                            <p className="text-[#9a9a9a] text-xs tracking-wide mt-1">
                                {isLogin
                                    ? 'Sign in to access your account and orders.'
                                    : 'Create your account and start your journey.'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Form */}
                    <AnimatePresence mode="wait">
                        <motion.form key={isLogin ? 'form-login' : 'form-reg'}
                            initial={{ opacity: 0, x: isLogin ? -14 : 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 14 : -14 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            onSubmit={onSubmit} noValidate className="space-y-5">

                            {/* Username */}
                            <FloatInput id="username" label="Username" value={username}
                                onChange={v => { setUsername(v); if (usernameErr) setUsernameErr(''); }}
                                required autoComplete="off" error={usernameErr} />

                            {/* Email — register only */}
                            {!isLogin && (
                                <FloatInput id="email" label="Email Address" type="email" value={email}
                                    onChange={v => { setEmail(v); if (emailErr) setEmailErr(''); }}
                                    required autoComplete="email" error={emailErr} />
                            )}

                            {/* Password */}
                            <div>
                                <FloatInput id="password" label="Password"
                                    type={showPw ? 'text' : 'password'} value={password}
                                    onChange={v => { setPassword(v); if (pwErr) setPwErr(''); }}
                                    required autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    error={pwErr}
                                    suffix={
                                        <button type="button" tabIndex={-1} onClick={() => setShowPw(s => !s)}
                                            className="text-[#aaa] hover:text-[#0a0a0a] transition-colors">
                                            {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                        </button>
                                    } />
                                {!isLogin && <StrengthBar password={password} />}
                            </div>

                            {/* Confirm password — register only */}
                            {!isLogin && (
                                <FloatInput id="cpassword" label="Confirm Password"
                                    type={showCpw ? 'text' : 'password'} value={confirmPassword}
                                    onChange={v => { setConfirmPassword(v); if (cpwErr) setCpwErr(''); }}
                                    required autoComplete="new-password" error={cpwErr}
                                    suffix={
                                        <button type="button" tabIndex={-1} onClick={() => setShowCpw(s => !s)}
                                            className="text-[#aaa] hover:text-[#0a0a0a] transition-colors">
                                            {showCpw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                        </button>
                                    } />
                            )}

                            {/* Remember me + forgot — login only */}
                            {isLogin && (
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                                        <div onClick={() => setRemember(r => !r)}
                                            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 ${remember ? 'bg-[#0a0a0a] border-[#0a0a0a]' : 'border-[#ccc] group-hover:border-[#888]'}`}>
                                            {remember && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-[#777]">Remember me</span>
                                    </label>
                                    <button type="button" onClick={() => toastService.info('Password reset coming soon')}
                                        className="text-xs text-[#777] hover:text-[#0a0a0a] transition-colors hover:underline underline-offset-2">
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Primary submit */}
                            <motion.button type="submit" disabled={loading || !canSubmit}
                                whileHover={!loading && canSubmit ? { scale: 1.015, boxShadow: '0 6px 20px rgba(10,10,10,0.22)' } : {}}
                                whileTap={!loading && canSubmit ? { scale: 0.98 } : {}}
                                className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 transition-all duration-200
                                    ${loading || !canSubmit ? 'bg-[#ccc] text-[#888] cursor-not-allowed' : 'bg-[#0a0a0a] text-white hover:bg-[#222]'}`}>
                                {loading ? (
                                    <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>Processing…</>
                                ) : (
                                    <>{isLogin ? 'Sign In' : 'Create Account'}<FiArrowRight className="w-4 h-4" /></>
                                )}
                            </motion.button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#ebebeb]" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-[10px] text-[#aaa] tracking-widest uppercase">or</span>
                                </div>
                            </div>

                            {/* Google */}
                            <button type="button" onClick={() => handleGoogleSignIn()}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#e0e0e0] bg-white hover:bg-[#f8f8f8] hover:border-[#bbb] transition-all duration-200 text-sm font-medium text-[#333]">
                                <GoogleIcon />
                                Continue with Google
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    {/* Switch mode footer */}
                    <p className="mt-8 text-xs text-center text-[#aaa]">
                        {isLogin ? (
                            <>Don't have an account?{' '}
                                <button onClick={() => switchMode(false)} className="text-[#0a0a0a] font-semibold hover:underline underline-offset-2">
                                    Create one
                                </button></>
                        ) : (
                            <>Already have an account?{' '}
                                <button onClick={() => switchMode(true)} className="text-[#0a0a0a] font-semibold hover:underline underline-offset-2">
                                    Sign in
                                </button></>
                        )}
                    </p>
                </div>
            </motion.div>

            {/* ── Compact auth footer ──────────────────────────────────── */}
            <footer className="mt-8 pb-6 w-full">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4 text-[11px] text-[#aaa] tracking-wide">
                    <p>© 2026 VELOURA. All rights reserved.</p>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-[#0a0a0a] transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#0a0a0a] transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;
