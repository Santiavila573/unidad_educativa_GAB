import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Calendar, Award, GraduationCap, ChevronLeft, ChevronRight, PlayCircle, Clock, Heart, Lightbulb, Trophy, Smile, Sparkles, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import { MOCK_NEWS } from '../constants';
import { Button, Card, Badge, Modal } from '../components/ui';
import { NewsItem } from '../types';

const HERO_SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
        title: "Excelencia Educativa",
        subtitle: "Formando líderes con identidad cultural"
    },
    {
        image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2064&auto=format&fit=crop",
        title: "Innovación Tecnológica",
        subtitle: "Aulas equipadas para el futuro digital"
    },
    {
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
        title: "Comunidad Unida",
        subtitle: "Valores que transforman la sociedad"
    },
    {
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
        title: "Ambientes de Aprendizaje",
        subtitle: "Espacios diseñados para la creatividad"
    }
];

// Helper Component for Number Animation
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string; prefix?: string }> = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (nodeRef.current) {
            observer.observe(nodeRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const framesPerSecond = 60;
        const totalFrames = Math.round((duration / 1000) * framesPerSecond);
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Easing function: easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeProgress * end));

            if (frame === totalFrames) {
                setCount(end);
                clearInterval(timer);
            }
        }, 1000 / framesPerSecond);

        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return <span ref={nodeRef}>{prefix}{count}{suffix}</span>;
};

const FEATURED_GALLERY = [
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", alt: "Liderazgo y Enseñanza", subtitle: "Institucional" },
    { url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop", alt: "Estudio de Valores" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop", alt: "Aprendizaje Activo" },
    { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop", alt: "Mentoría Digital" },
    { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", alt: "Cosecha de Valores" }
];

const HomePage: React.FC = () => {
    const recentNews = MOCK_NEWS.slice(0, 3);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [selectedCardModal, setSelectedCardModal] = useState<number | null>(null);
    const [selectedCurriculum, setSelectedCurriculum] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const handleNextImage = () => {
        if (!selectedImage) return;
        const currentIndex = FEATURED_GALLERY.findIndex(img => img.url === selectedImage.url);
        const nextIndex = (currentIndex + 1) % FEATURED_GALLERY.length;
        setSelectedImage(FEATURED_GALLERY[nextIndex]);
    };

    const handlePrevImage = () => {
        if (!selectedImage) return;
        const currentIndex = FEATURED_GALLERY.findIndex(img => img.url === selectedImage.url);
        const prevIndex = (currentIndex - 1 + FEATURED_GALLERY.length) % FEATURED_GALLERY.length;
        setSelectedImage(FEATURED_GALLERY[prevIndex]);
    };

    // Keyboard navigation for gallery
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;
            if (e.key === 'ArrowRight') handleNextImage();
            if (e.key === 'ArrowLeft') handlePrevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);
    const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

    const CURRICULUM_DATA = [
        {
            level: "Educación Inicial",
            title: "Simulación de Malla Curricular - Inicial",
            areas: [
                { icon: Smile, name: "Identidad y Autonomía", skills: ["Reconocimiento personal", "Expresión de emociones", "Hábitos de higiene"] },
                { icon: Sparkles, name: "Descubrimiento Natural", skills: ["Exploración sensorial", "Cuidado del entorno", "Fenómenos naturales"] },
                { icon: Heart, name: "Convivencia Social", skills: ["Respeto a normas", "Integración grupal", "Valores comunitarios"] },
                { icon: GraduationCap, name: "Lenguaje y Kichwa", skills: ["Comunicación lúdica", "Vocabulario básico", "Cantos ancestrales"] }
            ]
        },
        {
            level: "Educación Básica",
            title: "Plan de Estudios - Básica Superior",
            areas: [
                { icon: BookOpen, name: "Lengua y Literatura", skills: ["Comprensión lectora", "Gramática avanzada", "Escritura creativa"] },
                { icon: Trophy, name: "Estructura Lógica", skills: ["Resolución de problemas", "Geometría aplicada", "Cálculo mental"] },
                { icon: Lightbulb, name: "Ciencia y Entorno", skills: ["Física elemental", "Biología aplicada", "Ecología y reciclaje"] },
                { icon: Clock, name: "Realidad Nacional", skills: ["Historia del Ecuador", "Ciudadanía y Derechos", "Geografía política"] }
            ]
        },
        {
            level: "Bachillerato",
            title: "Bachillerato General Unificado (BGU)",
            areas: [
                { icon: Award, name: "Tronco Común", skills: ["Análisis matemático", "Literatura universal", "Química superior"] },
                { icon: CheckCircle2, name: "Emprendimiento", skills: ["Gestión de proyectos", "Contabilidad básica", "Ética profesional"] },
                { icon: GraduationCap, name: "Academia Avanzada", skills: ["Metodología de investigación", "Redacción académica", "Preparación superior"] },
                { icon: Sparkles, name: "Identidad Bilingüe", skills: ["Cosmovisión Andina", "Derechos colectivos", "Lengua Kichwa (Avanzado)"] }
            ]
        }
    ];

    useEffect(() => {
        setIsLoaded(true);

        // Generate random particles for decoration
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 4
        }));
        setParticles(newParticles);
    }, []);

    // Mouse tracking effect for parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Keyboard navigation for slider
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
                setIsAutoPlayPaused(true); // Pause autoplay on manual interaction
                setTimeout(() => setIsAutoPlayPaused(false), 10000); // Resume after 10s
            } else if (e.key === 'ArrowRight') {
                setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                setIsAutoPlayPaused(true); // Pause autoplay on manual interaction
                setTimeout(() => setIsAutoPlayPaused(false), 10000); // Resume after 10s
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Autoplay slider
    useEffect(() => {
        if (isAutoPlayPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlayPaused]);

    return (
        <div className="space-y-20 pb-16 bg-gray-50/50">
            {/* Modern Interactive Hero Section - Cinematic Enhancement with Premium Controls */}
            <div ref={heroRef} className="relative h-[85vh] md:h-[90vh] lg:h-screen min-h-[600px] flex items-start overflow-hidden bg-slate-900">
                {/* Background Slider with Parallax Zoom */}
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${index === currentSlide ? 'opacity-100 scale-100 visible z-10' : 'opacity-0 scale-105 invisible z-0'
                            }`}
                        style={{ transitionProperty: 'opacity, transform, visibility' }}
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className={`w-full h-full object-cover ${index === currentSlide ? 'animate-ken-burns' : ''
                                    }`}
                                style={{
                                    willChange: 'transform',
                                    transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`
                                }}
                            />
                        </div>
                        {/* Dynamic Cinematic Gradient Overlays - Darker on mobile for text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-ue-dark-blue/95 sm:from-ue-dark-blue/90 via-ue-dark-blue/40 to-transparent mix-blend-multiply"></div>

                        {/* Animated Light Streaks */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[120%] bg-white/5 rotate-12 blur-[120px] animate-pulse-slow"></div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[100%] bg-ue-gold/5 -rotate-12 blur-[100px] animate-pulse-slow delay-700"></div>
                        </div>
                    </div>
                ))}

                {/* Decorative Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute w-1 h-1 bg-ue-gold/40 rounded-full animate-sparkle"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                animationDelay: `${particle.delay}s`
                            }}
                        />
                    ))}
                </div>

                {/* Premium Navigation Arrows - Desktop */}
                <button
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                    className="hidden lg:flex absolute left-4 xl:left-8 2xl:left-12 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-14 h-14 rounded-full glass-effect-dark hover:bg-white/20 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group hover:scale-110 active:scale-95"
                    aria-label="Slide anterior"
                >
                    <svg className="w-6 h-6 text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                    className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-14 h-14 rounded-full glass-effect-dark hover:bg-white/20 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) group hover:scale-110 active:scale-95"
                    aria-label="Siguiente slide"
                >
                    <svg className="w-6 h-6 text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Pagination Dots - Premium Glassmorphism - Optimized positioning */}
                <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-10 xl:bottom-24 2xl:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-3 rounded-full glass-effect-dark">
                    {HERO_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) rounded-full ${index === currentSlide
                                ? 'w-12 h-3 bg-white/80'
                                : 'w-3 h-3 bg-white/40 hover:bg-white/60 hover:scale-125'
                                }`}
                            aria-label={`Ir a slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Content Container - Animated per slide - Enhanced Positioning with optimized spacing */}
                <div className="container mx-auto px-4 lg:px-24 xl:px-28 2xl:px-32 relative z-20 h-full flex flex-col justify-center lg:justify-center">
                    <div className="w-full pt-28 sm:pt-32 md:pt-40 lg:pt-44 xl:pt-56 2xl:pt-72 pb-20 sm:pb-24 md:pb-32 lg:pb-52 xl:pb-64 2xl:pb-72">
                        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-12 xl:col-span-9 2xl:col-span-8">
                                {/* Fixed height container to maintain consistent vertical positioning across all slides */}
                                <div className="flex flex-col" key={currentSlide}>
                                    <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 2xl:space-y-8">
                                        {/* Cinematic Title Reveal - Flexible height - TEXT INCREASED FOR MOBILE */}
                                        <div className="overflow-visible min-h-[auto] mb-2 flex flex-col justify-end items-start py-2">
                                            <div className="relative inline-block">
                                                {/* Background Bar with Unfolding Effect */}
                                                <div className="absolute inset-0 bg-ue-blue/90 skew-x-[-10deg] animate-bar-expand origin-left shadow-lg border-l-4 border-white/40"></div>
                                                <h1 className="relative z-10 px-6 sm:px-8 py-2 text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white leading-[1.1] tracking-wide animate-title-reveal delay-100 font-outfit drop-shadow-lg">
                                                    {HERO_SLIDES[currentSlide].title}
                                                </h1>
                                            </div>
                                        </div>

                                        {/* Subtitle with line reveal - Flexible height container - TEXT INCREASED, PADDING OPTIMIZED */}
                                        {/* Minimalist Subtitle with Discrete Underline Reveal */}
                                        <div className="relative w-fit mt-2 mb-2 2xl:mt-4 2xl:mb-6">
                                            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-white font-light leading-tight animate-title-reveal delay-200 font-outfit tracking-wide drop-shadow-md pb-3 2xl:pb-5">
                                                {HERO_SLIDES[currentSlide].subtitle}
                                            </p>
                                            <div className="h-[1px] 2xl:h-[2px] bg-white/60 w-full origin-left animate-line-reveal shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                                        </div>

                                        {/* Action Buttons - Auto height container - LARGER TOUCH TARGETS */}
                                        <div className="h-auto flex items-start pt-3 sm:pt-4">
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-title-reveal delay-300 w-full">
                                                {/* Botón Explorar Historia */}
                                                <Link to="/institucional" className="group/btn">
                                                    <Button
                                                        variant="secondary"
                                                        className="!rounded-none w-full sm:w-auto h-14 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base font-black transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-sm hover:shadow-sm font-outfit uppercase tracking-[0.15em] bg-white text-ue-blue border border-transparent hover:bg-ue-light-blue hover:border-ue-light-blue hover:text-white"
                                                    >
                                                        Explorar Historia
                                                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                                                    </Button>
                                                </Link>

                                                {/* Botón Oferta Académica — con los mismos estilos de hover que Explorar Historia */}
                                                <Link to="/oferta" className="group/btn">
                                                    <Button
                                                        variant="secondary" // Cambiado a "secondary" para coherencia visual
                                                        className="!rounded-none w-full sm:w-auto h-14 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base font-black transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-sm hover:shadow-sm font-outfit uppercase tracking-[0.15em] bg-white text-ue-blue border border-transparent hover:bg-ue-light-blue hover:border-ue-light-blue hover:text-white"
                                                    >
                                                        <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                                                        Oferta Académica
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side spacer */}
                            <div className="hidden xl:block xl:col-span-3">
                                {/* Reserved for future content */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator - Enhanced positioning to avoid overlaps */}
                <div className="hidden xl:flex 2xl:hidden absolute bottom-10 sm:bottom-12 md:bottom-14 left-1/2 transform -translate-x-1/2 flex-col items-center gap-2 animate-float opacity-60 hover:opacity-100 z-20 transition-all duration-500">
                    <span className="text-[10px] md:text-xs text-white uppercase tracking-widest font-light animate-fade-in delay-1000" style={{ animationFillMode: 'forwards', opacity: 0 }}>Explorar</span>
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 animate-fade-in delay-1000" style={{ animationFillMode: 'forwards', opacity: 0 }}>
                        <div className="w-1 h-2 bg-white rounded-full animate-smooth-bounce"></div>
                    </div>
                </div>

                {/* Bottom Curve/Fade */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-gray-50/50 to-transparent z-10"></div>
            </div>

            {/* Floating Cards Section - Ultra Minimal */}
            <div className="container mx-auto px-4 lg:px-8 -mt-16 sm:-mt-20 md:-mt-32 relative z-30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { icon: BookOpen, title: "Modelo Pedagógico", desc: "Constructivista", color: "ue-blue", delay: 0 },
                        { icon: Users, title: "Comunidad", desc: "Docentes Expertos", color: "ue-gold", delay: 100 },
                        { icon: Calendar, title: "Agenda", desc: "Cronograma 2026", color: "ue-blue", delay: 200 },
                        { icon: Award, title: "Certificación", desc: "Aval MINEDUC", color: "ue-gold", delay: 300 }
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white/98 backdrop-blur-sm p-5 md:p-6 shadow-md border-2 transition-all duration-300 ease-out hover:shadow-lg group cursor-pointer flex items-center gap-4 md:block animate-fade-in-up opacity-0"
                            style={{
                                animationDelay: `${item.delay}ms`,
                                animationFillMode: 'forwards',
                                borderColor: hoveredCard === idx ? (item.color === 'ue-blue' ? '#003366' : '#eab308') : 'rgba(0,0,0,0.06)',
                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
                                transform: hoveredCard === idx ? 'translateY(-4px)' : 'translateY(0)'
                            }}
                            onMouseEnter={() => setHoveredCard(idx)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setSelectedCardModal(idx)}
                        >
                            {/* Subtle Border Accent */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{
                                    background: `linear-gradient(135deg, ${item.color === 'ue-blue' ? 'rgba(0,51,102,0.02)' : 'rgba(234,179,8,0.02)'}, transparent)`,
                                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                }}
                            />

                            <div className="relative z-10 flex items-center gap-3 md:gap-4 mb-0 md:mb-3 shrink-0">
                                {/* Icon - Minimal Animation */}
                                <div
                                    className={`p-3 md:p-3 ${item.color === 'ue-blue' ? 'bg-blue-50 text-ue-blue' : 'bg-amber-50 text-ue-gold'} border border-current/10 transition-all duration-300`}
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)',
                                        transform: hoveredCard === idx ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <item.icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>

                                {/* Minimal Decorative Line */}
                                <div className="hidden md:block relative h-[1px] transition-all duration-300">
                                    <div
                                        className="h-full bg-gray-200 transition-all duration-500"
                                        style={{
                                            width: hoveredCard === idx ? '64px' : '32px'
                                        }}
                                    />
                                    <div
                                        className="absolute top-0 left-0 h-full transition-all duration-500"
                                        style={{
                                            width: hoveredCard === idx ? '64px' : '0px',
                                            background: item.color === 'ue-blue' ? '#003366' : '#eab308'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3
                                    className="font-bold text-gray-900 text-sm md:text-lg leading-tight font-outfit mb-1 transition-colors duration-200"
                                    style={{
                                        color: hoveredCard === idx ? (item.color === 'ue-blue' ? '#003366' : '#d97706') : '#111827'
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 font-medium">
                                    {item.desc}
                                </p>

                                {/* Minimal Hover Indicator */}
                                <div
                                    className="mt-2 h-[1px] transition-all duration-300"
                                    style={{
                                        width: hoveredCard === idx ? '100%' : '0%',
                                        background: item.color === 'ue-blue' ? '#003366' : '#eab308'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Academic Highlights Section - NEW */}
            <div className="container mx-auto px-4 lg:px-8 py-10">
                <div className="text-center mb-12 animate-fade-in">
                    <span className="text-ue-blue font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Nuestra Oferta</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit mb-4">Formación por Niveles</h2>
                    <div className="h-1.5 w-24 bg-ue-gold mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            level: "Educación Inicial",
                            title: "Primeros Pasos",
                            desc: "Desarrollo integral y estimulación temprana con identidad cultural.",
                            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop",
                            features: ["Rincones de aprendizaje", "Docentes parvularios", "Kichwa lúdico"]
                        },
                        {
                            level: "Educación Básica",
                            title: "Cimientos del Saber",
                            desc: "Fortaleciendo conocimientos y valores en un entorno bicultural.",
                            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2104&auto=format&fit=crop",
                            features: ["Inglés interactivo", "Laboratorios móviles", "Arte y Cultura"]
                        },
                        {
                            level: "Bachillerato",
                            title: "Futuro Profesional",
                            desc: "Preparación académica rigurosa para la educación superior.",
                            image: "https://images.unsplash.com/photo-1523050335456-c940c6d9692c?q=80&w=2070&auto=format&fit=crop",
                            features: ["Orientación vocacional", "Gestión de proyectos", "Liderazgo comunitario"]
                        }
                    ].map((item, idx) => (
                        <Card
                            key={idx}
                            noPadding
                            className="group !rounded-none overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                        >
                            <div className="h-56 overflow-hidden relative">
                                <img src={item.image} alt={item.level} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <Badge className="bg-ue-gold text-ue-blue font-bold uppercase text-[10px] tracking-widest !rounded-none">{item.level}</Badge>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                                <ul className="space-y-2 mb-8">
                                    {item.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                            <CheckCircle2 className="w-4 h-4 text-ue-blue" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="outline"
                                    className="w-full group-hover:bg-ue-light-blue group-hover:text-white transition-colors py-6 !rounded-none"
                                    onClick={() => setSelectedCurriculum(idx)}
                                >
                                    Ver Malla Curricular
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Institutional Pillars - Iconic Section */}
            <div className="bg-white py-20 border-y border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-ue-blue rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-64 h-64 bg-ue-gold rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-ue-gold font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Valores Fundamentales</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-outfit leading-tight">Nuestros Pilares Institucionales</h2>
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Nos guiamos por principios que trascienden el aula, integrando la sabiduría de nuestros ancestros con la visión de un mundo globalizado.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: Heart, title: "Identidad Cultural", color: "red", bg: "bg-red-50", text: "text-red-600", desc: "Revalorizamos nuestras raíces y el idioma Kichwa en cada proceso educativo." },
                                    { icon: Lightbulb, title: "Innovación Activa", color: "amber", bg: "bg-amber-50", text: "text-amber-600", desc: "Implementamos tecnologías digitales y métodos constructivistas de vanguardia." },
                                    { icon: Trophy, title: "Excelencia Integral", color: "blue", bg: "bg-blue-50", text: "text-blue-600", desc: "Buscamos el máximo desarrollo de las potencialidades humanas de cada estudiante." }
                                ].map((pillar, pIdx) => (
                                    <div key={pIdx} className="flex gap-6 group">
                                        <div className={`shrink-0 w-14 h-14 ${pillar.bg} ${pillar.text} !rounded-none flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)' }}>
                                            <pillar.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-1 font-outfit">{pillar.title}</h4>
                                            <p className="text-slate-500 text-sm">{pillar.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-ue-gold/10 !rounded-none rotate-3 scale-95 blur-xl"></div>
                            <div
                                className="relative !rounded-none overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] md:aspect-[4/3] lg:aspect-square group/video cursor-pointer"
                                onClick={() => setIsVideoModalOpen(true)}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105"
                                    alt="Ambiente de aprendizaje colaborativo"
                                />
                                <div className="absolute inset-0 bg-ue-blue/20 group-hover/video:bg-ue-blue/0 transition-colors duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-ue-blue/60 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8 p-6 glass-effect-dark !rounded-none border border-white/20 transition-all duration-500 group-hover/video:border-ue-gold/50 group-hover/video:bg-ue-blue/80">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 !rounded-none bg-ue-gold flex items-center justify-center animate-pulse group-hover/video:animate-none group-hover/video:scale-110 transition-transform" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)' }}>
                                            <PlayCircle className="w-6 h-6 text-ue-blue" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold font-outfit">Video Institucional</p>
                                            <p className="text-white/70 text-xs font-medium">Conoce nuestro centro en 2 minutos</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Play Icon Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-500">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-75 group-hover/video:scale-100 transition-transform duration-500">
                                        <PlayCircle className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Impact Counters - Modern Minimalist Stats Section */}
            <div className="bg-gray-50/80 py-20 md:py-24 relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-ue-blue rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ue-gold rounded-full blur-3xl"></div>
                </div>

                {/* Modern Container Bar with Elegant Border */}
                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    {/* Elegant Top Border Accent */}
                    <div className="flex justify-center mb-12">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-ue-blue/30 to-transparent"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {[
                            { icon: Users, label: "Estudiantes Activos", value: 850, suffix: "+", sub: "En dos jornadas" },
                            { icon: GraduationCap, label: "Años de Trayectoria", value: 25, suffix: "", sub: "Líderes en Cayambe" },
                            { icon: Smile, label: "Docentes Capacitados", value: 45, suffix: "", sub: "Planta docente fija" },
                            { icon: Sparkles, label: "Titulados 2024", value: 100, suffix: "%", sub: "Éxito Académico" }
                        ].map((stat, sIdx) => (
                            <div 
                                key={sIdx} 
                                className="relative group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 text-center shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-100/50 hover:border-ue-blue/20 overflow-hidden"
                            >
                                {/* Subtle Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-ue-blue/0 via-ue-blue/0 to-ue-gold/0 group-hover:from-ue-blue/[0.02] group-hover:via-transparent group-hover:to-ue-gold/[0.02] transition-all duration-500 pointer-events-none"></div>
                                
                                {/* Modern Icon Container */}
                                <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl mb-5 md:mb-6 group-hover:bg-ue-blue/5 transition-all duration-500 group-hover:scale-110">
                                    <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-ue-blue group-hover:text-ue-blue transition-colors duration-500" />
                                </div>

                                {/* Large Number */}
                                <div className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-black text-ue-blue mb-2 md:mb-3 font-outfit tracking-tight group-hover:scale-105 transition-transform duration-500">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>

                                {/* Label */}
                                <div className="relative z-10 text-[10px] md:text-xs font-bold uppercase text-gray-400 tracking-[0.2em] mb-1 md:mb-2 transition-colors duration-500 group-hover:text-gray-500">
                                    {stat.label}
                                </div>

                                {/* Subtitle */}
                                <div className="relative z-10 text-[10px] md:text-xs font-medium text-gray-400/80 mt-1">
                                    {stat.sub}
                                </div>

                                {/* Elegant Bottom Accent Line - Animated */}
                                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-ue-blue via-ue-gold to-ue-blue w-0 group-hover:w-full transition-all duration-700 ease-out"></div>

                                {/* Corner Decoration - Subtle */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-ue-blue/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        ))}
                    </div>

                    {/* Elegant Bottom Border Accent */}
                    <div className="flex justify-center mt-12">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-ue-gold/30 to-transparent"></div>
                    </div>
                </div>
            </div>

            {/* Featured Gallery - NEW SECTION */}
            <div className="container mx-auto px-4 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-ue-blue font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Nuestra Vida</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit">Galería de Momentos</h2>
                    </div>
                    <Link to="/galeria" className="group/btn">
                        <Button variant="outline" className="px-8 border-slate-200 hover:border-ue-blue text-slate-600 hover:text-ue-blue !rounded-none">
                            <ImageIcon className="w-4 h-4 mr-2" /> Ver toda la galería
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-[600px] lg:h-[450px]">
                    {FEATURED_GALLERY.map((img, idx) => (
                        <div
                            key={idx}
                            className={`${idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} !rounded-none overflow-hidden relative group cursor-pointer`}
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img.url} className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" alt={img.alt} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-5 lg:p-8">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {img.subtitle && (
                                        <p className="text-ue-gold font-bold text-[10px] lg:text-xs uppercase tracking-widest mb-1 lg:mb-2">{img.subtitle}</p>
                                    )}
                                    <p className={`text-white font-black font-outfit ${idx === 0 ? 'text-xl lg:text-2xl' : 'text-sm'} uppercase tracking-wider drop-shadow-lg`}>
                                        {img.alt}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Teacher Portal CTA - FULL WIDTH SYNCED WITH STATS */}
            <div className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#0052a3] py-20 relative overflow-hidden group">
                {/* Floating Ornaments - Dots */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/10 rounded-full animate-smooth-bounce"
                            style={{
                                width: Math.random() * 6 + 2 + 'px',
                                height: Math.random() * 6 + 2 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's',
                                animationDuration: Math.random() * 4 + 3 + 's'
                            }}
                        ></div>
                    ))}
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-outfit leading-tight animate-fade-in">
                            ¿Eres docente de la institución?
                        </h2>
                        <p className="text-white/80 text-lg md:text-xl leading-relaxed animate-fade-in delay-200">
                            Accede al repositorio digital centralizado para gestionar tus planificaciones, informes y acceder a la normativa vigente de forma segura.
                        </p>
                    </div>

                    <div className="shrink-0 animate-scale-reveal delay-300">
                        <Link to="/login">
                            <button
                                className="bg-[#FFC107] hover:bg-[#FFD54F] text-[#003366] px-10 py-5 font-black uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,193,7,0.3)] flex items-center gap-3 active:scale-95"
                                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                            >
                                Acceder al Portal
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Subtle Shine Effect */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-[1500ms] pointer-events-none"></div>
            </div>

            {/* Latest News */}
            <div className="container mx-auto px-4 lg:px-8 py-12 md:py-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-4 border-b border-slate-100 pb-6 md:pb-8">
                    <div>
                        <span className="text-ue-gold font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2 block">Actualidad Académica</span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-outfit">Noticias Recientes</h2>
                    </div>
                    <Link to="/noticias" className="group">
                        <Button variant="outline" className="bg-blue-50 border-blue-100/50 px-6 py-3 rounded-none">
                            Ver todas <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {recentNews.map((news, newsIdx) => (
                        <Card
                            key={news.id}
                            noPadding
                            className="h-full flex flex-col group cursor-pointer border-0 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) active:scale-[0.98] overflow-hidden bg-white hover-lift animate-scale-reveal opacity-0"
                            onClick={() => setSelectedNews(news)}
                            style={{ animationDelay: `${newsIdx * 150}ms`, animationFillMode: 'forwards' }}
                        >
                            <div className="h-48 md:h-56 lg:h-64 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <div className="absolute top-4 left-4 z-20 transition-transform duration-500 group-hover:scale-105">
                                    <Badge className="bg-white/90 text-gray-900 font-bold backdrop-blur shadow-sm border-0">{news.category}</Badge>
                                </div>
                                <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110" />
                            </div>

                            <div className="p-6 md:p-8 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                    <Clock className="w-3 h-3 text-ue-gold" />
                                    {news.date}
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-ue-blue transition-colors leading-tight font-outfit">
                                    {news.title}
                                </h3>

                                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                    {news.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between group-hover:bg-ue-light-blue group-hover:text-white transition-all duration-300"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedNews(news);
                                        }}
                                    >
                                        Leer noticia completa
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>


            {/* News Modal */}
            <Modal
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
                title="Detalles de la Noticia"
                noPadding
            >
                {selectedNews && (
                    <div className="animate-fade-in pb-4">
                        {/* Image Content */}
                        <div className="relative h-64 md:h-[400px] overflow-hidden">
                            <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover animate-scale-in" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                                <Badge className="bg-ue-gold text-ue-blue border-0 mb-4 px-4 py-1.5 text-xs font-black shadow-lg shadow-yellow-500/20">{selectedNews.category}</Badge>
                                <h2 className="text-2xl md:text-4xl font-black text-white leading-[1.1] mb-4 tracking-tight drop-shadow-md">
                                    {selectedNews.title}
                                </h2>

                                <div className="flex flex-wrap items-center gap-4 text-slate-200 text-xs md:text-sm font-bold">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                                        <Clock className="w-4 h-4 text-ue-gold" />
                                        {selectedNews.date}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                                        <Award className="w-4 h-4 text-ue-gold" />
                                        UECIB GAB
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="p-6 md:p-10 bg-white space-y-8 animate-slide-up">
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-ue-gold rounded-full"></div>
                                <p className="text-lg md:text-2xl text-slate-700 font-bold leading-relaxed pl-6 italic">
                                    {selectedNews.excerpt}
                                </p>
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <div className="text-slate-600 leading-[1.8] space-y-6 text-base md:text-lg font-medium">
                                    {selectedNews.content}
                                    <p>
                                        En la Unidad Educativa Comunitaria Intercultural Bilingüe "Gustavo Adolfo Bécquer", nos comprometemos con el desarrollo integral de nuestros estudiantes, integrando la tecnología y los valores ancestrales para formar ciudadanos globales con identidad propia.
                                    </p>
                                    <p className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-500 text-sm md:text-base italic">
                                        "La educación es el arma más poderosa que puedes usar para cambiar el mundo." - Nelson Mandela
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                                <div className="hidden sm:block text-slate-400 text-xs font-medium">
                                    © {new Date().getFullYear()} Departamento de Comunicación GAB
                                </div>
                                <Button onClick={() => setSelectedNews(null)} className="px-10 h-14 md:h-12 w-full sm:w-auto text-base">
                                    Entendido
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Floating Cards Modals - Sharp Minimalist */}
            {selectedCardModal !== null && (
                <Modal
                    isOpen={selectedCardModal !== null}
                    onClose={() => setSelectedCardModal(null)}
                    title={
                        [
                            "Modelo Pedagógico",
                            "Nuestra Comunidad",
                            "Agenda Académica",
                            "Certificación Oficial"
                        ][selectedCardModal]
                    }
                    noPadding
                >
                    <div className="p-8 md:p-12">
                        {/* Modelo Pedagógico */}
                        {selectedCardModal === 0 && (
                            <div className="space-y-8">
                                {/* Header */}
                                <div className="flex items-start gap-5">
                                    <div
                                        className="p-4 bg-blue-50 text-ue-blue border-2 border-ue-blue/20"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                        }}
                                    >
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-black text-ue-blue mb-2 font-outfit">Constructivista Intercultural</h3>
                                        <p className="text-gray-600 font-medium">Formación integral desde las raíces culturales</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-6">
                                    <div className="relative pl-5 border-l-4 border-ue-gold">
                                        <p className="text-lg text-gray-700 font-bold leading-relaxed">
                                            Nuestro modelo pedagógico se fundamenta en el constructivismo social, integrando los saberes ancestrales con metodologías contemporáneas.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div
                                            className="p-6 bg-gray-50 border-l-4 border-ue-blue"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                            }}
                                        >
                                            <h4 className="font-black text-ue-blue mb-3 text-lg">Principios Clave</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-gold mt-1">▸</span>
                                                    <span>Aprendizaje significativo</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-gold mt-1">▸</span>
                                                    <span>Respeto a la diversidad cultural</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-gold mt-1">▸</span>
                                                    <span>Desarrollo del pensamiento crítico</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-gold mt-1">▸</span>
                                                    <span>Educación bilingüe (Español-Kichwa)</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div
                                            className="p-6 bg-amber-50 border-l-4 border-ue-gold"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                            }}
                                        >
                                            <h4 className="font-black text-ue-gold mb-3 text-lg">Metodologías</h4>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-blue mt-1">▸</span>
                                                    <span>Aprendizaje basado en proyectos</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-blue mt-1">▸</span>
                                                    <span>Trabajo colaborativo</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-blue mt-1">▸</span>
                                                    <span>Integración tecnológica</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-ue-blue mt-1">▸</span>
                                                    <span>Conexión con la comunidad</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comunidad */}
                        {selectedCardModal === 1 && (
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div
                                        className="p-4 bg-amber-50 text-ue-gold border-2 border-ue-gold/20"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                        }}
                                    >
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-black text-ue-gold mb-2 font-outfit">Docentes de Excelencia</h3>
                                        <p className="text-gray-600 font-medium">Profesionales comprometidos con la educación de calidad</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative pl-5 border-l-4 border-ue-blue">
                                        <p className="text-lg text-gray-700 font-bold leading-relaxed">
                                            Contamos con un equipo de docentes altamente calificados, con especialización en educación intercultural bilingüe y formación continua.
                                        </p>
                                    </div>

                                    <div className="grid gap-6">
                                        <div
                                            className="p-6 bg-blue-50 border-l-4 border-ue-blue"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                            }}
                                        >
                                            <h4 className="font-black text-ue-blue mb-4 text-lg">Perfil de Nuestros Docentes</h4>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-white border-2 border-ue-blue/10">
                                                    <div className="text-3xl font-black text-ue-blue mb-2">100%</div>
                                                    <div className="text-sm text-gray-600 font-bold">Titulados</div>
                                                </div>
                                                <div className="text-center p-4 bg-white border-2 border-ue-blue/10">
                                                    <div className="text-3xl font-black text-ue-blue mb-2">85%</div>
                                                    <div className="text-sm text-gray-600 font-bold">Con Posgrado</div>
                                                </div>
                                                <div className="text-center p-4 bg-white border-2 border-ue-blue/10">
                                                    <div className="text-3xl font-black text-ue-blue mb-2">15+</div>
                                                    <div className="text-sm text-gray-600 font-bold">Años promedio</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="p-6 bg-gray-50 border-l-4 border-ue-gold"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                            }}
                                        >
                                            <h4 className="font-black text-ue-gold mb-3 text-lg">Áreas de Especialización</h4>
                                            <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-ue-gold" />
                                                    <span>Pedagogía Intercultural</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-ue-gold" />
                                                    <span>Tecnología Educativa</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-ue-gold" />
                                                    <span>Educación Inclusiva</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-ue-gold" />
                                                    <span>Lenguas Ancestrales</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Agenda */}
                        {selectedCardModal === 2 && (
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div
                                        className="p-4 bg-blue-50 text-ue-blue border-2 border-ue-blue/20"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                        }}
                                    >
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-black text-ue-blue mb-2 font-outfit">Cronograma 2026</h3>
                                        <p className="text-gray-600 font-medium">Planificación académica del año lectivo</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative pl-5 border-l-4 border-ue-gold">
                                        <p className="text-lg text-gray-700 font-bold leading-relaxed">
                                            Conoce las fechas importantes del calendario académico 2026 y planifica el éxito educativo de tus hijos.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { periodo: "Matrícula Ordinaria", fecha: "15 Ene - 15 Feb", color: "blue" },
                                            { periodo: "Inicio de Clases", fecha: "3 de Marzo", color: "gold" },
                                            { periodo: "Primer Quimestre", fecha: "Mar - Jul", color: "blue" },
                                            { periodo: "Vacaciones", fecha: "28 Jul - 11 Ago", color: "gold" },
                                            { periodo: "Segundo Quimestre", fecha: "Ago - Dic", color: "blue" },
                                            { periodo: "Finalización", fecha: "20 de Diciembre", color: "gold" }
                                        ].map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-5 border-l-4 ${item.color === 'blue' ? 'bg-blue-50 border-ue-blue' : 'bg-amber-50 border-ue-gold'}`}
                                                style={{
                                                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                                }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className={`font-black ${item.color === 'blue' ? 'text-ue-blue' : 'text-ue-gold'}`}>
                                                        {item.periodo}
                                                    </span>
                                                    <span className="font-bold text-gray-600">{item.fecha}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Certificación */}
                        {selectedCardModal === 3 && (
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div
                                        className="p-4 bg-amber-50 text-ue-gold border-2 border-ue-gold/20"
                                        style={{
                                            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                        }}
                                    >
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-black text-ue-gold mb-2 font-outfit">Aval del MINEDUC</h3>
                                        <p className="text-gray-600 font-medium">Certificación oficial del Ministerio de Educación</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative pl-5 border-l-4 border-ue-blue">
                                        <p className="text-lg text-gray-700 font-bold leading-relaxed">
                                            Institución fiscoscomisional acreditada por el Ministerio de Educación del Ecuador, garantizando títulos de bachillerato oficialmente reconocidos.
                                        </p>
                                    </div>

                                    <div className="grid gap-6">
                                        <div
                                            className="p-6 bg-blue-50 border-l-4 border-ue-blue"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                            }}
                                        >
                                            <h4 className="font-black text-ue-blue mb-4 text-lg">Certificaciones y Acreditaciones</h4>
                                            <ul className="space-y-3 text-gray-700">
                                                <li className="flex items-start gap-3">
                                                    <Award className="w-5 h-5 text-ue-blue mt-1 shrink-0" />
                                                    <div>
                                                        <div className="font-bold">Registro MINEDUC</div>
                                                        <div className="text-sm text-gray-600">Institución fiscoscomisional oficialmente registrada</div>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <Award className="w-5 h-5 text-ue-blue mt-1 shrink-0" />
                                                    <div>
                                                        <div className="font-bold">Bachillerato Reconocido</div>
                                                        <div className="text-sm text-gray-600">Títulos habilitados para educación superior</div>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <Award className="w-5 h-5 text-ue-blue mt-1 shrink-0" />
                                                    <div>
                                                        <div className="font-bold">Educación Intercultural Bilingüe</div>
                                                        <div className="text-sm text-gray-600">Certificada bajo el Sistema de EIB</div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div
                                            className="p-6 bg-amber-50 text-center border-4 border-ue-gold"
                                            style={{
                                                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                                            }}
                                        >
                                            <div className="text-5xl font-black text-ue-gold mb-2">✓</div>
                                            <div className="font-black text-xl text-ue-blue mb-2">Calidad Garantizada</div>
                                            <div className="text-gray-600 font-medium">Cumplimos con todos los estándares de calidad educativa establecidos por el MINEDUC</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Button */}
                        <div className="pt-8 border-t-2 border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedCardModal(null)}
                                className="px-10 py-3.5 text-base font-bold border-2 border-ue-blue bg-ue-blue text-ue-gold hover:bg-ue-light-blue hover:border-ue-light-blue transition-all duration-300 uppercase tracking-wide cursor-pointer"
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)'
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Curriculum Modals - High Impact Sharp Design */}
            {selectedCurriculum !== null && (
                <Modal
                    isOpen={selectedCurriculum !== null}
                    onClose={() => setSelectedCurriculum(null)}
                    title={CURRICULUM_DATA[selectedCurriculum].level}
                    maxWidth="4xl"
                >
                    <div className="p-4 md:p-8">
                        <div className="mb-10 text-center md:text-left">
                            <h3 className="text-2xl md:text-4xl font-black text-ue-blue font-outfit mb-3">{CURRICULUM_DATA[selectedCurriculum].title}</h3>
                            <p className="text-slate-500 font-medium">Breakdown detallado de áreas de aprendizaje y competencias por niveles.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {CURRICULUM_DATA[selectedCurriculum].areas.map((area, aIdx) => (
                                <div
                                    key={aIdx}
                                    className="p-6 bg-slate-50 border-l-4 border-ue-gold animate-slide-up"
                                    style={{
                                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                                        animationDelay: `${aIdx * 100}ms`
                                    }}
                                >
                                    <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-200">
                                        <div className="p-3 bg-white text-ue-blue border border-ue-blue/10 shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)' }}>
                                            <area.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-black text-slate-800 text-lg uppercase tracking-wide font-outfit">{area.name}</h4>
                                    </div>
                                    <ul className="space-y-3">
                                        {area.skills.map((skill, sIdx) => (
                                            <li key={sIdx} className="flex items-center gap-3 text-sm text-slate-600 font-bold group/skill">
                                                <div className="w-1.5 h-1.5 bg-ue-gold transition-all duration-300 group-hover/skill:scale-x-[3]"></div>
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">UECIB GAB • Gestión Académica 2026</div>
                            <Button
                                className="px-12 py-4 h-auto text-base font-black uppercase tracking-widest !rounded-none w-full md:w-auto"
                                onClick={() => setSelectedCurriculum(null)}
                            >
                                Entendido
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Gallery Lightbox Modal */}
            <Modal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                title={selectedImage?.alt || "Galería de Momentos"}
                maxWidth="max-w-5xl"
            >
                {selectedImage && (
                    <div className="flex flex-col items-center">
                        <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-2xl bg-slate-100 border border-slate-200 relative group/modal">
                            <img
                                src={selectedImage.url}
                                key={selectedImage.url}
                                className="w-full h-full object-contain animate-fade-in"
                                alt={selectedImage.alt}
                            />

                            {/* Navigation Arrows */}
                            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                    className="w-12 h-12 bg-white/20 hover:bg-ue-gold hover:text-ue-blue text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center opacity-0 group-hover/modal:opacity-100 pointer-events-auto border border-white/30"
                                    title="Imagen anterior"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                    className="w-12 h-12 bg-white/20 hover:bg-ue-gold hover:text-ue-blue text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center opacity-0 group-hover/modal:opacity-100 pointer-events-auto border border-white/30"
                                    title="Siguiente imagen"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-100 w-full flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-ue-gold animate-pulse"></div>
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                    {(FEATURED_GALLERY.findIndex(img => img.url === selectedImage.url) + 1)} / {FEATURED_GALLERY.length} • Captura Institucional
                                </span>
                            </div>
                            <Button onClick={() => setSelectedImage(null)} className="!rounded-none px-10">
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Video Institutional Modal */}
            <Modal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                title="Video Institucional"
                maxWidth="5xl"
                noPadding
            >
                <div className="flex flex-col">
                    <div className="relative aspect-video bg-black overflow-hidden">
                        <video
                            className="w-full h-full object-contain"
                            controls
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                            autoPlay
                            src="/video_educate.mp4"
                        >
                            <source src="/video_educate.mp4" type="video/mp4" />
                            Tu navegador no soporta la reproducción de video.
                        </video>
                    </div>

                    <div className="p-8 bg-white">
                        <div className="flex items-start gap-4">
                            <div className="hidden md:flex p-3 bg-ue-blue/5 text-ue-blue rounded-lg shrink-0">
                                <PlayCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-ue-blue font-outfit mb-3">
                                    Descubre Nuestra Esencia Educativa
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                                    Sumérgete en un recorrido visual por nuestra unidad educativa.
                                    Este video captura la alegría de aprender, la innovación en nuestras aulas
                                    y el compromiso de nuestros docentes. Testimonia cómo fusionamos la
                                    sabiduría cultural con la tecnología moderna para formar a los líderes del mañana.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm font-bold text-ue-gold uppercase tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-ue-gold"></div>
                                        Infraestructura
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-ue-gold uppercase tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-ue-gold"></div>
                                        Metodología
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-ue-gold uppercase tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-ue-gold"></div>
                                        Comunidad
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default HomePage;