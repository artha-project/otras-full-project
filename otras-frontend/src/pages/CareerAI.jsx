import React, { useState, useEffect } from "react";
import { Sparkles, Rocket, Calendar, Map, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

const CareerAI = () => {
  const { t, language } = useTranslation();

  const [formData, setFormData] = useState({
    logicalProfile: "Tier 1 verified (84%)",
    quantProfile: "Tier 2 verified (72%)",
    verbalAbility: "",
    interests: "",
    learningPattern: "",
    confidenceIndex: 70,
    longTermAspirations: "",
  });

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const savedData = sessionStorage.getItem("careerAI_formData");
    const savedRoadmap = sessionStorage.getItem("careerAI_roadmap");

    if (savedData) setFormData(JSON.parse(savedData));
    if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));

  }, []);

  useEffect(() => {
    sessionStorage.setItem("careerAI_formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (roadmap) {
      sessionStorage.setItem("careerAI_roadmap", JSON.stringify(roadmap));
    }
  }, [roadmap]);

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const generateRoadmap = async () => {
    setLoading(true);

    try {
      const payload = {
        exam: "Full Career Assessment",
        score: formData.confidenceIndex,
        weakAreas: [formData.learningPattern],
        language: language,
        ...formData
      };

      const resp = await axios.post("http://localhost:4000/ai/roadmap", payload);
      
      const result = resp.data.roadmap;
      
      // If the response is a string (e.g. from simulation), we might need to handle it
      // but if it's from the microservice, it's already a parsed object.
      
      if (typeof result === 'string') {
        // Fallback for simulated string responses
        setRoadmap({
          sixMonth: [result],
          oneYear: ["Continue your journey based on the analysis above."]
        });
      } else {
        setRoadmap(result);
      }
    } catch (err) {
      console.error("Failed to generate roadmap", err);
      // Fallback to minimal mock on error
      setRoadmap({
        sixMonth: ["Foundation building (0-6 months)"],
        oneYear: ["Advanced growth (6-12 months)"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="p-8 space-y-10">

      {/* HEADER */}

      <div>

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full label"
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            border: "1px solid var(--border-light)"
          }}
        >
          <Sparkles size={12} />
          {t("arthaIntelligenceTier3")}
        </div>

        <h1 className="page-title mt-3 uppercase">
          {t("intelligenceAnalysisRoadmap")}
        </h1>

        <p className="text-subtle mt-1">
          {t("synthesisDesc")}
        </p>

      </div>


      {/* GRID */}

      <div className="grid lg:grid-cols-[420px_1fr] gap-8">


        {/* FORM */}

        <div className="app-card p-6">

          <div className="mb-4">

            <h3 className="section-title">
              {t("arthaDataInputs")}
            </h3>

            <p className="text-subtle">
              {t("synthesizeProfiles")}
            </p>

          </div>


          <div className="space-y-4">

            <div>
              <label className="label">{t("logicalProfile")}</label>
              <input
                name="logicalProfile"
                value={formData.logicalProfile}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">{t("quantProfile")}</label>
              <input
                name="quantProfile"
                value={formData.quantProfile}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">{t("verbalAbility")}</label>
              <input
                name="verbalAbility"
                value={formData.verbalAbility}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">{t("interests")}</label>
              <input
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">{t("learningPattern")}</label>
              <input
                name="learningPattern"
                value={formData.learningPattern}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>


            {/* CONFIDENCE */}

            <div>

              <div className="flex justify-between mb-1 label">

                <span>{t("confidenceIndex")}</span>

                <span style={{ color: "var(--color-primary)" }}>
                  {formData.confidenceIndex}%
                </span>

              </div>

              <input
                type="range"
                name="confidenceIndex"
                min="0"
                max="100"
                value={formData.confidenceIndex}
                onChange={handleInputChange}
                className="w-full"
                style={{ accentColor: "var(--color-primary)" }}
              />

            </div>


            <div>
              <label className="label">{t("longTermAspirations")}</label>

              <textarea
                name="longTermAspirations"
                value={formData.longTermAspirations}
                onChange={handleInputChange}
                rows={4}
                className="input w-full"
              />
            </div>


            <button
              onClick={generateRoadmap}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? t("analyzingData") : t("generateMyRoadmap")}
            </button>

          </div>

        </div>


        {/* RESULTS */}

        <div>

          {!roadmap ? (

            <div className="app-card p-10 text-center">

              <Map size={40} style={{ color: "var(--text-muted)" }} />

              <h2 className="section-title mt-3">
                {t("readyForAnalysis")}
              </h2>

              <p className="text-subtle">
                {t("readyForAnalysisDesc")}
              </p>

            </div>

          ) : (

            <div className="space-y-6">


              {/* 6 MONTH */}

              <div className="app-card p-6">

                <div className="flex items-center gap-2 mb-3">

                  <Calendar size={18} style={{ color: "var(--color-primary)" }} />

                  <h3 className="section-title">
                    {t("sixMonthMap")}
                  </h3>

                </div>

                <div className="space-y-2">

                  {roadmap.sixMonth.map((step, i) => (

                    <p key={i} className="text-subtle">
                      <strong>{i + 1}.</strong> {step}
                    </p>

                  ))}

                </div>

              </div>


              {/* 1 YEAR */}

              <div className="app-card p-6">

                <div className="flex items-center gap-2 mb-3">

                  <Rocket size={18} style={{ color: "var(--color-primary)" }} />

                  <h3 className="section-title">
                    {t("oneYearTrajectory")}
                  </h3>

                </div>

                <div className="space-y-2">

                  {roadmap.oneYear.map((step, i) => (

                    <p key={i} className="text-subtle">
                      <strong>{i + 1}.</strong> {step}
                    </p>

                  ))}

                </div>


                <div
                  className="flex justify-between items-center mt-6 pt-4"
                  style={{ borderTop: "1px solid var(--border-light)" }}
                >

                  <span className="badge-success flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    {t("certifiedRoadmap")}
                  </span>

                  <button
                    onClick={() => {
                      setRoadmap(null);
                      sessionStorage.removeItem("careerAI_roadmap");
                    }}
                    className="label"
                  >
                    {t("resetAnalysis")}
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default CareerAI;
