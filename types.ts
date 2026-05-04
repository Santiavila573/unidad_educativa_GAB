
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
  status: 'active' | 'suspended';
  lastLogin?: string;
}

export interface SystemSettings {
  institutionName: string;
  address: string;
  phone: string;
  email: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Institucional' | 'Académico' | 'Comunidad';
}

export enum FileType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  XLSX = 'XLSX',
  PPTX = 'PPTX'
}

export interface RepoDocument {
  id: string;
  title: string;
  type: FileType;
  level: string; // EGB, BGU
  area: string; // Matemáticas, Lengua, etc.
  year: string; // 2023-2024
  category: 'Planificación' | 'Informe' | 'Acta' | 'Guía' | 'Oficial';
  uploadedBy: string;
  date: string;
  size: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'UPLOAD' | 'VIEW' | 'DOWNLOAD' | 'DELETE' | 'LOGIN';
  userId: string;
  userName: string;
  userRole: string;
  details: string;
  ip?: string; // Simulated
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isActive: boolean;
  createdAt: string;
  expiryDate?: string;
  authorName: string;
}
