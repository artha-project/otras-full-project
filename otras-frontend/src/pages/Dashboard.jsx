import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Shield,
  Search,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";
import ScheduleItem from "../components/ScheduleItem";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";
import { getSavedPlans } from "../services/studyPlanApi";

export default function Dashboard({ user: propUser }) {

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propUser?.id) {
      fetchDashboardData(propUser.id);
    } else {
      setLoading(false);
    }
  }, [propUser?.id]);

  const fetchDashboardData = async (userId) => {
    try {
      const [resp, plans] = await Promise.all([
        axios.get(`http://localhost:4000/users/${userId}/dashboard`),
        getSavedPlans(userId).catch(() => [])
      ]);
      setData({ ...resp.data, studyPlans: plans || [] });
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const user = propUser || JSON.parse(localStorage.getItem("user") || "{}");

  const stats =
    data?.stats ||
    { readinessIndex: 0, testsCompleted: 0, recentTend: [], percentile: 0, logicalScore: 0, quantScore: 0, verbalScore: 0 };

  console.log("ARTHA: Rendering AI feedback in report", stats);

  // 1. Data Source: Fetch actual mock tests (submitted only, from backend)
  const mockTests = data?.mockTests || [];

  // 2. Generate Last 7 Days Chronologically (Ending Today)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i)); // 6 days ago -> today

    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

    // Find tests written on this specific calendar date
    const dayTests = mockTests.filter(test => {
      const testDate = new Date(test.createdAt);
      return testDate.toDateString() === date.toDateString();
    });

    const avgScore = dayTests.length
      ? Math.round(dayTests.reduce((sum, t) => sum + Number(t.score || 0), 0) / dayTests.length)
      : 0;

    return {
      label: dayLabel,
      score: avgScore
    };
  });

  // Debug logs
  console.log("Raw Mock Tests:", mockTests);
  console.log("Last 7 Days Data:", last7Days);

  const hasData = mockTests.length > 0;
  const trendLabels = last7Days.map(d => d.label);
  const trendScores = last7Days.map(d => d.score);
  
  // Dynamic scaling: find the max score in the dataset (min 10 so it doesn't zoom too much on tiny numbers)
  const maxScore = Math.max(...trendScores, 10); 

  const pathPoints = trendScores.map((val, i) => {
    const x = (i / (trendScores.length - 1)) * 400;
    // Scale vertically using the dynamic maxScore, with a 10% padding at top
    // 80 is the height range we draw in (SVG height is 100)
    const y = 100 - (val / maxScore) * 80;
    return `${x},${y}`;
  });

  const trendLinePath = hasData ? `M${pathPoints.join(" L")}` : "";
  const trendAreaPath = hasData ? `${trendLinePath} L400,100 L0,100 Z` : "";

  // Daily Study Data
  let dailyTasks = [];
  if (data?.studyPlans && data.studyPlans.length > 0) {
    const firstPlan = data.studyPlans[0];
    if (firstPlan.days && firstPlan.days.length > 0) {
      const activeDay = firstPlan.days.find(d => d.activities?.some(a => !a.completed)) || firstPlan.days[0];
      dailyTasks = (activeDay.activities || []).slice(0, 3);
    }
  }

  return (
    <div className="space-y-5">

      {/* HERO */}

      <div
        className="rounded-2xl p-7 flex items-start justify-between"
        style={{
          background: "linear-gradient(135deg, #e0e8ff 0%, #f0f7ff 100%)"
        }}
      >

        <div>

          <h1 className="text-3xl font-bold text-blue-800 mb-1 capitalize">
            {t("welcome")}, {user.firstName || "Candidate"}.
          </h1>

          <p className="text-slate-500 text-sm">
            {user.otrId
              ? `${t("otrId")} ${user.otrId}. ${t("examRoadmap")}`
              : t("completeOTR")}
          </p>

        </div>


        {/* READINESS CARD */}

        <div className="bg-white rounded-xl p-4 text-center shadow-sm min-w-32">

          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
            {t("readiness")}
          </p>

          <p className="text-3xl font-bold text-blue-700">
            {stats.readinessIndex}
            <span className="text-lg">%</span>
          </p>

          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold text-green-700 bg-green-100">
            {stats.readinessIndex > 70
              ? t("ready")
              : t("foundation")}
          </span>

        </div>

      </div>


      {/* OTR BANNER */}

      {!user.otrId && (

        <div className="rounded-xl p-4 flex items-center justify-between border-2 border-cyan-200 bg-cyan-50">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <FileText size={18} className="text-cyan-600" />
            </div>

            <div>

              <p className="text-blue-700 font-semibold">
                {t("otrRequired")}
              </p>

              <p className="text-slate-500 text-sm">
                {t("otrDescription")}
              </p>

            </div>

          </div>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm"
            style={{ background: "#06b6d4" }}
          >
            {t("fillOtrForm")}
            <ArrowRight size={15} />
          </button>

        </div>

      )}


      {/* FEATURE CARDS */}

      <div className="grid grid-cols-3 gap-4">

        {[
          {
            icon: <Shield size={20} className="text-blue-500" />,
            title: t("eligibility"),
            desc: t("eligibilityDesc"),
            btn: t("checkEligibility"),
            page: "eligibility",
            primary: true
          },
          {
            icon: <Search size={20} className="text-blue-400" />,
            title: t("examDiscovery"),
            desc: t("examDiscoveryDesc"),
            btn: t("browseOpenings"),
            page: "exams"
          },
          {
            icon: <Star size={20} className="text-blue-400" />,
            title: t("careerIntelligence"),
            desc: t("careerDesc"),
            btn: t("generateRoadmap"),
            page: "career"
          }
        ].map((card, i) => (

          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">

            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              {card.icon}
            </div>

            <h3 className="text-slate-800 font-semibold text-base mb-1">
              {card.title}
            </h3>

            <p className="text-slate-500 text-sm mb-4">
              {card.desc}
            </p>

            <button
              onClick={() => navigate(`/${card.page}`)}
              className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all ${card.primary
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "border border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
            >
              {card.btn}
              {card.primary && <ArrowRight size={14} />}
            </button>

          </div>

        ))}

      </div>


      {/* BOTTOM SECTION */}

      <div className="grid grid-cols-2 gap-4">

        {/* PERFORMANCE TREND */}

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">

          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-blue-500" />
            <h3 className="font-semibold text-slate-800">
              {t("performanceTrend")}
            </h3>
          </div>

          <p className="text-slate-500 text-sm mb-4">
            {stats.testsCompleted > 0
              ? t("testsCompletedMsg").replace("{count}", stats.testsCompleted)
              : t("startMockTests")}
          </p>

          <div className="relative h-32 flex flex-col justify-center">
            {hasData ? (
              <>
                <svg viewBox="0 0 400 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={trendLinePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={trendAreaPath}
                    fill="url(#grad)"
                  />
                </svg>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                  {trendLabels.map((label, i) => (
                    <span key={i} className="text-xs text-slate-400">
                      {label}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-medium">{t("noDataAvailable") || "No performance data available yet"}</p>
                <p className="text-slate-300 text-xs mt-1">{t("completeMockToSeeTrend") || "Complete a mock test to see your trend"}</p>
              </div>
            )}
          </div>

        </div>


        {/* DAILY STUDY */}

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">

          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} className="text-cyan-500" />
            <h3 className="font-semibold text-slate-800">
              {t("dailySprint")}
            </h3>
          </div>

          <p className="text-slate-500 text-sm mb-4">
            {t("arthaFocus")}
          </p>

          <div>

            {dailyTasks.length > 0 ? (
              dailyTasks.map((task, idx) => (
                <ScheduleItem
                  key={idx}
                  time={task.timeSlot}
                  task={task.description}
                  status={task.completed ? "Completed" : task.missed ? "Missed" : "Pending"}
                  statusColor={task.completed ? "text-green-500" : task.missed ? "text-red-500" : "text-blue-500"}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">{t("noStudyPlanFound") || "No tasks available. Create a study plan."}</p>
            )}

          </div>

          <button
            onClick={() => navigate("/studyplan")}
            className="mt-3 text-blue-600 text-sm font-semibold hover:underline w-full text-right"
          >
            {t("weeklyArchitect")}
          </button>

        </div>

      </div>

    </div>
  );
}
