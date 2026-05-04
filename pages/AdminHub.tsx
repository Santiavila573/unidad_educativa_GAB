import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Settings, Search, Filter, Download, UserPlus, Trash2, Edit2, ShieldAlert, BarChart3, Database, Globe, Mail, Phone, MapPin, Save, MoreVertical, CheckCircle2, AlertCircle, Clock, Megaphone, Plus, FolderTree, Tag, Info, AlertOctagon, CheckCircle, X, LogOut } from 'lucide-react';
import { Card, Button, Badge, Modal } from '../components/ui';
import { useAuth } from '../services/authContext';
import { AuditService } from '../services/auditService';
import { AnnouncementService } from '../services/announcementService';
import { RepoSettingsService, RepoSettings } from '../services/repoSettingsService';
import { SecurityService, UserSession, SecurityAlert } from '../services/securityService';
import { AuditLogEntry, User, SystemSettings, Announcement } from '../types';

const AdminHub: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'audit' | 'announcements' | 'settings' | 'structure' | 'security'>('dashboard');

    // --- Dashboard State ---
    const [stats, setStats] = useState({
        totalFiles: 145,
        totalUsers: 24,
        monthlyDownloads: 1240,
        systemHealth: '98%',
        storageUsed: '1.2 GB / 5 GB'
    });

    // --- User Modal State ---
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [userForm, setUserForm] = useState<Partial<User>>({
        name: '',
        username: '',
        email: '',
        role: 'teacher',
        status: 'active'
    });

    // --- Users State ---
    const [users, setUsers] = useState<User[]>([
        { id: '1', username: 'admin', name: 'Administrador TIC', role: 'admin', status: 'active', lastLogin: '2026-01-08T12:00:00Z' },
        { id: '2', username: 'rector', name: 'Rectorado', role: 'admin', status: 'active', lastLogin: '2026-01-08T10:30:00Z' },
        { id: '3', username: 'jdoe', name: 'John Doe', role: 'teacher', status: 'active', lastLogin: '2026-01-07T15:45:00Z' },
        { id: '4', username: 'msmith', name: 'Mary Smith', role: 'teacher', status: 'suspended', lastLogin: '2025-12-20T09:00:00Z' },
    ]);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    // --- Audit State ---
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [auditSearchTerm, setAuditSearchTerm] = useState('');

    // --- Settings State ---
    const [settings, setSettings] = useState<SystemSettings>({
        institutionName: 'U.E.C.I.B. "Gustavo Adolfo Bécquer"',
        address: 'Quitumbe, Calle S/N, Quito, Ecuador',
        phone: '+593 2 123 4567',
        email: 'info@uecib.edu.ec',
        socialMedia: {
            facebook: 'https://facebook.com/uecib',
            twitter: 'https://twitter.com/uecib',
            instagram: 'https://instagram.com/uecib'
        }
    });

    const [userLogs, setUserLogs] = useState<AuditLogEntry[]>([]);

    // --- Repo Settings State ---
    const [repoSettings, setRepoSettings] = useState<RepoSettings>({ categories: [], levels: [], areas: [] });
    const [newTag, setNewTag] = useState({ categories: '', levels: '', areas: '' });

    // --- Security Monitor State ---
    const [activeSessions, setActiveSessions] = useState<UserSession[]>([]);
    const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);

    // --- Announcement State ---
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [announcementForm, setAnnouncementForm] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        type: 'info',
        isActive: true
    });

    useEffect(() => {
        setLogs(AuditService.getLogs());
        setAnnouncements(AnnouncementService.getAnnouncements());
        setRepoSettings(RepoSettingsService.getSettings());
        setActiveSessions(SecurityService.getSessions());
        setSecurityAlerts(SecurityService.getAlerts());
    }, []);

    const handleExportLogs = (format: 'json' | 'csv') => {
        let data = '';
        let type = '';
        let extension = '';

        if (format === 'json') {
            data = JSON.stringify(logs, null, 2);
            type = 'application/json';
            extension = 'json';
        } else {
            // Professional CSV Report Generation
            const bom = '\uFEFF';
            const institutionalHeader = [
                `"REPORTE DE AUDITORÍA - ${settings.institutionName.toUpperCase()}"`,
                `"Fecha de Generación:","${new Date().toLocaleString()}"`,
                `"Generado por:","${currentUser?.name} (@${currentUser?.username})"`,
                `"Total de Registros:","${logs.length}"`,
                '',
                '"DETALLE DE ACCIONES"'
            ].join('\n');

            const headers = ['ID', 'Fecha', 'Usuario', 'Rol', 'Acción', 'Detalles', 'IP'];
            const rows = logs.map(log => [
                log.id,
                `"${new Date(log.timestamp).toLocaleString()}"`,
                `"${log.userName}"`,
                `"${log.userRole}"`,
                `"${log.action}"`,
                `"${log.details.replace(/"/g, '""')}"`, // Escape quotes for CSV
                `"${log.ip}"`
            ]);

            data = bom + institutionalHeader + '\n' + headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
            type = 'text/csv;charset=utf-8';
            extension = 'csv';
        }

        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${extension}`;
        link.click();
        AuditService.logAction(currentUser, 'DOWNLOAD', `Exportó registros de auditoría en ${format.toUpperCase()}`);
    };

    // --- Announcement Handlers ---
    const handleOpenAnnouncementModal = (ann: Announcement | null = null) => {
        if (ann) {
            setSelectedAnnouncement(ann);
            setAnnouncementForm(ann);
        } else {
            setSelectedAnnouncement(null);
            setAnnouncementForm({
                title: '',
                content: '',
                type: 'info',
                isActive: true
            });
        }
        setIsAnnouncementModalOpen(true);
    };

    const handleSaveAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        const annToSave: Announcement = {
            id: selectedAnnouncement?.id || Date.now().toString(),
            title: announcementForm.title || '',
            content: announcementForm.content || '',
            type: announcementForm.type || 'info',
            isActive: announcementForm.isActive ?? true,
            createdAt: selectedAnnouncement?.createdAt || new Date().toISOString(),
            authorName: currentUser?.name || 'Admin',
            expiryDate: announcementForm.expiryDate
        };
        AnnouncementService.saveAnnouncement(annToSave);
        setAnnouncements(AnnouncementService.getAnnouncements());
        AuditService.logAction(currentUser!, 'UPLOAD', `${selectedAnnouncement ? 'Actualizó' : 'Creó'} anuncio global: ${annToSave.title}`);
        setIsAnnouncementModalOpen(false);
    };

    const handleDeleteAnnouncement = (id: string, title: string) => {
        if (window.confirm(`¿Eliminar el anuncio "${title}"?`)) {
            AnnouncementService.deleteAnnouncement(id);
            setAnnouncements(AnnouncementService.getAnnouncements());
            AuditService.logAction(currentUser!, 'DELETE', `Eliminó anuncio global: ${title}`);
        }
    };

    // --- Repo Settings Handlers ---
    const handleAddTag = (type: keyof RepoSettings) => {
        if (!newTag[type].trim()) return;
        if (repoSettings[type].includes(newTag[type].trim())) {
            alert('Esta opción ya existe');
            return;
        }

        const updated = { ...repoSettings, [type]: [...repoSettings[type], newTag[type].trim()] };
        setRepoSettings(updated);
        RepoSettingsService.saveSettings(updated);
        setNewTag({ ...newTag, [type]: '' });
        AuditService.logAction(currentUser!, 'UPLOAD', `Agregó ${type}: ${newTag[type].trim()} a la estructura del repositorio`);
    };

    const handleRemoveTag = (type: keyof RepoSettings, tag: string) => {
        if (window.confirm(`¿Seguro que desea eliminar "${tag}" de ${type}?`)) {
            const updated = { ...repoSettings, [type]: repoSettings[type].filter(t => t !== tag) };
            setRepoSettings(updated);
            RepoSettingsService.saveSettings(updated);
            AuditService.logAction(currentUser!, 'DELETE', `Eliminó ${type}: ${tag} de la estructura del repositorio`);
        }
    };

    const handleRevokeSession = (sessionId: string, userName: string) => {
        if (window.confirm(`¿Desea cerrar forzosamente la sesión de ${userName}?`)) {
            SecurityService.revokeSession(sessionId);
            const updated = SecurityService.getSessions();
            setActiveSessions(updated);
            AuditService.logAction(currentUser!, 'DELETE', `Cerró forzosamente la sesión de ${userName}`);
        }
    };

    const handleOpenUserModal = (userToEdit: User | null = null) => {
        if (userToEdit) {
            setSelectedUser(userToEdit);
            setUserForm(userToEdit);
            setIsNewUser(false);
            setUserLogs(logs.filter(l => l.userId === userToEdit.id));
        } else {
            setSelectedUser(null);
            setUserForm({
                name: '',
                username: '',
                email: '',
                role: 'teacher',
                status: 'active'
            });
            setIsNewUser(true);
            setUserLogs([]);
        }
        setIsUserModalOpen(true);
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNewUser) {
            const newUser: User = {
                ...userForm as User,
                id: Date.now().toString(),
                status: 'active',
                lastLogin: undefined
            };
            setUsers([...users, newUser]);
            AuditService.logAction(currentUser, 'UPLOAD', `Creó nuevo usuario: ${newUser.name} (@${newUser.username})`);
        } else if (selectedUser) {
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userForm } : u));
            AuditService.logAction(currentUser, 'UPLOAD', `Actualizó credenciales de usuario: ${userForm.name}`);
        }
        setIsUserModalOpen(false);
    };

    const handleDeleteUser = (id: string, name: string) => {
        if (window.confirm(`¿Está seguro de eliminar permanentemente al usuario "${name}"? Esta acción no se puede deshacer.`)) {
            setUsers(users.filter(u => u.id !== id));
            AuditService.logAction(currentUser, 'DELETE', `Eliminó permanentemente al usuario: ${name}`);
        }
    };

    const handleResetPassword = (name: string) => {
        if (window.confirm(`¿Enviar instrucciones de restablecimiento de contraseña a ${name}?`)) {
            alert(`Instrucciones enviadas al correo de ${name}.`);
            AuditService.logAction(currentUser, 'UPLOAD', `Solicitó restablecimiento de contraseña para: ${name}`);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );

    const filteredLogs = logs.filter(log =>
        log.userName.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Header Sidebar / Topbar */}
            <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-ue-gold p-2 rounded-xl text-slate-900 shadow-lg shadow-ue-gold/20">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-outfit tracking-tight">Portal de Administración</h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Gestor de Sistemas v2.0</p>
                            </div>
                        </div>

                        {/* Navigation Tabs - Responsive Scrollable Container */}
                        <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 -mb-1">
                            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 w-max md:w-auto min-w-full md:min-w-0">
                                {[
                                    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                                    { id: 'announcements', label: 'Anuncios', icon: Megaphone },
                                    { id: 'structure', label: 'Estructura', icon: FolderTree },
                                    { id: 'users', label: 'Usuarios', icon: Users },
                                    { id: 'security', label: 'Seguridad', icon: ShieldAlert },
                                    { id: 'audit', label: 'Auditoría', icon: Activity },
                                    { id: 'settings', label: 'Ajustes', icon: Settings }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'bg-ue-gold text-slate-900 shadow-lg'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 lg:px-8 py-10 animate-fade-in relative z-10">
                {/* --- DASHBOARD TAB --- */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: 'Documentos', value: stats.totalFiles, icon: Database, color: 'blue' },
                                { label: 'Usuarios Activos', value: stats.totalUsers, icon: Users, color: 'purple' },
                                { label: 'Descargas (Mes)', value: stats.monthlyDownloads, icon: Download, color: 'green' },
                                { label: 'Estado Sistema', value: stats.systemHealth, icon: CheckCircle2, color: 'orange' }
                            ].map((item, idx) => (
                                <Card key={item.label} className="border-0 shadow-xl shadow-slate-200/50 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-${item.color}-50 text-${item.color}-600 shrink-0`}>
                                            <item.icon className="h-6 w-6 md:h-8 md:w-8" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1 truncate">{item.label}</p>
                                            <p className="text-xl md:text-2xl font-black text-slate-800 font-outfit">{item.value}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card title="Alertas de Seguridad" className="lg:col-span-1">
                                <div className="space-y-4">
                                    {[
                                        { title: 'Intento de borrado', detail: 'Usuario rector intentó borrar acta ID: 504', time: '10 min', type: 'warning' },
                                        { title: 'Login Inusual', detail: 'Ingreso desde nueva IP: 190.15.2.4', time: '2h ago', type: 'info' },
                                        { title: 'Exceso de descargas', detail: 'msmith descargó 50 archivos en 5 min', time: '5h ago', type: 'error' }
                                    ].map((alert, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className={`mt-1 ${alert.type === 'error' ? 'text-red-500' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                                                <ShieldAlert className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{alert.detail}</p>
                                                <span className="text-[10px] text-slate-400 mt-2 block font-medium">{alert.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Uso del Almacenamiento" className="lg:col-span-2 overflow-hidden relative">
                                <div className="absolute top-4 right-6 text-2xl font-black text-slate-200">24%</div>
                                <div className="space-y-6 pt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-slate-600">Espacio Utilizado</span>
                                        <span className="font-bold text-ue-blue">{stats.storageUsed}</span>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-ue-blue to-ue-light-blue w-[24%] animate-bar-expand"></div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'PDFs', pct: 60, color: 'bg-red-400' },
                                            { label: 'Documentos', pct: 25, color: 'bg-blue-400' },
                                            { label: 'Imágenes', pct: 15, color: 'bg-green-400' }
                                        ].map((cat, idx) => (
                                            <div key={idx} className="p-4 rounded-2xl border border-slate-50 bg-white shadow-sm" title={`Uso de ${cat.label}: ${cat.pct}%`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400">{cat.label}</span>
                                                </div>
                                                <p className="text-xl font-bold text-slate-800">{cat.pct}%</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* --- ANNOUNCEMENTS TAB --- */}
                {activeTab === 'announcements' && (
                    <Card noPadding className="shadow-2xl shadow-slate-200/50 border-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md">
                            <h3 className="text-lg font-black text-slate-800 font-outfit uppercase tracking-tight">Gestión de Anuncios Globales</h3>
                            <Button icon={Plus} className="w-full sm:w-auto" onClick={() => handleOpenAnnouncementModal()}>Nuevo Anuncio</Button>
                        </div>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Anuncio</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Tipo</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Expira</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {announcements.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No hay anuncios configurados</td>
                                        </tr>
                                    ) : announcements.map((ann) => (
                                        <tr key={ann.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-black text-slate-800 font-outfit uppercase tracking-tight truncate">{ann.title}</p>
                                                    <p className="text-xs text-slate-500 truncate">{ann.content}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge color={ann.type === 'urgent' ? 'red' : ann.type === 'warning' ? 'gold' : ann.type === 'success' ? 'green' : 'blue'}>
                                                    {ann.type.toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${ann.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></div>
                                                    <span className={`text-xs font-bold ${ann.isActive ? 'text-green-600' : 'text-slate-400'} uppercase tracking-widest`}>
                                                        {ann.isActive ? 'Publicado' : 'Borrador'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold tabular-nums">
                                                {ann.expiryDate ? new Date(ann.expiryDate).toLocaleDateString() : 'Nunca'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-2 hover:text-ue-blue hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Editar Anuncio"
                                                        onClick={() => handleOpenAnnouncementModal(ann)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Eliminar Anuncio"
                                                        onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {announcements.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 italic">No hay anuncios registrados</div>
                            ) : announcements.map((ann) => (
                                <div key={ann.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="min-w-0 pr-2">
                                            <p className="font-bold text-slate-800 line-clamp-2 uppercase font-outfit tracking-tight">{ann.title}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{new Date(ann.date).toLocaleDateString()}</p>
                                        </div>
                                        <Badge color={ann.type === 'urgent' ? 'red' : 'blue'}>{ann.type.charAt(0).toUpperCase()}</Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2">{ann.content}</p>
                                    <div className="flex items-center justify-between pt-1">
                                        <Badge color={ann.isActive ? 'green' : 'slate'}>{ann.isActive ? 'PUBLICADO' : 'BORRADOR'}</Badge>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleOpenAnnouncementModal(ann)} className="p-2 text-slate-400 bg-slate-50 rounded-lg" title="Editar"><Edit2 className="h-4 w-4" /></button>
                                            <button onClick={() => handleDeleteAnnouncement(ann.id, ann.title)} className="p-2 text-slate-400 bg-slate-50 rounded-lg" title="Eliminar"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* --- REPOSITORY STRUCTURE TAB --- */}
                {activeTab === 'structure' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Categories management */}
                        <Card title="Categorías de Documentos" icon={Tag}>
                            <p className="text-xs text-slate-500 mb-6 italic">Define los tipos de documentos que se pueden subir (Ej: Planificación, Acta).</p>
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    placeholder="Nueva categoría..."
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                    value={newTag.categories}
                                    onChange={e => setNewTag({ ...newTag, categories: e.target.value })}
                                    onKeyPress={e => e.key === 'Enter' && handleAddTag('categories')}
                                />
                                <Button size="sm" onClick={() => handleAddTag('categories')} title="Agregar categoría"><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {repoSettings.categories.map(cat => (
                                    <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold group hover:bg-ue-light-blue hover:text-white transition-all">
                                        {cat}
                                        <button onClick={() => handleRemoveTag('categories', cat)} className="text-slate-400 group-hover:text-white hover:scale-125 transition-transform" title={`Eliminar ${cat}`}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Levels management */}
                        <Card title="Niveles Académicos" icon={Globe}>
                            <p className="text-xs text-slate-500 mb-6 italic">Niveles educativos para clasificar el contenido (Ej: EGB, BGU).</p>
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    placeholder="Nuevo nivel..."
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                    value={newTag.levels}
                                    onChange={e => setNewTag({ ...newTag, levels: e.target.value })}
                                    onKeyPress={e => e.key === 'Enter' && handleAddTag('levels')}
                                />
                                <Button size="sm" onClick={() => handleAddTag('levels')} title="Agregar nivel"><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {repoSettings.levels.map(level => (
                                    <div key={level} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold group hover:bg-ue-gold hover:text-ue-blue transition-all">
                                        {level}
                                        <button onClick={() => handleRemoveTag('levels', level)} className="text-slate-400 group-hover:text-ue-blue hover:scale-125 transition-transform" title={`Eliminar ${level}`}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Areas management */}
                        <Card title="Áreas / Asignaturas" icon={FolderTree}>
                            <p className="text-xs text-slate-500 mb-6 italic">Áreas de conocimiento o materias relacionadas.</p>
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    placeholder="Nueva área..."
                                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                    value={newTag.areas}
                                    onChange={e => setNewTag({ ...newTag, areas: e.target.value })}
                                    onKeyPress={e => e.key === 'Enter' && handleAddTag('areas')}
                                />
                                <Button size="sm" onClick={() => handleAddTag('areas')} title="Agregar área"><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {repoSettings.areas.map(area => (
                                    <div key={area} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold group hover:bg-slate-800 hover:text-white transition-all">
                                        {area}
                                        <button onClick={() => handleRemoveTag('areas', area)} className="text-slate-400 group-hover:text-white hover:scale-125 transition-transform" title={`Eliminar ${area}`}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === 'security' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2" noPadding title="Sesiones Activas" icon={Globe}>
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                                    <p className="text-xs text-slate-500 font-medium">Monitoreo de conexiones en tiempo real</p>
                                    <Badge color="green" className="animate-pulse">Live</Badge>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50/50 text-xs font-black text-slate-400 uppercase tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Usuario</th>
                                                <th className="px-6 py-4 text-left">Dispositivo / IP</th>
                                                <th className="px-6 py-4 text-left">Inicio</th>
                                                <th className="px-6 py-4 text-left">Estado</th>
                                                <th className="px-6 py-4 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {activeSessions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No hay sesiones activas registradas</td>
                                                </tr>
                                            ) : activeSessions.map((session) => (
                                                <tr key={session.sessionId} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-black text-slate-800 font-outfit uppercase tracking-tight">{session.userName}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{session.role}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{session.device}</span>
                                                            <span className="text-[10px] tabular-nums text-slate-400 font-medium">{session.ip}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                                        {new Date(session.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {session.isRevoked ? (
                                                            <Badge color="red">EXPULSADO</Badge>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Activo</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {!session.isRevoked && (
                                                            <button
                                                                onClick={() => handleRevokeSession(session.sessionId, session.userName)}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                title="Cerrar sesión forzosamente"
                                                            >
                                                                <LogOut className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {activeSessions.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 italic text-sm">No hay sesiones activas</div>
                                    ) : activeSessions.map((session) => (
                                        <div key={session.sessionId} className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-slate-800 font-outfit uppercase tracking-tight">{session.userName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{session.role}</p>
                                                </div>
                                                {session.isRevoked ? (
                                                    <Badge color="red">EXPULSADO</Badge>
                                                ) : (
                                                    <Badge color="green">ACTIVO</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-xs pt-1">
                                                <div className="flex gap-2 text-slate-500 font-medium">
                                                    <span>{session.ip}</span>
                                                    <span>•</span>
                                                    <span>{new Date(session.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                {!session.isRevoked && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        icon={LogOut}
                                                        onClick={() => handleRevokeSession(session.sessionId, session.userName)}
                                                        className="text-red-500 border-red-100 hover:bg-red-50 px-2 h-8"
                                                    >
                                                        Cerrar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Alertas de Seguridad" icon={ShieldAlert}>
                                <p className="text-xs text-slate-500 mb-6 italic">Eventos críticos y denegaciones de acceso.</p>
                                <div className="space-y-4">
                                    {securityAlerts.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle className="h-6 w-6 text-green-500" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sistema Protegido</p>
                                        </div>
                                    ) : securityAlerts.map(alert => (
                                        <div key={alert.id} className={`p-4 rounded-2xl border flex gap-4 ${alert.severity === 'high' ? 'bg-red-50 border-red-100 text-red-900' :
                                            alert.severity === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                                                'bg-slate-50 border-slate-100 text-slate-800'
                                            }`}>
                                            <div className={`shrink-0 p-2 rounded-xl ${alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                                                alert.severity === 'medium' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-slate-200 text-slate-500'
                                                }`}>
                                                <ShieldAlert className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight leading-tight">{alert.message}</p>
                                                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold opacity-60">
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleTimeString()}</span>
                                                    <span>IP: {alert.ip}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* --- USERS TAB --- */}
                {activeTab === 'users' && (
                    <Card noPadding className="shadow-2xl shadow-slate-200/50 border-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md">
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, usuario o email..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-ue-gold transition-all outline-none"
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button icon={UserPlus} className="w-full sm:w-auto" onClick={() => handleOpenUserModal()}>Nuevo Usuario</Button>
                        </div>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Rol</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Último Acceso</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300/30">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 font-outfit uppercase tracking-tight">{u.name}</p>
                                                        <p className="text-xs text-slate-400 font-bold tracking-wider">@{u.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge color={u.role === 'admin' ? 'purple' : 'blue'}>{u.role}</Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                                    <span className={`text-xs font-bold ${u.status === 'active' ? 'text-green-600' : 'text-red-600'} uppercase tracking-widest`}>
                                                        {u.status === 'active' ? 'Activo' : 'Suspendido'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold tabular-nums">
                                                {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-2 hover:text-ue-blue hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Gestionar Credenciales"
                                                        aria-label="Gestionar Credenciales"
                                                        onClick={() => handleOpenUserModal(u)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Eliminar Usuario"
                                                        aria-label="Eliminar Usuario"
                                                        onClick={() => handleDeleteUser(u.id, u.name)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 italic">No hay resultados</div>
                            ) : filteredUsers.map((u) => (
                                <div key={u.id} className="p-4 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600 border border-slate-200 uppercase shrink-0">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-slate-800 truncate">{u.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold tracking-wider">@{u.username}</p>
                                        </div>
                                        <Badge color={u.role === 'admin' ? 'purple' : 'blue'}>{u.role.charAt(0).toUpperCase()}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{u.status === 'active' ? 'Activo' : 'Suspendido'}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold border-l border-slate-200 pl-2">
                                                {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Sin login'}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleOpenUserModal(u)} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 rounded-lg" title="Editar Usuario"><Edit2 className="h-4 w-4" /></button>
                                            <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg" title="Eliminar Usuario"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* --- AUDIT TAB --- */}
                {activeTab === 'audit' && (
                    <Card noPadding className="shadow-2xl shadow-slate-200/50 border-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-md">
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filtros: usuario, acción, documentos..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-ue-gold transition-all outline-none"
                                    value={auditSearchTerm}
                                    onChange={(e) => setAuditSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button icon={Download} variant="outline" size="sm" onClick={() => handleExportLogs('csv')}>CSV</Button>
                                <Button icon={Download} variant="outline" size="sm" onClick={() => handleExportLogs('json')}>JSON</Button>
                            </div>
                        </div>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto min-h-[400px]">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Fecha</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Acción</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-bold tabular-nums">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3.5 w-3.5 text-slate-400 group-hover:text-ue-blue transition-colors" />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${log.userRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {log.userName.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 uppercase">{log.userName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge color={log.action === 'DELETE' ? 'red' : log.action === 'UPLOAD' ? 'green' : 'blue'}>{log.action}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-600 max-w-xs truncate">
                                                {log.details}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {filteredLogs.length === 0 ? (
                                <div className="p-10 text-center text-slate-400 italic">No hay registros de auditoría</div>
                            ) : filteredLogs.map((log) => (
                                <div key={log.id} className="p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Badge color={log.action === 'DELETE' ? 'red' : log.action === 'UPLOAD' ? 'green' : 'blue'}>{log.action}</Badge>
                                            <span className="text-[10px] text-slate-400 font-bold tabular-nums">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-700 uppercase">{log.userName}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium line-clamp-2">{log.details}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* --- SETTINGS TAB --- */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <Card title="Información Institucional">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Ajustes guardados'); }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Globe className="h-3 w-3" /> Nombre de la Institución
                                    </label>
                                    <input
                                        type="text"
                                        aria-label="Nombre de la Institución"
                                        placeholder="Nombre de la Institución"
                                        value={settings.institutionName}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-ue-gold/50 transition-all shadow-inner"
                                        onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> Email de Contacto
                                        </label>
                                        <input type="email" aria-label="Email de Contacto" placeholder="email@ejemplo.com" value={settings.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-ue-gold/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone className="h-3 w-3" /> Teléfono
                                        </label>
                                        <input type="text" aria-label="Teléfono" placeholder="+593 ..." value={settings.phone} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-ue-gold/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Dirección
                                    </label>
                                    <input type="text" aria-label="Dirección" placeholder="Dirección institucional" value={settings.address} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-ue-gold/50" />
                                </div>
                                <div className="pt-4">
                                    <Button icon={Save} className="w-full shadow-lg shadow-ue-blue/20">Guardar Cambios</Button>
                                </div>
                            </form>
                        </Card>

                        <div className="space-y-8">
                            <Card title="Redes Sociales">
                                <div className="space-y-6">
                                    {Object.entries(settings.socialMedia).map(([key, val]) => (
                                        <div key={key} className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none capitalize">{key}</label>
                                            <input
                                                type="text"
                                                aria-label={`URL de ${key}`}
                                                placeholder={`https://${key}.com/...`}
                                                value={val}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 truncate outline-none focus:ring-2 focus:ring-ue-gold/50"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card title="Acciones de Mantenimiento" className="bg-slate-900 border-0 shadow-2xl shadow-slate-900/20">
                                <div className="space-y-4 pt-2">
                                    <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-ue-gold border border-white/5 hover:border-ue-gold/50 hover:bg-ue-gold/5 active:scale-95 group">
                                        <span>Crear Backup Completo</span>
                                        <Database className="h-4 w-4 text-ue-gold group-hover:rotate-12 transition-transform" />
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-between text-slate-300 hover:text-green-400 border border-white/5 hover:border-green-400/50 hover:bg-green-400/5 active:scale-95 group">
                                        <span>Optimizar Base de Datos</span>
                                        <Activity className="h-4 w-4 text-green-400 group-hover:animate-pulse" />
                                    </Button>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center mt-6">Último backup: Hace 2 días</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </main>

            {/* Background Decorations */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-ue-blue/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-ue-gold/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>

            {/* User Modal */}
            <Modal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                title={isNewUser ? "Añadir Nuevo Usuario" : "Gestionar Credenciales"}
            >
                <form onSubmit={handleSaveUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="user-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                            <input
                                id="user-name"
                                required
                                type="text"
                                placeholder="Nombre completo del usuario"
                                title="Ingresar nombre completo"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={userForm.name}
                                onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="user-username" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario ID</label>
                            <input
                                id="user-username"
                                required
                                type="text"
                                placeholder="Nombre de usuario"
                                title="Ingresar ID de usuario"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={userForm.username}
                                onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="user-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <input
                                id="user-email"
                                required
                                type="email"
                                placeholder="ejemplo@uecib.edu.ec"
                                title="Ingresar correo electrónico"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={userForm.email}
                                onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="user-role" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol del Sistema</label>
                            <select
                                id="user-role"
                                title="Seleccionar rol del usuario"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={userForm.role}
                                onChange={e => setUserForm({ ...userForm, role: e.target.value as any })}
                            >
                                <option value="teacher">Docente (Acceso Estándar)</option>
                                <option value="admin">Administrador (Control Total)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="user-status" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado de Cuenta</label>
                            <select
                                id="user-status"
                                title="Seleccionar estado de la cuenta"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={userForm.status}
                                onChange={e => setUserForm({ ...userForm, status: e.target.value as any })}
                            >
                                <option value="active">Activo</option>
                                <option value="suspended">Suspendido</option>
                            </select>
                        </div>
                    </div>

                    {!isNewUser && (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-ue-blue" /> Historial Reciente
                                </h4>
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleResetPassword(userForm.name!)} className="text-ue-blue bg-blue-50 hover:bg-blue-100">
                                    Restablecer Contraseña
                                </Button>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 max-h-40 overflow-y-auto space-y-3">
                                {userLogs.length > 0 ? userLogs.map(log => (
                                    <div key={log.id} className="flex justify-between items-center text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <Badge size="xs" color={log.action === 'LOGIN' ? 'green' : 'blue'}>{log.action}</Badge>
                                            <span className="text-slate-600 font-medium">{log.details}</span>
                                        </div>
                                        <span className="text-slate-400 tabular-nums">{new Date(log.timestamp).toLocaleDateString()}</span>
                                    </div>
                                )) : (
                                    <p className="text-center text-slate-400 py-4 italic text-xs">Sin actividad registrada últimamente</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsUserModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="flex-1">{isNewUser ? "Crear Usuario" : "Guardar Cambios"}</Button>
                    </div>
                </form>
            </Modal>
            {/* Announcement Modal */}
            <Modal
                isOpen={isAnnouncementModalOpen}
                onClose={() => setIsAnnouncementModalOpen(false)}
                title={selectedAnnouncement ? "Editar Anuncio Global" : "Crear Nuevo Anuncio"}
            >
                <form onSubmit={handleSaveAnnouncement} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título del Anuncio</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: Mantenimiento Programado"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                            value={announcementForm.title}
                            onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contenido del Mensaje</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Describa el anuncio aquí..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none resize-none"
                            value={announcementForm.content}
                            onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="ann-type" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Alerta</label>
                            <select
                                id="ann-type"
                                title="Seleccionar tipo de alerta"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={announcementForm.type}
                                onChange={e => setAnnouncementForm({ ...announcementForm, type: e.target.value as any })}
                            >
                                <option value="info">Informativo (Azul)</option>
                                <option value="warning">Advertencia (Oro)</option>
                                <option value="urgent">Urgente (Rojo)</option>
                                <option value="success">Éxito (Verde)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="ann-expiry" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha de Expiración (Opcional)</label>
                            <input
                                id="ann-expiry"
                                type="date"
                                title="Seleccionar fecha de expiración"
                                placeholder="aaaa-mm-dd"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-ue-gold outline-none"
                                value={announcementForm.expiryDate || ''}
                                onChange={e => setAnnouncementForm({ ...announcementForm, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <input
                            type="checkbox"
                            id="ann-active"
                            className="w-4 h-4 text-ue-blue focus:ring-ue-blue border-slate-300 rounded"
                            checked={announcementForm.isActive}
                            onChange={e => setAnnouncementForm({ ...announcementForm, isActive: e.target.checked })}
                        />
                        <label htmlFor="ann-active" className="text-xs font-black text-slate-600 uppercase tracking-widest cursor-pointer">
                            Publicar inmediatamente
                        </label>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAnnouncementModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="flex-1">{selectedAnnouncement ? "Guardar Cambios" : "Crear Anuncio"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminHub;
