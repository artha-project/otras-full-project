import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import LandingPage from './components/Landing Page/Pages/LandingPage';
import Login from './components/Landing Page/Pages/Login';
import Signup from './components/Landing Page/Pages/Signup';
import ForgotPassword from './components/Landing Page/Pages/ForgotPassword';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import PageContainer from './components/PageContainer';
import Dashboard from './pages/Dashboard';
import Eligibility from './pages/Eligibility';
import ArthaEngine from './pages/ArthaEngine';
import Exams from './pages/Exams';
import StudyPlan from './pages/StudyPlan';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import CareerAI from './pages/CareerAI';
import MockTests from './pages/MockTests';
import Analytics from './pages/Analytics';
import ExamDetails from './pages/ExamDetails';
import ApplicationStatus from './pages/ApplicationStatus';
import PreviousPapers from './pages/PreviousPapers';
import Subscriptions from './pages/Subscriptions';
import CompanyInstructions from './pages/CompanyInstructions';
import ExamInstructions from './pages/ExamInstructions';
import ArthaTest from './pages/ArthaTest';
import ReferEarn from './pages/ReferEarn';
import TierAssessment from './pages/TierAssessment';

const ProtectedLayout = ({ collapsed, setCollapsed, user, logout }) => (
  <>
    <Sidebar
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      user={user}
      logout={logout}
    />
    <TopHeader collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
    <PageContainer collapsed={collapsed}>
      <Outlet />
    </PageContainer>
  </>
);

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="font-sans">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Internal Routes */}
        <Route element={<ProtectedLayout collapsed={collapsed} setCollapsed={setCollapsed} user={user} logout={logout} />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/eligibility" element={<Eligibility user={user} />} />
          <Route path="/artha" element={<ArthaEngine user={user} />} />
          <Route path="/exams" element={<Exams user={user} />} />
          <Route path="/exams/:id" element={<ExamDetails user={user} />} />
          <Route path="/studyplan" element={<StudyPlan user={user} />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile onAuthSuccess={handleAuthSuccess} user={user} />} />
          <Route path="/career" element={<CareerAI user={user} />} />
          <Route path="/mocktests" element={<MockTests user={user} />} />
          <Route path="/analytics" element={<Analytics user={user} />} />
          <Route path="/subscriptions" element={<Subscriptions user={user} />} />
          <Route path="/applications" element={<ApplicationStatus user={user} />} />
          <Route path="/refer-earn" element={<ReferEarn user={user} />} />
          <Route path="/previous-papers" element={<PreviousPapers />} />
          <Route path="/company-instructions" element={<CompanyInstructions />} />
          <Route path="/exam-instructions" element={<ExamInstructions />} />
          <Route path="/artha-test" element={<ArthaTest user={user} />} />
          <Route path="/tier-assessment/:tier" element={<TierAssessment user={user} />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
