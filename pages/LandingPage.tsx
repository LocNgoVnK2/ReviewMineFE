
import React from 'react';
import { Link } from 'react-router-dom';
import { CyberButton, CyberCard, NeonTag } from '../components/CyberElements';
import { useTranslation } from '../services/languageContext';

export const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-32 pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#facc1505_0%,transparent_70%)] pointer-events-none"></div>
        
        <div className="space-y-6 max-w-4xl relative z-10">
          <div className="mono text-[10px] font-bold text-yellow-400 tracking-[0.5em] uppercase animate-pulse">
            {t.landing.protocol}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            {t.landing.hero_h1} <br />
            <span className="text-yellow-400">{t.landing.hero_h1_span}</span>
          </h1>
          <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto mono uppercase tracking-wider leading-relaxed">
            {t.landing.hero_sub}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/register">
              <CyberButton className="px-12 py-4 text-lg">{t.landing.hero_cta_primary}</CyberButton>
            </Link>
            <Link to="/network">
              <CyberButton variant="outline" className="px-12 py-4 text-lg">{t.landing.hero_cta_secondary}</CyberButton>
            </Link>
          </div>
        </div>

        {/* Decorative Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
          <div className="mono text-[8px] text-white/20 uppercase tracking-[0.3em]">{t.landing.scroll}</div>
          <div className="w-px h-12 bg-gradient-to-b from-yellow-400/50 to-transparent"></div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="mono text-xs font-bold text-yellow-400 uppercase tracking-widest">{t.landing.problem_label}</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{t.landing.problem_h2}</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-1 h-6 bg-yellow-400/30 mt-1"></div>
              <p className="text-white/60 text-sm uppercase mono tracking-wide">{t.landing.problem_1}</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-1 h-6 bg-yellow-400/30 mt-1"></div>
              <p className="text-white/60 text-sm uppercase mono tracking-wide">{t.landing.problem_2}</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-1 h-6 bg-yellow-400/30 mt-1"></div>
              <p className="text-white/60 text-sm uppercase mono tracking-wide">{t.landing.problem_3}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 border border-yellow-400/10 rotate-3 pointer-events-none"></div>
          <CyberCard className="aspect-square flex items-center justify-center p-0">
             <div className="text-center space-y-2">
                <div className="text-6xl font-black text-yellow-400 opacity-20">?</div>
                <div className="mono text-[10px] text-white/20 uppercase tracking-[0.5em]">Undiscovered Potential</div>
             </div>
          </CyberCard>
        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="bg-yellow-400/5 py-24 border-y border-yellow-400/10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            {t.landing.solution_h2} <br /> <span className="text-yellow-400">{t.landing.solution_h2_span}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CyberCard title={t.landing.solution_card1_title} className="text-left">
              <p className="text-xs mono text-white/50 uppercase leading-relaxed mt-4">
                {t.landing.solution_card1_desc}
              </p>
            </CyberCard>
            <CyberCard title={t.landing.solution_card2_title} className="text-left">
              <p className="text-xs mono text-white/50 uppercase leading-relaxed mt-4">
                {t.landing.solution_card2_desc}
              </p>
            </CyberCard>
            <CyberCard title={t.landing.solution_card3_title} className="text-left">
              <p className="text-xs mono text-white/50 uppercase leading-relaxed mt-4">
                {t.landing.solution_card3_desc}
              </p>
            </CyberCard>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-2">
          <div className="mono text-xs text-yellow-400 font-bold uppercase tracking-[0.3em]">{t.landing.how_label}</div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">{t.landing.how_h2}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-yellow-400/10 -translate-y-1/2 z-0"></div>
          
          {[
            { step: "01", title: t.landing.step1_title, desc: t.landing.step1_desc },
            { step: "02", title: t.landing.step2_title, desc: t.landing.step2_desc },
            { step: "03", title: t.landing.step3_title, desc: t.landing.step3_desc }
          ].map((item, i) => (
            <div key={i} className="relative z-10 space-y-4 text-center">
              <div className="w-16 h-16 bg-black border border-yellow-400 mx-auto flex items-center justify-center mono font-black text-xl text-yellow-400">
                {item.step}
              </div>
              <h3 className="font-bold text-lg uppercase tracking-tight">{item.title}</h3>
              <p className="text-white/40 text-xs mono uppercase leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center pt-8">
          <Link to="/register">
            <CyberButton>{t.landing.how_cta}</CyberButton>
          </Link>
        </div>
      </section>

      {/* 5. SOCIAL PROOF / QUOTES */}
      <section className="max-w-4xl mx-auto px-6 space-y-12">
        <h2 className="text-center text-xl font-bold uppercase tracking-[0.4em] text-white/20 italic">{t.landing.social_label}</h2>
        <div className="space-y-6">
          {[
            "“I didn’t realize communication was my weak spot until I saw consistent feedback.”",
            "“It feels honest, but not hurtful. A mirror I actually want to look into.”",
            "“This is feedback I’d never get in a performance review meeting.”"
          ].map((quote, i) => (
            <div key={i} className="p-8 border-l-2 border-yellow-400/40 bg-white/5 italic text-lg text-white/80">
              {quote}
            </div>
          ))}
        </div>
      </section>

      {/* 8. TRUST & SAFETY */}
      <section className="max-w-6xl mx-auto px-6">
        <CyberCard className="border-blue-400/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-blue-400">{t.landing.safety_h2}</h2>
              <ul className="space-y-4">
                {[t.landing.safety_item1, t.landing.safety_item2, t.landing.safety_item3, t.landing.safety_item4].map(t => (
                  <li key={t} className="flex items-center space-x-3 text-xs mono uppercase tracking-widest text-white/60">
                    <div className="w-1 h-1 bg-blue-400"></div>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-blue-400/5 border border-blue-400/10 text-center space-y-4">
               <div className="text-4xl">🛡️</div>
               <p className="text-[10px] mono text-blue-400 uppercase font-bold tracking-[0.2em]">{t.landing.safety_card_label}</p>
               <p className="text-[10px] text-white/30 uppercase leading-relaxed">
                 {t.landing.safety_card_desc}
               </p>
            </div>
          </div>
        </CyberCard>
      </section>

      {/* 9. FINAL CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">
          {t.landing.final_cta_h2} <br /> <span className="text-yellow-400">{t.landing.final_cta_h2_span}</span>
        </h2>
        <Link to="/register" className="inline-block">
          <CyberButton className="px-16 py-5 text-xl">{t.landing.final_cta_button}</CyberButton>
        </Link>
        <p className="text-white/20 mono text-[10px] uppercase tracking-widest">{t.landing.final_cta_sub}</p>
      </section>
    </div>
  );
};
