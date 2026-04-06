import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiCheckCircle, FiInfo, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

interface ToastAction {
    label: string;
    path: string;
}

interface CustomToastProps {
    message: string;
    type?: 'success' | 'info' | 'error' | 'warning';
    actions?: ToastAction[];
    closeToast?: () => void;
}

const getAccentColor = (type?: string) => {
    switch (type) {
        case 'success': return 'bg-green-500';
        case 'error': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        case 'info':
        default: return 'bg-blue-500';
    }
};

const getIcon = (type?: string) => {
    switch (type) {
        case 'success': return <FiCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />;
        case 'error': return <FiAlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />;
        case 'warning': return <FiAlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0" />;
        case 'info':
        default: return <FiInfo className="text-blue-500 w-5 h-5 flex-shrink-0" />;
    }
};

const CustomToast: React.FC<CustomToastProps> = ({
    message,
    type = 'success',
    actions = [],
    closeToast
}) => {
    const navigate = useNavigate();

    return (
        <div className="premium-toast animate-toastIn relative overflow-hidden">
            {/* Dynamic Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${getAccentColor(type)}`} />

            {/* Manual Close Icon */}
            <button
                onClick={closeToast}
                className="absolute top-3 right-3.5 text-white/50 hover:text-white transition-opacity duration-200"
                aria-label="Close"
            >
                <FiX size={14} />
            </button>

            {/* Content Area */}
            <div className="flex flex-col gap-2.5 pl-3 pr-4">
                <div className="flex items-start gap-3 mt-1">
                    {getIcon(type)}
                    <p className="text-[14px] font-medium text-white leading-tight pr-4 mt-0.5">
                        {message}
                    </p>
                </div>

                {actions.length > 0 && (
                    <div className="flex items-center gap-5 mt-0.5">
                        {actions.map((action, index) => {
                            const isCheckout = action.label.toLowerCase().includes('checkout');
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        navigate(action.path);
                                        closeToast?.();
                                    }}
                                    className="text-[13px] font-bold text-white hover:opacity-75 transition-opacity duration-200 flex items-center gap-1"
                                >
                                    {action.label}
                                    {isCheckout && <span className="text-[14px]">→</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomToast;
