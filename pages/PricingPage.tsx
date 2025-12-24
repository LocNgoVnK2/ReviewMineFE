
import React from 'react';
import { CyberButton, CyberCard } from '../components/CyberElements';
import { useTranslation } from '../services/languageContext';

export const PricingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-24 px-6 max-w-6xl mx-auto space-y-16">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="mono text-[10px] font-bold text-yellow-400 tracking-[0.4em] uppercase">{t.pricing.mining_tiers}</div>
        <h1 className="text-6xl font-black tracking-tighter uppercase">{t.pricing.power_growth} <span className="text-yellow-400">{t.pricing.growth}</span></h1>
        <p className="text-white/40 mono text-xs uppercase leading-relaxed tracking-wider">
          {t.pricing.sub}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* FREE PLAN */}
        <CyberCard className="relative overflow-hidden group">
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight uppercase">{t.pricing.free_title}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black">0</span>
                <span className="text-xs mono text-white/40 uppercase">{t.pricing.mo}</span>
              </div>
            </div>

            <ul className="space-y-4">
              {t.pricing.features_free.map((feature: string) => (
                <li key={feature} className="flex items-center space-x-3 text-[10px] mono uppercase text-white/60">
                  <div className="w-1.5 h-1.5 bg-white/20"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <CyberButton variant="outline" className="w-full">{t.pricing.active}</CyberButton>
          </div>
        </CyberCard>

        {/* PRO PLAN */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-yellow-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
          <CyberCard className="relative border-yellow-400/50">
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">{t.pricing.recommended}</div>
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase text-yellow-400">{t.pricing.pro_title}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-black">15,000</span>
                  <span className="text-xs mono text-white/40 uppercase">{t.pricing.mo}</span>
                </div>
              </div>

              <ul className="space-y-4">
                {t.pricing.features_pro.map((feature: string) => (
                  <li key={feature} className="flex items-center space-x-3 text-[10px] mono uppercase text-yellow-400">
                    <div className="w-1.5 h-1.5 bg-yellow-400"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <CyberButton className="w-full">{t.pricing.upgrade}</CyberButton>
            </div>
          </CyberCard>
        </div>
      </div>

      <section className="max-w-3xl mx-auto pt-12 space-y-8">
        <div className="line-accent opacity-20"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2">
            <p className="text-[10px] mono text-yellow-400 uppercase font-bold tracking-widest">{t.pricing.self_aware}</p>
            <p className="text-[10px] text-white/30 uppercase">{t.pricing.self_aware_desc}</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[10px] mono text-yellow-400 uppercase font-bold tracking-widest">{t.pricing.anon}</p>
            <p className="text-[10px] text-white/30 uppercase">{t.pricing.anon_desc}</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[10px] mono text-yellow-400 uppercase font-bold tracking-widest">{t.pricing.const}</p>
            <p className="text-[10px] text-white/30 uppercase">{t.pricing.const_desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
