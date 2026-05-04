import React, { useState, useMemo } from 'react';
import { ImageIcon, X, ChevronLeft, ChevronRight, Filter, ZoomIn, Download, Share2 } from 'lucide-react';
import { Button, Modal, Badge } from '../components/ui';
import { Link } from 'react-router-dom';

interface GalleryItem {
    id: number;
    url: string;
    title: string;
    category: 'Eventos' | 'Infraestructura' | 'Comunidad' | 'Académico';
    date: string;
    description: string;
}

const GALLERY_DATA: GalleryItem[] = [
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
        title: "Laboratorio de Ciencias",
        category: "Académico",
        date: "Septiembre 2025",
        description: "Prácticas experimentales en nuestro laboratorio equipado de última generación, fomentando el espíritu científico."
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2064&auto=format&fit=crop",
        title: "Fachada Institucional",
        category: "Infraestructura",
        date: "Agosto 2025",
        description: "Vista principal de nuestras instalaciones modernas y seguras en el corazón de Cayambe."
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
        title: "Graduación Promoción 2025",
        category: "Eventos",
        date: "Julio 2025",
        description: "Celebrando el éxito y el futuro profesional de nuestros nuevos bachilleres de la República."
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
        title: "Biblioteca 'El Saber'",
        category: "Infraestructura",
        date: "Junio 2025",
        description: "Espacios diseñados para la lectura, la investigación académica y el silencio creativo."
    },
    {
        id: 6,
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2104&auto=format&fit=crop",
        title: "Taller de Robótica",
        category: "Académico",
        date: "Mayo 2025",
        description: "Innovación y tecnología aplicada desde los primeros años de básica para los retos del mañana."
    },
    {
        id: 7,
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
        title: "Reunión de Padres",
        category: "Comunidad",
        date: "Abril 2025",
        description: "Fortaleciendo el vínculo entre familia e institución para el desarrollo integral del estudiante."
    },
    {
        id: 8,
        url: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=2070&auto=format&fit=crop",
        title: "Selección de Baloncesto",
        category: "Eventos",
        date: "Marzo 2025",
        description: "Fomentando el deporte, la salud y el trabajo en equipo en nuestra juventud competitiva."
    },
    {
        id: 9,
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
        title: "Sesión de Co-estudio",
        category: "Comunidad",
        date: "Enero 2026",
        description: "Estudiantes colaborando en proyectos de investigación en nuestras áreas comunes."
    },
    {
        id: 10,
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop",
        title: "Clase de Programación",
        category: "Académico",
        date: "Diciembre 2025",
        description: "Introducción a las ciencias de la computación y el pensamiento lógico desde temprana edad."
    },
    {
        id: 11,
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        title: "Tutoría Personalizada",
        category: "Académico",
        date: "Noviembre 2025",
        description: "Acompañamiento docente para asegurar que cada estudiante alcance su máximo potencial."
    },
    {
        id: 12,
        url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
        title: "Debate Institucional",
        category: "Comunidad",
        date: "Octubre 2025",
        description: "Desarrollando habilidades de oratoria y pensamiento crítico sobre temas de actualidad nacional."
    },
    {
        id: 13,
        url: "https://images.unsplash.com/photo-1523580494863-6f3031224691?q=80&w=2070&auto=format&fit=crop",
        title: "Huerto Escolar",
        category: "Académico",
        date: "Septiembre 2025",
        description: "Conexión directa con la tierra y aprendizaje práctico sobre biodiversidad y agricultura sostenible."
    }
];

const CATEGORIES = ['Todos', 'Eventos', 'Infraestructura', 'Comunidad', 'Académico'];

const GalleryPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const [isHovered, setIsHovered] = useState<number | null>(null);

    const filteredGallery = useMemo(() => {
        if (activeCategory === 'Todos') return GALLERY_DATA;
        return GALLERY_DATA.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    const handleNext = () => {
        if (!selectedImage) return;
        const currentData = activeCategory === 'Todos' ? GALLERY_DATA : filteredGallery;
        const currentIndex = currentData.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % currentData.length;
        setSelectedImage(currentData[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedImage) return;
        const currentData = activeCategory === 'Todos' ? GALLERY_DATA : filteredGallery;
        const currentIndex = currentData.findIndex(img => img.id === selectedImage.id);
        const prevIndex = (currentIndex - 1 + currentData.length) % currentData.length;
        setSelectedImage(currentData[prevIndex]);
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, activeCategory, filteredGallery]);

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            {/* Header Section */}
            <div className="container mx-auto px-4 lg:px-8 mb-12">
                <div className="max-w-3xl">
                    <span className="text-ue-blue font-bold uppercase tracking-[0.2em] text-[10px] md:text-sm mb-3 block animate-fade-in">
                        Memorias Institucionales
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 font-outfit mb-6 animate-title-reveal">
                        Galería de Momentos
                    </h1>
                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed animate-fade-in delay-200">
                        Un recorrido visual por la excelencia académica, el compromiso cultural y la vida estudiantil que define a nuestra unidad educativa.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="container mx-auto px-4 lg:px-8 mb-12 sticky top-24 z-40">
                <div className="bg-white/80 backdrop-blur-md p-2 md:p-3 border-2 border-slate-100 flex flex-wrap items-center gap-2 md:gap-4 shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                    <div className="px-3 py-2 text-slate-400 hidden md:block">
                        <Filter className="w-4 h-4" />
                    </div>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border-2 ${activeCategory === cat
                                ? 'bg-ue-blue text-ue-gold border-ue-blue shadow-lg scale-105'
                                : 'bg-transparent text-slate-600 border-transparent hover:border-slate-200 hover:bg-slate-50'
                                }`}
                            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)' }}
                        >
                            {cat}
                        </button>
                    ))}
                    <div className="ml-auto text-xs font-bold text-slate-400 pr-4 hidden lg:block uppercase tracking-widest">
                        {filteredGallery.length} Resultados
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGallery.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group relative bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up"
                            style={{
                                animationDelay: `${idx * 100}ms`,
                                animationFillMode: 'forwards',
                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)'
                            }}
                            onMouseEnter={() => setIsHovered(item.id)}
                            onMouseLeave={() => setIsHovered(null)}
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="aspect-[4/3] md:aspect-square lg:aspect-[4/5] overflow-hidden relative">
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-4 left-4 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <Badge className="bg-ue-gold text-ue-blue font-black uppercase text-[10px] tracking-widest !rounded-none py-1.5 px-3 border-0">
                                        {item.category}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 text-left">
                                    <div className="w-12 h-1 bg-ue-gold mb-4 group-hover:w-24 transition-all duration-700"></div>
                                    <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">{item.date}</p>
                                    <h3 className="text-white text-xl md:text-2xl font-black font-outfit uppercase truncate leading-tight">
                                        {item.title}
                                    </h3>
                                    <div className="mt-4 flex items-center gap-2 text-ue-gold font-bold text-xs uppercase tracking-widest">
                                        Explorar momento <ZoomIn className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredGallery.length === 0 && (
                <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-slate-100 flex items-center justify-center mx-auto mb-6" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}>
                        <ImageIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-outfit mb-2">No se encontraron momentos</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Prueba seleccionando otra categoría para ver nuestras memorias institucionales.</p>
                    <Button variant="outline" className="mt-8 !rounded-none" onClick={() => setActiveCategory('Todos')}>
                        Ver toda la galería
                    </Button>
                </div>
            )}

            {/* Footer Bottom Link */}
            <div className="container mx-auto px-4 mt-20 text-center">
                <Link to="/" className="inline-flex items-center gap-2 text-ue-blue font-bold uppercase tracking-widest text-xs hover:text-ue-gold transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Volver al Inicio
                </Link>
            </div>

            {/* Fullscreen Image Modal - ENHANCED PREMIUM DESIGN */}
            {selectedImage && (
                <Modal
                    isOpen={!!selectedImage}
                    onClose={() => setSelectedImage(null)}
                    title={selectedImage.title}
                    maxWidth="max-w-6xl"
                >
                    <div className="relative group/modal overflow-hidden min-h-[500px]">
                        {/* Immersive Background Blur (Subtle) */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            <img src={selectedImage.url} className="w-full h-full object-cover blur-3xl scale-150" alt="" />
                        </div>

                        {/* Image Counter & Meta (Top) */}
                        <div className="flex justify-between items-center mb-6 relative z-10 px-1">
                            <div className="flex items-center gap-3">
                                <span className="bg-ue-gold/20 text-ue-blue px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-ue-gold/30">
                                    {(activeCategory === 'Todos' ? GALLERY_DATA : filteredGallery).findIndex(img => img.id === selectedImage.id) + 1} / {(activeCategory === 'Todos' ? GALLERY_DATA : filteredGallery).length}
                                </span>
                                <Badge className="bg-ue-blue text-ue-gold font-black uppercase text-[10px] tracking-widest !rounded-none py-1 px-4 shadow-sm border-0">
                                    {selectedImage.category}
                                </Badge>
                            </div>
                            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                                <div className="w-8 h-[1px] bg-slate-200"></div> {selectedImage.date}
                            </span>
                        </div>

                        {/* Main Image View - Cinematic Container */}
                        <div className="bg-slate-950 p-1 md:p-2 border-2 border-slate-200 shadow-2xl relative z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}>
                            <div className="relative aspect-[16/9] md:aspect-[4/3] lg:aspect-video flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-slate-900 via-slate-950 to-slate-950">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    key={selectedImage.id}
                                    className="max-w-full max-h-full object-contain animate-scale-reveal transition-all duration-700 ease-out-expo"
                                />

                                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] pointer-events-none"></div>

                                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        className="w-14 h-14 bg-black/20 hover:bg-ue-gold hover:text-ue-blue text-white backdrop-blur-xl transition-all duration-500 flex items-center justify-center group-hover/modal:opacity-100 opacity-0 transform -translate-x-4 group-hover/modal:translate-x-0 pointer-events-auto border border-white/10 hover:border-ue-gold shadow-2xl"
                                        style={{ clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%, 0 6px)' }}
                                        title="Anterior"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        className="w-14 h-14 bg-black/20 hover:bg-ue-gold hover:text-ue-blue text-white backdrop-blur-xl transition-all duration-500 flex items-center justify-center group-hover/modal:opacity-100 opacity-0 transform translate-x-4 group-hover/modal:translate-x-0 pointer-events-auto border border-white/10 hover:border-ue-gold shadow-2xl"
                                        style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
                                        title="Siguiente"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Details Panel */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-10 p-1 relative z-10 text-left">
                            <div className="lg:col-span-3">
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit uppercase tracking-tighter mb-4 leading-none">
                                    {selectedImage.title}
                                </h2>
                                <div className="h-1 bg-gradient-to-r from-ue-gold via-ue-blue to-transparent w-32 mb-6"></div>
                                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-light">
                                    {selectedImage.description}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="p-1 bg-slate-50 border border-slate-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                                    <button className="w-full h-14 bg-ue-blue text-white font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-[0.98]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                                        <Download className="w-4 h-4 text-ue-gold" /> Descargar
                                    </button>
                                    <button className="w-full h-14 bg-white text-slate-900 mt-1 border border-slate-200 font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}>
                                        <Share2 className="w-4 h-4 text-ue-blue" /> Compartir
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="w-full h-14 bg-slate-100 text-slate-500 font-black uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:bg-red-50 hover:text-red-600 transition-all active:scale-[0.98] border border-transparent hover:border-red-100"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)' }}
                                >
                                    <X className="w-4 h-4" /> Cerrar Galería
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default GalleryPage;
