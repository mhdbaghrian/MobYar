import { VerbConjugation, VerbMode } from '../types/sarf';

export interface PersianConjugationResult {
  subject: string; // e.g. "شما دو زن"
  verbPhrase: string; // e.g. "می‌زنید" or "یاری کردید"
  fullSentence: string; // e.g. "شما دو زن می‌زنید"
  traditionalHawza: string; // e.g. "می‌زنید شما دو زن حاضر"
}

// Subject pronouns matching each of the 14 Arabic Seeghehs
export const SEEGHEH_SUBJECTS: Record<
  number,
  { subject: string; hawzaDesc: string; person: 1 | 2 | 3; isPlural: boolean; isMukhateb: boolean }
> = {
  1: { subject: 'آن یک مرد', hawzaDesc: 'آن یک مرد غائب', person: 3, isPlural: false, isMukhateb: false },
  2: { subject: 'آن دو مرد', hawzaDesc: 'آن دو مرد غائب', person: 3, isPlural: true, isMukhateb: false },
  3: { subject: 'آن مردان', hawzaDesc: 'آن مردان غائب', person: 3, isPlural: true, isMukhateb: false },
  4: { subject: 'آن یک زن', hawzaDesc: 'آن یک زن غائبه', person: 3, isPlural: false, isMukhateb: false },
  5: { subject: 'آن دو زن', hawzaDesc: 'آن دو زن غائبه', person: 3, isPlural: true, isMukhateb: false },
  6: { subject: 'آن زنان', hawzaDesc: 'آن زنان غائبه', person: 3, isPlural: true, isMukhateb: false },
  7: { subject: 'تو (یک مرد)', hawzaDesc: 'تو یک مرد حاضر', person: 2, isPlural: false, isMukhateb: true },
  8: { subject: 'شما دو مرد', hawzaDesc: 'شما دو مرد حاضر', person: 2, isPlural: true, isMukhateb: true },
  9: { subject: 'شما مردان', hawzaDesc: 'شما مردان حاضر', person: 2, isPlural: true, isMukhateb: true },
  10: { subject: 'تو (یک زن)', hawzaDesc: 'تو یک زن حاضر', person: 2, isPlural: false, isMukhateb: true },
  11: { subject: 'شما دو زن', hawzaDesc: 'شما دو زن حاضر', person: 2, isPlural: true, isMukhateb: true },
  12: { subject: 'شما زنان', hawzaDesc: 'شما زنان حاضر', person: 2, isPlural: true, isMukhateb: true },
  13: { subject: 'من', hawzaDesc: 'من (متکلم وحده)', person: 1, isPlural: false, isMukhateb: false },
  14: { subject: 'ما', hawzaDesc: 'ما (متکلم مع‌الغیر)', person: 1, isPlural: true, isMukhateb: false },
};

// Default Persian stem mappings for the verbs in VERB_LIBRARY
export const DEFAULT_PERSIAN_STEMS: Record<string, { prefix?: string; stemMadi: string; stemMudari: string }> = {
  // ثلاثی مجرد
  'ن ص ر': { prefix: 'یاری', stemMadi: 'کرد', stemMudari: 'کن' },
  'ض ر ب_mujarrad': { prefix: '', stemMadi: 'زد', stemMudari: 'زن' },
  'ض ر ب': { prefix: '', stemMadi: 'زد', stemMudari: 'زن' },
  'ک ت ب': { prefix: '', stemMadi: 'نوشت', stemMudari: 'نویس' },
  'د خ ل': { prefix: 'وارد', stemMadi: 'شد', stemMudari: 'شو' },
  'خ ر ج': { prefix: 'بیرون', stemMadi: 'رفت', stemMudari: 'رو' },
  'ط ل ب': { prefix: 'طلب', stemMadi: 'کرد', stemMudari: 'کن' },
  'ش ک ر': { prefix: 'سپاسگزاری', stemMadi: 'کرد', stemMudari: 'کن' },
  'ع ب د': { prefix: 'پرستش', stemMadi: 'کرد', stemMudari: 'کن' },
  'ح ک م': { prefix: 'حکم', stemMadi: 'کرد', stemMudari: 'کن' },
  'ق ت ل_mujarrad': { prefix: '', stemMadi: 'کشت', stemMudari: 'کش' },
  'ج ل س': { prefix: '', stemMadi: 'نشست', stemMudari: 'نشین' },
  'غ ف ر': { prefix: '', stemMadi: 'آمرزید', stemMudari: 'آمرز' },
  'ص ب ر': { prefix: 'شکیبایی', stemMadi: 'کرد', stemMudari: 'کن' },
  'ح م ل': { prefix: 'حمل', stemMadi: 'کرد', stemMudari: 'کن' },
  'ع ر ف': { prefix: '', stemMadi: 'شناخت', stemMudari: 'شناس' },
  'ر ج ع': { prefix: 'باز', stemMadi: 'گشت', stemMudari: 'گرد' },
  'ک س ر': { prefix: '', stemMadi: 'شکست', stemMudari: 'شکن' },
  'ف ت ح': { prefix: '', stemMadi: 'گشود', stemMudari: 'گشا' },
  'ذ ه ب': { prefix: '', stemMadi: 'رفت', stemMudari: 'رو' },
  'ج ع ل': { prefix: 'قرار', stemMadi: 'داد', stemMudari: 'ده' },
  'م ن ع': { prefix: 'منع', stemMadi: 'کرد', stemMudari: 'کن' },
  'ع ل م_mujarrad': { prefix: '', stemMadi: 'دانست', stemMudari: 'دان' },
  'س م ع': { prefix: '', stemMadi: 'شنید', stemMudari: 'شنو' },
  'ف ه م': { prefix: '', stemMadi: 'فهمید', stemMudari: 'فهم' },
  'ش ر ب': { prefix: '', stemMadi: 'نوشید', stemMudari: 'نوش' },
  'ح م د': { prefix: 'ستایش', stemMadi: 'کرد', stemMudari: 'کن' },
  'ح س ن': { prefix: 'نیکو', stemMadi: 'شد', stemMudari: 'شو' },
  'ح س ب': { prefix: 'گمان', stemMadi: 'برد', stemMudari: 'بر' },

  // إفعال
  'ک ر م': { prefix: 'گرامی', stemMadi: 'داشت', stemMudari: 'دار' },
  'ح س ن_if\'al': { prefix: 'نیکی', stemMadi: 'کرد', stemMudari: 'کن' },
  'ر س ل': { prefix: '', stemMadi: 'فرستاد', stemMudari: 'فرست' },
  'ن ز ل': { prefix: 'فرو', stemMadi: 'فرستاد', stemMudari: 'فرست' },

  // تفعیل
  'ع ل م_taf\'il': { prefix: 'آموزش', stemMadi: 'داد', stemMudari: 'ده' },
  'ق د م': { prefix: 'پیشکش', stemMadi: 'کرد', stemMudari: 'کن' },
  'س ب ح': { prefix: 'تسبیح', stemMadi: 'گفت', stemMudari: 'گو' },

  // مفاعلة
  'ق ت ل_mufa\'alah': { prefix: 'پیکار', stemMadi: 'کرد', stemMudari: 'کن' },
  'ج ه د': { prefix: 'جهاد', stemMadi: 'کرد', stemMudari: 'کن' },
  'ض ر ر': { prefix: 'به یکدیگر زیان', stemMadi: 'رساند', stemMudari: 'رسان' },
  'ض ر ب_mufa\'alah': { prefix: 'با هم پیکار', stemMadi: 'کرد', stemMudari: 'کن' },

  // تفعّل
  'ع ل م_tafa\'\'ul': { prefix: 'یاد', stemMadi: 'گرفت', stemMudari: 'گیر' },
  'ک ل م': { prefix: 'سخن', stemMadi: 'گفت', stemMudari: 'گو' },

  // تفاعل
  'ق ت ل_tafa\'ul': { prefix: 'با یکدیگر', stemMadi: 'جنگید', stemMudari: 'جنگ' },
  'ج ه ر': { prefix: 'تظاهر و تجاهر', stemMadi: 'کرد', stemMudari: 'کن' },
  'ق ب ل': { prefix: 'رویاروی هم قرار', stemMadi: 'گرفت', stemMudari: 'گیر' },

  // افتعال
  'ج م ع': { prefix: 'گرد هم', stemMadi: 'آمد', stemMudari: 'آی' },
  'ق ر ب': { prefix: 'نزدیک', stemMadi: 'شد', stemMudari: 'شو' },

  // انفعال
  'ق ل ب': { prefix: 'دگرگون', stemMadi: 'شد', stemMudari: 'شو' },
  'ک س ر_infi\'al': { prefix: 'شکسته', stemMadi: 'شد', stemMudari: 'شو' },

  // استفعال
  'غ ف ر_istif\'al': { prefix: 'طلب آمرزش', stemMadi: 'کرد', stemMudari: 'کن' },
  'خ ر ج_istif\'al': { prefix: 'بیرون', stemMadi: 'کشید', stemMudari: 'کش' },

  // رباعی مجرد
  'د ح ر ج_rubai_mujarrad': { prefix: '', stemMadi: 'غلتاند', stemMudari: 'غلتان' },
  'ز ل ز ل_rubai_mujarrad': { prefix: '', stemMadi: 'لرزاند', stemMudari: 'لرزان' },

  // رباعی مزید
  'د ح ر ج_tafa\'lul': { prefix: '', stemMadi: 'غلتید', stemMudari: 'غلت' },
  'ز ل ز ل_tafa\'lul': { prefix: '', stemMadi: 'لرزید', stemMudari: 'لرز' },
  'ح ر ج م': { prefix: 'گرد هم', stemMadi: 'آمد', stemMudari: 'آی' },
  'ط م ئ ن': { prefix: 'آرام', stemMadi: 'گرفت', stemMudari: 'گیر' },
};

/**
 * Accurately conjugates a Persian verb corresponding to any of the 14 Arabic seeghehs
 * across all modes: madi, mudari, madi_majhul, mudari_majhul, amr, nahy
 */
export function conjugatePersianVerb(
  verb: VerbConjugation,
  seeghehIndex: number, // 1 to 14
  mode: VerbMode | 'madi' | 'mudari' = 'madi'
): PersianConjugationResult {
  const meta = SEEGHEH_SUBJECTS[seeghehIndex] || SEEGHEH_SUBJECTS[1];

  // Lookup stem
  const stem =
    verb.persianStem ||
    DEFAULT_PERSIAN_STEMS[`${verb.root}_${verb.babId}`] ||
    DEFAULT_PERSIAN_STEMS[verb.root] ||
    extractStemFromMeaning(verb.meaningBase);

  const prefix = stem.prefix ? `${stem.prefix} ` : '';
  let conjugatedVerb = '';

  // =========================================================================
  // ۱. ماضی معلوم (Madi)
  // =========================================================================
  if (mode === 'madi') {
    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `${stem.stemMadi}ند` : stem.stemMadi;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `${stem.stemMadi}ید` : `${stem.stemMadi}ی`;
    } else {
      conjugatedVerb = meta.isPlural ? `${stem.stemMadi}یم` : `${stem.stemMadi}م`;
    }
  }

  // =========================================================================
  // ۲. مضارع معلوم (Mudari)
  // =========================================================================
  else if (mode === 'mudari') {
    const m = stem.stemMudari;
    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `می‌${m}ند` : `می‌${m}د`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `می‌${m}ید` : `می‌${m}ی`;
    } else {
      conjugatedVerb = meta.isPlural ? `می‌${m}یم` : `می‌${m}م`;
    }
  }

  // =========================================================================
  // ۳. ماضی مجهول (Madi Majhul) - با فعل معین «شدن»
  // =========================================================================
  else if (mode === 'madi_majhul') {
    // برای افعال مرکب مثل یاری کرد -> یاری شد / یاری شدند
    // برای افعال بسیط مثل زد -> زده شد / زده شدند
    let passivePart = prefix;
    if (!prefix) {
      passivePart = `${stem.stemMadi}ه `;
    } else {
      // اگر فعل با «کردن» ساخته شده، جایگزین با «شدن»: «یاری شد»
      if (stem.stemMadi === 'کرد') {
        passivePart = `${prefix}`;
      } else if (stem.stemMadi === 'داشت') {
        passivePart = `${prefix}داشته `;
      } else if (stem.stemMadi === 'داد') {
        passivePart = `${prefix}داده `;
      } else {
        passivePart = `${prefix}${stem.stemMadi}ه `;
      }
    }

    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `${passivePart}شدند` : `${passivePart}شد`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `${passivePart}شدید` : `${passivePart}شدی`;
    } else {
      conjugatedVerb = meta.isPlural ? `${passivePart}شدیم` : `${passivePart}شدم`;
    }
    conjugatedVerb = conjugatedVerb.trim();
  }

  // =========================================================================
  // ۴. مضارع مجهول (Mudari Majhul)
  // =========================================================================
  else if (mode === 'mudari_majhul') {
    let passivePart = prefix;
    if (!prefix) {
      passivePart = `${stem.stemMadi}ه `;
    } else {
      if (stem.stemMadi === 'کرد') {
        passivePart = `${prefix}`;
      } else if (stem.stemMadi === 'داشت') {
        passivePart = `${prefix}داشته `;
      } else if (stem.stemMadi === 'داد') {
        passivePart = `${prefix}داده `;
      } else {
        passivePart = `${prefix}${stem.stemMadi}ه `;
      }
    }

    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `${passivePart}می‌شوند` : `${passivePart}می‌شود`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `${passivePart}می‌شوید` : `${passivePart}می‌شوی`;
    } else {
      conjugatedVerb = meta.isPlural ? `${passivePart}می‌شویم` : `${passivePart}می‌شوم`;
    }
    conjugatedVerb = conjugatedVerb.trim();
  }

  // =========================================================================
  // ۵. امر (Amr) - امر حاضر (مخاطب) و امر به لام (غائب)
  // =========================================================================
  else if (mode === 'amr') {
    const m = stem.stemMudari;
    const b = prefix ? `${prefix}` : 'بِ';

    if (meta.isMukhateb) {
      // امر حاضر (ص ۷ تا ۱۲)
      if (meta.isPlural) {
        conjugatedVerb = `${b}${m}ید`;
      } else {
        conjugatedVerb = `${b}${m}`;
      }
    } else {
      // امر به لام غائب و متکلم (باید ...)
      if (meta.person === 3) {
        conjugatedVerb = meta.isPlural ? `باید ${prefix}${m}ند` : `باید ${prefix}${m}د`;
      } else {
        conjugatedVerb = meta.isPlural ? `باید ${prefix}${m}یم` : `باید ${prefix}${m}م`;
      }
    }
  }

  // =========================================================================
  // ۶. نهی معلوم (Nahy) - نهی با لا جازمه (شما زنان تجاهر نکنید!)
  // =========================================================================
  else if (mode === 'nahy') {
    const m = stem.stemMudari;

    if (meta.isMukhateb) {
      // نهی حاضر (ص ۷ تا ۱۲): نکن / نکنید / نزن / نزنید
      if (meta.isPlural) {
        conjugatedVerb = `${prefix}نَ${m}ید`;
      } else {
        conjugatedVerb = `${prefix}نَ${m}`;
      }
    } else {
      // نهی غائب و متکلم (نباید ...)
      if (meta.person === 3) {
        conjugatedVerb = meta.isPlural ? `نباید ${prefix}${m}ند` : `نباید ${prefix}${m}د`;
      } else {
        conjugatedVerb = meta.isPlural ? `نباید ${prefix}${m}یم` : `نباید ${prefix}${m}م`;
      }
    }
  }

  // =========================================================================
  // ۷. نهی مجهول (Nahy Majhul) - لا يُنْصَرْ (نباید یاری شود)
  // =========================================================================
  else if (mode === 'nahy_majhul') {
    let passivePart = prefix;
    if (!prefix) {
      passivePart = `${stem.stemMadi}ه `;
    } else {
      if (stem.stemMadi === 'کرد') {
        passivePart = `${prefix}`;
      } else if (stem.stemMadi === 'داشت') {
        passivePart = `${prefix}داشته `;
      } else if (stem.stemMadi === 'داد') {
        passivePart = `${prefix}داده `;
      } else {
        passivePart = `${prefix}${stem.stemMadi}ه `;
      }
    }

    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `نباید ${passivePart}شوند` : `نباید ${passivePart}شود`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `نباید ${passivePart}شوید` : `نباید ${passivePart}شوی`;
    } else {
      conjugatedVerb = meta.isPlural ? `نباید ${passivePart}شویم` : `نباید ${passivePart}شوم`;
    }
    conjugatedVerb = conjugatedVerb.trim();
  }

  // =========================================================================
  // ۸. نفی ماضی (Nafy Madi) - ما فَعَلَ (یاری نکرد / نزد)
  // =========================================================================
  else if (mode === 'nafy_madi') {
    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `نَ${stem.stemMadi}ند` : `نَ${stem.stemMadi}`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `نَ${stem.stemMadi}ید` : `نَ${stem.stemMadi}ی`;
    } else {
      conjugatedVerb = meta.isPlural ? `نَ${stem.stemMadi}یم` : `نَ${stem.stemMadi}م`;
    }
  }

  // =========================================================================
  // ۹. نفی مضارع (Nafy Mudari) - لا يَفْعَلُ (یاری نمی‌کند / نمی‌زند)
  // =========================================================================
  else if (mode === 'nafy_mudari') {
    const m = stem.stemMudari;
    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `نمی‌${m}ند` : `نمی‌${m}د`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `نمی‌${m}ید` : `نمی‌${m}ی`;
    } else {
      conjugatedVerb = meta.isPlural ? `نمی‌${m}یم` : `نمی‌${m}م`;
    }
  }

  // =========================================================================
  // ۱۰. نفی مجهول (Nafy Majhul) - ما فُعِلَ / لا يُفْعَلُ (یاری نشد / یاری نمی‌شود)
  // =========================================================================
  else if (mode === 'nafy_majhul') {
    let passivePart = prefix;
    if (!prefix) {
      passivePart = `${stem.stemMadi}ه `;
    } else {
      if (stem.stemMadi === 'کرد') {
        passivePart = `${prefix}`;
      } else {
        passivePart = `${prefix}${stem.stemMadi}ه `;
      }
    }

    if (meta.person === 3) {
      conjugatedVerb = meta.isPlural ? `${passivePart}نشدند` : `${passivePart}نشد`;
    } else if (meta.person === 2) {
      conjugatedVerb = meta.isPlural ? `${passivePart}نشدید` : `${passivePart}نشدی`;
    } else {
      conjugatedVerb = meta.isPlural ? `${passivePart}نشدیم` : `${passivePart}نشدم`;
    }
    conjugatedVerb = conjugatedVerb.trim();
  }

  const fullVerbPhrase = (mode.includes('majhul') ? conjugatedVerb : `${prefix}${conjugatedVerb}`).trim();
  // Clean redundant double prefixes
  const normalizedVerbPhrase = fullVerbPhrase.replace(/\s+/g, ' ');
  const fullSentence = `${meta.subject} ${normalizedVerbPhrase}`;
  const traditionalHawza = `${normalizedVerbPhrase} (${meta.hawzaDesc})`;

  return {
    subject: meta.subject,
    verbPhrase: normalizedVerbPhrase,
    fullSentence,
    traditionalHawza,
  };
}

// Fallback smart parser for compound verbs like "یاری کرد" -> prefix: "یاری", stemMadi: "کرد", stemMudari: "کن"
function extractStemFromMeaning(meaning: string): { prefix?: string; stemMadi: string; stemMudari: string } {
  const parts = meaning.trim().split(/\s+/);
  const lastWord = parts[parts.length - 1];
  const prefix = parts.slice(0, parts.length - 1).join(' ');

  if (lastWord === 'کرد' || lastWord === 'کردن') {
    return { prefix, stemMadi: 'کرد', stemMudari: 'کن' };
  }
  if (lastWord === 'زد' || lastWord === 'زدن') {
    return { prefix, stemMadi: 'زد', stemMudari: 'زن' };
  }
  if (lastWord === 'داد' || lastWord === 'دادن') {
    return { prefix, stemMadi: 'داد', stemMudari: 'ده' };
  }
  if (lastWord === 'داشت' || lastWord === 'داشتن') {
    return { prefix, stemMadi: 'داشت', stemMudari: 'دار' };
  }
  if (lastWord === 'گرفت' || lastWord === 'گرفتن') {
    return { prefix, stemMadi: 'گرفت', stemMudari: 'گیر' };
  }
  if (lastWord === 'شد' || lastWord === 'شدن') {
    return { prefix, stemMadi: 'شد', stemMudari: 'شو' };
  }
  if (lastWord === 'گفت' || lastWord === 'گفتن') {
    return { prefix, stemMadi: 'گفت', stemMudari: 'گو' };
  }

  return { prefix: meaning, stemMadi: 'کرد', stemMudari: 'کن' };
}
