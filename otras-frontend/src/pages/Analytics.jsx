import { useState, useEffect } from 'react';
import { Target, BookOpen, Award, Clock, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import axios from 'axios';

export default function Analytics({ user }) {
  const { t } = useTranslation();
  const [arthaStats, setArthaStats] = useState({ percentile: 0, logicalScore: 0, quantScore: 0, verbalScore: 0 });

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:4000/artha/status/${user.id}`)
        .then(res => {
          if (res.data?.percentile) {
            setArthaStats({
              percentile: Math.round(res.data.percentile),
              logicalScore: res.data.logicalScore || 0,
              quantScore: res.data.quantScore || 0,
              verbalScore: res.data.verbalScore || 0,
            });
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e3a8a] mb-2 tracking-tight">{t("readinessAnalytics")}</h1>
          <p className="text-slate-500 text-lg font-medium">{t("trackEvolution")}</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard 
            title={t("arthaReadinessIndex")} 
            value={arthaStats.percentile > 0 ? `${arthaStats.percentile}%` : "N/A"} 
            change={arthaStats.percentile > 0 ? `${arthaStats.percentile}%` : "—"}
            changeLabel={t("highProbability")}
            icon={<Target size={20} className="text-slate-400" />}
          />
          <StatsCard 
            title={t("mocksTaken")} 
            value="24" 
            change="+4" 
            changeLabel={t("last30Days")}
            icon={<BookOpen size={20} className="text-slate-400" />}
          />
          <StatsCard 
            title={t("averageAccuracy")} 
            value="88%" 
            change="+2%" 
            changeLabel={t("stablePerformance")}
            icon={<Award size={20} className="text-slate-400" />}
          />
          <StatsCard 
            title={t("studyConsistency")} 
            value="92%" 
            change="+5%" 
            changeLabel={t("last7Days")}
            icon={<Clock size={20} className="text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN TIMELINE CHART */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} className="text-[#3b5998]" />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t("readinessEvolutionTimeline")}</h2>
            </div>
            <p className="text-slate-400 font-bold text-sm mb-12">{t("improvementCurve")}</p>
            
            <div className="relative flex-1 min-h-[350px] w-full mt-4">
              {/* Y-AXIS LABELS */}
              <div className="absolute left-0 top-0 h-[calc(100%-40px)] flex flex-col justify-between text-[11px] font-black text-slate-300 pb-2">
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              {/* GRID LINES */}
              <div className="absolute left-10 right-0 top-0 h-[calc(100%-40px)] flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-50 relative"></div>
                ))}
              </div>

              {/* THE CHART LINE (SVG) */}
              <div className="absolute left-10 right-0 top-0 h-[calc(100%-40px)]">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b5998" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#3b5998" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Fill area */}
                  <path
                    d="M 0 300 C 100 280, 200 220, 300 230 S 450 260, 600 220 S 800 150, 1000 80 L 1000 400 L 0 400 Z"
                    fill="url(#lineGradient)"
                  />
                  {/* Stroke path */}
                  <path
                    d="M 0 300 C 100 280, 200 220, 300 230 S 450 260, 600 220 S 800 150, 1000 80"
                    fill="none"
                    stroke="#3b5998"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                  />
                  {/* Glow point */}
                  <circle cx="1000" cy="80" r="6" fill="#3b5998" />
                  <circle cx="1000" cy="80" r="12" fill="#3b5998" className="animate-ping opacity-20" />
                </svg>
              </div>

              {/* X-AXIS LABELS */}
              <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[11px] font-black text-slate-300 px-2 uppercase tracking-tighter">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-6">
            {/* SUBJECT STRENGTH HEATMAP */}
            <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/40 border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-1 tracking-tight">{t("subjectStrengthHeatmap")}</h3>
              <p className="text-slate-400 font-bold text-xs mb-8">{t("accuracyDistribution")}</p>
              
              <div className="space-y-8">
                <SubjectProgress label="Quant" value={Math.max(0, Math.min(100, Math.round((arthaStats.quantScore + 10) * 4)))} />
                <SubjectProgress label="Verbal" value={Math.max(0, Math.min(100, Math.round((arthaStats.verbalScore + 10) * 4)))} />
                <SubjectProgress label="Logical" value={Math.max(0, Math.min(100, Math.round((arthaStats.logicalScore + 10) * 4)))} />
                <SubjectProgress label="Readiness" value={arthaStats.percentile || 0} />
              </div>
            </div>

            {/* ALERTS & INSIGHTS */}
            <div className="space-y-4">
              {/* BURNOUT WARNING */}
              <div className="bg-[#fff9f9] border border-[#ffe4e4] rounded-[24px] p-6 flex gap-5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shrink-0 shadow-sm border border-red-50">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-black text-red-600 mb-1 text-sm uppercase tracking-wide">{t("burnoutWarning")}</h4>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    {t("burnoutMsg")}
                  </p>
                </div>
              </div>

              {/* ARTHA INSIGHT */}
              <div className="bg-[#f5faff] border border-[#e5f1ff] rounded-[24px] p-6 flex gap-5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shrink-0 shadow-sm border border-blue-50">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h4 className="font-black text-[#3b5998] mb-1 text-sm uppercase tracking-wide">{t("arthaInsight")}</h4>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    {t("insightMsg")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, changeLabel, icon }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-lg shadow-slate-200/40 border border-slate-50 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <h4 className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">{title}</h4>
        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-4xl font-black text-[#1e3a8a] mb-2">{value}</div>
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-xs font-black">{change}</span>
          <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{changeLabel}</span>
        </div>
      </div>
    </div>
  );
}

function SubjectProgress({ label, value }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-black tracking-tight uppercase">
        <span className="text-slate-500 tracking-wider text-[11px] font-black">{label}</span>
        <span className="text-[#3b5998] text-xs">{value}%</span>
      </div>
      <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
        <div 
          className="h-full bg-[#3b5998] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
