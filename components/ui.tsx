import React from 'react';
import { createPortal } from 'react-dom';
import { LucideIcon, X } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, noPadding = false }) => (
  <div className={`bg-white rounded-none shadow-[0_2px_8px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] ${className}`}>
    {title && (
      <div className="bg-white/50 backdrop-blur-sm px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
      </div>
    )}
    <div className={noPadding ? '' : 'p-6'}>
      {children}
    </div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  const variants = {
    primary: "bg-ue-blue text-white hover:bg-ue-light-blue border-ue-blue hover:border-ue-light-blue shadow-sm hover:shadow-md focus:ring-ue-blue border transition-colors",
    secondary: "bg-ue-gold text-ue-blue hover:bg-ue-gold-light border-ue-gold hover:border-ue-gold-light shadow-sm hover:shadow-md focus:ring-ue-gold border transition-colors",
    danger: "bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 hover:shadow-sm focus:ring-red-500 transition-colors",
    outline: "bg-white text-ue-blue border border-ue-blue/20 hover:bg-blue-50 hover:text-ue-light-blue hover:border-ue-light-blue hover:shadow-sm focus:ring-blue-100 transition-colors",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-ue-blue shadow-none border border-transparent hover:border-slate-100 transition-colors"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`${size === 'sm' ? 'mr-1.5 h-3.5 w-3.5' : 'mr-2 h-4 w-4'}`} />}
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string; className?: string }> = ({ children, color = 'blue', className = '' }) => {
  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    yellow: 'bg-amber-50 text-amber-700 border-amber-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-rose-50 text-rose-700 border-rose-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  const selectedStyle = colorStyles[color] || colorStyles.blue;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold border ${selectedStyle} ${className}`}>
      {children}
    </span>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, noPadding = false, maxWidth = 'max-w-2xl' }) => {
  // Escape key listener and Scroll lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-10 overflow-hidden">
      {/* Backdrop - Increased Z and Blur */}
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-[12px] transition-opacity duration-500 animate-fade-in z-0"
        onClick={onClose}
      ></div>

      {/* Modal Content container - Sharp Edges Minimalist */}
      <div
        className={`bg-white shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] w-full ${maxWidth} max-h-[95vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-hidden animate-slide-up sm:animate-scale-in flex flex-col relative z-50 border border-white/20`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
      >
        {/* Mobile Handle */}
        <div className="w-12 h-1 bg-slate-200 mx-auto mt-3 mb-1 sm:hidden shrink-0"></div>
        {/* Header - Sticky with higher glassmorphism */}
        <div className="flex justify-between items-center px-6 py-5 md:px-8 border-b border-gray-100/80 bg-white/95 backdrop-blur-md shrink-0 sticky top-0 z-50">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 line-clamp-1 pr-10 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="group text-slate-400 hover:text-red-500 hover:bg-red-50 p-2.5 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            aria-label="Cerrar modal"
          >
            <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {/* Body with Internal Scroll */}
        <div className="overflow-y-auto flex-grow overscroll-contain scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className={`${noPadding ? '' : 'p-6 md:p-8'} pb-12 relative`}>
            {children}
          </div>
        </div>

        {/* Bottom Fade - Visual indicator for scroll */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-[60]"></div>
      </div>
    </div>,
    document.body
  );
};