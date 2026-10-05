import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Award,
  Flame,
  Zap,
  Edit2,
  Check,
  Plus,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Shield,
  CheckCircle2,
  BarChart3,
  Layers,
  LogIn,
  UserPlus,
  Lock,
  GraduationCap,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { UserProfile } from '../types/gamification';
import { AVATAR_OPTIONS, getAvatarById } from '../data/avatars';
import { BADGES_LIST } from '../data/badges';
import {
  calculateLevelInfo,
  calculateProfileCompletion,
  saveProfile,
  createNewProfile,
  deleteProfile,
  setActiveProfileId,
  exportAllDataAsJson,
  importDataFromJson,
  registerUser,
  loginUser,
} from '../utils/userProfileManager';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  allProfiles: UserProfile[];
  onProfileUpdated: (updated: UserProfile) => void;
  onProfileSwitched: (newProfile: UserProfile) => void;
  onProfilesListChanged: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  allProfiles,
  onProfileUpdated,
  onProfileSwitched,
  onProfilesListChanged,
}) => {
  // Main view tabs: 1. مشخصات و حساب (Profile & Auth), 2. مدال‌ها (Badges), 3. آمار و پشتیبان (Stats & Backup)
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'stats'>('profile');

  // Profile Form State (Complete & Edit)
  const [nickname, setNickname] = useState(activeProfile.nickname);
  const [username, setUsername] = useState(activeProfile.username || '');
  const [fullName, setFullName] = useState(activeProfile.fullName || '');
  const [educationLevel, setEducationLevel] = useState(
    activeProfile.educationLevel || 'مقدمات حوزه / طلبه پایه ۱'
  );
  const [institution, setInstitution] = useState(activeProfile.institution || '');
  const [learningGoal, setLearningGoal] = useState(
    activeProfile.learningGoal || 'فهم قرآن و ادعیه'
  );
  const [contact, setContact] = useState(activeProfile.emailOrPhone || '');
  const [pin, setPin] = useState(activeProfile.pin || '');
  const [avatarId, setAvatarId] = useState(activeProfile.avatarId);
  const [color, setColor] = useState(activeProfile.color || 'bg-emerald-600');
  const [saveToast, setSaveToast] = useState(false);

  // Sub-section within profile tab: 'details' (مشخصات) vs 'switch_auth' (ورود / ثبت‌نام / تغییر حساب)
  const [accountSubView, setAccountSubView] = useState<'details' | 'switch_auth'>('details');

  // Quick Auth forms inside switch_auth section
  const [authAction, setAuthAction] = useState<'list' | 'login' | 'register'>('list');
  const [authUsername, setAuthUsername] = useState('');
  const [authNickname, setAuthNickname] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Backup state
  const [backupJson, setBackupJson] = useState('');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Sync state on activeProfile change
  useEffect(() => {
    setNickname(activeProfile.nickname);
    setUsername(activeProfile.username || '');
    setFullName(activeProfile.fullName || '');
    setEducationLevel(activeProfile.educationLevel || 'مقدمات حوزه / طلبه پایه ۱');
    setInstitution(activeProfile.institution || '');
    setLearningGoal(activeProfile.learningGoal || 'فهم قرآن و ادعیه');
    setContact(activeProfile.emailOrPhone || '');
    setPin(activeProfile.pin || '');
    setAvatarId(activeProfile.avatarId);
    setColor(activeProfile.color || 'bg-emerald-600');
  }, [activeProfile]);

  if (!isOpen) return null;

  const currentAvatar = getAvatarById(activeProfile.avatarId);
  const levelInfo = calculateLevelInfo(activeProfile.xp);
  const completionPct = calculateProfileCompletion(activeProfile);

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNick = nickname.trim() || activeProfile.nickname;
    const cleanUser = username.trim() || activeProfile.username;

    const updated: UserProfile = {
      ...activeProfile,
      nickname: cleanNick,
      username: cleanUser,
      fullName: fullName.trim(),
      educationLevel,
      institution: institution.trim(),
      learningGoal,
      emailOrPhone: contact.trim(),
      pin: pin.trim(),
      avatarId,
      color,
      isRegistered: true,
    };

    saveProfile(updated);
    onProfileUpdated(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleSwitchAccount = (p: UserProfile) => {
    setActiveProfileId(p.id);
    onProfileSwitched(p);
    setAccountSubView('details');
  };

  const handleDeleteAccount = (id: string) => {
    if (allProfiles.length <= 1) {
      alert('حداقل یک حساب کاربری باید در سامانه باقی بماند.');
      return;
    }
    if (confirm('آیا از حذف این حساب کاربری اطمینان دارید؟')) {
      deleteProfile(id);
      onProfilesListChanged();
    }
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = loginUser(authUsername, authPin);
    if (res.success && res.profile) {
      onProfileSwitched(res.profile);
      setAccountSubView('details');
      setAuthUsername('');
      setAuthPin('');
    } else {
      setAuthError(res.error || 'ورود ناموفق بود.');
    }
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = registerUser({
      nickname: authNickname,
      username: authUsername || authNickname.trim().replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900),
      pin: authPin,
      avatarId: 'talib',
    });
    if (res.success && res.profile) {
      onProfilesListChanged();
      onProfileSwitched(res.profile);
      setAccountSubView('details');
      setAuthNickname('');
      setAuthUsername('');
      setAuthPin('');
    } else {
      setAuthError(res.error || 'ثبت‌نام با خطا مواجه شد.');
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobahese_profiles_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    if (!backupJson.trim()) return;
    const ok = importDataFromJson(backupJson);
    if (ok) {
      setBackupStatus('success');
      onProfilesListChanged();
      setTimeout(() => {
        setBackupStatus(null);
        setBackupJson('');
      }, 2500);
    } else {
      setBackupStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner">
              {currentAvatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {activeProfile.nickname}
                </h3>
                {activeProfile.fullName && (
                  <span className="text-xs text-emerald-200/90 hidden sm:inline">
                    ({activeProfile.fullName})
                  </span>
                )}
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-bold">
                  سطح {levelInfo.level} · {levelInfo.title}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                شناسه: @{activeProfile.username || 'user'} · {activeProfile.educationLevel || 'دانشجو'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Tabs Navigation */}
        <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-50 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-2 border-b-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-950 bg-white shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>مشخصات و حساب</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-2 border-b-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'badges'
                ? 'border-emerald-600 text-emerald-950 bg-white shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>مدال‌ها ({activeProfile.unlockedBadges.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-2 border-b-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'stats'
                ? 'border-emerald-600 text-emerald-950 bg-white shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>کارنامه و پشتیبان</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* ========================================================================= */}
          {/* TAB 1: PROFILE & ACCOUNT (ویرایش، تکمیل، ورود و ثبت‌نام در یک جا) */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Progress & Subview Switcher */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-stone-800">پیشرفت پرونده دانشجو:</span>
                    <span className="font-bold text-emerald-700">{completionPct}٪</span>
                    {activeProfile.streak > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold bg-amber-100/70 px-1.5 py-0.5 rounded-md mr-1">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {activeProfile.streak} روز تمرین متوالی
                      </span>
                    )}
                  </div>
                  <div className="w-48 sm:w-64 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                {/* Sub-view toggle button */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAccountSubView(accountSubView === 'details' ? 'switch_auth' : 'details')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                      accountSubView === 'switch_auth'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 inline ml-1" />
                    <span>{accountSubView === 'switch_auth' ? 'بازگشت به فرم مشخصات' : `تعویض یا ورود به حساب (${allProfiles.length})`}</span>
                  </button>
                </div>
              </div>

              {/* Sub-View A: Form for Editing & Completing Details */}
              {accountSubView === 'details' && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        نام مستعار (نمایشی در کارنامه‌ها):
                      </label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="مثال: طلبه کوشا"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        شناسه کاربری (Username):
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="مثال: ali_sarf"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        نام و نام خانوادگی کامل:
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="جهت درج در کارنامه رسمی..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        پین یا رمز عبور (اختیاری جهت قفل):
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="مثلاً پین ۴ رقمی..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        مقطع تحصیلی / رشته:
                      </label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-white"
                      >
                        <option value="مقدمات حوزه / طلبه پایه ۱">مقدمات حوزه / طلبه پایه ۱</option>
                        <option value="پایه ۲ و ۳ حوزه">پایه ۲ و ۳ حوزه</option>
                        <option value="سطح عالی حوزه">سطح عالی حوزه</option>
                        <option value="دانشجوی ادبیات عربی">دانشجوی ادبیات عربی</option>
                        <option value="دانشجوی الهیات و معارف">دانشجوی الهیات و معارف</option>
                        <option value="قرآن‌پژوه و علاقه‌مند آزاد">قرآن‌پژوه و علاقه‌مند آزاد</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        مرکز علمی یا مدرسه:
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="مثال: حوزه علمیه قم، دانشگاه..."
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      هدف اصلی از یادگیری صرف:
                    </label>
                    <select
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-white"
                    >
                      <option value="فهم قرآن و ادعیه">فهم قرآن کریم، نهج‌البلاغه و ادعیه</option>
                      <option value="تسلط برای تدریس و مباحثه">تسلط برای تدریس و اداره حلقه مباحثه</option>
                      <option value="آزمون‌های تحصیلی و ارشد/دکتری">آزمون‌های تحصیلی و ارشد / دکتری</option>
                      <option value="مکالمه و نگارش عربی">مکالمه، نگارش و ترجمه متون عربی</option>
                    </select>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1.5">
                      تصویر پروفایل (آواتار علمی):
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {AVATAR_OPTIONS.slice(0, 12).map((av) => {
                        const isSelected = avatarId === av.id;
                        return (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setAvatarId(av.id)}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center text-xl transition-all cursor-pointer ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 scale-105'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                            }`}
                            title={av.label}
                          >
                            <span>{av.emoji}</span>
                            <span className="text-[10px] text-stone-500 font-bold truncate max-w-full">
                              {av.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {saveToast && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>مشخصات با موفقیت ذخیره و به‌روزرسانی شد!</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>ذخیره تغییرات مشخصات</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      بستن
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-View B: Switch Account / Login / Register */}
              {accountSubView === 'switch_auth' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
                    <button
                      type="button"
                      onClick={() => setAuthAction('list')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        authAction === 'list' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      حساب‌های این دستگاه
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthAction('login')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        authAction === 'login' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      ورود به حساب
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthAction('register')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        authAction === 'register' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      + ثبت‌نام جدید
                    </button>
                  </div>

                  {/* 1. Saved Accounts List */}
                  {authAction === 'list' && (
                    <div className="space-y-2">
                      {allProfiles.map((p) => {
                        const isCurrent = p.id === activeProfile.id;
                        const av = getAvatarById(p.avatarId);
                        return (
                          <div
                            key={p.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                              isCurrent ? 'bg-emerald-50/70 border-emerald-400' : 'bg-white border-stone-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-2xl">{av.emoji}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-stone-900 truncate">
                                    {p.nickname}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-bold">
                                      جاری
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-stone-400">
                                  سطح {p.level} ({p.title}) · {p.xp} XP
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {!isCurrent && (
                                <button
                                  type="button"
                                  onClick={() => handleSwitchAccount(p)}
                                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  ورود
                                </button>
                              )}
                              {allProfiles.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAccount(p.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                                  title="حذف حساب"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. Login Form */}
                  {authAction === 'login' && (
                    <form onSubmit={handleQuickLogin} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          نام کاربری یا نام مستعار:
                        </label>
                        <input
                          type="text"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder="مثلاً: ali_sarf یا طلبه کوشا..."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          رمز عبور یا پین (در صورت وجود):
                        </label>
                        <input
                          type="password"
                          value={authPin}
                          onChange={(e) => setAuthPin(e.target.value)}
                          placeholder="پین ورود..."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      {authError && (
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        ورود به حساب
                      </button>
                    </form>
                  )}

                  {/* 3. Register Form */}
                  {authAction === 'register' && (
                    <form onSubmit={handleQuickRegister} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          نام مستعار دانشجو:
                        </label>
                        <input
                          type="text"
                          value={authNickname}
                          onChange={(e) => setAuthNickname(e.target.value)}
                          placeholder="مثلاً: محمد رضایی..."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          شناسه کاربری (جهت ورود مجدد):
                        </label>
                        <input
                          type="text"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder="مثلاً: m_reza..."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600 text-left font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">
                          پین یا رمز عبور اختیاری:
                        </label>
                        <input
                          type="password"
                          value={authPin}
                          onChange={(e) => setAuthPin(e.target.value)}
                          placeholder="اختیاری..."
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      {authError && (
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        ثبت‌نام و ورود فوری
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BADGES & REWARDS */}
          {/* ========================================================================= */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  نشان‌های کسب‌شده: {activeProfile.unlockedBadges.length} از {BADGES_LIST.length}
                </span>
                <span className="text-emerald-700 font-bold">
                  با گذراندن مراحل و آزمون‌ها مدال‌های جدید آزاد می‌شوند
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BADGES_LIST.map((b) => {
                  const isUnlocked = activeProfile.unlockedBadges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                        isUnlocked
                          ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                          : 'bg-stone-50/70 border-stone-200 opacity-55 grayscale'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-xl shrink-0">
                        {b.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-bold text-xs text-stone-900 truncate">{b.title}</h5>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold shrink-0">
                            +{b.xpReward} XP
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug line-clamp-2">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: STATS & BACKUP */}
          {/* ========================================================================= */}
          {activeTab === 'stats' && (
            <div className="space-y-5">
              {/* Lifetime Stats */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-stone-700 block">
                  آمار عملکرد آموزشی دانشجو:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block text-[11px]">کل جلسات آزمون</span>
                    <span className="font-bold text-stone-900 text-base">
                      {activeProfile.stats.totalSessions}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block text-[11px]">سوالات پاسخ داده</span>
                    <span className="font-bold text-stone-900 text-base">
                      {activeProfile.stats.totalQuestions}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block text-[11px]">پاسخ‌های کامل</span>
                    <span className="font-bold text-emerald-700 text-base">
                      {activeProfile.stats.correctAnswers}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block text-[11px]">درصد دقت کل</span>
                    <span className="font-bold text-stone-900 text-base">
                      {activeProfile.stats.totalQuestions > 0
                        ? Math.round(
                            (activeProfile.stats.correctAnswers / activeProfile.stats.totalQuestions) *
                              100
                          )
                        : 0}
                      ٪
                    </span>
                  </div>
                </div>
              </div>

              {/* Backup & Data Transfer */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>پشتیبان‌گیری و بازیابی اطلاعات (JSON)</span>
                  </h5>
                  <button
                    onClick={handleExportBackup}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                  >
                    دانلود فایل پشتیبان
                  </button>
                </div>

                <div className="pt-2 border-t border-stone-200/70 space-y-2">
                  <textarea
                    value={backupJson}
                    onChange={(e) => setBackupJson(e.target.value)}
                    placeholder="برای بازیابی، محتوای فایل JSON را اینجا وارد کنید..."
                    rows={3}
                    className="w-full p-2.5 text-xs font-mono bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-teal-600"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleImportBackup}
                      className="py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                    >
                      بازیابی داده‌ها
                    </button>
                    {backupStatus === 'success' && (
                      <span className="text-xs text-emerald-700 font-bold">
                        اطلاعات با موفقیت بازیابی شد!
                      </span>
                    )}
                    {backupStatus === 'error' && (
                      <span className="text-xs text-rose-600 font-bold">
                        فرمت داده‌ها نامعتبر است.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>داده‌ها به طور ایمن در حافظه دستگاه شما ذخیره می‌شوند.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
