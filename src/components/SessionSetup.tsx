import React, { useState } from 'react';
import {
  Users,
  User,
  Crown,
  CheckSquare,
  Square,
  Play,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  BookOpen,
  Tag,
  Layers,
  Settings2,
  Mic,
  ListOrdered,
  HelpCircle,
  Award,
  CheckCircle2,
  SlidersHorizontal,
  GraduationCap,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { BabId, QuestionType, SessionConfig, Student, StudyMode } from '../types/sarf';
import { ABWAB_LIST } from '../data/abwab';

interface SessionSetupProps {
  onStartSession: (config: SessionConfig) => void;
  onOpenWorkshop: () => void;
}

const DEFAULT_STUDENT_NAMES = ['علی', 'محمد', 'حسین', 'مهدی', 'صادق', 'فاطمه', 'زهرا', 'زینب'];
const STUDENT_COLORS = [
  'bg-emerald-600',
  'bg-blue-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-indigo-600',
  'bg-cyan-600',
];

interface QuickPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  mode: StudyMode;
  studentsCount: number;
  babIds: BabId[];
  types: QuestionType[];
  rounds: number;
  answerMethod: 'choice' | 'flashcard' | 'voice';
  popular?: boolean;
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'mudaaf_challenge',
    title: 'کارگاه افعال مضاعف و احکام ادغام',
    subtitle: 'تمرین تخصصی ادغام واجب، فک ادغام، امر مضاعف و شواهد قرآنی (مَدَّ، فَرَّ، مَسَّ)',
    badge: 'فعل مضاعف & ادغام',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: <Flame className="w-5 h-5 text-amber-700" />,
    mode: 'solo',
    studentsCount: 1,
    babIds: ['mujarrad_nasara', 'mujarrad_daraba', 'mujarrad_alima', "if'al", "istif'al"],
    types: ['mudaaf_fakk', 'mudaaf_conjugation', 'amr', 'targeted'],
    rounds: 8,
    answerMethod: 'choice',
    popular: true,
  },
  {
    id: 'comprehensive_exam',
    title: 'آزمون جامع صرف (افعال و مشتقات)',
    subtitle: 'سنجش کامل تسلط بر ماضی، مضارع، امر، نهی و مشتقات هشت‌گانه',
    badge: 'جامع و استاندارد',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <Award className="w-5 h-5 text-emerald-700" />,
    mode: 'solo',
    studentsCount: 1,
    babIds: ['mujarrad_nasara', 'mujarrad_daraba', 'mujarrad_alima', "if'al", "taf'il", "mufa'alah", "istif'al"],
    types: ['targeted', 'translation', 'tense_inversion', 'amr', 'nahy', 'passive', 'ism_fael', 'ism_mafool', 'ism_tafdil'],
    rounds: 10,
    answerMethod: 'choice',
    popular: true,
  },
  {
    id: 'quick_solo_5',
    title: 'تمرین فوری ۵ سوالی (انفرادی)',
    subtitle: 'آزمون سریع تستی برای مرور روزانه صیغه‌ها و ترجمه',
    badge: 'سریع و آسان (۲ دقیقه)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: <Zap className="w-5 h-5 text-amber-700" />,
    mode: 'solo',
    studentsCount: 1,
    babIds: ['mujarrad_nasara', 'mujarrad_daraba', "if'al", "taf'il"],
    types: ['targeted', 'translation', 'tense_inversion'],
    rounds: 5,
    answerMethod: 'choice',
  },
  {
    id: 'verbs_marathon',
    title: 'ماراتن تخصصی افعال (معلوم، مجهول، امر و نهی)',
    subtitle: 'تمرین فشرده صرف ترتیبی، معکوس، امر حاضر، نهی و صیغه‌های مجهول',
    badge: 'ویژه افعال',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: <Flame className="w-5 h-5 text-blue-700" />,
    mode: 'solo',
    studentsCount: 1,
    babIds: ['mujarrad_nasara', 'mujarrad_daraba', 'mujarrad_fataha', "if'al", "taf'il", "tafa''ul", "istif'al"],
    types: ['sequential', 'targeted', 'amr', 'nahy', 'nahy_majhul', 'passive', 'nafy'],
    rounds: 8,
    answerMethod: 'choice',
  },
  {
    id: 'mushtaqqat_mastery',
    title: 'کارگاه تخصصی مشتقات و اسماء',
    subtitle: 'اسم فاعل، مفعول، تفضیل، صفت مشبهه، اسم مکان، آلت، مبالغه و تکسیر',
    badge: 'علم الاشتقاق',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    icon: <Tag className="w-5 h-5 text-teal-700" />,
    mode: 'solo',
    studentsCount: 1,
    babIds: ['mujarrad_nasara', "if'al", "taf'il", "mufa'alah", "istif'al"],
    types: ['ism_fael', 'ism_mafool', 'sefat_moshabbahah', 'ism_tafdil', 'ism_makan_zaman', 'ism_ala', 'ism_mobalagheh', 'jam_taksir'],
    rounds: 8,
    answerMethod: 'choice',
  },
  {
    id: 'circle_mobahese_3',
    title: 'حلقه مباحثه ۳ نفره کلاسی (دست به دست)',
    subtitle: 'روش اصیل مباحثه علمی: پرسش نوبتی طلاب از یکدیگر به همراه کلید استاد',
    badge: 'مباحثه گروهی',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: <Users className="w-5 h-5 text-purple-700" />,
    mode: 'circle',
    studentsCount: 3,
    babIds: ['mujarrad_nasara', 'mujarrad_daraba', "if'al", "taf'il", "mufa'alah", "tafa''ul", "istif'al"],
    types: ['sequential', 'reverse', 'targeted', 'tense_inversion', 'amr', 'nahy', 'passive', 'ism_fael', 'ism_mafool'],
    rounds: 4,
    answerMethod: 'choice',
  },
  {
    id: 'thulathi_mujarrad_challenge',
    title: 'چالش ۶ باب ثلاثی مجرد',
    subtitle: 'تمرین تخصصی باب‌های نَصَرَ، ضَرَبَ، فَتَحَ، عَلِمَ، حَسُنَ و حَسِبَ',
    badge: 'ثلاثی مجرد',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: <GraduationCap className="w-5 h-5 text-emerald-700" />,
    mode: 'solo',
    studentsCount: 1,
    babIds: ['mujarrad_nasara', 'mujarrad_daraba', 'mujarrad_fataha', 'mujarrad_alima', 'mujarrad_hasuna', 'mujarrad_hasiba'],
    types: ['targeted', 'translation', 'tense_inversion', 'amr', 'nahy', 'passive'],
    rounds: 6,
    answerMethod: 'choice',
  },
];

export const SessionSetup: React.FC<SessionSetupProps> = ({
  onStartSession,
  onOpenWorkshop,
}) => {
  // Navigation Tab: Quick Presets vs Custom Wizard
  const [setupTab, setSetupTab] = useState<'quick' | 'custom'>('quick');

  // Domain filter in custom mode
  const [domainFilter, setDomainFilter] = useState<'both' | 'verbs' | 'nouns'>('both');

  // Mode
  const [mode, setMode] = useState<StudyMode>('solo');

  // Students list
  const [students, setStudents] = useState<Student[]>([
    { id: 's1', name: 'دانشجو', avatarSeed: '1', color: STUDENT_COLORS[0] },
  ]);
  const [newStudentName, setNewStudentName] = useState('');
  const [facilitatorId, setFacilitatorId] = useState<string>('s1');

  // Selected Abwab
  const [selectedBabs, setSelectedBabs] = useState<BabId[]>([
    'mujarrad_nasara',
    'mujarrad_daraba',
    "if'al",
    "taf'il",
    "mufa'alah",
    "istif'al",
  ]);

  // Selected Question Types
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'targeted',
    'translation',
    'tense_inversion',
    'amr',
    'nahy',
    'passive',
    'ism_fael',
    'ism_mafool',
  ]);

  // Rounds per student
  const [roundsPerStudent, setRoundsPerStudent] = useState<number>(5);

  // Solo answer method
  const [soloAnswerMethod, setSoloAnswerMethod] = useState<'choice' | 'flashcard' | 'voice'>('choice');

  // Quick launch a preset
  const handleLaunchPreset = (preset: QuickPreset) => {
    let presetStudents: Student[] = [];

    if (preset.studentsCount === 1) {
      presetStudents = [{ id: 's1', name: students[0]?.name || 'دانشجو', avatarSeed: '1', color: STUDENT_COLORS[0] }];
    } else if (preset.studentsCount === 2) {
      presetStudents = [
        { id: 's1', name: students[0]?.name || 'علی', avatarSeed: '1', color: STUDENT_COLORS[0] },
        { id: 's2', name: 'محمد', avatarSeed: '2', color: STUDENT_COLORS[1] },
      ];
    } else {
      presetStudents = [
        { id: 's1', name: 'علی', avatarSeed: '1', color: STUDENT_COLORS[0] },
        { id: 's2', name: 'محمد', avatarSeed: '2', color: STUDENT_COLORS[1] },
        { id: 's3', name: 'حسین', avatarSeed: '3', color: STUDENT_COLORS[2] },
      ];
    }

    const config: SessionConfig = {
      mode: preset.mode,
      students: presetStudents,
      facilitatorId: preset.mode === 'facilitator' ? presetStudents[0].id : undefined,
      selectedBabIds: preset.babIds,
      selectedQuestionTypes: preset.types,
      roundsPerStudent: preset.rounds,
      soloAnswerMethod: preset.answerMethod,
    };
    onStartSession(config);
  };

  // Load a preset into custom wizard for fine tuning
  const handleCustomizePreset = (preset: QuickPreset) => {
    setMode(preset.mode);
    setSelectedBabs(preset.babIds);
    setSelectedTypes(preset.types);
    setRoundsPerStudent(preset.rounds);
    setSoloAnswerMethod(preset.answerMethod);
    setSetupTab('custom');
  };

  // Handle student count change
  const handleAddStudent = (name?: string) => {
    const studentName = (name || newStudentName).trim();
    if (!studentName) return;

    const newId = `s_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const nextColor = STUDENT_COLORS[students.length % STUDENT_COLORS.length];
    const newStudent: Student = {
      id: newId,
      name: studentName,
      avatarSeed: (students.length + 1).toString(),
      color: nextColor,
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    setNewStudentName('');

    if (updated.length === 1) {
      setMode('solo');
    } else if (mode === 'solo' && updated.length > 1) {
      setMode('circle');
    }
  };

  const handleRemoveStudent = (id: string) => {
    if (students.length <= 1) return;
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    if (facilitatorId === id && updated.length > 0) {
      setFacilitatorId(updated[0].id);
    }
    if (updated.length === 1) {
      setMode('solo');
    }
  };

  const setGroupSize = (count: number) => {
    if (count === 1) {
      setMode('solo');
      setStudents([{ id: 's1', name: 'دانشجو', avatarSeed: '1', color: STUDENT_COLORS[0] }]);
    } else if (count === 2) {
      setMode('circle');
      setStudents([
        { id: 's1', name: 'علی', avatarSeed: '1', color: STUDENT_COLORS[0] },
        { id: 's2', name: 'محمد', avatarSeed: '2', color: STUDENT_COLORS[1] },
      ]);
    } else if (count === 3) {
      setMode('circle');
      setStudents([
        { id: 's1', name: 'علی', avatarSeed: '1', color: STUDENT_COLORS[0] },
        { id: 's2', name: 'محمد', avatarSeed: '2', color: STUDENT_COLORS[1] },
        { id: 's3', name: 'حسین', avatarSeed: '3', color: STUDENT_COLORS[2] },
      ]);
    } else if (count === 4) {
      setMode('circle');
      setStudents([
        { id: 's1', name: 'علی', avatarSeed: '1', color: STUDENT_COLORS[0] },
        { id: 's2', name: 'محمد', avatarSeed: '2', color: STUDENT_COLORS[1] },
        { id: 's3', name: 'حسین', avatarSeed: '3', color: STUDENT_COLORS[2] },
        { id: 's4', name: 'مهدی', avatarSeed: '4', color: STUDENT_COLORS[3] },
      ]);
    }
  };

  // Toggle Bab
  const toggleBab = (babId: BabId) => {
    if (selectedBabs.includes(babId)) {
      if (selectedBabs.length > 1) {
        setSelectedBabs(selectedBabs.filter((b) => b !== babId));
      }
    } else {
      setSelectedBabs([...selectedBabs, babId]);
    }
  };

  const selectAllBabs = () => {
    setSelectedBabs(ABWAB_LIST.map((b) => b.id));
  };

  const selectMujarradOnly = () => {
    setSelectedBabs(ABWAB_LIST.filter((b) => b.category === 'thulathi_mujarrad').map((b) => b.id));
  };

  const selectMazidOnly = () => {
    setSelectedBabs(ABWAB_LIST.filter((b) => b.category === 'thulathi_mazid').map((b) => b.id));
  };

  const selectRubaiOnly = () => {
    setSelectedBabs(
      ABWAB_LIST.filter((b) => b.category === 'rubai_mujarrad' || b.category === 'rubai_mazid').map(
        (b) => b.id
      )
    );
  };

  // Toggle Question Type
  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const selectAllTypes = () => {
    setSelectedTypes([
      'sequential', 'reverse', 'targeted', 'translation', 'tense_inversion', 'passive', 'amr', 'nahy', 'nahy_majhul', 'nafy',
      'ism_fael', 'ism_mafool', 'sefat_moshabbahah', 'ism_tafdil', 'ism_makan_zaman', 'ism_ala', 'ism_mobalagheh', 'jam_taksir'
    ]);
  };

  const selectVerbTypesOnly = () => {
    setSelectedTypes([
      'sequential', 'reverse', 'targeted', 'translation', 'tense_inversion', 'passive', 'amr', 'nahy', 'nahy_majhul', 'nafy'
    ]);
  };

  const selectNounTypesOnly = () => {
    setSelectedTypes([
      'ism_fael', 'ism_mafool', 'sefat_moshabbahah', 'ism_tafdil', 'ism_makan_zaman', 'ism_ala', 'ism_mobalagheh', 'jam_taksir'
    ]);
  };

  const selectEasyPreset = () => {
    setSelectedTypes(['targeted', 'translation', 'ism_fael', 'ism_mafool']);
  };

  const selectStandardExamPreset = () => {
    setSelectedTypes(['targeted', 'translation', 'tense_inversion', 'amr', 'nahy', 'passive', 'ism_fael', 'ism_mafool', 'ism_tafdil']);
  };

  const handleStartCustomSession = () => {
    const config: SessionConfig = {
      mode,
      students,
      facilitatorId: mode === 'facilitator' ? facilitatorId : undefined,
      selectedBabIds: selectedBabs,
      selectedQuestionTypes: selectedTypes,
      roundsPerStudent,
      soloAnswerMethod,
    };
    onStartSession(config);
  };

  const totalQuestions = students.length * roundsPerStudent;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2 px-2 sm:px-4" dir="rtl">
      {/* Hero Welcome Header */}
      <div className="bg-gradient-to-l from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>سامانه هوشمند آزمون و مباحثه صرف عربی</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-arabic">
            آغاز جلسه تمرین و مباحثه صرف
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            یک بسته آماده را با ۱ کلیک شروع کنید یا آزمون اختصاصی خود را بر اساس ابواب و مشتقات دلخواه بسازید.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-200/70 rounded-2xl">
        <button
          type="button"
          onClick={() => setSetupTab('quick')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            setupTab === 'quick'
              ? 'bg-white text-emerald-950 shadow-md ring-1 ring-stone-900/5'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Zap className={`w-4 h-4 ${setupTab === 'quick' ? 'text-amber-500 fill-amber-500' : ''}`} />
          <span>🚀 آزمون‌های آماده و سریع (۱ کلیک)</span>
        </button>

        <button
          type="button"
          onClick={() => setSetupTab('custom')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            setupTab === 'custom'
              ? 'bg-white text-emerald-950 shadow-md ring-1 ring-stone-900/5'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
          <span>🛠️ ساخت آزمون سفارشی</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: QUICK 1-CLICK PRESETS */}
      {/* ========================================================================= */}
      {setupTab === 'quick' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>بسته‌های پیشنهادی و آزمون‌های استاندارد:</span>
            </span>
            <span className="text-[11px] text-stone-400">
              با کلیک روی «شروع فوری»، آزمون بلافاصله شروع می‌شود.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {QUICK_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                  preset.popular
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-stone-100 shrink-0">
                        {preset.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-stone-900">
                          {preset.title}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border inline-block mt-0.5 ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 leading-relaxed">
                    {preset.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 pt-1">
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                      {preset.rounds} سوال
                    </span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                      {preset.mode === 'solo' ? 'تمرین انفرادی' : 'حلقه مباحثه ۳ نفره'}
                    </span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                      {preset.types.length} نوع سوال صرفی
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleLaunchPreset(preset)}
                    className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>شروع فوری آزمون</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCustomizePreset(preset)}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    title="شخصی‌سازی این قالب"
                  >
                    ویرایش
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CUSTOM SETUP WIZARD */}
      {/* ========================================================================= */}
      {setupTab === 'custom' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Step 1: Mode & Students */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ۱
                </span>
                <h3 className="font-bold text-stone-900 text-base">
                  حالت آزمون و تعداد افراد
                </h3>
              </div>

              {/* Quick group size buttons */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-400 text-[11px] ml-1">تعداد سریع:</span>
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setGroupSize(n)}
                    className={`w-7 h-7 rounded-lg font-bold cursor-pointer transition-all ${
                      students.length === n
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Solo Mode */}
              <button
                type="button"
                onClick={() => {
                  setMode('solo');
                  if (students.length > 1) setStudents([students[0]]);
                }}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  mode === 'solo'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">۱. تمرین انفرادی (Solo)</span>
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-[11px] text-stone-500">
                  تمرین تستی ۴ گزینه‌ای، فلش‌کارت یا صوتی برای مطالعه فردی.
                </p>
              </button>

              {/* Circle Mode */}
              <button
                type="button"
                onClick={() => {
                  setMode('circle');
                  if (students.length === 1) {
                    setStudents([
                      { id: 's1', name: 'علی', avatarSeed: '1', color: STUDENT_COLORS[0] },
                      { id: 's2', name: 'محمد', avatarSeed: '2', color: STUDENT_COLORS[1] },
                      { id: 's3', name: 'حسین', avatarSeed: '3', color: STUDENT_COLORS[2] },
                    ]);
                  }
                }}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  mode === 'circle'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">۲. حلقه مباحثه (دست به دست)</span>
                  <Users className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-[11px] text-stone-500">
                  دانشجویان به نوبت از هم می‌پرسند و کارنامه نهایی صادر می‌شود.
                </p>
              </button>

              {/* Facilitator Mode */}
              <button
                type="button"
                onClick={() => {
                  setMode('facilitator');
                  if (students.length === 1) {
                    setStudents([
                      { id: 's1', name: 'استاد', avatarSeed: '1', color: STUDENT_COLORS[0] },
                      { id: 's2', name: 'دانشجو ۱', avatarSeed: '2', color: STUDENT_COLORS[1] },
                      { id: 's3', name: 'دانشجو ۲', avatarSeed: '3', color: STUDENT_COLORS[2] },
                    ]);
                  }
                }}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  mode === 'facilitator'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">۳. سرگروه / استاد محور</span>
                  <Crown className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-[11px] text-stone-500">
                  یک نفر مسئول پرسش و نمره‌دهی به سایر اعضای کلاس است.
                </p>
              </button>
            </div>

            {/* Students list if group */}
            {mode !== 'solo' && (
              <div className="pt-2 border-t border-stone-100 space-y-2.5">
                <span className="text-xs font-semibold text-stone-700 block">
                  اسامی شرکت‌کنندگان ({students.length} نفر):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-medium"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${student.color}`} />
                      <span>{student.name}</span>
                      {students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Quick Add Student */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                      placeholder="نام عضو جدید..."
                      className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 w-32"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddStudent()}
                      className="p-1.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Domain Scope Selection */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ۲
                </span>
                <h3 className="font-bold text-stone-900 text-base">
                  موضوع و قلمرو آزمون
                </h3>
              </div>

              {/* Domain Switcher */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDomainFilter('both');
                    selectAllTypes();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    domainFilter === 'both' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  🎯 ترکیبی (فعل و اسم)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDomainFilter('verbs');
                    selectVerbTypesOnly();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    domainFilter === 'verbs' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  📖 فقط افعال
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDomainFilter('nouns');
                    selectNounTypesOnly();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    domainFilter === 'nouns' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  🏷️ فقط اسماء و مشتقات
                </button>
              </div>
            </div>

            {/* Sub-Abwab if Verbs or Both is enabled */}
            {(domainFilter === 'both' || domainFilter === 'verbs') && (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">
                    ابواب افعال مورد آزمون ({selectedBabs.length} باب انتخاب شده):
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={selectAllBabs}
                      className="text-emerald-700 hover:underline cursor-pointer"
                    >
                      همه ابواب ({ABWAB_LIST.length})
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={selectMujarradOnly}
                      className="text-emerald-700 hover:underline cursor-pointer"
                    >
                      فقط ۶ باب مجرد
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={selectMazidOnly}
                      className="text-emerald-700 hover:underline cursor-pointer"
                    >
                      فقط ابواب مزید
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-stone-50 rounded-xl border border-stone-200/70">
                  {ABWAB_LIST.map((bab) => {
                    const isSelected = selectedBabs.includes(bab.id);
                    return (
                      <button
                        key={bab.id}
                        type="button"
                        onClick={() => toggleBab(bab.id)}
                        className={`p-2 rounded-lg text-right text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-white border-stone-200 text-stone-600 opacity-70'
                        }`}
                      >
                        <span className="font-arabic truncate">{bab.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mr-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Question Types with Easy Presets */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ۳
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">
                    نوع و قالب سوالات
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    {selectedTypes.length} نوع سوال فعال است
                  </span>
                </div>
              </div>

              {/* Quick question presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={selectEasyPreset}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium cursor-pointer"
                >
                  پایه‌ای و آسان
                </button>
                <button
                  type="button"
                  onClick={selectStandardExamPreset}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold cursor-pointer border border-emerald-200/60"
                >
                  استاندارد آزمونی
                </button>
                <button
                  type="button"
                  onClick={selectAllTypes}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium cursor-pointer"
                >
                  همه ۱۷ نوع
                </button>
              </div>
            </div>

            {/* Question Type Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {/* Verbs Types */}
              {(domainFilter === 'both' || domainFilter === 'verbs') && (
                <>
                  {[
                    { id: 'mudaaf_fakk', title: 'احکام ادغام و فک ادغام (مضاعف)', desc: 'ادغام واجب، ممتنع و جائز' },
                    { id: 'mudaaf_conjugation', title: 'صرف افعال مضاعف', desc: 'مَدَّ، فَرَّ، مَسَّ، أَمَدَّ...' },
                    { id: 'targeted', title: 'نقطه‌زنی صیغه (ریشه+باب)', desc: 'صیغه ۵ در باب إفعال' },
                    { id: 'translation', title: 'تطبیق ترجمه فارسی', desc: 'معادل عربی «یاری کردید»' },
                    { id: 'tense_inversion', title: 'تبدیل ماضی ↔ مضارع', desc: 'أَکْرَمَ به مضارع' },
                    { id: 'amr', title: 'فعل امر (حاضر و به لام)', desc: 'اِفْعَلْ / لِيَفْعَلْ' },
                    { id: 'nahy', title: 'نهی معلوم با لا جازمه', desc: 'لا تَفْعَلْ' },
                    { id: 'nahy_majhul', title: 'نهی مجهول', desc: 'لا يُفْعَلْ (نباید شود)' },
                    { id: 'passive', title: 'مجهول (ماضی و مضارع)', desc: 'فُعِلَ / يُفْعَلُ' },
                    { id: 'nafy', title: 'نفی (ماضی و مضارع)', desc: 'ما فَعَلَ / لا يَفْعَلُ' },
                    { id: 'sequential', title: 'صرف ترتیبی (۱ تا ۱۴)', desc: 'صرف متوالی کل صیغه‌ها' },
                    { id: 'reverse', title: 'صرف معکوس (۱۴ به ۱)', desc: 'شکستن حفظ طوطی‌وار' },
                  ].map((q) => {
                    const isSelected = selectedTypes.includes(q.id as QuestionType);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => toggleType(q.id as QuestionType)}
                        className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-white border-stone-200 text-stone-600 opacity-60'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-xs block truncate">{q.title}</span>
                          <span className="text-[10px] text-stone-400 block truncate">{q.desc}</span>
                        </div>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mr-1" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-300 shrink-0 mr-1" />
                        )}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Nouns Types */}
              {(domainFilter === 'both' || domainFilter === 'nouns') && (
                <>
                  {[
                    { id: 'ism_fael', title: 'اسم فاعل', desc: 'فاعِل / مُفْعِل / مُعَلِّم' },
                    { id: 'ism_mafool', title: 'اسم مفعول', desc: 'مَفْعُول / مُفْعَل / مُعَلَّم' },
                    { id: 'sefat_moshabbahah', title: 'صفت مشبهه', desc: 'فَعِيل، حَسَن، کَرِيم' },
                    { id: 'ism_tafdil', title: 'اسم تفضیل', desc: 'أَفْعَل / مؤنث: فُعْلَى' },
                    { id: 'ism_makan_zaman', title: 'اسم مکان و زمان', desc: 'مَفْعَل / مَفْعِل' },
                    { id: 'ism_ala', title: 'اسم آلت', desc: 'مِفْعَل، مِفْعال، مِفْعَلَة' },
                    { id: 'ism_mobalagheh', title: 'اسم مبالغه', desc: 'فَعّال، فَعُول، مِفْعال' },
                    { id: 'jam_taksir', title: 'جمع مکسر و تکسیر', desc: 'مَفاعِل و منتهی الجموع' },
                  ].map((q) => {
                    const isSelected = selectedTypes.includes(q.id as QuestionType);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => toggleType(q.id as QuestionType)}
                        className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50/70 border-teal-400 text-teal-950 font-bold'
                            : 'bg-white border-stone-200 text-stone-600 opacity-60'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-xs block truncate">{q.title}</span>
                          <span className="text-[10px] text-stone-400 block truncate">{q.desc}</span>
                        </div>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-teal-700 shrink-0 mr-1" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-300 shrink-0 mr-1" />
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Step 4: Rounds & Answer Method */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                ۴
              </span>
              <h3 className="font-bold text-stone-900 text-base">
                تنظیمات تعداد پرسش و شیوه پاسخ
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  تعداد سوال (به ازای هر نفر):
                </label>
                <div className="flex items-center gap-2">
                  {[3, 5, 8, 10, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRoundsPerStudent(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        roundsPerStudent === num
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {num} سوال
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'solo' && (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    شیوه آزمون انفرادی:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSoloAnswerMethod('choice')}
                      className={`py-2 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        soloAnswerMethod === 'choice'
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      ۴ گزینه‌ای
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoloAnswerMethod('flashcard')}
                      className={`py-2 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        soloAnswerMethod === 'flashcard'
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      فلش‌کارت
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoloAnswerMethod('voice')}
                      className={`py-2 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1 ${
                        soloAnswerMethod === 'voice'
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Mic className="w-3 h-3" />
                      <span>صوتی</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Start Bar */}
          <div className="sticky bottom-4 z-20 bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-300 block">
                خلاصه آزمون شما:
              </span>
              <span className="text-xs text-stone-300">
                {students.length} دانشجو · {selectedBabs.length} باب · {selectedTypes.length} نوع سوال · مجموعاً {totalQuestions} پرسش
              </span>
            </div>

            <button
              type="button"
              onClick={handleStartCustomSession}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>آغاز آزمون ({totalQuestions} پرسش)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
