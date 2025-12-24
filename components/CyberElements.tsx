
import React from 'react';

export const CyberButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  type?: 'button' | 'submit';
}> = ({ children, onClick, className = '', variant = 'primary', type = 'button' }) => {
  const baseClasses = "relative px-6 py-2 mono font-bold text-sm tracking-wider uppercase transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]",
    outline: "border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10",
    ghost: "text-white/40 hover:text-yellow-400 hover:bg-white/5"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current"></div>
      {children}
    </button>
  );
};

export const CyberBadge: React.FC<{
  label: string;
  variant?: 'gold' | 'silver' | 'neon';
}> = ({ label, variant = 'neon' }) => {
  const styles = {
    gold: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
    silver: "text-blue-200 border-blue-200/30 bg-blue-200/5",
    neon: "text-white/40 border-white/20 bg-white/5"
  };
  return (
    <span className={`text-[8px] mono font-black px-1.5 py-0.5 border uppercase tracking-widest ${styles[variant]}`}>
      {label}
    </span>
  );
};

export const CyberCard: React.FC<{
  children: React.ReactNode;
  title?: string;
  className?: string;
  subtitle?: string;
}> = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`cyber-border bg-black/40 backdrop-blur-md p-6 ${className}`}>
      {title && (
        <div className="mb-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="mono text-yellow-400 text-xs font-bold uppercase tracking-[0.3em]">{title}</h3>
            <div className="h-px bg-yellow-400/20 flex-grow ml-4"></div>
          </div>
          {subtitle && <p className="text-[10px] mono text-white/40 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      )}
      {children}
      <div className="cyber-border-br"></div>
    </div>
  );
};

export const CyberInput: React.FC<{
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}> = ({ label, type = 'text', placeholder, value, onChange, onKeyDown, required, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="min-h-[14px]">
        {label && <label className="block text-[10px] mono text-white/40 uppercase tracking-widest leading-none">{label}</label>}
      </div>
      <div className="relative group">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          className="w-full bg-white/5 border border-white/10 p-3 text-sm mono focus:border-yellow-400 focus:outline-none transition-all duration-300 placeholder:text-white/10"
        />
        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-400 transition-all duration-500 group-focus-within:w-full"></div>
      </div>
    </div>
  );
};

export const NeonTag: React.FC<{
  tag: 'POSITIVE' | 'NEUTRAL' | 'CONSTRUCTIVE';
}> = ({ tag }) => {
  const styles = {
    POSITIVE: "text-green-400 border-green-400/30 bg-green-400/5",
    NEUTRAL: "text-blue-400 border-blue-400/30 bg-blue-400/5",
    CONSTRUCTIVE: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 border mono uppercase ${styles[tag]}`}>
      {tag}
    </span>
  );
};
