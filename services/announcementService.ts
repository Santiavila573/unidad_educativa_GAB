import { Announcement } from '../types';

const STORAGE_KEY = 'ue_announcements';

export const AnnouncementService = {
    getAnnouncements: (): Announcement[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    getActiveAnnouncements: (): Announcement[] => {
        const announcements = AnnouncementService.getAnnouncements();
        return announcements.filter(a => {
            if (!a.isActive) return false;
            if (a.expiryDate && new Date(a.expiryDate) < new Date()) return false;
            return true;
        });
    },

    saveAnnouncement: (announcement: Announcement) => {
        const announcements = AnnouncementService.getAnnouncements();
        const index = announcements.findIndex(a => a.id === announcement.id);
        if (index > -1) {
            announcements[index] = announcement;
        } else {
            announcements.push(announcement);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    },

    deleteAnnouncement: (id: string) => {
        const announcements = AnnouncementService.getAnnouncements();
        const filtered = announcements.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};
