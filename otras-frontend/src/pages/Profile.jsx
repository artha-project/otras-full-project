import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, User, BookOpen, MapPin, Shield, Lock, CheckCircle2, Edit2, Save, X, Gift } from 'lucide-react';
import FormField, { TextInput, SelectInput } from '../components/FormField';
import UserCreditsCard from '../components/UserCreditsCard';
import LoginModal from '../components/LoginModal';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

export default function Profile({ onAuthSuccess, user: currentUser }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    age: currentUser?.age || '',
    category: currentUser?.category || 'General',
    password: 'password',
    highestDegree: currentUser?.highestDegree || "Bachelor's Degree",
    careerPreference: currentUser?.careerPreference || '',
    domicile: currentUser?.domicile || 'Select state',
    pincode: currentUser?.pincode || '',
    referralCode: ''
  });

  const [registeredUser, setRegisteredUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (currentUser) {
        // Update existing user
        const response = await axios.patch(`http://localhost:4000/users/${currentUser.id}`, {
          ...formData,
          age: parseInt(formData.age) || null
        });
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setRegisteredUser(updatedUser);
        if (onAuthSuccess) onAuthSuccess(updatedUser);
        setIsEditing(false);
        alert(t('profileUpdatedSuccess'));
      } else {
        // Register new user
        const response = await axios.post('http://localhost:4000/auth/register', {
          ...formData,
          age: parseInt(formData.age) || null
        });
        const { user: newUser, access_token } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setRegisteredUser(newUser);
        if (onAuthSuccess) onAuthSuccess(newUser);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredUser && !currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t("registrationSuccessful")}</h1>
        <p className="text-slate-500 mb-8">{t("identityGenerated")}</p>

        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("candidateName")}</p>
              <p className="text-xl font-bold text-slate-800">{registeredUser.firstName} {registeredUser.lastName}</p>
            </div>
            <Shield size={32} className="text-blue-600" />
          </div>
          <div className="bg-blue-900 rounded-xl p-6 text-white text-center">
            <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">{t("yourUniqueOtrId")}</p>
            <p className="text-4xl font-black tracking-[0.2em]">{registeredUser.otrId}</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          {t("goToDashboard")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-700 mb-1">
        {currentUser ? t('yourEcosystemProfile') : t('otrFormTitle')}
      </h1>
      <p className="text-slate-500 text-sm mb-5">
        {currentUser
          ? t('manageIdentityDesc')
          : t('completeIdentityDesc')}
      </p>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-5 flex items-center gap-3">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Pending Alert */}
      {!currentUser && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 mb-5">
          <AlertCircle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-700 font-semibold text-sm">{t("registrationPending")}</p>
            <p className="text-yellow-600 text-sm">
              {t("completeFormDesc")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {/* Main Form */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <User size={18} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">{t("candidateProfile")}</h2>
                  <p className="text-slate-500 text-sm">{t("personalContactInfo")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!currentUser && (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {t("alreadyHaveAccount")}
                  </button>
                )}
                {currentUser && (
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t("firstName")}>
                <TextInput
                  placeholder={t("enterFirstName")}
                  value={formData.firstName}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </FormField>
              <FormField label={t("lastName")}>
                <TextInput
                  placeholder={t("enterLastName")}
                  value={formData.lastName}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </FormField>
              <FormField label={t("emailAddress")}>
                <TextInput
                  placeholder="example@gmail.com"
                  value={formData.email}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </FormField>
              <FormField label={t("age")}>
                <TextInput
                  placeholder="e.g. 24"
                  value={formData.age}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('age', e.target.value)}
                />
              </FormField>
              <FormField label={t("category")}>
                <SelectInput
                  options={['General', 'OBC', 'SC', 'ST', 'EWS']}
                  value={formData.category}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('category', e.target.value)}
                />
              </FormField>
              {!currentUser && (
                <>
                  <FormField label={t("setLoginPassword")}>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2.5 text-sm outline-none focus:border-blue-400"
                      />
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{t("passwordFutureLogins")}</p>
                  </FormField>
                  <FormField label={t("referralCodeOptional")}>
                    <TextInput
                      placeholder="e.g. REF873452"
                      value={formData.referralCode}
                      onChange={(e) => handleChange('referralCode', e.target.value.toUpperCase())}
                    />
                    <p className="text-slate-400 text-xs mt-1">{t("enterFriendCode")}</p>
                  </FormField>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen size={18} className="text-blue-500" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">{t("educationGeography")}</h2>
                <p className="text-slate-500 text-sm">{t("requiredForOtrDesc")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t("highestDegree")}>
                <SelectInput
                  options={["Bachelor's Degree", "Master's Degree", '12th / HSC', '10th / SSC']}
                  value={formData.highestDegree}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('highestDegree', e.target.value)}
                />
              </FormField>
              <FormField label={t("careerPreference")}>
                <TextInput
                  placeholder="e.g. Civil Services"
                  value={formData.careerPreference}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('careerPreference', e.target.value)}
                />
              </FormField>
              <FormField label={t("domicileState")}>
                <SelectInput
                  options={['Select state', 'Maharashtra', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Delhi']}
                  value={formData.domicile}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('domicile', e.target.value)}
                />
              </FormField>
              <FormField label={t("pincode")}>
                <TextInput
                  placeholder="e.g. 400026"
                  value={formData.pincode}
                  disabled={currentUser && !isEditing}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                />
              </FormField>
            </div>
          </div>

          {( (!currentUser) || (currentUser && isEditing) ) && (
            <div className="flex items-center justify-end gap-3 pb-4">
              <button 
                onClick={() => {
                  if (currentUser) {
                    setIsEditing(false);
                    setFormData({
                        firstName: currentUser.firstName,
                        lastName: currentUser.lastName,
                        email: currentUser.email,
                        age: currentUser.age || '',
                        category: currentUser.category || 'General',
                        password: 'password',
                        highestDegree: currentUser.highestDegree || "Bachelor's Degree",
                        careerPreference: currentUser.careerPreference || '',
                        domicile: currentUser.domicile || 'Select state',
                        pincode: currentUser.pincode || '',
                        referralCode: ''
                    });
                  }
                }}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity ${loading ? 'opacity-50' : 'hover:opacity-90'} flex items-center gap-2`}
                style={{ background: '#1e3a8a' }}
              >
                {loading ? (
                    currentUser ? 'Saving...' : 'Generating...'
                ) : (
                    <>
                        {currentUser ? <Save size={16} /> : null}
                        {currentUser ? t('saveChanges') : t('generateOtrIdentity')}
                    </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{t("otrasEcosystemCard")}</h3>
                <p className="text-blue-200 text-sm">{t("uniqueCandidateIdentity")}</p>
              </div>
              <Shield size={28} className="text-blue-300" />
            </div>
            <div className="bg-blue-800/60 rounded-xl p-4 mb-4">
              <p className="text-blue-300 text-xs uppercase tracking-widest mb-1">{t("otrRegistrationId")}</p>
              <p className="text-2xl font-extrabold tracking-widest text-white">
                {currentUser ? currentUser.otrId : (registeredUser ? registeredUser.otrId : t('unregistered'))}
              </p>
            </div>
            <div className="flex items-start gap-2 bg-blue-800/40 rounded-lg p-3 text-xs text-blue-300">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-cyan-400" />
              <div>
                <p className="font-bold text-cyan-400 mb-0.5">{t("idGenerationLogic")}:</p>
                <p>{t("logicCodes")}</p>
                <p>{t("idMandatoryDesc")}</p>
              </div>
            </div>
          </div>

          {/* Credits card – only for registered users */}
          {currentUser && (
            <UserCreditsCard user={currentUser} />
          )}

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">{t("registrationStatus")}</h3>
            <div className="h-2 bg-slate-100 rounded-full mb-4">
              <div className="h-2 rounded-full bg-cyan-400" style={{ width: (currentUser || registeredUser) ? '100%' : '15%' }} />
            </div>
            <div className="space-y-2.5">
              {[t('identityVerified'), t('educationalMapping'), t('geographicDomicile'), t('credentialSecurity')].map(
                (item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-slate-600 text-sm">{item}</span>
                    {(currentUser || registeredUser) ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <span className="text-red-500 text-xs font-semibold">{t("required")}</span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          if (onAuthSuccess) onAuthSuccess(user);
          // Auto-fill form data for the logged in user to avoid sync issues
          setFormData(prev => ({
            ...prev,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age || '',
            category: user.category || 'General',
            highestDegree: user.highestDegree || "Bachelor's Degree",
            careerPreference: user.careerPreference || '',
            domicile: user.domicile || 'Select state',
            pincode: user.pincode || '',
          }));
        }} 
      />
    </div>
  );
}
