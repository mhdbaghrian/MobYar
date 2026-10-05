import { UserProfile, StageScore } from '../types/gamification';
import { BADGES_LIST } from '../data/badges';
import { SessionSummary } from '../types/sarf';

const STORAGE_KEY_PROFILES = 'mobahese_user_profiles_v2';
const STORAGE_KEY_ACTIVE_ID = 'mobahese_active_profile_id_v2';

export const LEVEL_TITLES = [
  { level: 1, minXp: 0, title: 'نوآموز صرف' },
  { level: 2, minXp: 200, title: 'صرفیار نوپا' },
  { level: 3, minXp: 500, title: 'متعلم کوشا' },
  { level: 4, minXp: 900, title: 'طلبه مباحث' },
  { level: 5, minXp: 1400, title: 'ادیب مستعد' },
  { level: 6, minXp: 2000, title: 'صرفیار ماهر' },
  { level: 7, minXp: 2800, title: 'محقق صرف و نحو' },
  { level: 8, minXp: 3800, title: 'صاحب‌نظر اوزان' },
  { level: 9, minXp: 5000, title: 'ادیب فرزانه' },
  { level: 10, minXp: 6500, title: 'استاد صرف و مباحثه' },
];

export const calculateLevelInfo = (xp: number) => {
  let currentLevel = 1;
  let currentTitle = LEVEL_TITLES[0].title;
  let nextLevelXp = LEVEL_TITLES[1].minXp;
  let prevLevelXp = 0;

  for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TITLES[i].minXp) {
      currentLevel = LEVEL_TITLES[i].level;
      currentTitle = LEVEL_TITLES[i].title;
      prevLevelXp = LEVEL_TITLES[i].minXp;
      nextLevelXp = LEVEL_TITLES[i + 1]?.minXp || prevLevelXp + 2000;
      break;
    }
  }

  const range = nextLevelXp - prevLevelXp;
  const progressInLevel = Math.max(0, xp - prevLevelXp);
  const progressPct = range > 0 ? Math.min(100, Math.round((progressInLevel / range) * 100)) : 100;

  return {
    level: currentLevel,
    title: currentTitle,
    progressPct,
    currentXp: xp,
    nextLevelXp,
    xpToNext: Math.max(0, nextLevelXp - xp),
  };
};

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const createDefaultProfile = (nickname = 'دانشجوی صرف'): UserProfile => {
  const today = getTodayString();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return {
    id: `user_${Date.now()}_${randNum}`,
    username: `user_${randNum}`,
    nickname,
    fullName: '',
    emailOrPhone: '',
    pin: '',
    isRegistered: false,
    educationLevel: 'مقدمات حوزه / دانشجو',
    institution: '',
    learningGoal: 'تسلط بر صرف و درک متون عربی',
    avatarId: 'talib',
    avatarSeed: '1',
    color: 'bg-emerald-600',
    title: 'نوآموز صرف',
    level: 1,
    xp: 0,
    coins: 50,
    streak: 1,
    lastActiveDate: today,
    createdAt: new Date().toISOString(),
    unlockedStageId: 1,
    stageScores: {},
    stats: {
      totalSessions: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      totalTimeSeconds: 0,
      stagesCompleted: 0,
      perfectSessions: 0,
    },
    unlockedBadges: [],
  };
};

export const calculateProfileCompletion = (profile: UserProfile): number => {
  let score = 0;
  if (profile.nickname?.trim()) score += 20;
  if (profile.username?.trim()) score += 15;
  if (profile.avatarId?.trim()) score += 15;
  if (profile.fullName?.trim()) score += 20;
  if (profile.educationLevel?.trim()) score += 10;
  if (profile.institution?.trim()) score += 10;
  if (profile.learningGoal?.trim()) score += 10;
  return Math.min(100, score);
};

export const registerUser = (params: {
  username: string;
  nickname: string;
  fullName?: string;
  pin?: string;
  emailOrPhone?: string;
  avatarId?: string;
  educationLevel?: string;
  institution?: string;
  learningGoal?: string;
}): { success: boolean; profile?: UserProfile; error?: string } => {
  const cleanUsername = params.username.trim().toLowerCase();
  const cleanNickname = params.nickname.trim();

  if (!cleanNickname) {
    return { success: false, error: 'لطفاً نام مستعار را وارد نمایید.' };
  }
  if (!cleanUsername) {
    return { success: false, error: 'لطفاً نام کاربری را وارد نمایید.' };
  }

  const profiles = getAllProfiles();
  const exists = profiles.some(
    (p) => p.username?.toLowerCase() === cleanUsername
  );
  if (exists) {
    return { success: false, error: 'این نام کاربری قبلاً ثبت شده است. نام دیگری انتخاب کنید.' };
  }

  const newProf = createDefaultProfile(cleanNickname);
  newProf.username = cleanUsername;
  newProf.fullName = params.fullName?.trim() || '';
  newProf.pin = params.pin?.trim() || '';
  newProf.emailOrPhone = params.emailOrPhone?.trim() || '';
  newProf.avatarId = params.avatarId || 'talib';
  newProf.isRegistered = true;
  if (params.educationLevel) newProf.educationLevel = params.educationLevel;
  if (params.institution) newProf.institution = params.institution;
  if (params.learningGoal) newProf.learningGoal = params.learningGoal;

  saveProfile(newProf);
  setActiveProfileId(newProf.id);

  return { success: true, profile: newProf };
};

export const loginUser = (
  identifier: string,
  pin?: string
): { success: boolean; profile?: UserProfile; error?: string } => {
  const cleanId = identifier.trim().toLowerCase();
  if (!cleanId) {
    return { success: false, error: 'لطفاً نام کاربری یا نام مستعار خود را وارد کنید.' };
  }

  const profiles = getAllProfiles();
  const matched = profiles.find(
    (p) =>
      p.username?.toLowerCase() === cleanId ||
      p.nickname?.toLowerCase() === cleanId ||
      (p.emailOrPhone && p.emailOrPhone.toLowerCase() === cleanId)
  );

  if (!matched) {
    return {
      success: false,
      error: 'حساب کاربری با این مشخصات یافت نشد. می‌توانید با همین مشخصات ثبت نام کنید.',
    };
  }

  if (matched.pin && matched.pin.trim() !== '') {
    if (!pin || pin.trim() !== matched.pin.trim()) {
      return { success: false, error: 'رمز عبور یا پین وارد شده صحیح نمی‌باشد.' };
    }
  }

  setActiveProfileId(matched.id);
  return { success: true, profile: matched };
};

export const getAllProfiles = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      const defaultProf = createDefaultProfile('طلبه کوشا');
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify([defaultProf]));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, defaultProf.id);
      return [defaultProf];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const defaultProf = createDefaultProfile('طلبه کوشا');
    return [defaultProf];
  } catch {
    return [createDefaultProfile('طلبه کوشا')];
  }
};

export const getActiveProfile = (): UserProfile => {
  const profiles = getAllProfiles();
  const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  const found = profiles.find((p) => p.id === activeId);
  if (found) return found;
  if (profiles.length > 0) {
    setActiveProfileId(profiles[0].id);
    return profiles[0];
  }
  const defaultProf = createDefaultProfile('طلبه کوشا');
  saveProfile(defaultProf);
  setActiveProfileId(defaultProf.id);
  return defaultProf;
};

export const setActiveProfileId = (id: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch {}
};

export const saveProfile = (profile: UserProfile): void => {
  try {
    const profiles = getAllProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

export const createNewProfile = (
  nickname: string,
  avatarId = 'talib',
  color = 'bg-emerald-600'
): UserProfile => {
  const prof = createDefaultProfile(nickname.trim() || 'دانشجوی جدید');
  prof.avatarId = avatarId;
  prof.color = color;
  saveProfile(prof);
  setActiveProfileId(prof.id);
  return prof;
};

export const deleteProfile = (id: string): boolean => {
  const profiles = getAllProfiles();
  if (profiles.length <= 1) return false; // Prevent deleting last profile
  const filtered = profiles.filter((p) => p.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(filtered));
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (activeId === id) {
      setActiveProfileId(filtered[0].id);
    }
    return true;
  } catch {
    return false;
  }
};

export const updateStreakAndActivity = (profile: UserProfile): UserProfile => {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  let updatedStreak = profile.streak;

  if (profile.lastActiveDate === today) {
    // Already active today, streak unchanged
  } else if (profile.lastActiveDate === yesterday) {
    // Yesterday was active, increment streak!
    updatedStreak += 1;
  } else {
    // Break in streak, reset to 1
    updatedStreak = 1;
  }

  return {
    ...profile,
    streak: updatedStreak,
    lastActiveDate: today,
  };
};

export interface BadgeAwardNotification {
  badgeId: string;
  badgeTitle: string;
  badgeIcon: string;
  xpReward: number;
}

export const checkBadges = (
  profile: UserProfile
): { updatedBadges: string[]; newAwards: BadgeAwardNotification[]; totalXpGained: number } => {
  const currentBadges = new Set(profile.unlockedBadges || []);
  const newAwards: BadgeAwardNotification[] = [];
  let totalXpGained = 0;

  const tryAward = (bId: string, condition: boolean) => {
    if (condition && !currentBadges.has(bId)) {
      currentBadges.add(bId);
      const bObj = BADGES_LIST.find((b) => b.id === bId);
      if (bObj) {
        newAwards.push({
          badgeId: bId,
          badgeTitle: bObj.title,
          badgeIcon: bObj.icon,
          xpReward: bObj.xpReward,
        });
        totalXpGained += bObj.xpReward;
      }
    }
  };

  // Conditions
  tryAward('first_step', profile.stats.totalSessions >= 1 || profile.stats.stagesCompleted >= 1);
  tryAward('perfect_session', profile.stats.perfectSessions >= 1);
  tryAward('streak_3', profile.streak >= 3);
  tryAward('streak_7', profile.streak >= 7);
  tryAward('stage_1_conqueror', !!profile.stageScores[1]);
  tryAward('stage_2_mudari', !!profile.stageScores[2]);
  tryAward('stage_3_amr_nahy', !!profile.stageScores[3]);
  tryAward('stage_4_passive', !!profile.stageScores[4]);
  tryAward('stage_5_mazid_1', !!profile.stageScores[5]);
  tryAward('stage_6_mazid_2', !!profile.stageScores[6]);
  tryAward('stage_7_mushtaqqat_1', !!profile.stageScores[7]);
  tryAward('stage_8_mushtaqqat_2', !!profile.stageScores[8]);
  tryAward('mudaaf_tamer', !!profile.stageScores[9]);
  tryAward('sarf_grandmaster', profile.stats.stagesCompleted >= 10);

  return {
    updatedBadges: Array.from(currentBadges),
    newAwards,
    totalXpGained,
  };
};

export const recordSessionToActiveProfile = (
  summary: SessionSummary,
  studentId: string
): { profile: UserProfile; newBadges: BadgeAwardNotification[]; xpEarned: number } => {
  const currentProfile = getActiveProfile();
  const studentResults = summary.results.filter((r) => r.studentId === studentId);
  if (studentResults.length === 0) {
    return { profile: currentProfile, newBadges: [], xpEarned: 0 };
  }

  const correctCount = studentResults.filter((r) => r.score === 10).length;
  const partialCount = studentResults.filter((r) => r.score === 5).length;
  const isPerfect =
    studentResults.length >= 5 &&
    studentResults.every((r) => r.score === 10);

  // XP calculation
  // 15 XP per correct, 5 XP per partial, +50 XP bonus for perfect session
  let xpGained = correctCount * 15 + partialCount * 5;
  if (isPerfect) xpGained += 50;
  if (summary.config.mode === 'circle') xpGained += 25; // Group discussion collaboration bonus

  // Coins reward: 1 coin per 10 XP
  const coinsGained = Math.max(1, Math.floor(xpGained / 10));

  let updated = updateStreakAndActivity(currentProfile);

  updated = {
    ...updated,
    xp: updated.xp + xpGained,
    coins: updated.coins + coinsGained,
    stats: {
      ...updated.stats,
      totalSessions: updated.stats.totalSessions + 1,
      totalQuestions: updated.stats.totalQuestions + studentResults.length,
      correctAnswers: updated.stats.correctAnswers + correctCount,
      totalTimeSeconds: updated.stats.totalTimeSeconds + summary.durationSeconds,
      perfectSessions: updated.stats.perfectSessions + (isPerfect ? 1 : 0),
    },
  };

  // Recalculate level
  const lvlInfo = calculateLevelInfo(updated.xp);
  updated.level = lvlInfo.level;
  updated.title = lvlInfo.title;

  // Check Badges
  const { updatedBadges, newAwards, totalXpGained: badgeXp } = checkBadges(updated);
  if (badgeXp > 0) {
    updated.xp += badgeXp;
    const reLvl = calculateLevelInfo(updated.xp);
    updated.level = reLvl.level;
    updated.title = reLvl.title;
  }
  updated.unlockedBadges = updatedBadges;

  saveProfile(updated);
  return {
    profile: updated,
    newBadges: newAwards,
    xpEarned: xpGained + badgeXp,
  };
};

export const recordStageCompletionToProfile = (
  stageId: number,
  score: number,
  maxScore: number
): {
  profile: UserProfile;
  passed: boolean;
  stars: 1 | 2 | 3;
  newBadges: BadgeAwardNotification[];
  xpEarned: number;
} => {
  const currentProfile = getActiveProfile();
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const passed = pct >= 75;

  let stars: 1 | 2 | 3 = 1;
  if (pct >= 90) stars = 3;
  else if (pct >= 80) stars = 2;

  let xpReward = 0;
  if (passed) {
    // XP reward based on stars
    xpReward = 100 + stars * 40;
  } else {
    // Practice reward
    xpReward = 20;
  }

  let updated = updateStreakAndActivity(currentProfile);

  const prevScore = updated.stageScores[stageId];
  const newStageScore: StageScore = {
    stars: prevScore ? (Math.max(prevScore.stars, stars) as 1 | 2 | 3) : stars,
    bestScorePct: prevScore ? Math.max(prevScore.bestScorePct, pct) : pct,
    completedAt: new Date().toISOString(),
    attemptsCount: (prevScore?.attemptsCount || 0) + 1,
  };

  const updatedStageScores = {
    ...updated.stageScores,
    ...(passed ? { [stageId]: newStageScore } : {}),
  };

  // If passed, unlock next stage if this was the current highest
  let newUnlocked = updated.unlockedStageId;
  if (passed && stageId >= updated.unlockedStageId && stageId < 10) {
    newUnlocked = stageId + 1;
  }

  const completedStagesCount = Object.keys(updatedStageScores).length;

  updated = {
    ...updated,
    xp: updated.xp + xpReward,
    coins: updated.coins + (passed ? 20 : 5),
    unlockedStageId: newUnlocked,
    stageScores: updatedStageScores,
    stats: {
      ...updated.stats,
      stagesCompleted: completedStagesCount,
    },
  };

  // Recalculate Level
  const lvlInfo = calculateLevelInfo(updated.xp);
  updated.level = lvlInfo.level;
  updated.title = lvlInfo.title;

  // Badges
  const { updatedBadges, newAwards, totalXpGained: badgeXp } = checkBadges(updated);
  if (badgeXp > 0) {
    updated.xp += badgeXp;
    const reLvl = calculateLevelInfo(updated.xp);
    updated.level = reLvl.level;
    updated.title = reLvl.title;
  }
  updated.unlockedBadges = updatedBadges;

  saveProfile(updated);

  return {
    profile: updated,
    passed,
    stars,
    newBadges: newAwards,
    xpEarned: xpReward + badgeXp,
  };
};

export const exportAllDataAsJson = (): string => {
  const profiles = getAllProfiles();
  const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  const data = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    activeId,
    profiles,
  };
  return JSON.stringify(data, null, 2);
};

export const importDataFromJson = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.profiles || !Array.isArray(data.profiles) || data.profiles.length === 0) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(data.profiles));
    if (data.activeId) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, data.activeId);
    } else {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, data.profiles[0].id);
    }
    return true;
  } catch {
    return false;
  }
};
