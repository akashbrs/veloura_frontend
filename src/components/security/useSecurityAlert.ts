import { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';

interface SecurityAlertData {
    _id: string;
    ip: string;
    attempts: number;
    time: string;
    message: string;
    active: boolean;
    createdAt: string;
}

export const useSecurityAlert = (userId: string | undefined) => {
    const [alert, setAlert] = useState<SecurityAlertData | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchAlert = async () => {
            console.log(`[SecurityAlertHook] Fetching alert for userId: ${userId}`);
            try {
                const { data } = await api.get(`/security-alert/${userId}`);
                console.log('[SecurityAlertHook] Received response:', data);
                if (data && data.active) {
                    console.log('[SecurityAlertHook] Setting active alert in state');
                    setAlert(data);
                } else {
                    console.log('[SecurityAlertHook] No active alert found');
                }
            } catch (error) {
                console.error('[SecurityAlertHook] Security alert fetch failed:', error);
            }
        };

        fetchAlert();
    }, [userId]);

    const dismissAlert = useCallback(async () => {
        if (!alert?._id) {
            setAlert(null);
            return;
        }

        try {
            await api.put(`/security-alert/${alert._id}/dismiss`);
        } catch (error) {
            console.error('Failed to dismiss alert:', error);
        } finally {
            setAlert(null);
        }
    }, [alert]);

    return { alert, dismissAlert };
};
