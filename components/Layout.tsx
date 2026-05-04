import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, Phone, Mail, MapPin, User, LogOut, ChevronRight, LayoutDashboard, Globe, Shield, Award, Facebook, Twitter, Instagram, Linkedin, Youtube, Bell, Info, AlertOctagon, CheckCircle } from 'lucide-react';
import { useAuth } from '../services/authContext';
import { AnnouncementService } from '../services/announcementService';
import { Announcement } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Check if we are on the Home Page
  const isHome = location.pathname === '/';

  // Handle Scroll Effect with optimizations
  useEffect(() => {
    const handleScroll = () => {
      // Increased threshold to 50px so it feels like it only changes when leaving the very top
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // --- Announcements Logic ---
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    const fetchAnnouncements = () => {
      const active = AnnouncementService.getActiveAnnouncements();
      setActiveAnnouncements(active);
    };

    fetchAnnouncements();
    // Poll every minute for updates
    const interval = setInterval(fetchAnnouncements, 60000);

    // Load dismissed from session storage
    const saved = sessionStorage.getItem('dismissed_announcements');
    if (saved) setDismissedAnnouncements(JSON.parse(saved));

    return () => clearInterval(interval);
  }, []);

  const dismissAnnouncement = (id: string) => {
    const newDismissed = [...dismissedAnnouncements, id];
    setDismissedAnnouncements(newDismissed);
    sessionStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed));
  };

  const visibleAnnouncements = activeAnnouncements.filter(a => !dismissedAnnouncements.includes(a.id));

  // Dynamic Navigation Link Component
  const NavLink = ({ to, label }: { to: string, label: string }) => {
    const active = location.pathname === to;

    // Base styles
    const baseClasses = "relative px-2 lg:px-4 py-2 rounded-none text-sm font-semibold transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center group overflow-hidden";

    // Colors change based on scroll state
    const textClass = scrolled
      ? (active ? 'text-ue-blue' : 'text-slate-600 hover:text-ue-blue')
      : (active ? 'text-white' : 'text-blue-100 hover:text-white');

    return (
      <Link to={to} className={`${baseClasses} ${textClass}`}>
        <span className="relative z-10">{label}</span>

        {/* Animated Background Pill */}
        <span className={`absolute inset-0 rounded-none transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) ${scrolled
          ? (active ? 'bg-white scale-100 opacity-100' : 'bg-slate-100 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100')
          : (active ? 'bg-white/15 scale-100 opacity-100' : 'bg-white/10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100')
          }`}></span>

        {/* Dynamic Bottom Line */}
        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-800 cubic-bezier(0.34, 1.56, 0.64, 1) ${active ? 'w-1/2 opacity-100 text-ue-gold' : 'w-0 opacity-0'
          } ${scrolled ? 'bg-ue-blue' : 'bg-ue-gold shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`}></span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans selection:bg-ue-gold/30 selection:text-ue-blue">

      {/* Top Bar - Slides Up on Scroll - Enhanced Design */}
      <div className={`hidden md:block fixed top-0 w-full bg-slate-900 text-white z-[60] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${scrolled ? '-translate-y-full' : 'translate-y-0'
        }`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center h-10">
          {/* Left Side: Contact Info */}
          <div className="flex items-center gap-6 text-[11px] font-medium tracking-wide text-slate-300 animate-fade-in">
            <a href="mailto:secretaria@uecibgab.edu.ec" className="flex items-center gap-2 hover:text-ue-gold transition-colors group">
              <Mail className="w-3.5 h-3.5 text-slate-500 group-hover:text-ue-gold transition-colors" />
              <span>secretaria@uecibgab.edu.ec</span>
            </a>
            <div className="w-px h-3 bg-slate-700/50"></div>
            <a href="tel:+593991234567" className="flex items-center gap-2 hover:text-ue-gold transition-colors group">
              <Phone className="w-3.5 h-3.5 text-slate-500 group-hover:text-ue-gold transition-colors" />
              <span>+593 99 123 4567</span>
            </a>
          </div>

          {/* Right Side: Docentes & Admisiones */}
          <div className="flex items-center gap-4 h-full">
            <Link to="/login" className="text-[11px] font-semibold text-slate-300 hover:text-white transition-colors">
              Docentes
            </Link>

            {/* Admisiones Button */}
            <Link to="/oferta" className="h-10 bg-ue-blue hover:bg-ue-gold text-white hover:text-ue-blue px-6 flex items-center justify-center font-bold uppercase text-[10px] tracking-widest transition-all duration-300 relative group overflow-hidden">
              <span className="relative z-10">Admisiones</span>
              <div className="absolute inset-0 bg-ue-gold/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar - Morphs and Resizes */}
      <header
        className={`fixed w-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex items-center ${isMenuOpen ? 'z-[130]' : 'z-50'
          } ${(scrolled || isMenuOpen)
            ? 'top-0 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-xl shadow-slate-900/5'
            : `top-8 md:top-[33px] h-20 sm:h-24 border-b border-white/5 shadow-none ${isHome ? 'bg-transparent' : 'bg-ue-blue'}`
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center h-full">

          {/* Logo Section - Morphs */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative z-50 h-full">
            <div className={`flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${(scrolled || isMenuOpen)
              ? 'bg-ue-blue text-white w-9 h-9 sm:w-10 sm:h-10 shadow-lg shadow-blue-900/10 rotate-0'
              : 'bg-white/10 text-ue-gold w-11 h-11 sm:w-12 sm:h-12 border border-white/10 shadow-inner -rotate-3 group-hover:rotate-0'
              }`}>
              <GraduationCap className={`transition-all duration-600 cubic-bezier(0.34, 1.56, 0.64, 1) ${(scrolled || isMenuOpen) ? 'h-5 w-5' : 'h-6 w-6 sm:h-7 sm:w-7'}`} />
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <h1 className={`font-bold tracking-tight leading-none transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1) whitespace-nowrap ${(scrolled || isMenuOpen) ? 'text-base sm:text-lg text-slate-800' : 'text-lg sm:text-xl text-white'
                }`}>
                UECIB GAB
              </h1>
              <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1) ${(scrolled || isMenuOpen) ? 'text-slate-500 h-0 opacity-0 -translate-y-2' : 'text-blue-100 mt-1 opacity-100 h-auto translate-y-0'
                }`}>
                Gustavo Adolfo Bécquer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 h-full">
            <div className="flex items-center gap-1 bg-transparent px-2 py-1 rounded-full">
              <NavLink to="/" label="Inicio" />
              <NavLink to="/institucional" label="Institucional" />
              <NavLink to="/oferta" label="Oferta" />
              <NavLink to="/noticias" label="Noticias" />
              <NavLink to="/contacto" label="Contacto" />
            </div>

            <div className={`h-8 w-px mx-2 lg:mx-4 transition-colors duration-500 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`}></div>

            <div className="flex items-center pl-1">
              {user ? (
                <div className="flex items-center gap-3 animate-fade-in">
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      title="Administración"
                      className={`p-2 rounded-none transition-all duration-300 ${scrolled
                        ? 'text-slate-400 hover:text-ue-gold hover:bg-ue-light-blue/10'
                        : 'text-white/60 hover:text-ue-gold hover:bg-white/10'
                        }`}
                    >
                      <Shield className="h-5 w-5" />
                    </Link>
                  )}
                  <Link
                    to="/repositorio"
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-none font-bold text-sm shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm ${scrolled
                      ? 'bg-ue-blue text-white hover:bg-ue-light-blue hover:border-ue-light-blue'
                      : 'bg-ue-gold text-ue-blue hover:bg-ue-gold-light hover:border-ue-gold-light'
                      }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden lg:inline">Panel</span>
                  </Link>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-none transition-all duration-300 ${scrolled
                      ? 'text-slate-400 hover:text-white hover:bg-red-600'
                      : 'text-white/60 hover:text-white hover:bg-red-600/90'
                      }`}
                    title="Cerrar Sesión"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-sm font-semibold transition-all duration-300 border backdrop-blur-sm group ${scrolled
                    ? 'bg-slate-50 text-slate-700 border-slate-200 hover:border-ue-gold hover:text-ue-blue hover:bg-ue-gold/10'
                    : 'bg-white/10 text-white border-white/10 hover:bg-ue-gold hover:text-ue-blue hover:border-ue-gold'
                    }`}
                >
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Docentes</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Toggle Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden relative z-50 p-2.5 rounded-none transition-all duration-500 focus:outline-none active:scale-90 ${(scrolled || isMenuOpen)
              ? 'text-slate-800 bg-slate-50 hover:bg-ue-light-blue/10 hover:text-ue-blue'
              : 'text-white bg-white/10 hover:bg-ue-gold/20 hover:text-ue-gold'
              }`}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className={`absolute block h-0.5 w-6 bg-current rounded-full transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current rounded-full transition-all duration-500 ${isMenuOpen ? 'opacity-0 -translate-x-2' : 'opacity-100'}`}></span>
              <span className={`absolute block h-0.5 w-6 bg-current rounded-full transition-all duration-500 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Cinematic Blur */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={toggleMenu}
      ></div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-2xl shadow-2xl z-[110] md:hidden transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full bg-slate-50/50 relative overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ue-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Mobile Header */}
          <div className="p-5 border-b border-slate-100 bg-white pt-16 sm:pt-20">
            <div className="flex items-center gap-3 text-ue-blue mb-1">
              <div className="p-2 bg-blue-50 rounded-xl">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">UECIB GAB</h2>
            </div>
            <p className="text-[10px] text-slate-500 ml-12 font-medium uppercase tracking-wider">Unidad Educativa Intercultural Bilingüe</p>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 overflow-y-auto py-8 px-5 space-y-3">
            {[
              { to: "/", label: "Inicio", icon: Globe },
              { to: "/institucional", label: "Institucional", icon: GraduationCap },
              { to: "/oferta", label: "Oferta Educativa", icon: LayoutDashboard },
              { to: "/noticias", label: "Noticias", icon: Mail },
              { to: "/contacto", label: "Contacto", icon: Phone },
            ].map((item, idx) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className={`flex items-center justify-between p-4 rounded-none transition-all duration-300 group ${isActive
                    ? 'bg-ue-blue text-white shadow-lg shadow-blue-900/20 translate-x-2'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-blue-100 hover:translate-x-1'
                    }`}
                  onClick={toggleMenu}
                  style={{
                    transitionDelay: `${idx * 40}ms`,
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? 'none' : 'translateX(20px)'
                  }}
                >
                  <span className="flex items-center gap-4 font-semibold text-sm">
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/10 text-ue-gold' : 'bg-slate-50 text-slate-400 group-hover:text-ue-blue group-hover:bg-blue-50'}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {item.label}
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isActive ? 'text-white/40' : 'text-slate-300'}`} />
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer Area */}
          <div className={`p-6 bg-white border-t border-slate-100 transition-all duration-700 delay-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4 px-3 py-3 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-ue-blue text-white flex items-center justify-center font-bold text-lg shadow-blue-900/20">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user.role}</p>
                  </div>
                </div>
                <Link to="/repositorio" className="w-full flex items-center justify-center gap-2 bg-ue-gold text-ue-blue font-bold px-4 py-4 rounded-none shadow-sm active:scale-95 transition-all hover:bg-ue-gold-light hover:border-ue-gold-light hover:text-ue-blue hover:shadow-sm border border-ue-gold" onClick={toggleMenu}>
                  <LayoutDashboard className="w-5 h-5" /> Repositorio
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="w-full flex items-center justify-center gap-2 bg-ue-dark-blue text-white font-bold px-4 py-4 rounded-none shadow-sm active:scale-95 transition-all hover:bg-ue-light-blue hover:border-ue-light-blue hover:text-white hover:shadow-sm border border-ue-dark-blue" onClick={toggleMenu}>
                    <Shield className="w-5 h-5" /> Administración
                  </Link>
                )}
                <button onClick={() => { logout(); toggleMenu(); }} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold px-4 py-3.5 rounded-none hover:bg-red-600 hover:text-white transition-all border border-transparent hover:border-red-600">
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest px-2">Portal Administrativo</p>
                <Link to="/login" className="w-full flex items-center justify-center gap-3 bg-ue-blue text-white font-bold px-4 py-4 rounded-none shadow-sm active:scale-95 transition-all hover:bg-ue-gold hover:text-ue-blue hover:shadow-sm border border-ue-blue hover:border-ue-gold group" onClick={toggleMenu}>
                  <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-ue-gold group-hover:text-ue-blue transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  Repositorio Institucional
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer Logic: 
          On Home: h-0 to let Hero image sit behind the transparent navbar.
          Other Pages: h-24/32 to push content down below the solid navbar. 
      */}
      <div className={`${isHome ? 'h-0' : 'h-28 md:h-32'} transition-all duration-500`}></div>

      {/* Main Content */}
      <main className="flex-grow relative z-0 animate-fade-in">
        {/* Global Announcements Banner */}
        {visibleAnnouncements.length > 0 && (
          <div className="container mx-auto px-4 lg:px-8 relative z-50">
            <div className="space-y-3 pt-4">
              {visibleAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-lg animate-slide-up transition-all duration-500 ${ann.type === 'urgent' ? 'bg-red-50/90 border-red-200 text-red-900' :
                    ann.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-900' :
                      ann.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' :
                        'bg-blue-50/90 border-blue-200 text-blue-900'
                    }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${ann.type === 'urgent' ? 'bg-red-100 text-red-600' :
                    ann.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                      ann.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {ann.type === 'urgent' ? <AlertOctagon className="h-5 w-5" /> :
                      ann.type === 'warning' ? <Bell className="h-5 w-5" /> :
                        ann.type === 'success' ? <CheckCircle className="h-5 w-5" /> :
                          <Info className="h-5 w-5" />}
                  </div>
                  <div className="flex-grow pt-0.5">
                    <h4 className="text-sm font-black uppercase tracking-tight font-outfit">{ann.title}</h4>
                    <p className="text-xs font-medium opacity-80 mt-1 leading-relaxed">{ann.content}</p>
                  </div>
                  <button
                    onClick={() => dismissAnnouncement(ann.id)}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors group"
                    aria-label="Cerrar anuncio"
                  >
                    <X className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ue-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-ue-gold p-2.5 rounded-xl text-ue-blue shadow-lg shadow-yellow-500/10">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">UECIB GAB</h3>
            </div>
            <p className="text-slate-400 text-base leading-relaxed font-light">
              Formando líderes con identidad cultural y excelencia académica para el futuro del Ecuador.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-ue-gold hover:text-ue-blue hover:border-ue-gold cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-90" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-ue-gold hover:text-ue-blue hover:border-ue-gold cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-90" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-ue-gold hover:text-ue-blue hover:border-ue-gold cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-90" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-ue-gold hover:text-ue-blue hover:border-ue-gold cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-90" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-ue-gold hover:text-ue-blue hover:border-ue-gold cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-90" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="sm:pl-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ue-gold mb-8 opacity-90">Institución</h3>
            <ul className="space-y-4 text-sm text-slate-300 font-medium">
              <li><Link to="/institucional" className="hover:text-white transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-3 group-hover:bg-ue-gold transition-all"></span>Misión y Visión</Link></li>
              <li><Link to="/institucional" className="hover:text-white transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-3 group-hover:bg-ue-gold transition-all"></span>Historia</Link></li>
              <li><Link to="/institucional" className="hover:text-white transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-3 group-hover:bg-ue-gold transition-all"></span>Autoridades</Link></li>
            </ul>
          </div>

          <div className="sm:pl-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ue-gold mb-8 opacity-90">Comunidad</h3>
            <ul className="space-y-4 text-sm text-slate-300 font-medium">
              <li><Link to="/noticias" className="hover:text-white transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-3 group-hover:bg-ue-gold transition-all"></span>Noticias</Link></li>
              <li><Link to="/oferta" className="hover:text-white transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-3 group-hover:bg-ue-gold transition-all"></span>Admisiones</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-3 group-hover:bg-ue-gold transition-all"></span>Repositorio Institucional</Link></li>
            </ul>
          </div>

          <div className="sm:pl-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ue-gold mb-8 opacity-90">Contacto</h3>
            <ul className="space-y-5 text-sm text-slate-300">
              <li className="flex items-start space-x-4">
                <div className="p-2 bg-white/5 rounded-lg shrink-0">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <span className="hover:text-white transition-colors cursor-pointer leading-relaxed">Comunidad Compañía Lote 2, Parroquia Cangahua, Cayambe, Pichincha, Ecuador.</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="p-2 bg-white/5 rounded-lg shrink-0">
                  <Award className="h-4 w-4 text-slate-400" />
                </div>
                <span className="hover:text-white transition-colors cursor-pointer">Código DINEIB: 17B00153</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} UECIB Gustavo Adolfo Bécquer. Desarrollado por Santiago con estándares MINEDUC.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-ue-gold transition-colors">Política de Privacidad</Link>
            <Link to="#" className="hover:text-ue-gold transition-colors">Términos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;