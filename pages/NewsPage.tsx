import React, { useState, useMemo } from 'react';
import { MOCK_NEWS } from '../constants';
import { Card, Badge, Button, Modal } from '../components/ui';
import { NewsItem } from '../types';
import { Clock, Award, ChevronRight, Filter, Calendar, TrendingUp } from 'lucide-react';

const NewsPage: React.FC = () => {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('todas');
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(MOCK_NEWS.map(item => item.category)));
        return ['todas', ...cats];
    }, []);

    // Filter news by category
    const filteredNews = useMemo(() => {
        if (activeCategory === 'todas') return MOCK_NEWS;
        return MOCK_NEWS.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* Header Section - Minimalist with Animations */}
                <div className="mb-12 md:mb-16">
                    {/* Animated Label */}
                    <div className="flex items-center gap-3 mb-4 overflow-hidden">
                        <div className="h-1 bg-ue-gold animate-line-reveal origin-left" style={{ width: '48px' }}></div>
                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase animate-title-reveal delay-100">
                            Mantente Informado
                        </span>
                    </div>

                    {/* Animated Title */}
                    <div className="overflow-visible mb-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 font-outfit leading-[1.1] animate-title-reveal delay-150">
                            Noticias y Comunicados
                        </h1>
                    </div>

                    {/* Animated Subtitle with Underline */}
                    <div className="relative w-fit animate-title-reveal delay-200">
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl font-medium pb-3">
                            Descubre las últimas novedades y eventos de nuestra comunidad educativa
                        </p>
                        <div className="h-[2px] bg-gradient-to-r from-ue-gold to-transparent w-full origin-left animate-line-reveal delay-300"></div>
                    </div>
                </div>

                {/* Category Filter - Sharp Minimal */}
                <div className="mb-10 md:mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Filtrar por categoría</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="px-5 py-2.5 text-sm font-bold border-2 transition-all duration-300 uppercase tracking-wide cursor-pointer"
                                style={{
                                    borderColor: activeCategory === cat ? '#003366' : 'rgba(0,0,0,0.08)',
                                    background: activeCategory === cat ? '#003366' : 'white',
                                    color: activeCategory === cat ? '#eab308' : '#6b7280',
                                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
                                    transform: activeCategory === cat ? 'translateY(-2px)' : 'translateY(0)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-500 font-medium">
                        {filteredNews.length} {filteredNews.length === 1 ? 'noticia' : 'noticias'}
                    </div>
                </div>

                {/* News Grid - Sharp Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredNews.map((item, idx) => (
                        <div
                            key={item.id}
                            className="flex flex-col h-full bg-white border-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            style={{
                                borderColor: hoveredCard === idx ? '#003366' : 'rgba(0,0,0,0.06)',
                                transform: hoveredCard === idx ? 'translateY(-6px)' : 'translateY(0)',
                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'
                            }}
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setSelectedNews(item)}
                        >
                            {/* Image Section */}
                            <div className="h-48 md:h-56 lg:h-64 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 transition-opacity duration-300"
                                    style={{ opacity: hoveredCard === idx ? 0.5 : 0.7 }}
                                ></div>

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-20">
                                    <span
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-black backdrop-blur-md border-2 border-white/20 text-white uppercase tracking-wider"
                                        style={{
                                            background: 'rgba(255,255,255,0.15)',
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)'
                                        }}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                {/* Stats Badge */}
                                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold backdrop-blur-md border border-white/20 text-white"
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)'
                                        }}
                                    >
                                        <TrendingUp className="w-3 h-3" />
                                        Popular
                                    </span>
                                </div>

                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    style={{
                                        transform: hoveredCard === idx ? 'scale(1.08)' : 'scale(1)'
                                    }}
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-6 md:p-7 flex-grow flex flex-col">
                                {/* Date */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                                        {item.date}
                                    </span>
                                    <div className="flex-1 h-[1px] bg-gray-100 ml-2"></div>
                                </div>

                                {/* Title */}
                                <h2
                                    className="text-xl md:text-2xl font-black text-gray-900 mb-3 leading-tight line-clamp-2 font-outfit transition-colors duration-200"
                                    style={{
                                        color: hoveredCard === idx ? '#003366' : '#111827'
                                    }}
                                >
                                    {item.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-gray-600 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed flex-grow font-medium">
                                    {item.excerpt}
                                </p>

                                {/* Read More Button */}
                                <div className="mt-auto pt-5 border-t border-gray-100">
                                    <button
                                        className="w-full flex items-center justify-between px-5 py-3 text-sm font-bold border-2 transition-all duration-300 group/btn cursor-pointer"
                                        style={{
                                            borderColor: hoveredCard === idx ? '#003366' : 'rgba(0,0,0,0.08)',
                                            background: hoveredCard === idx ? '#003366' : 'white',
                                            color: hoveredCard === idx ? '#eab308' : '#6b7280',
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedNews(item);
                                        }}
                                    >
                                        <span className="uppercase tracking-wider">Leer Completa</span>
                                        <ChevronRight
                                            className="w-4 h-4 transition-transform duration-300"
                                            style={{
                                                transform: hoveredCard === idx ? 'translateX(4px)' : 'translateX(0)'
                                            }}
                                        />
                                    </button>
                                </div>

                                {/* Hover Indicator */}
                                <div
                                    className="mt-3 h-[2px] bg-ue-gold transition-all duration-300"
                                    style={{
                                        width: hoveredCard === idx ? '100%' : '0%'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Modal - Sharp Minimalist */}
            <Modal
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
                title="Noticia Completa"
                noPadding
            >
                {selectedNews && (
                    <div className="animate-fade-in pb-4">
                        {/* Hero Image */}
                        <div className="relative h-72 md:h-[450px] overflow-hidden">
                            <img
                                src={selectedNews.image}
                                alt={selectedNews.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                            {/* Hero Content */}
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                                {/* Category Badge */}
                                <span
                                    className="inline-flex items-center px-4 py-2 text-xs font-black mb-5 border-2 border-ue-gold text-ue-gold uppercase tracking-wider shadow-lg"
                                    style={{
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(12px)',
                                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)'
                                    }}
                                >
                                    {selectedNews.category}
                                </span>

                                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight drop-shadow-lg font-outfit">
                                    {selectedNews.title}
                                </h2>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white border border-white/10"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(12px)',
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)'
                                        }}
                                    >
                                        <Clock className="w-4 h-4 text-ue-gold" />
                                        {selectedNews.date}
                                    </span>
                                    <span
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white border border-white/10"
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(12px)',
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)'
                                        }}
                                    >
                                        <Award className="w-4 h-4 text-ue-gold" />
                                        UECIB GAB
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="p-8 md:p-12 bg-white space-y-8">
                            {/* Excerpt Highlight */}
                            <div className="relative pl-6">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-ue-gold"></div>
                                <p className="text-xl md:text-2xl text-slate-700 font-bold leading-relaxed">
                                    {selectedNews.excerpt}
                                </p>
                            </div>

                            {/* Main Content */}
                            <div className="prose prose-slate max-w-none">
                                <div className="text-slate-600 leading-[1.8] space-y-6 text-base md:text-lg font-medium">
                                    {selectedNews.content}
                                    <p>
                                        En la Unidad Educativa Comunitaria Intercultural Bilingüe "Gustavo Adolfo Bécquer", nos comprometemos con el desarrollo integral de nuestros estudiantes, integrando la tecnología y los valores ancestrales para formar ciudadanos globales con identidad propia.
                                    </p>

                                    {/* Quote Block */}
                                    <div
                                        className="p-8 border-l-4 border-ue-gold bg-gray-50 text-slate-600 text-base md:text-lg italic my-8"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                        }}
                                    >
                                        <p className="mb-3">"La educación es el arma más poderosa que puedes usar para cambiar el mundo."</p>
                                        <p className="text-sm font-bold text-gray-500 not-italic">— Nelson Mandela</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-8 border-t-2 border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-slate-400 text-xs font-medium">
                                    © {new Date().getFullYear()} Departamento de Comunicación
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="px-10 py-3.5 text-base font-bold border-2 border-ue-blue bg-ue-blue text-ue-gold hover:bg-ue-dark-blue transition-all duration-300 w-full sm:w-auto uppercase tracking-wide cursor-pointer"
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                    }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NewsPage;