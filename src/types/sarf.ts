export type BabCategory =
  | 'thulathi_mujarrad'
  | 'thulathi_mazid'
  | 'rubai_mujarrad'
  | 'rubai_mazid';

export type BabId =
  | 'mujarrad' // ثلاثی مجرد کلی
  | 'mujarrad_nasara' // باب ۱: فَعَلَ يَفْعُلُ (نَصَرَ)
  | 'mujarrad_daraba' // باب ۲: فَعَلَ يَفْعِلُ (ضَرَبَ)
  | 'mujarrad_fataha' // باب ۳: فَعَلَ يَفْعَلُ (فَتَحَ)
  | 'mujarrad_alima'  // باب ۴: فَعِلَ يَفْعَلُ (عَلِمَ)
  | 'mujarrad_hasuna' // باب ۵: فَعُلَ يَفْعُلُ (حَسُنَ)
  | 'mujarrad_hasiba' // باب ۶: فَعِلَ يَفْعِلُ (حَسِبَ)
  | 'if\'al'
  | 'taf\'il'
  | 'mufa\'alah'
  | 'tafa\'\'ul'
  | 'tafa\'ul'
  | 'ifti\'al'
  | 'infi\'al'
  | 'istif\'al'
  | 'if\'ilal' // باب ۹: اِفْعِلال (احمرّ - الوان و عیوب)
  | 'if\'i\'al' // باب ۱۰: اِفْعيعال (اعشوشب - مبالغه)
  | 'rubai_mujarrad'
  | 'tafa\'lul'
  | 'if\'inlal'
  | 'if\'illal';

export interface BabInfo {
  id: BabId;
  name: string; // e.g. "إِفْعال"
  persianName: string; // e.g. "افعال"
  category: BabCategory;
  waznMadi: string; // "أَفْعَلَ"
  waznMudari: string; // "يُفْعِلُ"
  waznMasdar: string; // "إِفْعالاً"
  meaning: string; // "تعدیه، صیرورت، دخول در زمان یا مکان"
  extraLetters: string; // "همزه در ابتدا"
  exampleRoot: string; // "ک ر م"
  exampleMadi: string; // "أَكْرَمَ"
  exampleMudari: string; // "يُكْرِمُ"
  exampleTranslation: string; // "گرامی داشت"
}

export interface SeeghehInfo {
  index: number; // 1 to 14
  nameAr: string; // "للغائب"
  nameFa: string; // "مفرد مذکر غائب"
  pronoun: string; // "هُوَ"
  group: 'ghayeb' | 'mukhateb' | 'mutakallem';
  gender: 'mudhakkar' | 'muannath' | 'mushtarak';
  number: 'mufrad' | 'muthanna' | 'jam\'';
  markerMadi: string; // "مبنی بر فتح / بدون ضمیر بارز"
  markerMudari: string; // "حرف مضارع يَـ و ضمه پایانی"
}

export type VerbMode =
  | 'madi' // ماضی معلوم
  | 'mudari' // مضارع معلوم
  | 'madi_majhul' // ماضی مجهول (فُعِلَ)
  | 'mudari_majhul' // مضارع مجهول (يُفْعَلُ)
  | 'amr' // امر حاضر و غائب (اِفْعَلْ / لِيَفْعَلْ)
  | 'nahy' // نهی معلوم با لا جازمه (لا تَفْعَلْ)
  | 'nahy_majhul' // نهی مجهول (لا تُفْعَلْ - نباید انجام شود)
  | 'nafy_madi' // نفی ماضی (ما فَعَلَ / لَمْ يَفْعَلْ)
  | 'nafy_mudari' // نفی مضارع (لا يَفْعَلُ / ما يَفْعَلُ)
  | 'nafy_majhul'; // نفی مجهول (ما فُعِلَ / لا يُفْعَلُ)

export type SarfDomain = 'verbs' | 'nouns' | 'both';

export type QuestionType =
  // افعال
  | 'sequential' // صرف ترتیبی ۱ تا ۱۴
  | 'reverse' // صرف معکوس (۱۴ تا ۱، ۱۲ تا ۷، ۶ تا ۱)
  | 'targeted' // نقطه‌زنی (ریشه + باب + صیغه)
  | 'translation' // تطبیق با ترجمه فارسی صیغه (آن یک مرد فلان کرد...)
  | 'tense_inversion' // تبدیل ماضی به مضارع و برعکس
  | 'passive' // تبدیل یا نقطه‌زنی مجهول (ماضی و مضارع مجهول)
  | 'amr' // ساخت و تطبیق امر (امر حاضر و امر به لام)
  | 'nahy' // ساخت و تطبیق نهی معلوم
  | 'nahy_majhul' // نهی مجهول (لا يُفْعَلْ / لا تُنْصَرْ)
  | 'nafy' // نفی ماضی و مضارع (معلوم و مجهول)
  // اسماء و مشتقات
  | 'ism_fael' // اسم فاعل (ثلاثی مجرد و مزید)
  | 'ism_mafool' // اسم مفعول (مَفْعُول، مُفْعَل...)
  | 'sefat_moshabbahah' // صفت مشبهه (فَعِيل، حَسَن، کَرِيم...)
  | 'ism_tafdil' // اسم تفضیل (أَفْعَل / فُعْلَى)
  | 'ism_makan_zaman' // اسم مکان و زمان (مَفْعَل / مَفْعِل)
  | 'ism_ala' // اسم آلت (مِفْعَل، مِفْعال، مِفْعَلَة)
  | 'ism_mobalagheh' // اسم مبالغه (فَعّال، فَعُول، مِفْعال)
  | 'jam_taksir'; // جمع مکسر و اوزان جموع

export interface PersianStemInfo {
  prefix?: string; // e.g. "یاری", "گرامی", "آموزش", "پیکار", "یاد", "سخن"
  stemMadi: string; // e.g. "کرد", "زد", "داشت", "فرستاد", "داد", "گرفت"
  stemMudari: string; // e.g. "کن", "زن", "دار", "فرست", "ده", "گیر"
}

export interface VerbConjugation {
  root: string; // "ع ل م"
  babId: BabId;
  meaningBase: string; // "آموزش داد"
  masdar?: string; // "عِلْماً" یا "تَعْليماً"
  verbType?: 'salim' | 'mahmuz' | 'mudaaf' | 'mithal' | 'ajwaf' | 'naqis' | 'lafif';
  isTransitive?: boolean; // آیا متعدی است و مجهول می‌پذیرد؟
  quranicAyah?: string; // نمونه قرآنی
  persianStem?: PersianStemInfo;
  madi: string[]; // 14 forms (index 0 to 13)
  mudari: string[]; // 14 forms
  madiMajhul?: string[]; // 14 forms
  mudariMajhul?: string[]; // 14 forms
  amr?: string[]; // 14 forms (index 6 to 11 are amr hader, others amr bi-lam)
  nahy?: string[]; // 14 forms (معلوم)
  nahyMajhul?: string[]; // 14 forms (مجهول: لا يُفْعَلْ)
  nafyMadi?: string[]; // 14 forms: ما فَعَلَ
  nafyMudari?: string[]; // 14 forms: لا يَفْعَلُ
  nafyMadiMajhul?: string[]; // 14 forms: ما فُعِلَ
  nafyMudariMajhul?: string[]; // 14 forms: لا يُفْعَلُ
}

export interface NounDerivative {
  id: string;
  type:
    | 'ism_fael'
    | 'ism_mafool'
    | 'sefat_moshabbahah'
    | 'ism_tafdil'
    | 'ism_makan_zaman'
    | 'ism_ala'
    | 'ism_mobalagheh'
    | 'jam_taksir';
  typeNameFa: string; // e.g. "اسم فاعل"
  wazn: string; // e.g. "فاعِل"
  root: string; // e.g. "ن ص ر"
  babName: string; // "ثلاثی مجرد" یا "إفعال"
  singularMasc: string; // "ناصِرٌ"
  singularFem: string; // "ناصِرَةٌ"
  dualMasc: string; // "ناصِرانِ"
  dualFem: string; // "ناصِرَتانِ"
  pluralMasc: string; // "ناصِرُونَ"
  pluralFem: string; // "ناصِراتٌ"
  jamTaksir?: string; // "نُصّار"
  meaning: string; // "یاری‌کننده"
  quranicAyah?: string; // آیه‌ای از قرآن
  ruleDescription: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  babId: BabId;
  babName: string;
  root: string;
  title: string;
  prompt: string;
  subPrompt?: string;
  tense?: 'madi' | 'mudari';
  verbMode?: VerbMode;
  seeghehRange?: {
    start: number;
    end: number;
    description: string;
  };
  targetSeegheh?: SeeghehInfo;
  sourceVerb?: string; // For conversions
  sourceTense?: 'madi' | 'mudari' | VerbMode;
  correctAnswer: string;
  correctAnswersList?: { seegheh: SeeghehInfo; form: string }[];
  options?: string[]; // 4 choices for solo mode
  explanation: string;
  pedagogicalTip?: string;
}

export interface Student {
  id: string;
  name: string;
  avatarSeed: string;
  color: string;
}

export interface QuestionResult {
  questionId: string;
  question: Question;
  askerStudentId?: string;
  studentId: string;
  studentName: string;
  score: 0 | 5 | 10; // 10 = perfect, 5 = with hint, 0 = missed
  userAnswer?: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export type StudyMode =
  | 'circle' // حلقه نوبتی: دست به دست (A از B، B از C...)
  | 'facilitator' // سرگروه / استاد: یک نفر می‌پرسد
  | 'solo'; // تمرین انفرادی: آزمون تستی، صوتی یا فلش کارت

export interface SessionConfig {
  mode: StudyMode;
  students: Student[];
  facilitatorId?: string;
  selectedBabIds: BabId[];
  selectedQuestionTypes: QuestionType[];
  roundsPerStudent: number;
  soloAnswerMethod: 'choice' | 'flashcard' | 'voice';
}

export interface SessionSummary {
  id: string;
  date: string;
  config: SessionConfig;
  results: QuestionResult[];
  totalScore: number;
  maxScore: number;
  durationSeconds: number;
}
