import React from 'react';
import { toast, type ToastOptions } from 'react-toastify';
import CustomToast from '@/components/ui/CustomToast';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'info' | 'error' | 'warning';

interface ToastAction {
    label: string;
    path: string;
}

interface NotifyOptions {
    type?: ToastType;
    actions?: ToastAction[];
    identifier?: string;
    baseMessage?: string;
}

interface ActiveToast {
    id: string | number;
    count: number;
    message: string;
}

// ─── State ────────────────────────────────────────────────────────────────────

const MAX_ACTIVE_TOASTS = 2;
const activeToasts = new Map<string, ActiveToast>();
const toastQueue: (string | number)[] = [];

// ─── Base Toast Options ───────────────────────────────────────────────────────

const getToastPosition = () => {
    return window.innerWidth < 640 ? 'bottom-center' : 'bottom-right';
};

const BASE_TOAST_OPTIONS: Partial<ToastOptions> = {
    position: getToastPosition(),
    autoClose: 4500,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        border: 'none',
        overflow: 'visible',
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeActions = (
    actions: ToastAction[] | ToastAction = []
): ToastAction[] =>
    Array.isArray(actions) ? actions : actions.label ? [actions] : [];

const renderToast = (
    message: string,
    type: ToastType,
    actions: ToastAction[],
    closeToast?: () => void
) =>
    React.createElement(CustomToast, { message, type, actions, closeToast });

// ─── Core notify ─────────────────────────────────────────────────────────────

const notify = (message: string, options: NotifyOptions = {}): void => {
    const { type = 'success', actions = [], identifier, baseMessage } = options;
    const toastKey = identifier ?? `${type}-${message}`;

    // Update existing toast if same key is active
    if (activeToasts.has(toastKey)) {
        const existing = activeToasts.get(toastKey)!;
        const newCount = existing.count + 1;
        const newMessage = baseMessage ? `${baseMessage} (${newCount})` : message;

        existing.count = newCount;
        existing.message = newMessage;

        toast.update(existing.id, {
            render: ({ closeToast }) => renderToast(newMessage, type, actions, closeToast),
        });
        return;
    }

    // Enforce max toast limit — evict the oldest
    if (toastQueue.length >= MAX_ACTIVE_TOASTS) {
        const oldestId = toastQueue.shift();
        if (oldestId !== undefined) {
            toast.dismiss(oldestId);
            for (const [key, val] of activeToasts.entries()) {
                if (val.id === oldestId) {
                    activeToasts.delete(key);
                    break;
                }
            }
        }
    }

    const toastOptions: ToastOptions = {
        ...BASE_TOAST_OPTIONS,
        onClose: () => {
            activeToasts.delete(toastKey);
            const idx = toastQueue.indexOf(id);
            if (idx !== -1) toastQueue.splice(idx, 1);
        },
    };

    const id = toast(
        ({ closeToast }) => renderToast(message, type, actions, closeToast),
        toastOptions
    );

    activeToasts.set(toastKey, { id, count: 1, message });
    toastQueue.push(id);
};

// ─── Public API ───────────────────────────────────────────────────────────────

export const toastService = {
    success: (
        message: string,
        actions: ToastAction[] | ToastAction = [],
        identifier?: string,
        baseMessage?: string
    ) =>
        notify(message, {
            type: 'success',
            actions: normalizeActions(actions),
            identifier,
            baseMessage,
        }),

    info: (
        message: string,
        actions: ToastAction[] | ToastAction = [],
        identifier?: string
    ) =>
        notify(message, {
            type: 'info',
            actions: normalizeActions(actions),
            identifier,
        }),

    error: (message: string, identifier?: string) =>
        notify(message, { type: 'error', identifier: identifier ?? `error-${message}` }),

    warning: (
        message: string,
        actions: ToastAction[] | ToastAction = []
    ) =>
        notify(message, {
            type: 'warning',
            actions: normalizeActions(actions),
        }),
};
