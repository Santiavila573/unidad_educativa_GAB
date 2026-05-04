import { User } from '../types';

export interface UserSession {
    sessionId: string;
    userId: string;
    userName: string;
    role: string;
    ip: string;
    loginTime: string;
    device: string;
    isRevoked: boolean;
}

export interface SecurityAlert {
    id: string;
    type: 'failed_login' | 'unauthorized_access' | 'system_change';
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: string;
    userId?: string;
    ip: string;
}

const SESSIONS_KEY = 'ue_active_sessions';
const ALERTS_KEY = 'ue_security_alerts';

export const SecurityService = {
    getSessions: (): UserSession[] => {
        const data = localStorage.getItem(SESSIONS_KEY);
        return data ? JSON.parse(data) : [];
    },

    registerSession: (user: User): UserSession => {
        const sessions = SecurityService.getSessions();
        const newSession: UserSession = {
            sessionId: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            userName: user.name,
            role: user.role,
            ip: '192.168.1.' + Math.floor(Math.random() * 255), // Simulated IP
            loginTime: new Date().toISOString(),
            device: navigator.userAgent.includes('Mobile') ? 'Móvil' : 'Escritorio',
            isRevoked: false
        };

        // Add new session and keep only last 20
        const updated = [newSession, ...sessions].slice(0, 20);
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
        return newSession;
    },

    revokeSession: (sessionId: string) => {
        const sessions = SecurityService.getSessions();
        const updated = sessions.map(s =>
            s.sessionId === sessionId ? { ...s, isRevoked: true } : s
        );
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    },

    getAlerts: (): SecurityAlert[] => {
        const data = localStorage.getItem(ALERTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    addAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => {
        const alerts = SecurityService.getAlerts();
        const newAlert: SecurityAlert = {
            ...alert,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        };
        const updated = [newAlert, ...alerts].slice(0, 50);
        localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    },

    // Check if current session is still valid
    isSessionValid: (sessionId: string): boolean => {
        const sessions = SecurityService.getSessions();
        const session = sessions.find(s => s.sessionId === sessionId);
        return session ? !session.isRevoked : false;
    }
};
