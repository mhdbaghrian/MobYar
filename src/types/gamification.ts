import { BabId, QuestionType } from './sarf';

export interface AvatarOption {
  id: string;
  label: string;
  iconName: string;
  emoji: string;
  color: string;
  bgLight: string;
  borderLight: string;
  description: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'journey' | 'skill' | 'streak' | 'mastery';
  xpReward: number;
}

export interface UserStats {
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTimeSeconds: number;
  stagesCompleted: number;
  perfectSessions: number;
}

export interface StageScore {
  stars: 1 | 2 | 3;
  bestScorePct: number;
  completedAt: string;
  attemptsCount: number;
}

export interface UserProfile {
  id: string;
  username: string; // شناسه یکتا یا نام کاربری
  nickname: string; // نام مستعار یا نمایشی در کارنامه‌ها
  fullName?: string; // نام و نام خانوادگی
  emailOrPhone?: string; // ایمیل یا شماره تماس اختیاری
  pin?: string; // پین یا رمز عبور اختیاری
  isRegistered?: boolean; // آیا ثبت نام رسمی شده یا کاربر مهمان/محلی است
  educationLevel?: string; // مقطع تحصیلی / سطح حوزوی یا دانشگاهی
  institution?: string; // مرکز آموزشی / مدرسه علمیه / دانشگاه
  learningGoal?: string; // هدف از یادگیری صرف (قرآن، مباحثه، تدریس...)
  avatarId: string;
  avatarSeed: string;
  color: string;
  title: string; // e.g. "نوآموز صرف", "صرفیار", "ادیب فرزانه", "استاد صرف"
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: string;
  unlockedStageId: number; // 1 to 10
  stageScores: Record<number, StageScore>;
  stats: UserStats;
  unlockedBadges: string[]; // Badge IDs
  notes?: string;
  bio?: string;
}

export interface StageLessonSection {
  title: string;
  content: string; // Markdown or rich formatted explanation
  examples?: {
    term: string;
    wazn?: string;
    meaning: string;
    notes?: string;
  }[];
  keyTakeaways?: string[];
}

export interface LearningStage {
  id: number; // 1 to 10
  levelNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: 'basics' | 'verbs' | 'mazid' | 'nouns' | 'mudaaf' | 'mastery';
  badgeName: string;
  xpReward: number;
  minPassScorePct: number; // usually 75% or 80%
  questionCount: number;
  targetBabIds: BabId[];
  targetQuestionTypes: QuestionType[];
  prerequisiteStageId?: number;
  lessonSummary: string;
  lessonSections: StageLessonSection[];
  practicalTips: string[];
}
