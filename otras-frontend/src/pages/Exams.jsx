import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, BookOpen, Calendar, Shield, Briefcase } from 'lucide-react';
import ExamCard from '../components/ExamCard';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

export default function Exams({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [exams, setExams] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const [examsResp, jobsResp] = await Promise.all([
        axios.get('http://localhost:4000/exams'),
        axios.get('http://localhost:4000/jobs'),
      ]);

      setExams(examsResp.data);
      setJobs(jobsResp.data);

    } catch (err) {
      console.error('Failed to fetch exams/jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id) => {
    setSaved((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const handleSelectExam = (exam) => {
    navigate('/mocktests', { state: { selectedExam: exam } });
  };

  const handleApplyDetails = (exam) => {
    navigate('/exams/' + exam.id, { state: { selectedExam: exam } });
  };

  const filtered = exams.filter(
    (e) => !query || e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <h1 className="page-title">
            {t("examDiscoveryTitle")}
          </h1>

          <p className="text-subtle">
            {t("examDiscoverySubtitle")}
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button className="btn-secondary flex items-center gap-2">
            <Filter size={14} />
            {t("qualificationFilter")}
          </button>

          <button className="btn-secondary flex items-center gap-2">
            <MapPin size={14} />
            {t("stateSelection")}
          </button>

        </div>

      </div>


      {/* SEARCH */}

      <div className="relative">

        <Search
          size={16}
          style={{ color: "var(--text-muted)" }}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchExams")}
          className="input w-full pl-10"
        />

      </div>


      {/* MAIN GRID */}

      <div className="grid grid-cols-3 gap-6">

        {/* EXAM LIST */}

        <div className="col-span-2 space-y-4">

          <div className="flex items-center justify-between">

            <h2 className="section-title">
              {t("liveNotifications")}
            </h2>

            <span
              className="label px-3 py-1 rounded-full"
              style={{ background: "var(--bg-light)" }}
            >
              {filtered.length} {t("announcementsFound")}
            </span>

          </div>

          {loading ? (

            <div className="app-card p-8 text-center">
              <p className="text-subtle">
                {t("loadingExams")}
              </p>
            </div>

          ) : (

            filtered.map((exam) => (

              <div
                key={exam.id}
                onClick={() => handleSelectExam(exam)}
                className="cursor-pointer hover-lift"
              >

                <ExamCard
                  exam={{
                    ...exam,
                    tags: exam.subjects?.map((s) => s.name) || [],
                    deadline: '2026-04-30',
                    status: 'Open'
                  }}
                  saved={saved.includes(exam.id)}
                  onSave={handleSave}
                  onApplyDetails={handleApplyDetails}
                />

              </div>

            ))

          )}

        </div>


        {/* SIDEBAR */}

        <div className="space-y-6">

          {/* JOBS CARD */}

          <div className="app-card p-5">

            <div className="flex items-center gap-2 mb-4">

              <Briefcase size={16} style={{ color: "var(--color-primary)" }} />

              <h3 className="card-title">
                {t("activeJobOpenings")}
              </h3>

            </div>

            <div className="space-y-3 mb-4">

              {jobs.length === 0 ? (

                <p className="text-subtle">
                  {t("noActiveJobs")}
                </p>

              ) : (

                jobs.slice(0, 3).map(job => (

                  <div
                    key={job.id}
                    className="app-card p-3"
                  >

                    <p className="card-title" style={{ fontSize: "13px" }}>
                      {job.title}
                    </p>

                    <p
                      className="text-subtle"
                      style={{ fontSize: "12px" }}
                    >
                      {job.description}
                    </p>

                  </div>

                ))

              )}

            </div>

            <button
              style={{
                color: "var(--color-primary)",
                fontSize: "12px",
                fontWeight: 600
              }}
            >
              {t("viewAllPostings")}
            </button>

          </div>


          {/* RESOURCE CARD */}

          <div className="app-card p-5">

            <h3 className="card-title mb-4">
              {t("resourceAggregator")}
            </h3>

            {[
              { icon: BookOpen, label: t('previousYearPapers') },
              { icon: Calendar, label: t('syllabusTracker') },
              { icon: Shield, label: t('eligibilityChecker') },
            ].map(({ icon: Icon, label }) => (

              <button
                key={label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-default mb-2"
                style={{
                  border: "1px solid var(--border-light)"
                }}
              >

                <Icon size={15} style={{ color: "var(--text-muted)" }} />

                <span className="text-subtle">
                  {label}
                </span>

              </button>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}
