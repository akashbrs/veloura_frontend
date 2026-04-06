import React, { useEffect, useRef, useCallback } from 'react';
import '@/components/security/securityAlert.css';

/* ── Types ──────────────────────────────────────────────────────── */
interface AlertData {
    _id: string;
    ip: string;
    attempts: number;
    time: string;
    message: string;
    active: boolean;
    createdAt: string;
}

interface SecurityAlertPopupProps {
    alert: AlertData | null;
    onClose: () => void;
    onSecureAccount?: () => void;
}

/* ── Threat Level Logic ─────────────────────────────────────────── */
type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';

const getThreatLevel = (attempts: number): ThreatLevel => {
    if (attempts >= 8) return 'Critical';
    if (attempts >= 5) return 'High';
    if (attempts >= 3) return 'Medium';
    return 'Low';
};

const THREAT_COLORS: Record<ThreatLevel, string> = {
    Low: '#3b82f6',
    Medium: '#f59e0b',
    High: '#f97316',
    Critical: '#ef4444',
};

/* ── Formatted Time ─────────────────────────────────────────────── */
const formatDetectionTime = (createdAt: string, rawTime: string): string => {
    try {
        const d = new Date(createdAt);
        if (isNaN(d.getTime())) return rawTime;
        const day = String(d.getDate()).padStart(2, '0');
        const month = d.toLocaleString('en-IN', { month: 'short' });
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year} • ${hours}:${minutes} IST`;
    } catch {
        return rawTime;
    }
};

/* ── Component ──────────────────────────────────────────────────── */
const SecurityAlertPopup: React.FC<SecurityAlertPopupProps> = ({ alert, onClose, onSecureAccount }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const firstFocusRef = useRef<HTMLButtonElement>(null);

    if (alert) {
        console.log('[SecurityAlertPopup] Rendering with alert:', alert);
    }

    /* Focus trap & Escape key */
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key === 'Tab' && modalRef.current) {
            const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (!alert) return;
        document.addEventListener('keydown', handleKeyDown);
        // Auto-focus the first interactive element
        setTimeout(() => firstFocusRef.current?.focus(), 100);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [alert, handleKeyDown]);

    if (!alert) return null;

    const threatLevel = getThreatLevel(alert.attempts);
    const threatColor = THREAT_COLORS[threatLevel];
    const detectionTime = formatDetectionTime(alert.createdAt, alert.time);

    return (
        <div className="security-overlay" id="security-alert-overlay">
            <div
                className="security-popup"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="sec-alert-title"
                aria-describedby="sec-alert-desc"
                ref={modalRef}
            >
                {/* Pulsing Shield Icon */}
                <div className="security-popup__icon">🛡️</div>

                {/* Title */}
                <h2 className="security-popup__title" id="sec-alert-title">
                    Security Warning
                </h2>

                {/* Description */}
                <p className="security-popup__text" id="sec-alert-desc">
                    Our security system detected suspicious login attempts on your account.
                </p>

                {/* Detail Rows */}
                <div className="security-popup__details">
                    <div className="security-popup__detail-row">
                        <span className="security-popup__detail-label">Attack Type</span>
                        <span className="security-popup__detail-value">
                            Brute Force Login Attempt
                        </span>
                    </div>
                    <div className="security-popup__detail-row">
                        <span className="security-popup__detail-label">Suspicious Login Source</span>
                        <span className="security-popup__detail-value security-popup__detail-value--danger">
                            {alert.ip}
                        </span>
                    </div>
                    <div className="security-popup__detail-row">
                        <span className="security-popup__detail-label">Detection Time</span>
                        <span className="security-popup__detail-value">{detectionTime}</span>
                    </div>
                    <div className="security-popup__detail-row">
                        <span className="security-popup__detail-label">Failed Login Attempts</span>
                        <span className="security-popup__detail-value security-popup__detail-value--danger">
                            {alert.attempts}
                        </span>
                    </div>
                    <div className="security-popup__detail-row">
                        <span className="security-popup__detail-label">Threat Level</span>
                        <span
                            className={`security-popup__threat security-popup__threat--${threatLevel.toLowerCase()}`}
                            style={{ '--threat-color': threatColor } as React.CSSProperties}
                        >
                            <span className="security-popup__threat-dot" />
                            {threatLevel}
                        </span>
                    </div>
                </div>

                {/* Note */}
                <p className="security-popup__note">
                    The malicious IP has been automatically blocked by the Cyber Attack
                    Lifecycle Defence Framework. If this activity was not performed by you,
                    please secure your account immediately.
                </p>

                {/* Actions */}
                <div className="security-popup__actions">
                    <button
                        className="security-popup__btn security-popup__btn--secondary"
                        onClick={onClose}
                        id="dismiss-security-alert"
                        ref={firstFocusRef}
                    >
                        Dismiss
                    </button>
                    {onSecureAccount && (
                        <button
                            className="security-popup__btn security-popup__btn--primary"
                            onClick={() => {
                                onClose();
                                onSecureAccount();
                            }}
                            id="secure-account-btn"
                        >
                            🔒 Secure Account
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityAlertPopup;
