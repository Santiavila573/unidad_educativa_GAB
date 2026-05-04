import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Modal } from '../components/ui';
import {
    BookOpen,
    Award,
    Zap,
    Users,
    Target,
    Cpu,
    ChevronRight,
    GraduationCap,
    Languages,
    Microscope,
    FlaskConical,
    Palette,
    Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper Component for Number Animation (matching HomePage style)
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

// 3D Tilt Wrapper Component
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'none',
            '--x': `${x}px`,
            '--y': `${y}px`
        } as React.CSSProperties);
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'all 0.5s ease-out'
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={style}
            className={`relative overflow-hidden group/tilt ${className}`}
        >
            {/* Dynamic Shine Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300 pointer-events-none z-10 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,255,255,0.15),transparent_40%)]"></div>
            {children}
        </div>
    );
};

const AcademicOfferPage: React.FC = () => {
    const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<any | null>(null);

    const EGB_LEVELS = [
        {
            name: "Preparatoria",
            detail: "1er Grado (5 años)",
            icon: Palette,
            color: "bg-blue-500",
            description: "Inicio del proceso educativo enfocado en el desarrollo integral, socialización y descubrimiento del entorno.",
            subjects: ["Identidad y Autonomía", "Convivencia", "Relaciones Lógico-Matemáticas", "Comprensión y Expresión del Lenguaje", "Expresión Artística", "Educación Física"]
        },
        {
            name: "Básica Elemental",
            detail: "2do, 3ro y 4to Grado",
            icon: Globe,
            color: "bg-green-500",
            description: "Fortalecimiento de habilidades fundamentales en lectoescritura, cálculo matemático y comprensión social.",
            subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Ciencias Sociales", "Educación Cultural y Artística", "Educación Física", "Lengua Ancestral"]
        },
        {
            name: "Básica Media",
            detail: "5to, 6to y 7mo Grado",
            icon: FlaskConical,
            color: "bg-indigo-500",
            description: "Desarrollo del pensamiento crítico, investigación y proyectos prácticos integradores.",
            subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Ciencias Sociales", "ECA", "Educación Física", "Inglés", "Cosmovisión Andina"]
        },
        {
            name: "Básica Superior",
            detail: "8vo, 9no y 10mo Grado",
            icon: Microscope,
            color: "bg-purple-500",
            description: "Consolidación de conocimientos complejos y preparación para los desafíos del bachillerato.",
            subjects: ["Lengua y Literatura", "Matemática", "Ciencias Naturales", "Ciencias Sociales", "ECA", "Educación Física", "Inglés", "Proyectos Escolares"]
        },
    ];

    const BGU_TRACKS = [
        {
            name: "Bachillerato en Ciencias",
            description: "Preparación académica profunda para el éxito en la educación superior y universidades.",
            features: ["Pensamiento Crítico", "Investigación Científica", "Pre-Universitario"],
            icon: GraduationCap,
            status: "activo",
            color: "bg-ue-blue",
            longDescription: "El Bachillerato en Ciencias ofrece a los estudiantes una formación humanística-científica sólida. Se enfoca en el desarrollo de capacidades de análisis, síntesis y pensamiento abstracto.",
            subjects: ["Física Superior", "Química Analítica", "Matemática Avanzada", "Biología Molecular", "Lengua y Literatura", "Investigación de Campo"],
            outcomes: ["Ingreso Directo a Universidad", "Certificación en Ciencias", "Habilidades de Investigación"]
        },
        {
            name: "Bachillerato Técnico",
            description: "Proyectos agropecuarios sustentables con enfoque en desarrollo comunitario local.",
            features: ["Emprendimiento Rural", "Sostenibilidad", "Enfoque Práctico"],
            icon: Cpu,
            status: "en proceso",
            color: "bg-slate-700",
            longDescription: "Un enfoque práctico hacia la sostenibilidad alimentaria y el manejo técnico de recursos naturales, integrando tecnología moderna con saberes ancestrales.",
            subjects: ["Agrotécnica", "Manejo de Suelos", "Emprendimiento y Gestión", "Biología Aplicada", "Tecnología de Alimentos", "Prácticas Comunitarias"],
            outcomes: ["Técnico Agropecuario", "Gestor de Emprendimiento", "Líder de Sostenibilidad"]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero Section - High Impact with Floating Elements */}
            <div className="relative bg-ue-blue py-24 md:py-32 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1523050335456-c940c6d9692c?q=80&w=2070&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 animate-ken-burns"
                    alt="Fondo Académico"
                />
                {/* Abstract Background elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ue-gold opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                {/* Floating Glass Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-full animate-bubble border border-white/10"></div>
                    <div className="absolute bottom-[30%] right-[15%] w-48 h-48 bg-ue-gold/5 backdrop-blur-2xl rounded-full animate-bubble-reverse border border-white/5"></div>
                    <div className="absolute top-[60%] left-[40%] w-16 h-16 bg-white/10 rounded-xl rotate-12 animate-bubble-reverse [animation-delay:2s]"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-6 md:pt-10 2xl:pt-20">
                    <div className="inline-flex items-center gap-2 bg-ue-gold/20 backdrop-blur-md border border-ue-gold/30 rounded-full px-5 py-1.5 mb-6 animate-fade-in shadow-xl">
                        <Award className="w-3.5 h-3.5 text-ue-gold animate-pulse" />
                        <span className="text-ue-gold font-bold text-[10px] md:text-xs uppercase tracking-[0.25em] font-outfit">Progreso Académico</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black text-white mb-6 font-outfit animate-title-reveal leading-[1.1]">
                        Nuestra <span className="text-ue-gold italic">Oferta</span> <br className="hidden md:block" /> Educativa
                    </h1>
                    <p className="text-blue-100/90 max-w-3xl mx-auto text-base md:text-xl leading-relaxed font-outfit mb-10 opacity-0 animate-fade-in [animation-fill-mode:forwards] [animation-delay:400ms]">
                        Formación integral con estándares internacionales, preservando el conocimiento ancestral para los líderes del mañana.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="grid lg:grid-cols-12 gap-10 2xl:gap-20 items-start">

                    {/* Left Column - EGB Journey */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 overflow-hidden relative animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none"></div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-14 w-14 bg-ue-blue rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                                            <BookOpen className="h-8 w-8" />
                                        </div>
                                        <h2 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight font-outfit">Educación General Básica</h2>
                                    </div>
                                    <p className="text-slate-500 font-bold ml-1">EGB: Un camino de crecimiento continuo</p>
                                </div>
                                <Badge color="blue" className="px-5 py-2 text-sm font-black">Niveles 1 a 10</Badge>
                            </div>

                            <div className="relative grid sm:grid-cols-2 gap-x-8 gap-y-12">
                                {/* Visual Path Line - Desktop only */}
                                <div className="hidden sm:block absolute top-[15%] bottom-[15%] left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-slate-200 pointer-events-none opacity-40"></div>

                                {EGB_LEVELS.map((level, idx) => (
                                    <TiltCard
                                        key={idx}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`p-8 rounded-3xl border transition-all duration-300
                                            ${hoveredLevel === level.name || selectedLevel?.name === level.name
                                                ? 'bg-white border-ue-blue shadow-2xl shadow-blue-100'
                                                : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 
                                            ${hoveredLevel === level.name || selectedLevel?.name === level.name ? `${level.color} text-white scale-110 shadow-lg` : 'bg-white text-slate-400'}`}>
                                            <level.icon className="h-7 w-7" />
                                        </div>
                                        <h3 className={`text-xl font-black mb-2 transition-colors font-outfit ${hoveredLevel === level.name || selectedLevel?.name === level.name ? 'text-ue-blue' : 'text-slate-800'}`}>
                                            {level.name}
                                        </h3>
                                        <p className="text-slate-500 font-bold mb-4">{level.detail}</p>
                                        <div className={`h-1 rounded-full transition-all duration-700 ${hoveredLevel === level.name || selectedLevel?.name === level.name ? 'w-24 bg-ue-gold' : 'w-12 bg-slate-200'}`}></div>

                                        {/* Abstract background detail on hover */}
                                        <div className={`absolute top-4 right-4 text-[6rem] font-black text-slate-100 transition-opacity duration-500 pointer-events-none select-none
                                            ${hoveredLevel === level.name || selectedLevel?.name === level.name ? 'opacity-20' : 'opacity-0'}`}>
                                            0{idx + 1}
                                        </div>
                                    </TiltCard>
                                ))}
                            </div>

                            <div className="mt-12 p-8 bg-ue-blue rounded-3xl text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                    <div className="h-16 w-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shrink-0">
                                        <Languages className="h-8 w-8 text-ue-gold" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black mb-1 font-outfit">Fortalecimiento de la Identidad</h4>
                                        <p className="text-blue-100 text-sm leading-relaxed opacity-80">
                                            Incorporamos la enseñanza de la lengua ancestral y cosmovisión andina en todos los niveles como eje transversal del aprendizaje.
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        <div className="h-10 w-10 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-ue-blue transition-all duration-300">
                                            <ChevronRight className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - BGU specialization */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8 animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:800ms]">
                        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-white relative overflow-hidden h-full flex flex-col">
                            {/* Cinematic Glows */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-ue-blue/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-ue-gold/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                            <div className="mb-12 relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 bg-ue-gold rounded-2xl flex items-center justify-center text-ue-blue shadow-xl shadow-yellow-500/10">
                                        <GraduationCap className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-1 font-outfit">Bachillerato</h2>
                                        <p className="text-ue-gold font-bold text-sm tracking-[0.2em] uppercase opacity-80">BGU Unificado</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 leading-relaxed">Especializaciones diseñadas para la formación profesional técnica y académica avanzada.</p>
                            </div>

                            <div className="space-y-6 flex-grow relative z-10">
                                {BGU_TRACKS.map((track, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => track.status === 'activo' && setSelectedLevel(track)}
                                        className={`p-8 rounded-[2rem] border transition-all duration-500 group
                                        ${track.status === 'activo'
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                                                : 'bg-slate-800/50 border-white/5 grayscale cursor-not-allowed opacity-60'}`}>

                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-2xl ${track.status === 'activo' ? 'bg-ue-blue/60' : 'bg-slate-700'}`}>
                                                <track.icon className="h-6 w-6 text-white" />
                                            </div>
                                            {track.status !== 'activo' && <Badge color="gray">Próximamente</Badge>}
                                            {track.status === 'activo' && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>}
                                        </div>

                                        <h3 className="text-xl font-black mb-3 group-hover:text-ue-gold transition-colors font-outfit">{track.name}</h3>
                                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{track.description}</p>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-ue-gold uppercase tracking-[0.2em] opacity-60">
                                                Competencias Clave
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {track.features.map((feature, fidx) => (
                                                    <span key={fidx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:bg-ue-light-blue group-hover:border-ue-light-blue transition-all duration-300">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 relative z-10 text-center">
                                <h4 className="text-white font-black mb-6 font-outfit">¿Interesado en formar parte?</h4>
                                <Link to="/contacto">
                                    <Button variant="secondary" className="w-full h-16 rounded-none text-lg font-black group">
                                        Iniciar Proceso de Admisión
                                        <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                    </Button>
                                </Link>
                                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Cupos limitados 2026-2027</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Output Profile Section */}
                <div className="mt-20 md:mt-32 mb-20">
                    <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden text-center max-w-5xl mx-auto">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-ue-blue via-ue-gold to-ue-blue"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter font-outfit">Perfil de Salida del <span className="text-ue-blue">Estudiante</span></h2>
                            <p className="text-slate-600 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-3xl mx-auto italic">
                                "Al finalizar su educación en UECIB GAB, nuestros estudiantes no solo dominan las ciencias académicas, sino que poseen una identidad cultural inquebrantable."
                            </p>

                            <div className="grid sm:grid-cols-3 gap-10">
                                {[
                                    { title: "Pensamiento Crítico", desc: "Capacidad de analizar y resolver problemas complejos con ética y lógica." },
                                    { title: "Identidad Cultural", desc: "Dominio de la lengua ancestral y orgullo por sus raíces andinas." },
                                    { title: "Ciudadanía Global", desc: "Preparados para triunfar en cualquier entorno con valores universales." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="h-12 w-12 bg-blue-50 text-ue-blue rounded-2xl flex items-center justify-center mx-auto text-xl font-black mb-4">
                                            0{i + 1}
                                        </div>
                                        <h4 className="font-black text-slate-800 uppercase tracking-tighter text-lg font-outfit">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Impact stats with Animated Counters - Matching HomePage Style - Full Width */}
            <div className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#0052a3] py-24 relative overflow-hidden">
                {/* Floating Ornaments - Dots */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
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

                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { label: "Niveles", value: 10, suffix: "+", icon: Target, sub: "Educación Integral" },
                            { label: "Enfoque", value: 100, suffix: "%", icon: Globe, sub: "Excelencia Académica" },
                            { label: "Bachillerato", value: 2, suffix: " Áreas", icon: Cpu, sub: "Especialización" },
                            { label: "Proyecto", value: 2025, suffix: "", icon: Users, sub: "Visión Futura" }
                        ].map((stat, sIdx) => (
                            <div key={sIdx} className="text-center group p-8 bg-white/[0.02] border border-white/[0.05] relative hover:bg-white/[0.05] transition-all duration-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)' }}>
                                <div className="inline-flex p-3 !rounded-none bg-white/[0.03] border border-white/10 text-white/40 mb-6 group-hover:text-ue-gold transition-colors duration-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)' }}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black text-white mb-3 font-outfit tracking-tighter drop-shadow-sm">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-blue-50 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                                <div className="text-blue-100/60 text-[10px] font-medium">{stat.sub}</div>

                                {/* Modern Accent Line */}
                                <div className="absolute bottom-0 left-0 h-[2px] bg-ue-gold/30 w-0 group-hover:w-full transition-all duration-700"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Curriculum Modal Explorer */}
            <Modal
                isOpen={!!selectedLevel}
                onClose={() => setSelectedLevel(null)}
                title={`Curriculo: ${selectedLevel?.name}`}
            >
                {selectedLevel && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center gap-6 mb-8">
                            <div className={`h-20 w-20 rounded-3xl ${selectedLevel.color} text-white flex items-center justify-center shadow-2xl shadow-blue-200`}>
                                <selectedLevel.icon className="h-10 w-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-none mb-2 font-outfit">{selectedLevel.name}</h3>
                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                    <Badge color="blue">{selectedLevel.detail}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Enfoque Pedagógico</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">
                                {selectedLevel.longDescription || selectedLevel.description}
                            </p>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-xs font-black text-ue-blue uppercase tracking-widest mb-6">
                                <Zap className="h-4 w-4 text-ue-gold" /> Áreas de Conocimiento
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedLevel.subjects.map((subject: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-ue-blue/30 transition-colors group/item">
                                        <div className="h-2 w-2 rounded-full bg-ue-gold group-hover/item:scale-150 transition-transform"></div>
                                        <span className="text-slate-700 font-bold text-sm tracking-tight">{subject}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedLevel.outcomes && (
                            <div className="pt-4">
                                <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                                    <Target className="h-4 w-4 text-ue-blue" /> Perfil de Egreso Específico
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedLevel.outcomes.map((outcome: string, idx: number) => (
                                        <Badge key={idx} color="blue" className="px-4 py-2 border border-blue-100/50 shadow-sm">
                                            {outcome}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100">
                            <Button onClick={() => setSelectedLevel(null)} className="w-full h-14 rounded-none font-black">
                                Cerrar Explorador
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AcademicOfferPage;