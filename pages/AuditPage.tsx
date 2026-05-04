import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { AuditService } from '../services/auditService';
import { AuditLogEntry } from '../types';
import { Card, Badge, Button } from '../components/ui';
import { Shield, Clock, User, FileText, Download, Trash2, Eye, Upload, Filter, Search, RotateCcw } from 'lucide-react';

const AuditPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Security check
        if (!user || user.role !== 'admin') {
            navigate('/repositorio');
            return;
        }
        setLogs(AuditService.getLogs());
    }, [user, navigate]);

    const handleClearLogs = () => {
        if (window.confirm("¿Está seguro de limpiar todo el historial de auditoría?")) {
            AuditService.clearLogs();
            setLogs([]);
        }
    }

    const filteredLogs = logs.filter(log =>
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ActionIcon = ({ action }: { action: string }) => {
        switch (action) {
            case 'UPLOAD': return <Upload className="h-4 w-4 text-green-600" />;
            case 'DELETE': return <Trash2 className="h-4 w-4 text-red-600" />;
            case 'DOWNLOAD': return <Download className="h-4 w-4 text-blue-600" />;
            case 'VIEW': return <Eye className="h-4 w-4 text-slate-600" />;
            default: return <FileText className="h-4 w-4 text-gray-500" />;
        }
    }

    const ActionBadge = ({ action }: { action: string }) => {
        let color = 'gray';
        if (action === 'UPLOAD') color = 'green';
        if (action === 'DELETE') color = 'red';
        if (action === 'DOWNLOAD') color = 'blue';
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold border uppercase tracking-wider
                ${color === 'green' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                ${color === 'red' ? 'bg-red-50 text-red-700 border-red-100' : ''}
                ${color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                ${color === 'gray' ? 'bg-slate-50 text-slate-600 border-slate-200' : ''}
            `}>
                <ActionIcon action={action} />
                {action}
            </span>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
                <div className="container mx-auto px-4 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3 font-outfit">
                                <Shield className="h-6 w-6 text-ue-gold" />
                                Auditoría del Sistema
                            </h1>
                            <p className="text-sm text-slate-400 mt-1 ml-9">
                                Registro de actividades y seguridad documental
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => setLogs(AuditService.getLogs())} variant="outline" className="text-white hover:text-ue-blue border-white/20 hover:bg-white/10">
                                <RotateCcw className="h-4 w-4 mr-2" /> Actualizar
                            </Button>
                            <Button onClick={handleClearLogs} variant="danger">
                                Limpiar Registros
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 animate-fade-in">
                <Card noPadding className="shadow-xl shadow-slate-200/50 ring-1 ring-black/5">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 bg-white sticky top-20 z-20 flex gap-4 items-center">
                        <div className="relative flex-grow max-w-md">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-ue-blue focus:border-ue-blue transition-all outline-none"
                                placeholder="Buscar por usuario, acción o detalles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="text-sm text-slate-500 font-medium ml-auto">
                            Mostrando {filteredLogs.length} registros
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Hora</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 tabular-nums">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${log.userRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {log.userName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700 leading-none">{log.userName}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase">{log.userRole}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ActionBadge action={log.action} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {log.details}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            No se encontraron registros de auditoría
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AuditPage;
