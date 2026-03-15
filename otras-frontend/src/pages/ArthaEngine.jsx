import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, GraduationCap, TrendingUp, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";
import IntelligenceFeedback from "../components/artha/IntelligenceFeedback";

export default function ArthaEngine({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tierStatus, setTierStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTierStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTierStatus = async () => {
    try {
      setLoading(true);
      console.log("ARTHA: Fetching tier status", user.id);
      const resp = await axios.get(`http://localhost:4000/artha/status/${user.id}`);
      console.log("ARTHA: Tier status response", resp.data);
      setTierStatus(resp.data);
    } catch (err) {
      console.error("Failed to fetch tier status", err);
    } finally {
      setLoading(false);
    }
  };


  const handleTier2Action = () => {
    console.log("ARTHA: Tier-2 button clicked");
    console.log("ARTHA: Tier status", tierStatus);
    if (tierStatus?.tier2.subscriptionRequired) {
      navigate("/subscriptions");
    } else if (tierStatus?.tier2.unlocked) {
      console.log("ARTHA: Navigating to Tier assessment", 2);
      navigate("/tier-assessment/2");
    }
  };

  const handleTier3Action = () => {
    console.log("ARTHA: Tier-3 button clicked");
    console.log("ARTHA: Tier status", tierStatus);
    if (tierStatus?.tier3.subscriptionRequired) {
      navigate("/subscriptions");
    } else if (tierStatus?.tier3.unlocked) {
      console.log("ARTHA: Navigating to Tier assessment", 3);
      navigate("/tier-assessment/3");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-500">{t("syncingEngineData")}</p>
        </div>
      </div>
    );
  }

  // Helper flags
  const t1 = tierStatus?.tier1;
  const t2 = tierStatus?.tier2;
  const t3 = tierStatus?.tier3;

  return (
    <div className="p-8 space-y-10">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="label" style={{ color: "var(--color-primary)" }}>
            {t("intelligenceEngine")}
          </p>
          <h1 className="page-title mt-2 uppercase">
            {t("arthaMultiTierJourney")}
          </h1>
          <p className="text-subtle mt-2">
            {t("completeTiersDesc")}
          </p>
        </div>

        {/* ENGINE STATUS */}
        <div className="app-card p-5 flex items-center gap-4">
          <ShieldCheck size={22} style={{ color: "var(--success)" }} />
          <div>
            <p className="label">
              {t("engineStatus")}
            </p>
            <p className="card-title" style={{ color: "var(--success)" }}>
              {t("activeSyncing")}
            </p>
          </div>
        </div>
      </div>


      {/* TIER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TIER 1 */}
        <div className="app-card p-6 flex flex-col justify-between hover-lift">
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: "var(--color-primary-light)" }}
            >
              <Brain size={22} style={{ color: "var(--color-primary)" }} />
            </div>

            <h3 className="card-title">
              {t("tier1Foundational")}
            </h3>

            <p className="label mt-1" style={{ color: "var(--color-primary)" }}>
              {t("aptitudeReasoning")}
            </p>

            <p className="text-subtle mt-3">
              {t("tier1Desc")}
            </p>

            {/* PROGRESS */}
            <div className="mt-5">
              <div className="flex justify-between label mb-1">
                <span>{t("tierProgress")}</span>
                <span>{t1?.completed ? "100%" : "0%"}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: t1?.completed ? "100%" : "0%" }}></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              console.log("ARTHA: Tier-1 assessment started");
              navigate("/company-instructions");
            }}
            className={t1?.completed ? "btn-secondary mt-6" : "btn-primary mt-6"}
          >
            {t1?.completed ? t("retakeAssessment") : t("startAssessment")}
          </button>
        </div>


        {/* TIER 2 */}
        <div className={`app-card p-6 flex flex-col justify-between ${!t2?.unlocked && !t2?.subscriptionRequired ? "opacity-60" : "hover-lift"}`}>
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: t2?.unlocked ? "var(--color-primary-light)" : "var(--bg-light)" }}
            >
              <GraduationCap size={22} style={{ color: t2?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }} />
            </div>

            <h3 className="card-title" style={{ color: t2?.unlocked ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {t("tier2Subject")}
            </h3>

            <p className="label mt-1" style={{ color: t2?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }}>
              {t("coreGovtTopics")}
            </p>

            <p className="text-subtle mt-3">
              {t("tier2Desc")}
            </p>

            {t2?.unlocked && (
              <div className="mt-5">
                <div className="flex justify-between label mb-1">
                  <span>{t("tierProgress")}</span>
                  <span>{t2?.completed ? "100%" : "0%"}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: t2?.completed ? "100%" : "0%" }}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            {t2?.subscriptionExpired ? (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 text-center leading-tight">
                {t("subscriptionExpiredMsg")}
              </div>
            ) : (!t2?.unlocked && !t2?.subscriptionRequired && (
              <div className="mt-6 text-center label uppercase">
                {t("completePreviousTier")}
              </div>
            ))}

            <button
              disabled={!t2?.unlocked && !t2?.subscriptionRequired}
              onClick={handleTier2Action}
              className={`mt-4 w-full ${t2?.subscriptionRequired ? "btn-primary bg-orange-600 hover:bg-orange-700 hover:text-white" : (t2?.completed ? "btn-secondary" : "btn-primary")}`}
              style={{ opacity: (!t2?.unlocked && !t2?.subscriptionRequired) ? 0.6 : 1 }}
            >
              {t2?.subscriptionExpired ? t("renewSubscription") : (t2?.subscriptionRequired ? t("takeSubscription") : (t2?.completed ? t("retakeAssessment") : t("startAssessment")))}
            </button>
          </div>
        </div>


        {/* TIER 3 */}
        <div className={`app-card p-6 flex flex-col justify-between ${!t3?.unlocked && !t3?.subscriptionRequired ? "opacity-60" : "hover-lift"}`}>
          <div>
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ background: t3?.unlocked ? "var(--color-primary-light)" : "var(--bg-light)" }}
            >
              <TrendingUp size={22} style={{ color: t3?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }} />
            </div>

            <h3 className="card-title" style={{ color: t3?.unlocked ? "var(--text-primary)" : "var(--text-secondary)" }}>
              {t("tier3Intelligence")}
            </h3>

            <p className="label mt-1" style={{ color: t3?.unlocked ? "var(--color-primary)" : "var(--text-secondary)" }}>
              {t("aiRoadmapGen")}
            </p>

            <p className="text-subtle mt-3">
              {t("tier3Desc")}
            </p>

            {t3?.unlocked && (
              <div className="mt-5">
                <div className="flex justify-between label mb-1">
                  <span>{t("tierProgress")}</span>
                  <span>{t3?.completed ? "100%" : "0%"}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: t3?.completed ? "100%" : "0%" }}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            {t3?.subscriptionExpired ? (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-100 text-center leading-tight">
                {t("subscriptionExpiredMsg")}
              </div>
            ) : (!t3?.unlocked && !t3?.subscriptionRequired && (
              <div className="mt-6 text-center label uppercase">
                {t("completePreviousTier")}
              </div>
            ))}

            <button
              disabled={!t3?.unlocked && !t3?.subscriptionRequired}
              onClick={handleTier3Action}
              className={`mt-4 w-full ${t3?.subscriptionRequired ? "btn-primary bg-orange-600 hover:bg-orange-700 hover:text-white" : (t3?.completed ? "btn-secondary" : "btn-primary")}`}
              style={{ opacity: (!t3?.unlocked && !t3?.subscriptionRequired) ? 0.6 : 1 }}
            >
              {t3?.subscriptionExpired ? t("renewSubscription") : (t3?.subscriptionRequired ? t("takeSubscription") : (t3?.completed ? t("retakeAssessment") : t("startAssessment")))}
            </button>
          </div>
        </div>

      </div>
      
      {/* AI INTELLIGENCE REPORT */}
      {tierStatus?.feedback && (
        <div className="mt-10">
          <IntelligenceFeedback feedback={tierStatus.feedback} />
        </div>
      )}


      {/* WHY SECTION */}
      <div
        className="rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center"
        style={{
          background:
            "linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))",
          color: "white"
        }}
      >

        <div className="max-w-xl">
          <h2 className="section-title mb-4 uppercase" style={{ color: "white" }}>
            {t("whyArthaAssessment")}
          </h2>
          <p
            className="text-subtle mb-6"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {t("whyArthaDesc")}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>✓ {t("predictiveAnalysis")}</p>
            <p>✓ {t("weaknessMapping")}</p>
            <p>✓ {t("milestoneScheduling")}</p>
            <p>✓ {t("certifiedReadiness")}</p>
          </div>
        </div>

        {/* READINESS CARD */}
        <div
          className="rounded-xl p-8 mt-6 md:mt-0 text-center"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)"
          }}
        >
          <p
            className="label"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {t("currentReadiness")}
          </p>
          <h3 className="text-5xl font-bold mt-2">
            {tierStatus?.percentile ? `${Math.round(tierStatus.percentile)}%` : "0%"}
          </h3>

          <span
            className="inline-block mt-3 px-4 py-1 rounded-full text-sm"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {t("incomplete")}
          </span>
        </div>
      </div>
    </div>
  );
}
