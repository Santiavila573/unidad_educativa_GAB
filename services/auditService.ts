import { AuditLogEntry, User } from '../types';

const STORAGE_KEY = 'uecib_audit_logs';

export const AuditService = {
  getLogs: (): AuditLogEntry[] => {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  },

  logAction: (user: User | null, action: AuditLogEntry['action'], details: string) => {
    if (!user) return; // Don't log anonymous actions for now (except login attempts if needed)

    const newEntry: AuditLogEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      details,
      ip: '192.168.1.1' // Simulated IP
    };

    const currentLogs = AuditService.getLogs();
    // Keep only last 100 logs for demo purposes
    const updatedLogs = [newEntry, ...currentLogs].slice(0, 100); 
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  },

  clearLogs: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
