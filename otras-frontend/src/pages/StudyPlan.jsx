import { useState, useEffect } from "react";
import { BookOpen, Zap, Star, Settings, Loader2, CheckCircle2, Clock, ChevronRight, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import FormattedText from "../components/FormattedText";
import FormField, { TextInput, SelectInput } from "../components/FormField";
import { useTranslation } from "../hooks/useTranslation";
import { generateStudyPlan, saveStudyPlan, getSavedPlans, updateActivityStatus, moveToNextDay, simulateDateChange } from "../services/studyPlanApi";

export default function StudyPlan({ user: propUser }) {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Tab states
  const [activeTab, setActiveTab] = useState("architect"); // architect | saved
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  
  // Generated Plan (Preview)
  const [previewPlan, setPreviewPlan] = useState(null);
  const [previewInputs, setPreviewInputs] = useState(null);
  
  // Saved Plans
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null); // For accordion
  const [simulatedDate, setSimulatedDate] = useState(null);

  // Form States
  const [targetExam, setTargetExam] = useState("SSC CGL 2024");
  const [examDate, setExamDate] = useState("2026-06-16");
  const [level, setLevel] = useState("Intermediate");
  const [weakAreas, setWeakAreas] = useState("Reasoning, Quant");
  const [hours, setHours] = useState("6");
  const [mockFreq, setMockFreq] = useState("Once a week");
  const [revision, setRevision] = useState("Spaced Repetition");
  const [prefTime, setPrefTime] = useState("Mornings (8 AM - 12 PM)");
  const [duration, setDuration] = useState("7");

  const effectiveUser = propUser || JSON.parse(localStorage.getItem("user") || "{}");
  const userId = (effectiveUser.id && effectiveUser.id !== 7) ? effectiveUser.id : 1;
  const getSafeDayName = (date) => {
    if (!date) return "Day";
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  };

  const [lastCheckedDate, setLastCheckedDate] = useState(new Date().toDateString());

  useEffect(() => {
    fetchSavedPlans();

    // AUTO-RESCHEDULER: Watch for date changes (e.g., at midnight)
    const dateCheckInterval = setInterval(() => {
        const currentDate = new Date().toDateString();
        if (currentDate !== lastCheckedDate) {
            console.log("Date changed! Auto-syncing study plans to relocate missed tasks...");
            setLastCheckedDate(currentDate);
            fetchSavedPlans();
        }
    }, 60000); // Check every minute

    return () => clearInterval(dateCheckInterval);
  }, [userId, lastCheckedDate]);

  const fetchSavedPlans = async () => {
    try {
      if (!userId) return;
      const plans = await getSavedPlans(userId);
      setSavedPlans(plans);
      
      // Also update currently selected plan if open
      if (selectedPlan) {
          const updated = plans.find(p => p.id === selectedPlan.id);
          if (updated) setSelectedPlan(updated);
      }
    } catch (error) {
      console.error("Failed to fetch saved plans:", error);
    }
  };

  const handleArchitectPlan = async () => {
    setLoading(true);
    const payload = {
      userId, targetExam, examDate, currentLevel: level,
      weakAreas: weakAreas.split(",").map(s => s.trim()),
      dailyStudyHours: parseInt(hours), mockFrequency: mockFreq,
      revisionStrategy: revision, preferredStudyTimes: prefTime,
      planDurationDays: parseInt(duration),
      language
    };

    console.log("Study Plan: Generating plan");

    try {
      const response = await generateStudyPlan(payload);
      if (response && response.days && response.days.length > 0) {
        setPreviewPlan(response);
        setPreviewInputs(payload);
        setActiveDayIndex(0);
        console.log("Study Plan: Plan generated");
      } else {
        alert("AI generated an empty or invalid plan. Please try again with different inputs.");
      }
    } catch (error) {
      console.error("Study Plan Generation Error:", error);
      alert(`AI study plan generation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!previewPlan || !previewInputs) return;
    setSaving(true);
    try {
      await saveStudyPlan(previewInputs, previewPlan);
      console.log("Study Plan: Plan saved");
      alert("Study plan saved successfully!");
      setPreviewPlan(null);
      setPreviewInputs(null);
      fetchSavedPlans();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPlan = () => {
    setPreviewPlan(null);
    setPreviewInputs(null);
  };

  const handleToggleActivity = async (planId, activityId, completed) => {
    try {
      await updateActivityStatus(activityId, userId, { completed });
      console.log("Study Plan: Task completed");
      
      // Update local state
      if (selectedPlan && selectedPlan.id === planId) {
        const updatedPlan = { ...selectedPlan };
        updatedPlan.days = updatedPlan.days.map(d => ({
          ...d,
          activities: d.activities.map(a => a.id === activityId ? { ...a, completed } : a)
        }));
        setSelectedPlan(updatedPlan);
      }
      
      // Also update savedPlans list
      setSavedPlans(prev => prev.map(p => {
        if (p.id === planId) {
          return {
            ...p,
            days: p.days.map(d => ({
              ...d,
              activities: d.activities.map(a => a.id === activityId ? { ...a, completed } : a)
            }))
          };
        }
        return p;
      }));
    } catch (error) {
      console.error("Toggle Activity Error:", error);
    }
  };

  const handleNextDay = async (planId) => {
    try {
      await moveToNextDay(planId);
      console.log("Study Plan: Missed tasks moved");
      
      // Refresh all plans data
      const plans = await getSavedPlans(userId);
      setSavedPlans(plans);
      
      // Update selectedPlan if active
      if (selectedPlan && selectedPlan.id === planId) {
         const updated = plans.find(p => p.id === planId);
         if (updated) setSelectedPlan(updated);
         
         if (activeDayIndex < (selectedPlan.days.length - 1)) {
            setActiveDayIndex(activeDayIndex + 1);
         }
      }
    } catch (error) {
      console.error("Next Day Error:", error);
    }
  };

  const handleSimulateDateChange = async () => {
    if (!selectedPlan) return;
    
    // Calculate Next Day
    const current = simulatedDate ? new Date(simulatedDate) : new Date();
    const nextDay = new Date(current);
    nextDay.setDate(current.getDate() + 1);
    
    setSimulatedDate(nextDay);
    console.log("Simulated Date:", nextDay);
    
    // Move to next day UI
    if (activeDayIndex < (selectedPlan.days.length - 1)) {
       const nextIndex = activeDayIndex + 1;
       setActiveDayIndex(nextIndex);
       console.log("Active Day Index:", nextIndex + 1);
    }

    try {
      console.log("Study Plan: Simulating Date Change (Backend move tasks)");
      await simulateDateChange(selectedPlan.id);
      
      // Refresh current plan
      const plans = await getSavedPlans(userId);
      setSavedPlans(plans);
      
      const updated = plans.find(p => p.id === selectedPlan.id);
      if (updated) setSelectedPlan(updated);
      
      alert(`Simulation Mode: Advanced to ${nextDay.toLocaleDateString()}. Missed tasks relocated.`);
    } catch (error) {
      console.error("Simulation Error:", error);
      alert("Failed to simulate date change.");
    }
  };

  const openPlan = (plan) => {
    setSelectedPlan(plan);
    setActiveDayIndex(0);
    setExpandedDay(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderDailySchedule = (plan) => {
    const day = plan.days[activeDayIndex];
    if (!day) return null;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="app-card p-5">
            <div className="flex flex-wrap gap-2 mb-6 max-h-[120px] overflow-y-auto p-1">
              {plan.days.map((d, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeDayIndex === idx ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                  Day {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  Day {activeDayIndex + 1}: {getSafeDayName(day.date)}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{day.date ? new Date(day.date).toLocaleDateString() : ""}</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">{day.activities.length} Activities</span>
            </div>

            <div className="space-y-3">
              {day.activities.map((block, i) => (
                <div key={i} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${block.completed ? "bg-green-50/50 border-green-100" : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"}`}>
                   {/* Checkbox for saved plans only */}
                  {plan.id && (
                    <button 
                       onClick={() => handleToggleActivity(plan.id, block.id, !block.completed)}
                       className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${block.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-300 hover:border-blue-500"}`}
                    >
                       {block.completed && <CheckCircle2 size={14} />}
                    </button>
                  )}
                  
                  <div className="min-w-[100px]"><span className={`text-[10px] font-bold uppercase ${block.completed ? "text-green-600" : "text-blue-600"}`}>{block.timeSlot}</span></div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm mb-1 ${block.completed ? "text-slate-500 line-through" : "text-slate-800"}`}><FormattedText text={block.description} /></h4>
                    {block.focusArea && <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">Focus: {block.focusArea}</span>}
                  </div>
                  {block.missed && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase">Missed & Rescheduled</span>}
                </div>
              ))}
            </div>

            {/* Next Day Navigation */}
            {plan.id && activeDayIndex < (plan.days.length - 1) && (
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => handleNextDay(plan.id)}
                  className="btn-secondary flex items-center gap-2 group"
                >
                  {t("nextDay")} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderAccordionView = (plan) => {
    return (
      <div className="space-y-3 mt-4">
        {plan.days.map((day, idx) => (
          <div key={idx} className="app-card overflow-hidden">
            <button 
              onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-slate-800">Day {idx + 1}: {getSafeDayName(day.date)}</h4>
                  <p className="text-[10px] text-slate-400">{day.date ? new Date(day.date).toLocaleDateString() : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-slate-400">{day.activities.filter(a => a.completed).length}/{day.activities.length} Done</span>
                {expandedDay === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>
            {expandedDay === idx && (
              <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                {day.activities.map((act, ai) => (
                  <div key={ai} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-slate-50">
                    <div className={`w-2 h-2 rounded-full ${act.completed ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-[10px] font-bold text-blue-600 min-w-[100px] uppercase">{act.timeSlot}</span>
                    <span className={`flex-1 ${act.completed ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}><FormattedText text={act.description} /></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={14} style={{color: "var(--color-cyan)"}} />
            <span className="label" style={{color: "var(--color-cyan)"}}>{t("studyArchitect")}</span>
          </div>
          <h1 className="page-title">{t("aiStudyPlanArchitect")}</h1>
          <p className="text-subtle">{t("studyPlanDesc")}</p>
        </div>
        {selectedPlan && (
          <div className="flex gap-2">
             <button onClick={handleSimulateDateChange} className="btn-secondary text-[10px] py-1 h-auto flex items-center gap-2">
                <Clock size={12} /> Simulate Date Change
             </button>
             <button onClick={() => setSelectedPlan(null)} className="btn-secondary text-[10px] py-1 h-auto flex items-center gap-2">
                <X size={12} /> Close Plan
             </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-1">
          <div className="app-card p-6 glass-card sticky top-6">
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
              <FormField label="Plan Duration"><SelectInput value={duration} onChange={(e) => setDuration(e.target.value)} options={["7", "15", "30"]} /></FormField>
              <button onClick={handleArchitectPlan} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Settings size={14} />}
                {loading ? "Generating AI Study Plan..." : t("architectPlan")}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW OR SELECTED PLAN */}
        <div className="lg:col-span-2 space-y-5">
           {loading ? (
             <div className="app-card p-12 text-center flex flex-col items-center justify-center min-h-[400px] glass-card">
                <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                <h3 className="section-title">Generating AI Study Plan...</h3>
                <p className="text-subtle">Architecting your path to success. This takes 10-20 seconds.</p>
             </div>
           ) : selectedPlan ? (
             <div className="space-y-6">
                <div className="app-card p-6 border-l-4 border-blue-500 bg-blue-50/20">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedPlan.targetExam}</h2>
                    <p className="text-xs font-bold text-blue-600 mt-1">{selectedPlan.days.length} Day Comprehensive Plan</p>
                </div>
                
                <div className="flex gap-4 mb-4">
                   <button onClick={() => setExpandedDay(null)} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${expandedDay === null ? "bg-white shadow-md text-blue-600 border border-blue-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                      Daily View
                   </button>
                   <button onClick={() => setExpandedDay(0)} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${expandedDay !== null ? "bg-white shadow-md text-blue-600 border border-blue-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                      Full Roadmap
                   </button>
                </div>

                {expandedDay === null ? renderDailySchedule(selectedPlan) : renderAccordionView(selectedPlan)}
             </div>
           ) : previewPlan ? (
             <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
                   <div>
                     <h3 className="font-bold">AI Recommended Plan</h3>
                     <p className="text-xs text-blue-100">{previewPlan.days.length} Days tailored for YOUR performance.</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={handleSavePlan} disabled={saving} className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Plan
                      </button>
                      <button onClick={handleCancelPlan} disabled={saving} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-600 transition-colors">
                        <X size={14} /> Cancel
                      </button>
                   </div>
                </div>

                <div className="app-card p-5 border-l-4 border-cyan-500">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-cyan-500" />
                    <span className="label text-cyan-500 font-bold uppercase">{t("strategySummary")}</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed"><FormattedText text={previewPlan.summary} /></p>
                </div>

                {renderDailySchedule(previewPlan)}
             </div>
           ) : (
             <div className="app-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <BookOpen size={32} className="text-slate-300" />
                </div>
                <h3 className="section-title">Ready to Architect?</h3>
                <p className="text-subtle max-w-sm mx-auto">Fill in the inputs and let OTRAS AI build your personalized 30-day success roadmap.</p>
             </div>
           )}

           {/* SAVED PLANS SECTION */}
           <div className="mt-12 pt-8 border-t border-slate-100">
              <h2 className="section-title mb-6 flex items-center gap-2">
                 <Save size={18} className="text-blue-500" />
                 Saved Study Plans
              </h2>
              {savedPlans.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      onClick={() => openPlan(plan)}
                      className="app-card p-5 cursor-pointer group hover:border-blue-500 hover:shadow-xl transition-all border-l-4 border-blue-400"
                    >
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{plan.targetExam}</h4>
                          <span className="text-[10px] font-bold text-slate-400">{new Date(plan.createdAt).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
                          <span>{plan.days.length} Days</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{plan.dailyStudyHours} Hrs/Day</span>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-slate-400 text-sm">No saved plans yet.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
