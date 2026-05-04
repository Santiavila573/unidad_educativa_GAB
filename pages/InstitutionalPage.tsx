import React, { useState, useRef, useEffect } from 'react';
import { INSTITUTIONAL_INFO } from '../constants';
import { Card, Button, Badge } from '../components/ui';
import {
  Download,
  Eye,
  History as HistoryIcon,
  Target,
  Compass,
  ShieldCheck,
  Award,
  BookOpen,
  ScrollText,
  ChevronRight,
  Sparkles,
  Flag,
  Globe,
  Heart,
  Shield,
  Users,
  Scale
} from 'lucide-react';

// Advanced Value Mapping for Premium UX
const VALUE_DEFAULTS: Record<string, { icon: any; desc: string }> = {
  "Interculturalidad": { icon: Globe, desc: "Valoramos la diversidad de saberes y tradiciones de nuestro pueblo." },
  "Respeto": { icon: Heart, desc: "Base fundamental de nuestra convivencia armónica y bilingüe." },
  "Responsabilidad": { icon: Shield, desc: "Compromiso firme con la excelencia académica y el bienestar común." },
  "Solidaridad": { icon: Users, desc: "Apoyo mutuo para fortalecer el crecimiento colectivo de nuestra comunidad." },
  "Honestidad": { icon: ShieldCheck, desc: "Actuamos con absoluta transparencia e integridad en cada acción." },
  "Justicia": { icon: Scale, desc: "Equidad y rectitud garantizando los derechos de todos nuestros integrantes." },
};

// 3D Tilt Wrapper Component with Premium Spotlight
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Tilt calculations
    const xPct = x / rect.width;
    const yPct = y / rect.height;
    const tiltX = (yPct - 0.5) * 10;
    const tiltY = (xPct - 0.5) * -10;

    setTilt({ x: tiltX, y: tiltY });
    setSpotlightPos({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      className={`relative transition-all duration-200 ease-out group/spotlight ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255,255,255,0.15), transparent 40%)`
        }}
      />

      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
};

const InstitutionalPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Modern Hero Section - Refined Proportions */}
      <div className="relative h-[45vh] min-h-[450px] 2xl:h-[65vh] flex items-center justify-center overflow-hidden bg-white mt-[-80px]">
        {/* Background Image with Light Overlay */}
        <img
          src="/images/legacy-building.png"
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 animate-ken-burns grayscale-[50%]"
          alt="School Legacy Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white"></div>

        {/* Animated Background Gradients (Enhanced) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-ue-gold/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl pt-24 md:pt-32">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full px-5 py-1.5 mb-8 animate-fade-in shadow-lg">
            <Award className="w-3.5 h-3.5 text-ue-blue animate-pulse" />
            <span className="text-ue-blue font-bold text-[10px] md:text-xs uppercase tracking-[0.25em] font-outfit">Nuestra Identidad</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 font-outfit animate-title-reveal leading-[1.1] tracking-tighter">
            Un Legado de <br />
            <span className="bg-gradient-to-r from-ue-blue to-ue-light-blue bg-clip-text text-transparent italic px-2">Excelencia</span>
          </h1>
          <div className="w-24 h-1.5 bg-ue-gold mx-auto rounded-full animate-line-reveal shadow-sm"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 -mt-6 2xl:mt-0">
        <div className="max-w-6xl mx-auto space-y-20 md:space-y-36 2xl:space-y-48">

          {/* Historia Section - Minimalist & Modern */}
          <section className="animate-fade-in delay-200">
            <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-center">
              <div className="lg:col-span-12 xl:col-span-7 order-2 lg:order-1">
                <div className="flex items-center gap-5 mb-10 md:mb-14">
                  <div className="w-14 h-14 bg-ue-blue/5 text-ue-blue rounded-2xl flex items-center justify-center shadow-inner">
                    <HistoryIcon className="w-7 h-7" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-outfit tracking-tight">Nuestra <span className="text-ue-blue italic px-1">Historia</span></h2>
                </div>
                <div className="space-y-10 md:space-y-16">
                  <div className="relative pl-10 md:pl-14 border-l-2 border-slate-100 py-2">
                    <div className="absolute left-[-9px] top-6 w-4 h-4 bg-ue-gold rounded-full ring-8 ring-ue-gold/10"></div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <span className="text-xs font-black text-ue-gold uppercase tracking-[0.2em] mb-3 block font-outfit">1995 • El Comienzo</span>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 font-outfit tracking-tight">Fundación Institucional</h3>
                      <p className="text-slate-600 leading-relaxed font-outfit text-lg md:text-xl">
                        {INSTITUTIONAL_INFO.history.split('.')[0]}.
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-10 md:pl-14 border-l-2 border-slate-100 py-2">
                    <div className="absolute left-[-9px] top-6 w-4 h-4 bg-ue-blue rounded-full ring-8 ring-ue-blue/10"></div>
                    <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                      <span className="text-xs font-black text-ue-blue uppercase tracking-[0.2em] mb-3 block font-outfit">Hacia el Futuro</span>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 font-outfit tracking-tight">Evolución Institucional</h3>
                      <p className="text-slate-600 leading-relaxed font-outfit text-lg md:text-xl">
                        {INSTITUTIONAL_INFO.history.split('.').slice(1).join('.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-12 xl:col-span-5 order-1 lg:order-2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-ue-blue/20 to-ue-gold/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <TiltCard className="relative p-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <img
                      src="/C:/Users/sam_c/.gemini/antigravity/brain/ea2dfe37-1131-4d92-a60b-37b3730256a4/school_history_legacy_1767888634710.png"
                      className="rounded-[2rem] w-full h-[400px] md:h-[550px] object-cover scale-100 group-hover:scale-110 transition-transform duration-2000"
                      alt="School History Legacy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                      <p className="text-white font-outfit text-xl font-bold italic">"Forjando el camino del saber desde 1995"</p>
                    </div>
                  </TiltCard>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision - Modern & Elegant Cards */}
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <TiltCard className="group h-full">
              <div className="bg-white rounded-[3rem] p-10 md:p-14 h-full relative overflow-hidden flex flex-col shadow-2xl shadow-slate-200/60 border border-slate-100 transition-all duration-700 hover:shadow-ue-blue/10">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity group-hover:scale-110 duration-1000">
                  <Target className="w-48 h-48 md:w-64 md:h-64 text-ue-blue" />
                </div>
                <div className="relative z-10 flex-grow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-ue-blue rounded-2xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                    <Target className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 uppercase tracking-widest font-outfit leading-tight">Misión</h2>
                  <p className="text-slate-600 text-xl lg:text-2xl leading-relaxed italic font-light font-outfit">
                    "{INSTITUTIONAL_INFO.mission}"
                  </p>
                </div>
                <div className="mt-12 h-1.5 w-20 bg-ue-gold rounded-full group-hover:w-full transition-all duration-1000 ease-in-out"></div>
              </div>
            </TiltCard>

            <TiltCard className="group h-full">
              <div className="bg-slate-50/50 rounded-[3rem] p-10 md:p-14 h-full relative overflow-hidden flex flex-col shadow-xl shadow-slate-200/40 border border-slate-100 transition-all duration-700 hover:shadow-ue-blue/10">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity group-hover:scale-110 duration-1000">
                  <Compass className="w-48 h-48 md:w-64 md:h-64 text-ue-blue" />
                </div>
                <div className="relative z-10 flex-grow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-ue-blue rounded-2xl mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-inner">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 uppercase tracking-widest font-outfit leading-tight">Visión</h2>
                  <p className="text-slate-600 text-xl lg:text-2xl leading-relaxed italic font-light font-outfit">
                    "{INSTITUTIONAL_INFO.vision}"
                  </p>
                </div>
                <div className="mt-12 h-1.5 w-20 bg-ue-blue rounded-full group-hover:w-full transition-all duration-1000 ease-in-out"></div>
              </div>
            </TiltCard>
          </div>

          {/* Values - Advanced UI/UX Grid */}
          <section className="py-20 md:py-32">
            <div className="text-center mb-16 md:mb-24 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ue-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="inline-block bg-ue-gold/5 border border-ue-gold/10 px-8 py-2.5 rounded-full mb-8 relative z-10 shadow-sm">
                <span className="text-ue-gold font-bold text-xs md:text-sm uppercase tracking-[0.3em] font-outfit">Pilares Institucionales</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 font-outfit tracking-tight relative z-10 pr-2">
                Nuestros <span className="bg-gradient-to-r from-ue-blue to-ue-light-blue bg-clip-text text-transparent italic px-1">Valores</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
              {INSTITUTIONAL_INFO.values.map((val, idx) => {
                const metadata = VALUE_DEFAULTS[val] || { icon: Sparkles, desc: "Principio fundamental de nuestra institución." };
                const Icon = metadata.icon;

                return (
                  <TiltCard key={idx} className="group h-full">
                    <div className="relative bg-white border border-slate-100 p-8 md:p-14 rounded-[3.5rem] h-full transition-all duration-700 hover:shadow-2xl hover:shadow-ue-blue/10 overflow-hidden flex flex-col">
                      {/* Decorative Background Icon */}
                      <Icon className="absolute -right-8 -bottom-8 w-48 h-48 text-ue-blue opacity-[0.02] group-hover:opacity-[0.05] transition-opacity group-hover:scale-110 duration-1000 rotate-12" />

                      <div className="relative z-10 flex-grow">
                        <div className="w-16 h-16 bg-blue-50 text-ue-blue rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                          <Icon className="w-8 h-8" />
                        </div>

                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-normal font-outfit leading-tight break-words">
                          {val}
                        </h3>

                        <p className="text-slate-500 text-sm sm:text-base md:text-lg leading-relaxed font-outfit group-hover:text-slate-700 transition-colors duration-500">
                          {metadata.desc}
                        </p>
                      </div>

                      {/* Animated Progress/Interaction Line */}
                      <div className="mt-10 relative">
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-ue-blue to-ue-light-blue transition-all duration-1000 ease-out rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </section>

          {/* Normativa - Clean & Corporate */}
          <section className="pb-24 md:pb-32">
            <div className="bg-white rounded-[3rem] p-10 md:p-16 lg:p-24 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 relative z-10">
                <div>
                  <div className="flex h-12 w-12 bg-ue-blue text-white rounded-2xl items-center justify-center shadow-lg shadow-blue-200 mb-6">
                    <ScrollText className="w-6 h-6" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-outfit tracking-tighter leading-tight">Marco <span className="text-ue-gold italic px-1">Legal</span></h2>
                  <p className="text-slate-500 text-lg font-medium mt-4 font-outfit">Documentación oficial y pública de transparencia institucional</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                {[
                  { title: "Código de Convivencia", type: "Documento PDF", size: "2.4 MB", color: "ue-blue" },
                  { title: "Plan Educativo Institucional (PEI)", type: "Documento PDF", size: "5.1 MB", color: "ue-blue" },
                  { title: "Reglamento Interno LOEI", type: "Plataforma Digital", size: "Acceso Externo", color: "ue-gold" }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group p-8 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-ue-blue/20 hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row justify-between items-center gap-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        {item.size.includes('externo') ? <Eye className="w-8 h-8 text-ue-gold" /> : <Flag className="w-8 h-8 text-ue-blue" />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-xl group-hover:text-ue-blue transition-colors leading-tight font-outfit">{item.title}</h4>
                        <div className="flex gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 font-outfit">
                          <span className="text-ue-blue/60">{item.type}</span>
                          <span className="opacity-30">•</span>
                          <span>{item.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={item.size.includes('externo') ? "outline" : "primary"}
                      icon={item.size.includes('externo') ? Eye : Download}
                      className="w-full sm:w-auto px-10 h-14 rounded-2xl group-hover:scale-105 transition-transform font-bold"
                    >
                      {item.size.includes('externo') ? 'Ver Enlace' : 'Descargar'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalPage;