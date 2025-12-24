
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { CyberButton, CyberCard, NeonTag, CyberBadge, CyberInput } from './components/CyberElements';
import { MirrorChart } from './components/RadarChart';
import { FeedbackTag, DomainType, Review, UserProfile, MicroPost } from './types';
import { getMirrorInsight } from './services/geminiService';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { PricingPage } from './pages/PricingPage';
import { LandingPage } from './pages/LandingPage';
import { LanguageProvider, useTranslation } from './services/languageContext';

// --- NAV BAR COMPONENT ---
const Navbar = () => {
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-yellow-400/10 h-16">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-yellow-400 rotate-45 group-hover:rotate-180 transition-all duration-500 flex items-center justify-center">
            <div className="-rotate-45 group-hover:rotate-[-180deg] transition-all duration-500 font-black text-black text-xs">R</div>
          </div>
          <span className="mono text-lg font-black tracking-tighter uppercase">REVIEW<span className="text-yellow-400">MINE</span></span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-[10px] mono font-bold uppercase tracking-[0.2em] text-white/60">
          <Link to="/network" className={`hover:text-yellow-400 transition-colors ${location.pathname === '/network' ? 'text-yellow-400' : ''}`}>{t.nav.network}</Link>
          <Link to="/pricing" className={`hover:text-yellow-400 transition-colors ${location.pathname === '/pricing' ? 'text-yellow-400' : ''}`}>{t.nav.pricing}</Link>
          <Link to="/dashboard" className={`hover:text-yellow-400 transition-colors ${location.pathname === '/dashboard' ? 'text-yellow-400' : ''}`}>{t.nav.dashboard}</Link>
          <Link to="/me" className={`hover:text-yellow-400 transition-colors ${location.pathname.startsWith('/profile') || location.pathname === '/me' ? 'text-yellow-400' : ''}`}>{t.nav.profile}</Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-white/10 p-0.5">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 mono text-[10px] uppercase font-bold transition-all ${language === 'en' ? 'bg-yellow-400 text-black' : 'text-white/40 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('vi')}
              className={`px-2 py-1 mono text-[10px] uppercase font-bold transition-all ${language === 'vi' ? 'bg-yellow-400 text-black' : 'text-white/40 hover:text-white'}`}
            >
              VN
            </button>
          </div>
          <Link to="/login">
            <CyberButton variant="outline" className="scale-75 origin-right">{t.nav.access}</CyberButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// --- MODAL COMPONENT FOR ATTRIBUTE EDITING ---
const AttributeEditModal = ({ 
  isOpen, 
  onClose, 
  title, 
  items, 
  onUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  items: string[]; 
  onUpdate: (items: string[]) => void 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    if (isOpen) setLocalItems(items);
  }, [isOpen, items]);

  if (!isOpen) return null;

  const addItem = () => {
    if (inputValue.trim() && !localItems.includes(inputValue.trim())) {
      setLocalItems([...localItems, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeItem = (item: string) => {
    setLocalItems(localItems.filter(i => i !== item));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <CyberCard title={title} className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="space-y-6">
          <div className="flex gap-2">
            <CyberInput 
              className="flex-grow"
              placeholder="Module designation..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
            />
            <CyberButton onClick={addItem} className="h-full">ADD</CyberButton>
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scroll">
            {localItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 hover:border-yellow-400/30 transition-all">
                <span className="mono text-xs text-white/80">{item}</span>
                <button 
                  onClick={() => removeItem(item)}
                  className="text-red-500/50 hover:text-red-500 mono text-[10px] uppercase font-bold tracking-widest"
                >
                  [ REMOVE ]
                </button>
              </div>
            ))}
            {localItems.length === 0 && (
              <p className="text-center py-8 text-white/20 mono text-[10px] uppercase tracking-[0.2em]">Zero Modules Active</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
            <button onClick={onClose} className="mono text-[10px] uppercase text-white/40 hover:text-white px-4">Cancel</button>
            <CyberButton onClick={() => { onUpdate(localItems); onClose(); }}>Commit Protocol</CyberButton>
          </div>
        </div>
      </CyberCard>
    </div>
  );
};

// --- MAIN PAGES ---

const Dashboard = ({ users, onUpdateUser }: { users: UserProfile[], onUpdateUser: (u: UserProfile) => void }) => {
  const { t } = useTranslation();
  const initialUser = useMemo(() => users.find(u => u.id === 'me') || users[0], [users]);
  const [formData, setFormData] = useState<UserProfile>(initialUser);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingAttr, setEditingAttr] = useState<{title: string, key: 'personality' | 'interests' | 'habits'} | null>(null);

  useEffect(() => {
    setFormData(initialUser);
  }, [initialUser]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const handleDomainToggle = (domain: DomainType) => {
    const newDomains = formData.activeDomains.includes(domain)
      ? formData.activeDomains.filter(d => d !== domain)
      : [...formData.activeDomains, domain];
    setFormData({ ...formData, activeDomains: newDomains });
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{t.dashboard.title}</h1>
          <p className="text-white/40 mono text-xs uppercase tracking-widest">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/me"><CyberButton variant="outline" className="scale-90">View Profile</CyberButton></Link>
          <CyberButton onClick={handleSave} className="md:w-auto w-full" variant={saveSuccess ? "outline" : "primary"}>
            {isSaving ? t.dashboard.saving : saveSuccess ? `✓ ${t.dashboard.saved}` : t.dashboard.save_changes}
          </CyberButton>
        </div>
      </header>

      <div className="space-y-12">
        {/* 1. PUBLIC IDENTITY - Grid Alignment Refined */}
        <CyberCard title={t.dashboard.identity_header} subtitle={t.dashboard.identity_desc}>
          <div className="space-y-8 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <CyberInput 
                label={t.dashboard.name_label} 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <CyberInput 
                label={t.common.net_alias} 
                value={`@${formData.username}`} 
                onChange={(e) => setFormData({...formData, username: e.target.value.replace('@', '')})}
              />
            </div>
            <div className="w-full">
              <CyberInput 
                label={t.dashboard.specialization_label} 
                value={formData.specialization} 
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              />
            </div>
          </div>
        </CyberCard>

        {/* 2. REPUTATION MANAGEMENT */}
        <CyberCard title={t.dashboard.reputation_header} subtitle={t.dashboard.reputation_desc}>
          <div className="space-y-6 pt-2">
            <p className="text-[10px] mono text-yellow-400/60 uppercase italic">{t.dashboard.domain_warning}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.values(DomainType).map(domain => {
                const isActive = formData.activeDomains.includes(domain);
                return (
                  <button
                    key={domain}
                    onClick={() => handleDomainToggle(domain)}
                    className={`p-4 border mono text-[10px] uppercase text-center transition-all relative h-20 flex items-center justify-center ${
                      isActive ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 font-bold' : 'border-white/10 text-white/30 hover:border-white/30'
                    }`}
                  >
                    {t.domains[domain as keyof typeof t.domains] || domain}
                    {isActive && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 shadow-[0_0_5px_#facc15]"></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </CyberCard>

        {/* 3. CHARACTER MODULES */}
        <CyberCard title={t.dashboard.attributes_header} subtitle={t.dashboard.attributes_desc}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-2">
            {[
              { label: t.common.personality, key: 'personality' as const, color: 'text-white/60', bg: 'bg-white/5' },
              { label: t.common.interests, key: 'interests' as const, color: 'text-yellow-400/80', bg: 'bg-yellow-400/5' },
              { label: t.common.habits, key: 'habits' as const, color: 'text-blue-400/80', bg: 'bg-blue-400/5' }
            ].map(attr => (
              <div key={attr.key} className="space-y-4 flex flex-col">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h4 className="text-[10px] mono text-white/40 uppercase tracking-widest">{attr.label}</h4>
                  <button 
                    onClick={() => setEditingAttr({ title: `SYNC ${attr.label}`, key: attr.key })}
                    className="text-[8px] mono text-yellow-400 uppercase hover:underline font-bold"
                  >
                    [ {t.dashboard.edit_tags} ]
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData[attr.key] as string[] || []).map(p => (
                    <span key={p} className={`px-2 py-1 text-[9px] mono border border-white/10 ${attr.bg} ${attr.color}`}>
                      {p}
                    </span>
                  ))}
                  {(!formData[attr.key] || (formData[attr.key] as string[]).length === 0) && (
                    <span className="text-[9px] mono text-white/10 uppercase italic">Idle Module</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>

      <AttributeEditModal 
        isOpen={!!editingAttr}
        onClose={() => setEditingAttr(null)}
        title={editingAttr?.title || ''}
        items={(editingAttr ? formData[editingAttr.key] as string[] : []) || []}
        onUpdate={(newItems) => {
          if (editingAttr) {
            setFormData({ ...formData, [editingAttr.key]: newItems });
          }
        }}
      />
    </div>
  );
};

const Feed = ({ users, posts }: { users: UserProfile[], posts: MicroPost[] }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [insightPage, setInsightPage] = useState(1);
  const [activeDomain, setActiveDomain] = useState<DomainType>(DomainType.PROFESSIONAL);
  const postsPerPage = 2;

  const featuredByDomain = useMemo(() => {
    const domains = Object.values(DomainType);
    const result: Record<string, UserProfile[]> = {};
    domains.forEach(domain => {
      const topUsers = users
        .filter(u => u.activeDomains.includes(domain))
        .sort((a, b) => b.trustScore - a.trustScore)
        .slice(0, 3);
      if (topUsers.length > 0) result[domain] = topUsers;
    });
    return result;
  }, [users]);

  const availableDomains = useMemo(() => Object.keys(featuredByDomain) as DomainType[], [featuredByDomain]);
  const trendingProfiles = useMemo(() => [...users].sort((a, b) => (b.weeklyReviews || 0) - (a.weeklyReviews || 0)).slice(0, 5), [users]);
  const paginatedPosts = useMemo(() => posts.slice((insightPage - 1) * postsPerPage, insightPage * postsPerPage), [posts, insightPage]);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const currentPodiumUsers = useMemo(() => {
    const dUsers = featuredByDomain[activeDomain] || [];
    const podium = [];
    if (dUsers[1]) podium.push({ ...dUsers[1], rank: 2 });
    if (dUsers[0]) podium.push({ ...dUsers[0], rank: 1 });
    if (dUsers[2]) podium.push({ ...dUsers[2], rank: 3 });
    return podium;
  }, [featuredByDomain, activeDomain]);

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 space-y-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            {t.common.node_network_pre}<span className="text-yellow-400">{t.common.node_network_mid}</span>{t.common.node_network_post}
          </h1>
          <p className="text-white/40 mono text-xs uppercase tracking-widest">{t.common.network_sub}</p>
        </div>
        <div className="w-full md:w-80">
          <CyberInput placeholder={t.common.search_placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-20">
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="mono text-sm font-bold text-yellow-400 tracking-[0.3em] uppercase">⭐ {t.common.top_miners_in}</h2>
              <div className="flex flex-wrap gap-2">
                {availableDomains.map(domain => (
                  <button key={domain} onClick={() => setActiveDomain(domain)} className={`px-3 py-1 mono text-[10px] uppercase border transition-all ${activeDomain === domain ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-white/5 text-white/40 border-white/10 hover:border-yellow-400/50 hover:text-white'}`}>{t.domains[domain as keyof typeof t.domains] || domain}</button>
                ))}
              </div>
            </div>
            <div className="h-px bg-yellow-400/10 w-full mb-12"></div>
            <div className="relative flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-0 h-auto md:h-[360px] pt-8">
              {currentPodiumUsers.length > 0 ? currentPodiumUsers.map((user) => {
                const isTop1 = user.rank === 1;
                return (
                  <div key={user.id} className={`w-full md:w-1/3 transition-all duration-500 hover:z-20 ${isTop1 ? 'md:scale-110 z-10' : 'md:scale-90 opacity-70 hover:opacity-100'} ${user.rank === 2 ? 'md:translate-x-4' : user.rank === 3 ? 'md:-translate-x-4' : ''}`}>
                    <Link to={`/profile/${user.id}`} className="block h-full group">
                      <CyberCard className={`h-full flex flex-col items-center justify-center text-center p-8 transition-all ${isTop1 ? 'border-yellow-400 border-2 bg-yellow-400/10' : 'border-white/10 group-hover:border-yellow-400/40'}`}>
                        <div className={`absolute -top-3 px-3 py-0.5 mono font-black text-[10px] tracking-widest ${isTop1 ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/40'}`}>0{user.rank}</div>
                        <img src={user.avatar} className={`rounded-none border mb-4 transition-all duration-300 ${isTop1 ? 'w-24 h-24 border-yellow-400' : 'w-16 h-16 border-white/10 grayscale group-hover:grayscale-0'}`} alt={user.name} />
                        <h4 className={`font-bold uppercase tracking-tight mb-1 ${isTop1 ? 'text-lg text-yellow-400' : 'text-sm text-white/70'}`}>{user.name}</h4>
                        <p className="text-[10px] mono text-white/30 uppercase mb-4 italic">@{user.username}</p>
                        <div className={`mt-auto pt-4 border-t w-full ${isTop1 ? 'border-yellow-400/20' : 'border-white/5'}`}><p className="text-[8px] mono text-white/40 uppercase tracking-widest">{t.common.trust_rank}</p><p className={`font-black ${isTop1 ? 'text-3xl text-yellow-400' : 'text-xl text-white/70'}`}>{user.trustScore}</p></div>
                      </CyberCard>
                    </Link>
                  </div>
                );
              }) : <div className="py-20 text-center border border-dashed border-white/10 w-full mono text-xs text-white/20 uppercase tracking-[0.4em]">No miners in this domain yet</div>}
            </div>
          </section>

          <section className="space-y-6 pt-12">
            <h2 className="mono text-sm font-bold text-blue-400 tracking-[0.3em] uppercase">📡 {t.common.insight_stream}</h2>
            <div className="space-y-4">
              {paginatedPosts.map(post => (
                <div key={post.id} className="p-6 bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all space-y-4 group">
                  <div className="flex items-center space-x-3">
                    <img src={post.authorAvatar} className="w-8 h-8 grayscale group-hover:grayscale-0 transition-all border border-white/10" alt={post.authorName} />
                    <div><Link to={`/profile/${post.authorId}`} className="text-xs font-bold block hover:text-blue-400 transition-colors">{post.authorName}</Link><span className="text-[10px] mono text-white/20 uppercase">{post.timestamp}</span></div>
                  </div>
                  <p className="text-sm italic text-white/80 leading-relaxed">"{post.content}"</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-4 pt-6">
               <CyberButton variant="ghost" onClick={() => setInsightPage(p => Math.max(1, p - 1))} className={`scale-75 ${insightPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}>{t.common.prev}</CyberButton>
               <span className="mono text-[10px] text-white/40 uppercase tracking-widest">{t.common.page} {insightPage} / {totalPages}</span>
               <CyberButton variant="ghost" onClick={() => setInsightPage(p => Math.min(totalPages, p + 1))} className={`scale-75 ${insightPage === totalPages ? 'opacity-20 cursor-not-allowed' : ''}`}>{t.common.next}</CyberButton>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <CyberCard title={t.common.network_stats} subtitle="Aggregate Protocol Data">
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-white/5 p-3 text-center"><p className="text-[8px] mono text-white/40 uppercase mb-1">{t.common.active_profiles}</p><p className="text-xl font-black">1.4k</p></div>
              <div className="bg-white/5 p-3 text-center"><p className="text-[8px] mono text-white/40 uppercase mb-1">{t.common.reviews_week}</p><p className="text-xl font-black">842</p></div>
            </div>
          </CyberCard>
          <CyberCard title={t.common.trending_now} subtitle="Profiles receiving most activity">
            <div className="space-y-4">
              {trendingProfiles.map((user, idx) => (
                <Link to={`/profile/${user.id}`} key={user.id} className="flex items-center space-x-3 group">
                  <span className="mono text-xs text-yellow-400 font-bold">0{idx + 1}</span>
                  <div className="flex-grow"><p className="text-xs font-bold group-hover:text-yellow-400 transition-colors">{user.name}</p><p className="text-[10px] mono text-white/30 uppercase">{user.weeklyReviews} {t.common.new_mines}</p></div>
                  <p className="text-[10px] font-black text-white/40">{user.trustScore}%</p>
                </Link>
              ))}
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

const Profile = ({ users, posts }: { users: UserProfile[], posts: MicroPost[] }) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const user = id === 'me' ? users.find(u => u.id === 'me') : users.find(u => u.id === id);
  const isMe = id === 'me' || user?.id === 'me';

  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [minesPage, setMinesPage] = useState(1);
  const minesPerPage = 3;

  if (!user) return <div className="py-40 text-center mono uppercase text-white/20">Node Identification Failure</div>;

  const paginatedMines = useMemo(() => user.reviews.slice((minesPage - 1) * minesPerPage, minesPage * minesPerPage), [user.reviews, minesPage]);
  const totalMinesPages = Math.ceil(user.reviews.length / minesPerPage);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const res = await getMirrorInsight(user.reviews);
    setInsight(res);
    setLoadingInsight(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      <div className="space-y-6">
        <CyberCard className="text-center">
          <img src={user.avatar} className="w-32 h-32 grayscale border-2 border-yellow-400/20 mx-auto mb-4" alt={user.name} />
          <h2 className="text-2xl font-black tracking-tight uppercase">{user.name}</h2>
          <p className="mono text-yellow-400/60 text-xs mb-4">@{user.username}</p>
          <div className="flex flex-wrap justify-center gap-1 mb-6">{user.badges?.map(b => <CyberBadge key={b} label={b} variant="gold" />)}</div>
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-yellow-400/10 mb-6">
            <div><p className="text-[10px] mono text-white/40 uppercase">{t.common.trust_rate}</p><p className="font-bold text-yellow-400">{user.trustScore}%</p></div>
            <div><p className="text-[10px] mono text-white/40 uppercase">{t.common.verified}</p><p className="font-bold text-blue-400">9/10</p></div>
          </div>
          <div className="space-y-3">
             {isMe && <Link to="/dashboard" className="block"><CyberButton className="w-full text-[10px]">{t.nav.dashboard}</CyberButton></Link>}
             <CyberButton onClick={() => { navigator.clipboard.writeText(window.location.href); setCopyStatus(true); setTimeout(() => setCopyStatus(false), 2000); }} variant="outline" className="w-full text-[10px]">{copyStatus ? t.common.copied : t.common.copy_link}</CyberButton>
          </div>
        </CyberCard>
        <CyberCard title={t.common.skills}><div className="space-y-2">{user.topSkills?.map(skill => (<div key={skill} className="flex items-center justify-between text-[10px] mono p-2 bg-white/5 border border-white/5"><span>{skill}</span><span className="text-yellow-400 font-black">{t.common.certified}</span></div>))}</div></CyberCard>
      </div>

      <div className="lg:col-span-2 space-y-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold tracking-tight uppercase italic">{t.common.overview}</h2><div className="h-px bg-white/10 flex-grow mx-6"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-8">
            <CyberCard title={t.common.radar}><MirrorChart reviews={user.reviews} /></CyberCard>
            <CyberCard title={t.common.growth_insight}>
              {insight ? (<div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mono">{insight}</div>) : (
                <div className="flex flex-col items-center justify-center py-8 h-full space-y-4 text-center">
                  <p className="text-xs text-white/40 mono uppercase tracking-widest leading-relaxed">{t.common.ai_mining}</p>
                  <CyberButton variant="outline" onClick={fetchInsight} className="scale-90">{loadingInsight ? t.common.ai_loading : t.common.ai_button}</CyberButton>
                </div>
              )}
            </CyberCard>
          </div>
          <CyberCard title={t.common.node_identity}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
              <div className="space-y-4">
                <div><h4 className="text-[10px] mono text-yellow-400/60 uppercase font-black tracking-widest mb-2">{t.common.specialization}</h4><p className="text-sm italic text-white/80">{user.specialization || 'Not indexed'}</p></div>
                <div><h4 className="text-[10px] mono text-yellow-400/60 uppercase font-black tracking-widest mb-2">{t.common.personality}</h4><div className="flex flex-wrap gap-2">{user.personality?.map(p => (<span key={p} className="text-[10px] mono bg-white/5 border border-white/10 px-2 py-0.5 text-white/60">{p}</span>))}</div></div>
              </div>
              <div className="space-y-4">
                <div><h4 className="text-[10px] mono text-yellow-400/60 uppercase font-black tracking-widest mb-2">{t.common.interests}</h4><div className="flex flex-wrap gap-2">{user.interests?.map(i => (<span key={i} className="text-[10px] mono border-l-2 border-yellow-400 px-2 text-white/40">{i}</span>))}</div></div>
                <div><h4 className="text-[10px] mono text-yellow-400/60 uppercase font-black tracking-widest mb-2">{t.common.habits}</h4><ul className="space-y-1">{user.habits?.map(h => (<li key={h} className="text-[10px] mono text-white/50 flex items-center space-x-2"><div className="w-1 h-1 bg-yellow-400/40"></div><span>{h}</span></li>))}</ul></div>
              </div>
            </div>
          </CyberCard>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-bold tracking-tight uppercase italic">{t.common.feedback_mines}</h2><div className="h-px bg-white/10 flex-grow mx-6"></div></div>
          <div className="grid gap-4">
            {paginatedMines.map(review => (
              <div key={review.id} className="p-5 bg-white/5 border border-white/10 hover:border-yellow-400/20 transition-all flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="md:w-32 flex-shrink-0"><div className="text-[10px] mono text-white/40 uppercase mb-1 tracking-tighter">{t.domains[review.domain as keyof typeof t.domains] || review.domain}</div><div className="flex space-x-1">{[1,2,3,4,5].map(star => (<div key={star} className={`w-2 h-2 ${star <= review.rating ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-white/10'}`}></div>))}</div></div>
                <div className="flex-grow"><p className="text-sm text-white/90 leading-snug">"{review.comment}"</p><div className="mt-3 flex items-center space-x-3"><NeonTag tag={review.tag} /><span className="text-[10px] mono text-white/20">{review.createdAt}</span></div></div>
              </div>
            ))}
          </div>
          {totalMinesPages > 1 && (<div className="flex items-center justify-center space-x-4 pt-6"><button onClick={() => setMinesPage(p => Math.max(1, p - 1))} className={`mono text-[10px] uppercase tracking-widest hover:text-yellow-400 ${minesPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}>[{t.common.prev}]</button><span className="mono text-[10px] text-white/40">{minesPage} / {totalMinesPages}</span><button onClick={() => setMinesPage(p => Math.min(totalMinesPages, p + 1))} className={`mono text-[10px] uppercase tracking-widest hover:text-yellow-400 ${minesPage === totalMinesPages ? 'opacity-20 cursor-not-allowed' : ''}`}>[{t.common.next}]</button></div>)}
        </section>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<{ users: UserProfile[], posts: MicroPost[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Persistent state using localStorage to simulate a database
    const savedData = localStorage.getItem('reviewmine_node_data');
    if (savedData) {
      setData(JSON.parse(savedData));
      setLoading(false);
    } else {
      fetch('./data.json')
        .then(res => res.json())
        .then(jsonData => {
          setData(jsonData);
          localStorage.setItem('reviewmine_node_data', JSON.stringify(jsonData));
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load node data:", err);
          setLoading(false);
        });
    }
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    if (!data) return;
    const newUsers = data.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    const newData = { ...data, users: newUsers };
    setData(newData);
    localStorage.setItem('reviewmine_node_data', JSON.stringify(newData));
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center mono uppercase text-yellow-400 animate-pulse tracking-[0.5em]">Initializing Protocol...</div>;
  if (!data) return <div className="min-h-screen bg-black flex items-center justify-center mono uppercase text-red-500">Protocol Failure</div>;

  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-grid relative flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/network" element={<Feed users={data.users} posts={data.posts} />} />
              <Route path="/profile/:id" element={<Profile users={data.users} posts={data.posts} />} />
              <Route path="/me" element={<Profile users={data.users} posts={data.posts} />} />
              <Route path="/dashboard" element={<Dashboard users={data.users} onUpdateUser={handleUpdateUser} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </main>
          <footer className="py-12 px-6 border-t border-yellow-400/5 bg-black/50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs mono uppercase tracking-widest text-white/30">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400/20 rotate-45 border border-yellow-400/40"></div>
                <span>REVIEW MINE © 2025</span>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Ethics Codex</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
