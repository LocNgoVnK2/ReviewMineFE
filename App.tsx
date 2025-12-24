
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

// --- MOCK DATA ---
const MOCK_ME: UserProfile = {
  id: 'me',
  name: 'Alex Rivera',
  username: 'arivera_tech',
  avatar: 'https://picsum.photos/seed/alex/200',
  trustScore: 98,
  activeDomains: [DomainType.PROFESSIONAL, DomainType.COMMUNICATION, DomainType.LEADERSHIP, DomainType.SOCIAL],
  reviews: [
    { id: '1', domain: DomainType.PROFESSIONAL, rating: 5, comment: 'Exceptional attention to detail in architecture.', tag: FeedbackTag.POSITIVE, createdAt: '2024-03-20' },
    { id: '2', domain: DomainType.COMMUNICATION, rating: 4, comment: 'Always clear, though can be a bit direct sometimes.', tag: FeedbackTag.CONSTRUCTIVE, createdAt: '2024-03-18' },
    { id: '3', domain: DomainType.LEADERSHIP, rating: 5, comment: 'Inspires the team to push boundaries.', tag: FeedbackTag.POSITIVE, createdAt: '2024-03-15' },
    { id: '4', domain: DomainType.SOCIAL, rating: 3, comment: 'Great energy but often skips the small talk.', tag: FeedbackTag.NEUTRAL, createdAt: '2024-03-10' },
  ],
  badges: ['⭐ Trusted', '🏅 Architect'],
  topSkills: ['System Design', 'Team Ops'],
  weeklyReviews: 12
};

const MOCK_USERS: UserProfile[] = [
  MOCK_ME,
  {
    id: 'u2',
    name: 'Sarah Chen',
    username: 'schen_design',
    avatar: 'https://picsum.photos/seed/sarah/200',
    trustScore: 94,
    activeDomains: [DomainType.PROFESSIONAL, DomainType.COMMUNICATION],
    reviews: [],
    badges: ['🎨 Visualist'],
    topSkills: ['UI/UX', 'Branding'],
    weeklyReviews: 8
  },
  {
    id: 'u3',
    name: 'Marcus Thorne',
    username: 'mthorne_lead',
    avatar: 'https://picsum.photos/seed/marcus/200',
    trustScore: 89,
    activeDomains: [DomainType.LEADERSHIP, DomainType.RELIABILITY],
    reviews: [],
    badges: ['⚡ Fast Lane'],
    topSkills: ['Management', 'Strategy'],
    weeklyReviews: 15
  },
  {
    id: 'u4',
    name: 'Elena Vance',
    username: 'evance_rel',
    avatar: 'https://picsum.photos/seed/elena/200',
    trustScore: 91,
    activeDomains: [DomainType.RELIABILITY, DomainType.COMMUNICATION],
    reviews: [],
    badges: ['🛡️ Reliable'],
    topSkills: ['Support', 'Quality'],
    weeklyReviews: 5
  }
];

const MOCK_MICRO_POSTS: MicroPost[] = [
  { id: 'mp1', content: "Just received a constructive review on my communication style. Learning to pause before replying. Growth hurts but helps! #SelfAware", timestamp: '2h ago', reactions: [{type: '👍', count: 12}, {type: '🤔', count: 4}] },
  { id: 'mp2', content: "Building trust takes months, losing it takes seconds. Maintain your reputation protocols.", timestamp: '5h ago', reactions: [{type: '👀', count: 22}, {type: '🛡️', count: 8}] }
];

// --- COMPONENTS ---

const Navbar = () => {
  const { language, setLanguage, t } = useTranslation();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-yellow-400/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center rotate-45">
            <span className="text-black font-black -rotate-45">R</span>
          </div>
          <span className="mono text-xl font-black tracking-tighter">REVIEW<span className="text-yellow-400">MINE</span></span>
        </Link>
        <div className="flex items-center space-x-6 text-xs mono font-bold uppercase tracking-widest text-white/60">
          <Link to="/network" className="hover:text-yellow-400 transition-colors">{t.nav.network}</Link>
          <Link to="/pricing" className="hover:text-yellow-400 transition-colors">{t.nav.pricing}</Link>
          <Link to="/me" className="hover:text-yellow-400 transition-colors">{t.nav.profile}</Link>
          
          <div className="flex items-center space-x-2 border border-white/10 px-2 py-1">
            <button 
              onClick={() => setLanguage('vi')} 
              className={`hover:text-yellow-400 transition-colors ${language === 'vi' ? 'text-yellow-400' : ''}`}
            >VN</button>
            <span className="text-white/20">|</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`hover:text-yellow-400 transition-colors ${language === 'en' ? 'text-yellow-400' : ''}`}
            >EN</button>
          </div>

          <Link to="/login">
            <CyberButton className="scale-90" variant="outline">{t.nav.access}</CyberButton>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Feed = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const featuredMiners = useMemo(() => MOCK_USERS.filter(u => u.trustScore > 90).slice(0, 3), []);
  const trendingProfiles = useMemo(() => [...MOCK_USERS].sort((a, b) => (b.weeklyReviews || 0) - (a.weeklyReviews || 0)), []);
  const filteredUsers = useMemo(() => MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 space-y-12">
      {/* Header & Search */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">{t.common.node_network}</h1>
          <p className="text-white/40 mono text-xs uppercase tracking-widest">{t.common.network_sub}</p>
        </div>
        <div className="w-full md:w-80">
          <CyberInput 
            placeholder={t.common.search_placeholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Discover & Trending */}
        <div className="lg:col-span-8 space-y-12">
          {/* Featured Miners */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="mono text-sm font-bold text-yellow-400 tracking-[0.3em] uppercase">⭐ {t.common.featured_miners}</h2>
              <div className="h-px bg-yellow-400/20 flex-grow ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredMiners.map(user => (
                <Link to={`/profile/${user.id}`} key={user.id} className="group">
                  <CyberCard className="h-full border-yellow-400/20 group-hover:border-yellow-400 transition-all text-center flex flex-col items-center">
                    <img src={user.avatar} className="w-16 h-16 grayscale group-hover:grayscale-0 transition-all border border-yellow-400/20 mb-4" />
                    <h4 className="font-bold text-sm mb-1">{user.name}</h4>
                    <div className="flex flex-wrap justify-center gap-1 mb-3">
                      {user.badges?.map(b => <CyberBadge key={b} label={b} variant="gold" />)}
                    </div>
                    <div className="mt-auto pt-3 border-t border-white/5 w-full">
                      <p className="text-[10px] mono text-white/40 uppercase">{t.common.trust_rank}</p>
                      <p className="text-xl font-black text-yellow-400">{user.trustScore}</p>
                    </div>
                  </CyberCard>
                </Link>
              ))}
            </div>
          </section>

          {/* Search Results / Directory */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="mono text-sm font-bold text-white/60 tracking-[0.3em] uppercase">{t.common.all_nodes}</h2>
              <div className="h-px bg-white/10 flex-grow ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map(user => (
                <Link to={`/profile/${user.id}`} key={user.id} className="block group">
                  <div className="p-4 bg-white/5 border border-white/10 group-hover:border-yellow-400/30 transition-all flex items-center space-x-4">
                    <img src={user.avatar} className="w-12 h-12 grayscale" />
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm">{user.name}</h4>
                      <p className="text-[10px] mono text-yellow-400/50 italic">@{user.username}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex space-x-1 justify-end mb-1">
                        {user.topSkills?.slice(0, 1).map(s => <CyberBadge key={s} label={s} />)}
                      </div>
                      <p className="text-lg font-black">{user.trustScore}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Micro Posts */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
              <h2 className="mono text-sm font-bold text-blue-400 tracking-[0.3em] uppercase">📡 {t.common.insight_stream}</h2>
              <div className="h-px bg-blue-400/20 flex-grow ml-4"></div>
            </div>
            <div className="space-y-4">
              {MOCK_MICRO_POSTS.map(post => (
                <div key={post.id} className="p-4 bg-white/5 border-l-2 border-blue-400/50 space-y-3">
                  <p className="text-sm italic text-white/80 leading-relaxed">"{post.content}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] mono text-white/20 uppercase">{post.timestamp}</span>
                    <div className="flex space-x-3">
                      {post.reactions.map(r => (
                        <button key={r.type} className="text-[10px] mono text-white/40 hover:text-white transition-colors bg-white/5 px-2 py-0.5 border border-white/10">
                          {r.type} {r.count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Trending & Analytics */}
        <div className="lg:col-span-4 space-y-8">
          <CyberCard title={t.common.network_stats} subtitle="Aggregate Protocol Data">
            <div className="space-y-6 py-2">
              <div>
                <div className="flex justify-between text-[10px] mono uppercase mb-1">
                  <span>Constructive Ratio</span>
                  <span className="text-yellow-400">82%</span>
                </div>
                <div className="h-1 bg-white/10 w-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{width: '82%'}}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 text-center">
                  <p className="text-[8px] mono text-white/40 uppercase mb-1">{t.common.active_profiles}</p>
                  <p className="text-xl font-black">1.4k</p>
                </div>
                <div className="bg-white/5 p-3 text-center">
                  <p className="text-[8px] mono text-white/40 uppercase mb-1">{t.common.reviews_week}</p>
                  <p className="text-xl font-black">842</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] mono text-white/40 uppercase mb-2">{t.common.trending_skills}</p>
                {['Architect', 'Team Lead', 'Reliable'].map(skill => (
                   <div key={skill} className="flex items-center justify-between text-[10px] mono uppercase p-2 border border-white/5 bg-white/5">
                    <span>{skill}</span>
                    <span className="text-yellow-400">↑ {Math.floor(Math.random() * 20)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CyberCard>

          <CyberCard title={t.common.trending_now} subtitle="Profiles receiving most activity">
            <div className="space-y-4">
              {trendingProfiles.map((user, idx) => (
                <Link to={`/profile/${user.id}`} key={user.id} className="flex items-center space-x-3 group">
                  <span className="mono text-xs text-yellow-400 font-bold">0{idx + 1}</span>
                  <div className="flex-grow">
                    <p className="text-xs font-bold group-hover:text-yellow-400 transition-colors">{user.name}</p>
                    <p className="text-[10px] mono text-white/30 uppercase">{user.weeklyReviews} new mines</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white/40">{user.trustScore}%</p>
                  </div>
                </Link>
              ))}
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const user = id === 'me' ? MOCK_ME : MOCK_USERS.find(u => u.id === id) || MOCK_ME;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const res = await getMirrorInsight(user.reviews);
    setInsight(res);
    setLoadingInsight(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar: User Info */}
      <div className="space-y-6">
        <CyberCard className="text-center">
          <div className="relative inline-block mb-4">
            <img src={user.avatar} className="w-32 h-32 grayscale border-2 border-yellow-400/20" alt={user.name} />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black px-2 py-1 text-[10px] font-black tracking-widest">
              LVL {Math.floor(user.trustScore / 10)}
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
          <p className="mono text-yellow-400/60 text-xs mb-4">@{user.username}</p>
          <div className="flex flex-wrap justify-center gap-1 mb-6">
            {user.badges?.map(b => <CyberBadge key={b} label={b} variant="gold" />)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-yellow-400/10 mb-6">
            <div>
              <p className="text-[10px] mono text-white/40 uppercase">{t.common.trust_rate}</p>
              <p className="font-bold text-yellow-400">{user.trustScore}%</p>
            </div>
            <div>
              <p className="text-[10px] mono text-white/40 uppercase">{t.common.verified}</p>
              <p className="font-bold text-blue-400">9/10</p>
            </div>
          </div>

          <div className="space-y-3">
             <CyberButton onClick={handleShare} variant="outline" className="w-full text-[10px]">
              {copyStatus ? t.common.copied : t.common.copy_link}
            </CyberButton>
            {id !== 'me' && (
              <CyberButton onClick={() => setIsModalOpen(true)} className="w-full">
                {t.common.submit_feedback}
              </CyberButton>
            )}
          </div>
        </CyberCard>

        <CyberCard title={t.common.skills}>
          <div className="space-y-2">
            {user.topSkills?.map(skill => (
              <div key={skill} className="flex items-center justify-between text-[10px] mono p-2 bg-white/5 border border-white/5">
                <span>{skill}</span>
                <span className="text-yellow-400 font-black">CERTIFIED</span>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <CyberCard title={t.common.radar}>
            <MirrorChart reviews={user.reviews} />
          </CyberCard>

          <CyberCard title={t.common.growth_insight}>
            {insight ? (
              <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap mono">
                {insight}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <p className="text-xs text-white/40 text-center mono uppercase tracking-widest leading-relaxed">
                  {t.common.ai_mining}
                </p>
                <CyberButton variant="outline" onClick={fetchInsight} className="scale-90">
                  {loadingInsight ? t.common.ai_loading : t.common.ai_button}
                </CyberButton>
                <p className="text-[8px] mono text-yellow-400/50 uppercase tracking-widest">{t.common.pro_required}</p>
              </div>
            )}
          </CyberCard>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight uppercase italic">{t.common.feedback_mines}</h2>
            <div className="h-px bg-white/10 flex-grow mx-6"></div>
          </div>

          <div className="grid gap-4">
            {user.reviews.length > 0 ? (
              user.reviews.map(review => (
                <div key={review.id} className="p-5 bg-white/5 border border-white/10 hover:border-yellow-400/20 transition-all flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="md:w-32 flex-shrink-0">
                    <div className="text-[10px] mono text-white/40 uppercase mb-1 tracking-tighter">{review.domain}</div>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map(star => (
                        <div key={star} className={`w-2 h-2 ${star <= review.rating ? 'bg-yellow-400' : 'bg-white/10'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-white/90 leading-snug">"{review.comment}"</p>
                    <div className="mt-3 flex items-center space-x-3">
                      <NeonTag tag={review.tag} />
                      <span className="text-[10px] mono text-white/20">{review.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-white/10 text-white/20 mono text-xs uppercase tracking-[0.4em]">
                {t.common.empty_node}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <CyberCard title={`${t.common.submit_feedback} - ${user.name}`} className="relative z-10 w-full max-w-lg">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div>
                <label className="block text-[10px] mono text-white/40 uppercase mb-1">{t.common.select_domain}</label>
                <select className="w-full bg-black border border-white/20 p-2 text-sm mono focus:border-yellow-400 focus:outline-none">
                  {user.activeDomains.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] mono text-white/40 uppercase mb-1">{t.common.rating_protocol}</label>
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <button type="button" key={i} className="w-10 h-10 border border-white/10 hover:border-yellow-400 text-sm mono transition-colors">
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] mono text-white/40 uppercase mb-1">{t.common.growth_obs}</label>
                <textarea className="w-full bg-black border border-white/20 p-3 text-sm h-24 focus:border-yellow-400 focus:outline-none placeholder:text-white/10 mono" placeholder={t.common.placeholder_obs}></textarea>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="accent-yellow-400" id="anon" defaultChecked />
                  <label htmlFor="anon" className="text-[10px] mono text-white/40 uppercase tracking-widest">{t.common.ghost_enc}</label>
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[10px] mono uppercase text-white/40 hover:text-white">{t.common.cancel}</button>
                  <CyberButton type="submit">{t.common.deploy}</CyberButton>
                </div>
              </div>
            </form>
          </CyberCard>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-grid relative flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/network" element={<Feed />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/me" element={<Profile />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </main>
          
          <footer className="py-12 px-6 border-t border-yellow-400/5 bg-black/50">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400/20 rotate-45 border border-yellow-400/40"></div>
                <span className="mono text-[10px] font-bold tracking-widest text-white/40 uppercase">REVIEW MINE © 2025 – REPUTATION ASSETS PROTOCOL</span>
              </div>
              <div className="flex space-x-6 text-[10px] mono uppercase tracking-widest text-white/30">
                <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Ethics Codex</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Uplink API</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
