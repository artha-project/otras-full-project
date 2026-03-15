import { useState, useEffect } from "react";
import { BookOpen, Zap, Star, Settings, Loader2, CheckCircle2, Clock } from "lucide-react";
import FormField, { TextInput, SelectInput } from "../components/FormField";
import { useTranslation } from "../hooks/useTranslation";
import { generateStudyPlan } from "../services/studyPlanApi";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_MAP = {
  "Monday": "Mon", "Tuesday": "Tue", "Wednesday": "Wed", "Thursday": "Thu",
  "Friday": "Fri", "Saturday": "Sat", "Sunday": "Sun"
};

export default function StudyPlan({ user: propUser }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState("Mon");
  
  // States for the AI Response
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  
  // Form States
  const [targetExam, setTargetExam] = useState("SSC CGL 2024");
  const [examDate, setExamDate] = useState("2026-06-16");
  const [level, setLevel] = useState("Intermediate");
  const [weakAreas, setWeakAreas] = useState("Reasoning, Quant");
  const [hours, setHours] = useState("6");
  const [mockFreq, setMockFreq] = useState("Once a week");
  const [revision, setRevision] = useState("Spaced Repetition");
  const [prefTime, setPrefTime] = useState("Mornings (8 AM - 12 PM)");

  const effectiveUser = propUser || JSON.parse(localStorage.getItem("user") || "{}");
  const userId = (effectiveUser.id && effectiveUser.id !== 7) ? effectiveUser.id : 1;

  const handleArchitectPlan = async () => {
    setLoading(true);
    const payload = {
      userId, targetExam, examDate, currentLevel: level,
      weakAreas: weakAreas.split(",").map(s => s.trim()),
      dailyStudyHours: parseInt(hours), mockFrequency: mockFreq,
      revisionStrategy: revision, preferredStudyTimes: prefTime
    };

    console.log("StudyPlan Input Payload:", payload);

    try {
      const response = await generateStudyPlan(payload);
      console.log("AI Study Plan Response:", response);
      
      if (response) {
        console.log("Updating frontend plan state");
        
        // Safety: Ensure fields are serializable for React rendering
        const safeString = (val) => {
          if (typeof val === 'object' && val !== null) {
            return Object.values(val).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(' ');
          }
          return val || "";
        }

        const rawDays = response.days || response.weeklyPlan || [];
        const safeDays = rawDays.map(day => ({
          ...day,
          day: safeString(day.day),
          activities: (day.activities || []).map(act => ({
            timeSlot: safeString(act.timeSlot),
            description: safeString(act.description),
            focusArea: safeString(act.focusArea)
          }))
        }));

        setWeeklyPlan(safeDays);
        setSummary(safeString(response.summary));
        setRecommendations(
          Array.isArray(response.recommendations) 
            ? response.recommendations.map(safeString) 
            : []
        );
        
        const firstDay = safeDays[0]?.day;
        if (firstDay) setActiveDay(DAY_MAP[firstDay] || (typeof firstDay === 'string' ? firstDay.substring(0, 3) : "Mon"));
      }
    } catch (error) {
      console.error("Study Plan Generation Error:", error);
      alert("AI study plan generation failed. Check console logs.");
    } finally {
      setLoading(false);
    }
  };

  const daySchedule = weeklyPlan?.find(
    d => d.day.toLowerCase().startsWith(activeDay.toLowerCase())
  )?.activities || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={14} style={{color: "var(--color-cyan)"}} />
          <span className="label" style={{color: "var(--color-cyan)"}}>{t("studyArchitect")}</span>
        </div>
        <h1 className="page-title">{t("aiStudyPlanArchitect")}</h1>
        <p className="text-subtle">{t("studyPlanDesc")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FORM SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="app-card p-6 glass-card">
            <h2 className="card-title mb-4">{t("planInputs")}</h2>
            <div className="space-y-4">
              <FormField label={t("targetExam")}><TextInput value={targetExam} onChange={(e) => setTargetExam(e.target.value)} /></FormField>
              <FormField label={t("examDate")}><TextInput type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} /></FormField>
              <FormField label={t("currentLevel")}><SelectInput value={level} onChange={(e) => setLevel(e.target.value)} options={[t("beginner"), t("intermediate"), t("advanced")]} /></FormField>
              <FormField label={t("weakAreas")}><TextInput value={weakAreas} onChange={(e) => setWeakAreas(e.target.value)} placeholder="e.g. Math, Physics" /></FormField>
              <FormField label={t("dailyStudyHours")}><TextInput value={hours} onChange={(e) => setHours(e.target.value)} /></FormField>
              <FormField label={t("mockFrequency")}><SelectInput value={mockFreq} onChange={(e) => setMockFreq(e.target.value)} options={[t("onceAWeek"), t("twiceAWeek"), t("daily")]} /></FormField>
              <FormField label={t("revisionStrategy")}><TextInput value={revision} onChange={(e) => setRevision(e.target.value)} /></FormField>
              <FormField label={t("preferredTime")}><TextInput value={prefTime} onChange={(e) => setPrefTime(e.target.value)} /></FormField>
              <button onClick={handleArchitectPlan} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Settings size={14} />}
                {loading ? "Generating AI Study Plan..." : t("architectPlan")}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="lg:col-span-2 space-y-5">
          {!weeklyPlan && !loading ? (
            <div className="app-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <BookOpen size={32} style={{color: "var(--text-muted)"}} />
              </div>
              <h3 className="section-title mt-3">Artha Study Hub</h3>
              <p className="text-subtle max-w-sm mx-auto">{t("architectWeeklyPlan")}</p>
            </div>
          ) : loading ? (
            <div className="app-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] glass-card">
               <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
               <h3 className="section-title">Generating AI Study Plan...</h3>
               <p className="text-subtle">Architecting your path to success.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="app-card p-5 border-l-4 border-cyan-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-cyan-500" />
                    <span className="label text-cyan-500 font-bold uppercase">{t("strategySummary")}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{summary}</p>
                </div>
                <div className="app-card p-5 border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={14} className="text-purple-500" />
                    <span className="label text-purple-500 font-bold uppercase">{t("arthaRecommendations")}</span>
                  </div>
                  <ul className="text-slate-700 space-y-2 text-sm">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="app-card p-5">
                <div className="flex flex-wrap gap-2 mb-6">
                  {DAYS.map(day => (
                    <button key={day} onClick={() => setActiveDay(day)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeDay === day ? "day-tab-active" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Clock size={18} className="text-blue-500" />
                    {activeDay} Schedule
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{daySchedule.length} Study Blocks</span>
                </div>
                <div className="space-y-4">
                  {daySchedule.length > 0 ? (
                    daySchedule.map((block, i) => (
                      <div key={i} className="group flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                        <div className="min-w-[120px]"><span className="text-xs font-bold text-blue-600 uppercase">{block.timeSlot}</span></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-sm mb-1">{block.description}</h4>
                          {block.focusArea && <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">Focus: {block.focusArea}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-400 text-sm italic">Rest Day or No Activities Scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
