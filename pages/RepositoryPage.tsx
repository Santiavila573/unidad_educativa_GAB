import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/authContext';
import { AuditService } from '../services/auditService';
import { RepoSettingsService, RepoSettings } from '../services/repoSettingsService';
import { MOCK_DOCUMENTS } from '../constants';
import { RepoDocument, FileType } from '../types';
import { Button, Card, Badge, Modal } from '../components/ui';
import { FileText, Download, Trash2, Upload, Search, Filter, FolderOpen, User as UserIcon, Eye, Check, CloudUpload, Calendar, ChevronDown, File as LucideFile, Grid, MoreVertical, FileSpreadsheet, Presentation, Award, Shield } from 'lucide-react';

const RepositoryPage: React.FC = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<RepoDocument[]>(MOCK_DOCUMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('Todos');

    // States for Modals
    const [selectedDoc, setSelectedDoc] = useState<RepoDocument | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Dynamic Settings
    const [repoSettings, setRepoSettings] = useState<RepoSettings>({ categories: [], levels: [], areas: [] });

    // State for New Document Form
    const [newDocData, setNewDocData] = useState({
        title: '',
        category: '',
        level: '',
        area: '',
        year: '2026-2027',
        file: null as File | null
    });

    useEffect(() => {
        const settings = RepoSettingsService.getSettings();
        setRepoSettings(settings);

        // Initialize form with first available options
        setNewDocData(prev => ({
            ...prev,
            category: settings.categories[0] || '',
            level: settings.levels[0] || '',
            area: settings.areas[0] || ''
        }));
    }, []);

    // Filter Logic
    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.area.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Wrapper for viewing details to log the action
    const handleViewDetails = (doc: RepoDocument) => {
        AuditService.logAction(user, 'VIEW', `Visualizó detalles: ${doc.title} (ID: ${doc.id})`);
        setSelectedDoc(doc);
    };

    const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (user?.role !== 'admin') {
            alert("Solo el administrador puede eliminar documentos.");
            return;
        }
        if (window.confirm("¿Está seguro de eliminar este documento? Esta acción quedará registrada.")) {
            AuditService.logAction(user, 'DELETE', `Eliminó documento: ${title} (ID: ${id})`);
            setDocuments(documents.filter(d => d.id !== id));
            if (selectedDoc?.id === id) setSelectedDoc(null);
        }
    };

    const handleDownload = (doc: RepoDocument, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        // Log Download Action
        AuditService.logAction(user, 'DOWNLOAD', `Descargó documento: ${doc.title} (ID: ${doc.id})`);

        const content = `DOCUMENTO SIMULADO: ${doc.title}\nID: ${doc.id}\n...Contenido...\nDescargado por: ${user?.name}\nFecha: ${new Date().toISOString()}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${doc.title.replace(/\s+/g, '_')}.txt`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    // Upload Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewDocData({ ...newDocData, file: e.target.files[0] });
        }
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newDocData.title || !newDocData.file) {
            alert("Por favor complete el título y seleccione un archivo.");
            return;
        }

        const fileName = newDocData.file.name;
        let type = FileType.PDF;
        if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) type = FileType.DOCX;
        else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) type = FileType.XLSX;
        else if (fileName.endsWith('.pptx') || fileName.endsWith('.ppt')) type = FileType.PPTX;

        const sizeBytes = newDocData.file.size;
        const sizeStr = sizeBytes > 1024 * 1024
            ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
            : `${(sizeBytes / 1024).toFixed(0)} KB`;

        const newDoc: RepoDocument = {
            id: Date.now().toString(),
            title: newDocData.title,
            type: type,
            level: newDocData.level,
            area: newDocData.area,
            year: newDocData.year,
            category: newDocData.category,
            uploadedBy: user?.name || 'Usuario',
            date: new Date().toISOString().split('T')[0],
            size: sizeStr
        };

        // Log Upload Action
        AuditService.logAction(user, 'UPLOAD', `Subió documento: ${newDoc.title} (${newDoc.size})`);

        setDocuments([newDoc, ...documents]);
        setIsUploadOpen(false);
        setNewDocData({
            title: '',
            category: 'Planificación' as RepoDocument['category'],
            level: 'EGB Superior',
            area: 'Matemáticas',
            year: '2026-2027',
            file: null
        });
    };

    const FileIcon = ({ type, size = "md" }: { type: string, size?: "md" | "lg" | "xl" | "2xl" }) => {
        let colorClass = "bg-slate-100 text-slate-500 border-slate-200";
        let IconComponent = FileText;

        if (type === FileType.PDF) {
            colorClass = "bg-red-50 text-red-500 border-red-100";
        } else if (type === FileType.XLSX) {
            colorClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
            IconComponent = FileSpreadsheet;
        } else if (type === FileType.DOCX) {
            colorClass = "bg-blue-50 text-blue-500 border-blue-100";
            IconComponent = FileText;
        } else if (type === FileType.PPTX) {
            colorClass = "bg-orange-50 text-orange-500 border-orange-100";
            IconComponent = Presentation;
        }

        const dims = size === "2xl" ? "h-24 w-24 rounded-3xl" : size === "xl" ? "h-20 w-20 rounded-2xl" : size === "lg" ? "h-14 w-14 rounded-xl" : "h-11 w-11 rounded-xl";
        const iconSize = size === "2xl" ? "h-12 w-12" : size === "xl" ? "h-10 w-10" : size === "lg" ? "h-7 w-7" : "h-6 w-6";

        return (
            <div className={`flex items-center justify-center ${colorClass} ${dims} shadow-sm border transition-all duration-300 group-hover:scale-105 group-hover:shadow-md relative overflow-hidden`}>
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"></div>
                <IconComponent className={iconSize} strokeWidth={1.5} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 relative pb-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60"></div>

            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-16 sm:top-20 z-30 transition-all duration-300 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8 2xl:px-12 py-4 md:py-5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-5">
                        <div className="animate-slide-up w-full md:w-auto">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3 font-outfit">
                                <div className="bg-gradient-to-br from-ue-gold to-yellow-300 p-2 md:p-2.5 rounded-xl shadow-lg shadow-yellow-500/20 text-ue-blue ring-1 ring-white/50">
                                    <FolderOpen className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                    Repositorio Digital
                                </span>
                            </h1>
                            <p className="text-sm text-slate-500 mt-1 ml-14 font-medium">
                                Gestión documental centralizada y segura
                            </p>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto animate-slide-up delay-100">
                            <div className="hidden md:flex flex-col items-end mr-2 text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sesión iniciada como</p>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-purple-500 animate-pulse' : 'bg-green-500'}`}></span>
                                    <p className="text-sm font-bold text-slate-700">{user?.name}</p>
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsUploadOpen(true)}
                                icon={Upload}
                                className="w-full md:w-auto"
                            >
                                Subir Archivo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 2xl:px-12 py-8 animate-fade-in relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 2xl:gap-12">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-28 space-y-6">
                            <Card className="border-0 shadow-xl shadow-slate-200/50 ring-1 ring-black/5 bg-white/90 backdrop-blur-sm overflow-visible">
                                <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-3 md:gap-4 lg:block lg:space-y-6 relative">
                                    {/* Decorative gradient blob - Hidden on tablet/mobile to save paint perf */}
                                    <div className="hidden lg:block absolute -top-10 -right-10 w-24 h-24 bg-ue-light-blue/10 rounded-full blur-2xl pointer-events-none"></div>

                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5 ml-1 flex items-center gap-2 font-outfit">
                                            <Search className="w-3 h-3" /> Buscar
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-ue-light-blue/50 focus:border-ue-light-blue transition-all outline-none text-slate-700 placeholder-slate-400 hover:bg-white hover:shadow-sm"
                                                placeholder="Palabras clave..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3.5 group-focus-within:text-ue-light-blue transition-colors" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5 ml-1 flex items-center gap-2 font-outfit">
                                            <Filter className="w-3 h-3" /> Categoría
                                        </label>
                                        <div className="relative group">
                                            <select
                                                className="w-full pl-4 pr-10 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-ue-light-blue/50 focus:border-ue-light-blue transition-all outline-none appearance-none text-slate-700 cursor-pointer hover:bg-white hover:shadow-sm"
                                                value={filterCategory}
                                                onChange={(e) => setFilterCategory(e.target.value)}
                                                title="Filtrar por categoría"
                                            >
                                                <option value="Todos">Todas las categorías</option>
                                                {repoSettings.categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none group-hover:text-slate-600" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 mt-4 md:mt-0 md:pt-0 md:border-t-0 md:col-span-1">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/50 relative overflow-hidden h-full flex flex-col justify-center">
                                            <div className="hidden md:block lg:block absolute top-0 right-0 w-16 h-16 bg-blue-200/20 rounded-full -mr-6 -mt-6"></div>
                                            <h4 className="text-xs font-bold text-ue-blue uppercase mb-2 md:mb-3 relative z-10 font-outfit">Resumen</h4>
                                            <div className="flex justify-between items-center text-sm text-slate-600 mb-1 relative z-10">
                                                <span className="flex items-center gap-2"><LucideFile className="w-3 h-3 text-slate-400" /> Archivos</span>
                                                <span className="font-bold bg-white px-2 py-0.5 rounded text-ue-blue shadow-sm">{filteredDocs.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-slate-600 relative z-10">
                                                <span className="flex items-center gap-2"><Grid className="w-3 h-3 text-slate-400" /> Peso</span>
                                                <span className="font-bold">{(filteredDocs.length * 1.2).toFixed(1)} MB</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Files Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-transparent md:bg-white md:rounded-2xl md:shadow-xl md:shadow-slate-200/40 md:ring-1 md:ring-black/5 overflow-hidden">
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto min-h-[500px]">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-5 2xl:px-8 2xl:py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit">Documento</th>
                                            <th scope="col" className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-5 2xl:px-8 2xl:py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit">Categoría</th>
                                            <th scope="col" className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-5 2xl:px-8 2xl:py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell lg:table-cell font-outfit">Autor</th>
                                            <th scope="col" className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-5 2xl:px-8 2xl:py-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell font-outfit">Fecha</th>
                                            <th scope="col" className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-5 2xl:px-8 2xl:py-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-50">
                                        {filteredDocs.length > 0 ? filteredDocs.map((doc, idx) => (
                                            <tr
                                                key={doc.id}
                                                onClick={() => handleViewDetails(doc)}
                                                style={{ "--stagger-idx": idx } as React.CSSProperties}
                                                className="animate-slide-up animate-stagger hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-transparent transition-all duration-300 group cursor-pointer relative z-0 hover:z-10 hover:shadow-md hover:scale-[1.005] border-transparent border-l-4 hover:border-l-ue-blue"
                                            >
                                                <td className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-4 2xl:px-8 2xl:py-6">
                                                    <div className="flex items-center">
                                                        <div className="mr-3 lg:mr-4 relative">
                                                            <div className="relative z-10 transform transition-transform group-hover:scale-110">
                                                                <FileIcon type={doc.type} />
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-bold text-slate-800 mb-1 group-hover:text-ue-blue transition-colors truncate max-w-[200px] lg:max-w-[300px] xl:max-w-[400px]" title={doc.title}>{doc.title}</div>
                                                            <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200 group-hover:bg-white group-hover:border-slate-300 transition-colors shrink-0">{doc.level}</span>
                                                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                                                                <span className="hidden sm:inline truncate">{doc.area}</span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                                                                <span className="shrink-0">{doc.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-4 2xl:px-8 2xl:py-6 whitespace-nowrap">
                                                    <Badge color={doc.category === 'Oficial' ? 'red' : 'blue'}>{doc.category}</Badge>
                                                </td>
                                                <td className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-4 2xl:px-8 2xl:py-6 whitespace-nowrap text-sm text-slate-600 hidden md:table-cell lg:table-cell">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-white">
                                                            {doc.uploadedBy.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-slate-700">{doc.uploadedBy.split(' ')[0]}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-4 2xl:px-8 2xl:py-6 whitespace-nowrap text-sm text-slate-500 font-medium tabular-nums hidden xl:table-cell">
                                                    {doc.date}
                                                </td>
                                                <td className="px-4 py-3 lg:px-4 lg:py-4 xl:px-6 xl:py-4 2xl:px-8 2xl:py-6 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-all duration-200">
                                                        <button
                                                            className="text-slate-400 hover:text-ue-blue hover:bg-blue-50 transition-all p-2 rounded-lg hover:shadow-sm active:scale-95"
                                                            title="Ver Detalles"
                                                            onClick={(e) => { e.stopPropagation(); handleViewDetails(doc); }}
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            className="text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all p-2 rounded-lg hover:shadow-sm active:scale-95"
                                                            title="Descargar"
                                                            onClick={(e) => handleDownload(doc, e)}
                                                        >
                                                            <Download className="h-5 w-5" />
                                                        </button>
                                                        {user?.role === 'admin' && (
                                                            <button
                                                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all p-2 rounded-lg hover:shadow-sm active:scale-95"
                                                                title="Eliminar"
                                                                onClick={(e) => handleDelete(doc.id, doc.title, e)}
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-32 text-center text-slate-500">
                                                    <div className="flex flex-col items-center justify-center animate-fade-in">
                                                        <div className="bg-slate-50 p-6 rounded-full mb-4 ring-1 ring-slate-100 shadow-inner">
                                                            <Search className="h-10 w-10 text-slate-300" />
                                                        </div>
                                                        <h3 className="text-lg font-bold text-slate-800 mb-1 font-outfit">No se encontraron documentos</h3>
                                                        <p className="text-sm text-slate-400">Intenta ajustar los filtros o tu búsqueda</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Stacked Cards View */}
                            <div className="md:hidden space-y-4">
                                {filteredDocs.length > 0 ? (
                                    <>
                                        {filteredDocs.map((doc, idx) => (
                                            <div
                                                key={doc.id}
                                                style={{ "--stagger-idx": idx } as React.CSSProperties}
                                                className="bg-white rounded-2xl p-4 md:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-[0.98] transition-all hover:shadow-md relative overflow-hidden group animate-stagger"
                                                onClick={() => handleViewDetails(doc)}
                                            >
                                                {/* Left Accent */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-ue-blue rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                                {/* Card Header: Icon + Title + Menu */}
                                                <div className="flex items-start gap-4 mb-4 relative z-10">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <FileIcon type={doc.type} size="md" />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 pr-2">{doc.title}</h3>
                                                            {user?.role === 'admin' && (
                                                                <button
                                                                    className="text-slate-300 hover:text-red-500 p-2 -mr-2 -mt-2 rounded-full hover:bg-red-50 transition-colors"
                                                                    onClick={(e) => handleDelete(doc.id, doc.title, e)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                                                            <span className="uppercase">{doc.type}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                            <span>{doc.size}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tags Stack */}
                                                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                                                    <Badge color={doc.category === 'Oficial' ? 'red' : 'blue'}>{doc.category}</Badge>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                                                        {doc.area}
                                                    </span>
                                                </div>

                                                {/* Card Footer: Metadata + Actions */}
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                                            {doc.uploadedBy.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-slate-700">{doc.uploadedBy.split(' ')[0]}</span>
                                                            <span className="text-[10px] text-slate-400">{doc.date}</span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        onClick={(e) => handleDownload(doc, e)}
                                                    >
                                                        <Download className="h-3.5 w-3.5" /> Descargar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
                                        <Search className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                        <p className="font-medium text-sm">No se encontraron documentos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Details Modal */}
            <Modal
                isOpen={!!selectedDoc}
                onClose={() => setSelectedDoc(null)}
                title={selectedDoc?.title || 'Detalles del Documento'}
                noPadding
            >
                {selectedDoc && (
                    <div className="animate-fade-in">
                        {/* Premium Header */}
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-ue-blue p-8 md:p-12 pb-16 text-white relative overflow-hidden">
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ue-gold/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl animate-scale-in">
                                    <FileIcon type={selectedDoc.type} size="2xl" />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ue-gold text-ue-blue text-[10px] font-black uppercase tracking-[0.15em] mb-1 shadow-lg shadow-yellow-500/20 font-outfit">
                                        <span className={`w-2 h-2 rounded-full ${selectedDoc.category === 'Oficial' ? 'bg-red-500' : 'bg-ue-blue'}`}></span>
                                        {selectedDoc.category}
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black leading-tight tracking-tight drop-shadow-sm font-outfit">{selectedDoc.title}</h2>
                                    <p className="text-slate-300 text-sm font-bold bg-white/5 inline-block px-3 py-1 rounded-lg backdrop-blur">{selectedDoc.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="bg-white p-6 md:p-10 -mt-10 rounded-t-[2.5rem] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] space-y-10">
                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {[
                                    { label: 'Área', value: selectedDoc.area, icon: FolderOpen },
                                    { label: 'Nivel', value: selectedDoc.level, icon: Award },
                                    { label: 'Año Lectivo', value: selectedDoc.year, icon: Calendar },
                                    { label: 'Tamaño', value: selectedDoc.size, icon: FileText }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-ue-blue/20 hover:bg-blue-50/30 transition-all duration-300 group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-ue-light-blue group-hover:text-white transition-colors">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none font-outfit">{item.label}</label>
                                        </div>
                                        <p className="font-bold text-slate-800 text-lg md:text-xl pl-1">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Uploader Card */}
                            <div className="flex items-center justify-between p-6 rounded-3xl bg-blue-50/50 border border-blue-100 ring-1 ring-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-ue-blue text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-900/20 ring-4 ring-white">
                                        {selectedDoc.uploadedBy.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1 font-outfit">Subido por</p>
                                        <p className="text-base font-black text-slate-800 leading-none font-outfit">{selectedDoc.uploadedBy}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 font-outfit">Fecha de carga</p>
                                    <p className="text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">{selectedDoc.date}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button variant="outline" className="flex-1 py-4 h-14 sm:h-auto border-slate-200 hover:border-slate-300 font-bold text-slate-600 rounded-xl font-outfit" onClick={() => setSelectedDoc(null)}>
                                    Cerrar Detalles
                                </Button>
                                <Button className="flex-[2] py-4 h-14 sm:h-auto text-lg font-outfit" icon={Download} onClick={(e) => selectedDoc && handleDownload(selectedDoc, e)}>
                                    Descargar Archivo
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Upload Modal */}
            <Modal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                title="Subir Nuevo Documento"
            >
                <form onSubmit={handleUploadSubmit} className="space-y-8 animate-fade-in py-2">
                    <div className="space-y-6">
                        {/* Title Section */}
                        <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-ue-blue" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] font-outfit">Información General</span>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 ml-1 font-outfit">Título del Documento <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-ue-blue/10 focus:border-ue-blue transition-all outline-none font-bold text-slate-800 placeholder-slate-400 shadow-sm"
                                    placeholder="Ej. Planificación Curricular - Matemáticas"
                                    value={newDocData.title}
                                    onChange={(e) => setNewDocData({ ...newDocData, title: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2 ml-1 font-outfit">
                                        <Filter className="w-3.5 h-3.5 text-ue-gold" /> Categoría
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-ue-blue/10 focus:border-ue-blue transition-all outline-none appearance-none cursor-pointer font-bold text-slate-700 hover:border-slate-300 shadow-sm"
                                            value={newDocData.category}
                                            onChange={(e) => setNewDocData({ ...newDocData, category: e.target.value })}
                                            title="Seleccionar categoría"
                                        >
                                            {repoSettings.categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="h-4 w-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2 ml-1 font-outfit">
                                        <Calendar className="w-3.5 h-3.5 text-ue-gold" /> Año Lectivo
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-ue-blue/10 focus:border-ue-blue transition-all outline-none appearance-none cursor-pointer font-bold text-slate-700 hover:border-slate-300 shadow-sm"
                                            value={newDocData.year}
                                            onChange={(e) => setNewDocData({ ...newDocData, year: e.target.value })}
                                            title="Seleccionar año lectivo"
                                        >
                                            <option value="2026-2027">2026-2027</option>
                                            <option value="2025-2026">2025-2026</option>
                                            <option value="2024-2025">2024-2025</option>
                                            <option value="2023-2024">2023-2024</option>
                                        </select>
                                        <ChevronDown className="h-4 w-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2 ml-1 font-outfit">
                                        <Shield className="w-3.5 h-3.5 text-ue-gold" /> Nivel
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-ue-blue/10 focus:border-ue-blue transition-all outline-none appearance-none cursor-pointer font-bold text-slate-700 hover:border-slate-300 shadow-sm"
                                            value={newDocData.level}
                                            onChange={(e) => setNewDocData({ ...newDocData, level: e.target.value })}
                                            title="Seleccionar nivel académico"
                                        >
                                            {repoSettings.levels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="h-4 w-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2 ml-1 font-outfit">
                                        <Grid className="w-3.5 h-3.5 text-ue-gold" /> Área / Asignatura
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-ue-blue/10 focus:border-ue-blue transition-all outline-none appearance-none cursor-pointer font-bold text-slate-800 hover:border-slate-300 shadow-sm"
                                            value={newDocData.area}
                                            onChange={(e) => setNewDocData({ ...newDocData, area: e.target.value })}
                                            title="Seleccionar área / asignatura"
                                        >
                                            {repoSettings.areas.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="h-4 w-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Section */}
                        <div className="pt-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-3 ml-1 font-outfit">
                                <CloudUpload className="w-4 h-4 text-blue-600" /> Archivo del Documento <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-12 pb-12 border-2 border-slate-200 border-dashed rounded-[2.5rem] bg-slate-50 hover:bg-blue-50/50 hover:border-ue-blue hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 cursor-pointer relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-ue-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="space-y-4 text-center relative z-10">
                                    {newDocData.file ? (
                                        <div className="flex flex-col items-center animate-scale-in">
                                            <div className="h-20 w-20 text-green-600 bg-white rounded-3xl flex items-center justify-center mb-4 shadow-xl ring-1 ring-green-100 group-hover:rotate-12 transition-transform">
                                                <Check className="h-10 w-10" strokeWidth={3} />
                                            </div>
                                            <p className="text-lg font-black text-slate-900 leading-tight font-outfit">{newDocData.file.name}</p>
                                            <p className="text-[10px] text-slate-500 font-black tracking-widest bg-white/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-100 inline-block mt-2 uppercase">
                                                {(newDocData.file.size / 1024).toFixed(0)} KB • Listo para subir
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setNewDocData({ ...newDocData, file: null })}
                                                className="mt-6 text-xs text-red-500 font-bold hover:bg-red-50 px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 group/btn border border-transparent hover:border-red-100 shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" /> Cambiar Archivo
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-200/50 group-hover:scale-110 group-hover:shadow-blue-200/50 transition-all duration-500 ring-1 ring-slate-100 group-hover:ring-blue-200">
                                                <CloudUpload className="h-10 w-10 text-ue-blue animate-bounce" />
                                            </div>
                                            <div className="text-base text-slate-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer font-black text-ue-blue hover:text-blue-700 focus-within:outline-none transition-colors">
                                                    <span>Selecciona un documento</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt" />
                                                </label>
                                                <p className="mt-1 font-bold text-slate-400">o arrastra y suelta aquí</p>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 mt-4">
                                                {['PDF', 'DOCX', 'XLSX'].map((ext) => (
                                                    <span key={ext} className="text-[10px] font-black tracking-widest text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">{ext}</span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 mt-2">
                        <Button type="button" variant="outline" className="flex-1 py-4 h-14 sm:h-auto border-slate-200 hover:border-slate-300 font-bold text-slate-600 rounded-xl font-outfit" onClick={() => setIsUploadOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-[2] py-4 h-14 sm:h-auto text-xl font-outfit" icon={Upload}>
                            Subir Documento Ahora
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RepositoryPage;