
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CyberButton, CyberCard, CyberInput } from '../components/CyberElements';
import { useTranslation } from '../services/languageContext';

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/me');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block w-12 h-12 bg-yellow-400 rotate-45 mb-4">
            <div className="w-full h-full flex items-center justify-center -rotate-45">
              <span className="text-black font-black text-xl">R</span>
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">{t.auth.login_h1} <span className="text-yellow-400">{t.auth.login_h1_span}</span></h1>
          <p className="text-white/40 mono text-xs tracking-widest uppercase">{t.auth.login_sub}</p>
        </div>

        <CyberCard title={t.auth.login_card}>
          <form className="space-y-6" onSubmit={handleLogin}>
            <CyberInput label={t.auth.user_id} placeholder="username or email" required />
            <CyberInput label={t.auth.security_key} type="password" placeholder="••••••••" required />
            
            <div className="flex items-center justify-between text-[10px] mono uppercase tracking-wider">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="accent-yellow-400" />
                <span className="text-white/40 group-hover:text-white transition-colors">{t.auth.remember}</span>
              </label>
              <a href="#" className="text-yellow-400/60 hover:text-yellow-400 transition-colors">{t.auth.lost_key}</a>
            </div>

            <CyberButton type="submit" className="w-full py-4">{t.auth.init_session}</CyberButton>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] mono text-white/40 uppercase tracking-widest mb-4">{t.auth.new_network}</p>
            <Link to="/register">
              <CyberButton variant="outline" className="w-full">{t.auth.create_identity}</CyberButton>
            </Link>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/me');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-24">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase">{t.auth.reg_h1} <span className="text-yellow-400">{t.auth.reg_h1_span}</span></h1>
          <p className="text-white/40 mono text-xs tracking-widest uppercase">{t.auth.reg_sub}</p>
        </div>

        <CyberCard title={t.auth.reg_card} subtitle={t.auth.reg_card_sub}>
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CyberInput label={t.auth.full_desig} placeholder="Legal Name" required />
              <CyberInput label={t.auth.net_alias} placeholder="@username" required />
            </div>
            <CyberInput label={t.auth.uplink} type="email" placeholder="email@domain.com" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CyberInput label={t.auth.security_key} type="password" placeholder="••••••••" required />
              <CyberInput label={t.auth.confirm_key} type="password" placeholder="••••••••" required />
            </div>

            <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 space-y-2">
              <p className="text-[10px] mono text-yellow-400 font-bold uppercase tracking-widest">{t.auth.ethics}</p>
              <p className="text-[10px] text-white/40 leading-relaxed uppercase">
                {t.auth.ethics_desc}
              </p>
            </div>

            <CyberButton type="submit" className="w-full py-4">{t.auth.authorize}</CyberButton>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] mono text-white/40 uppercase tracking-widest mb-4">{t.auth.already_sync}</p>
            <Link to="/login">
              <CyberButton variant="outline" className="w-full">{t.auth.existing_access}</CyberButton>
            </Link>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};
