
import React, { useState, useCallback, useEffect } from 'react';
import { 
  ClipboardCheck, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  BarChart3, 
  User, 
  Award,
  Smartphone,
  QrCode,
  Download,
  Filter,
  RefreshCcw,
  LayoutDashboard,
  Users,
  Settings
} from 'lucide-react';
import { 
  Phase, 
  SurveyState, 
  LikertValue, 
  UserProfile 
} from './types';
import { 
  ENGAGEMENT_QUESTIONS, 
  BEHAVIORAL_QUESTIONS, 
  SJT_QUESTIONS 
} from './constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

// --- Components ---

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const Header: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => (
  <header className="bg-white border-b px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-2">
      <div className="bg-blue-700 text-white p-1.5 rounded-lg">
        <ClipboardCheck size={20} />
      </div>
      <div>
        <h1 className="text-sm font-bold text-gray-900 leading-none">ITC Factory Insight</h1>
        <p className="text-[10px] text-gray-500 font-medium tracking-tight">Cigarette Division</p>
      </div>
    </div>
    <button 
      onClick={onAdminClick}
      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
    >
      <BarChart3 size={20} />
    </button>
  </header>
);

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>(Phase.WELCOME);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [step, setStep] = useState(0);
  const [surveyState, setSurveyState] = useState<SurveyState>({
    engagementResponses: {},
    behavioralResponses: {},
    sjtResponses: {},
  });
  const [showQR, setShowQR] = useState(false);

  // --- Handlers ---

  const handleStartSurvey = (profile: UserProfile) => {
    setUser(profile);
    setPhase(Phase.ENGAGEMENT);
    setStep(0);
  };

  const handleLikertSelect = (questionId: string, value: LikertValue) => {
    setSurveyState(prev => ({
      ...prev,
      engagementResponses: { ...prev.engagementResponses, [questionId]: value }
    }));
    
    setTimeout(() => {
      if (step < ENGAGEMENT_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setPhase(Phase.BEHAVIORAL);
        setStep(0);
      }
    }, 300);
  };

  const handleBehavioralSelect = (questionId: string, trait: string) => {
    setSurveyState(prev => ({
      ...prev,
      behavioralResponses: { ...prev.behavioralResponses, [questionId]: trait }
    }));
    
    setTimeout(() => {
      if (step < BEHAVIORAL_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setPhase(Phase.SITUATIONAL);
        setStep(0);
      }
    }, 300);
  };

  const handleSJTSelect = (questionId: string, key: string) => {
    setSurveyState(prev => ({
      ...prev,
      sjtResponses: { ...prev.sjtResponses, [questionId]: key }
    }));
    
    setTimeout(() => {
      if (step < SJT_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setPhase(Phase.RESULTS);
        setStep(0);
      }
    }, 300);
  };

  // --- CSV Export Logic for Power BI ---
  const exportToCSV = () => {
    // Constructing a row with current session data
    // In a real app, this would be an array of all collected responses
    const headers = ['EmployeeName', 'EmployeeID', 'EngagementAvg', 'DominantTrait', ...ENGAGEMENT_QUESTIONS.map(q => q.id)];
    const avgScore = getEngagementAverage().toFixed(2);
    const trait = getDominantTraits()[0]?.[0] || 'Unknown';
    
    const row = [
      user?.name || 'Anonymous',
      user?.employeeId || 'N/A',
      avgScore,
      trait,
      ...ENGAGEMENT_QUESTIONS.map(q => surveyState.engagementResponses[q.id] || '')
    ];

    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ITC_Survey_PowerBI_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Calculations ---

  const getEngagementAverage = () => {
    const values = Object.values(surveyState.engagementResponses) as number[];
    if (values.length === 0) return 0;
    return values.reduce((a: number, b: number) => a + b, 0) / values.length;
  };

  const getDominantTraits = () => {
    const counts: Record<string, number> = {};
    (Object.values(surveyState.behavioralResponses) as string[]).forEach((trait: string) => {
      counts[trait] = (counts[trait] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  // --- View Renderers ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Smartphone className="text-blue-600" size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Phase 1</h2>
      <p className="text-gray-600 mb-8 max-w-sm">
        Integrated Engagement & Behavioral Assessment. Built for ITC Cigarette Division.
      </p>
      
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-left text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employee Name</label>
            <input 
              type="text" 
              placeholder="Enter Full Name"
              id="workerName"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-left text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employee ID</label>
            <input 
              type="text" 
              placeholder="e.g. ITC12345"
              id="workerId"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => {
              const name = (document.getElementById('workerName') as HTMLInputElement).value;
              const id = (document.getElementById('workerId') as HTMLInputElement).value;
              if (name && id) {
                handleStartSurvey({ name, employeeId: id, department: 'Production' });
              } else {
                alert('Please fill in all details to continue.');
              }
            }}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
          >
            Start Assessment
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <button 
        onClick={() => setShowQR(!showQR)}
        className="mt-8 flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium"
      >
        <QrCode size={18} />
        Scan for QR Access
      </button>

      {showQR && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://itc-survey.app" alt="QR Code" />
          <p className="text-xs text-gray-500 mt-2">Share this with your teammates</p>
        </div>
      )}
    </div>
  );

  const renderEngagement = () => {
    const q = ENGAGEMENT_QUESTIONS[step];
    return (
      <div className="p-6 flex flex-col min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <div className="mb-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Phase 1: Engagement</span>
          <h3 className="text-lg font-bold text-gray-900 mt-1">Feedback & Vigor</h3>
        </div>
        
        <ProgressBar current={step + 1} total={ENGAGEMENT_QUESTIONS.length} />

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h4 className="text-xl font-bold text-gray-800 leading-tight mb-4">{q.hindi}</h4>
            <p className="text-gray-500 italic">{q.english}</p>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((val) => (
              <button
                key={val}
                onClick={() => handleLikertSelect(q.id, val as LikertValue)}
                className={`w-full py-4 px-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  surveyState.engagementResponses[q.id] === val 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 bg-white hover:border-blue-200'
                }`}
              >
                <span className="font-bold text-gray-700">
                  {val === 5 ? 'Strongly Agree (पूरी तरह सहमत)' : 
                   val === 4 ? 'Agree (सहमत)' : 
                   val === 3 ? 'Neutral (तटस्थ)' : 
                   val === 2 ? 'Disagree (असहमत)' : 
                   'Strongly Disagree (पूरी तरह असहमत)'}
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  surveyState.engagementResponses[q.id] === val ? 'border-blue-500 bg-blue-500' : 'border-gray-200'
                }`}>
                  {surveyState.engagementResponses[q.id] === val && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex justify-between items-center py-4 border-t border-gray-100">
           <button 
             disabled={step === 0}
             onClick={() => setStep(step - 1)}
             className={`p-2 rounded-lg flex items-center gap-1 font-semibold ${step === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-blue-600'}`}
           >
             <ChevronLeft size={20} /> Back
           </button>
           <span className="text-sm font-medium text-gray-400">Question {step + 1} of {ENGAGEMENT_QUESTIONS.length}</span>
        </div>
      </div>
    );
  };

  const renderBehavioral = () => {
    const q = BEHAVIORAL_QUESTIONS[step];
    return (
      <div className="p-6 flex flex-col min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <div className="mb-4">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Phase 2: Behavioral</span>
          <h3 className="text-lg font-bold text-gray-900 mt-1">Natural Work Style</h3>
        </div>
        
        <ProgressBar current={step + 1} total={BEHAVIORAL_QUESTIONS.length} />

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h4 className="text-xl font-bold text-gray-800 leading-tight mb-2">{q.question}</h4>
            <p className="text-sm text-gray-500">Choose the one that most accurately represents your behavior.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[q.optionA, q.optionB].map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleBehavioralSelect(q.id, opt.trait)}
                className="w-full p-6 text-left rounded-2xl border-2 border-gray-100 bg-white hover:border-orange-500 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-400">{idx === 0 ? 'A' : 'B'}</span>
                  </div>
                  <span className="font-bold text-gray-700 text-lg leading-snug">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSJT = () => {
    const q = SJT_QUESTIONS[step];
    return (
      <div className="p-6 flex flex-col min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
        <div className="mb-4">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Phase 3: Work Simulations</span>
          <h3 className="text-lg font-bold text-gray-900 mt-1">Situational Judgment</h3>
        </div>
        
        <ProgressBar current={step + 1} total={SJT_QUESTIONS.length} />

        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="text-xs font-bold text-gray-400 mb-2">SCENARIO {step + 1}</div>
            <h4 className="text-xl font-bold text-gray-800 leading-tight">{q.scenario}</h4>
          </div>

          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSJTSelect(q.id, opt.key)}
                className="w-full p-5 text-left rounded-xl border-2 border-gray-100 bg-white hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <span className="font-bold text-gray-400 group-hover:text-emerald-600">{opt.key}</span>
                  </div>
                  <span className="font-medium text-gray-700 leading-relaxed">{opt.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const avgScore = getEngagementAverage();
    const traits = getDominantTraits();
    const dominantTrait = traits[0]?.[0] || 'Contributor';

    return (
      <div className="p-6 pb-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
            <Award size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Assessment Complete!</h2>
          <p className="text-gray-500">Thank you for your valuable input, {user?.name}.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Engagement Profile</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-gray-900">{avgScore.toFixed(1)}</span>
              <span className="text-lg text-gray-400 font-bold mb-1">/ 5.0</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full ${avgScore >= 4 ? 'bg-emerald-500' : avgScore >= 3 ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${(avgScore / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm font-semibold text-gray-600">
              {avgScore >= 4 ? 'High Engagement' : avgScore >= 3 ? 'Moderate Engagement' : 'Low Engagement'}
            </p>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 text-white">
            <h3 className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Top Behavioral Trait</h3>
            <div className="text-2xl font-black mb-3">{dominantTrait}</div>
            <p className="text-sm opacity-90 leading-relaxed">
              Based on your forced-choice answers, you excel at being a {dominantTrait.toLowerCase()}. This means you are naturally {
                dominantTrait === 'Executor' ? 'goal-oriented and responsible.' :
                dominantTrait === 'Harmonizer' ? 'a team player and empathetic.' :
                dominantTrait === 'Guardian' ? 'safe, methodical and reliable.' :
                dominantTrait === 'Informer' ? 'a communicator and transparent.' :
                'a key contributor to the team.'
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">ITC Recognition Points</h3>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl font-black text-xl">
                +150
              </div>
              <div>
                <p className="font-bold text-gray-800">Survey Bonus Earned</p>
                <p className="text-xs text-gray-500">Redeem these points in the canteen or store.</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setPhase(Phase.WELCOME)}
          className="w-full mt-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    const engagementData = [
      { name: 'Organization', score: 4.2 },
      { name: 'Job Role', score: 3.8 },
      { name: 'Vigor', score: 4.5 },
      { name: 'Support', score: 3.2 },
      { name: 'Recognition', score: 2.8 },
    ];

    const traitDistribution = [
      { name: 'Executors', value: 45, color: '#2563eb' },
      { name: 'Harmonizers', value: 32, color: '#059669' },
      { name: 'Guardians', value: 28, color: '#ea580c' },
      { name: 'Informers', value: 15, color: '#7c3aed' },
    ];

    return (
      <div className="bg-slate-50 min-h-screen animate-in fade-in duration-500">
        {/* Sidebar Mockup for BI Look */}
        <div className="flex h-screen">
          <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 shrink-0">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-yellow-400 p-1.5 rounded">
                <BarChart3 className="text-slate-900" size={20} />
              </div>
              <span className="font-bold text-lg">Power Insight</span>
            </div>
            <nav className="space-y-4 flex-1">
              <div className="flex items-center gap-3 text-white bg-white/10 p-2 rounded-lg cursor-pointer">
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors p-2 cursor-pointer">
                <Users size={18} />
                <span className="text-sm font-medium">Manpower Pool</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors p-2 cursor-pointer">
                <Filter size={18} />
                <span className="text-sm font-medium">Shift Filters</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors p-2 cursor-pointer">
                <Settings size={18} />
                <span className="text-sm font-medium">Settings</span>
              </div>
            </nav>
            <div className="pt-6 border-t border-slate-800">
               <button 
                onClick={() => setPhase(Phase.WELCOME)}
                className="w-full flex items-center gap-3 text-slate-400 hover:text-white p-2"
               >
                 <ChevronLeft size={18} />
                 <span className="text-sm">Exit Admin</span>
               </button>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto p-4 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Manpower BI Dashboard</h2>
                <p className="text-slate-500 text-sm">Real-time engagement analytics for ITC Factory Operations</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                  <RefreshCcw size={16} />
                  Refresh
                </button>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                >
                  <Download size={16} />
                  Export to Power BI
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Responses</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">1,284</span>
                  <span className="text-xs font-bold text-emerald-500">+12%</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">High-Flyer Pool</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600">84</span>
                  <span className="text-xs font-bold text-slate-400">Potential Leads</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Critical Retention</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-500">14%</span>
                  <span className="text-xs font-bold text-rose-400">Low Score</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Apprentice Mentors</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600">32</span>
                  <span className="text-xs font-bold text-emerald-400">Active</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-800">Engagement Score by Core Dimension</h3>
                  <div className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500">Score Out of 5.0</div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} layout="vertical" margin={{ left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="name" type="category" width={100} fontSize={12} stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="score" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={24}>
                        {engagementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score > 4 ? '#059669' : entry.score > 3 ? '#2563eb' : '#e11d48'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-8">Behavioral Personality Split</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={traitDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {traitDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Data Table Look-alike */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Recent Employee Profiles</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">View All Records</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Employee</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Primary Trait</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Action Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">Amit Kumar</div>
                        <div className="text-xs text-slate-400">ID: ITC09212</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Guardian</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-medium text-slate-600">Engaged</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Consider for Safety Audit team.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">Sarah Jones</div>
                        <div className="text-xs text-slate-400">ID: ITC08831</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded uppercase">Informer</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-sm font-medium text-slate-600">Moderate</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">Enable peer-to-peer feedback role.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${phase === Phase.DASHBOARD ? 'max-w-none' : 'max-w-lg mx-auto bg-white sm:shadow-2xl'}`}>
      {phase !== Phase.DASHBOARD && <Header onAdminClick={() => setPhase(Phase.DASHBOARD)} />}
      
      <main className="flex-1 overflow-y-auto">
        {phase === Phase.WELCOME && renderWelcome()}
        {phase === Phase.ENGAGEMENT && renderEngagement()}
        {phase === Phase.BEHAVIORAL && renderBehavioral()}
        {phase === Phase.SITUATIONAL && renderSJT()}
        {phase === Phase.RESULTS && renderResults()}
        {phase === Phase.DASHBOARD && renderAdminDashboard()}
      </main>

      {phase !== Phase.DASHBOARD && (
        <footer className="py-6 px-4 text-center border-t bg-gray-50">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
            <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase italic">ITC Limited</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Digital Buddy System • Privacy Assured</p>
        </footer>
      )}
    </div>
  );
};

export default App;
