import { BabId } from '../types/sarf';

export interface FormPair {
  madi: string[];
  mudari: string[];
}

export interface FullConjugationSet {
  madi: string[];
  mudari: string[];
  madiMajhul?: string[];
  mudariMajhul?: string[];
  amr: string[];
  nahy: string[];
}

/**
 * Generate 14 past and 14 present active forms for regular triliteral sound roots
 */
export function generateSoundConjugation(
  f: string,
  a: string,
  l: string,
  ainMadiHarakah: 'َ' | 'ِ' | 'ُ',
  ainMudariHarakah: 'َ' | 'ِ' | 'ُ'
): FormPair {
  const mBase = `${f}َ${a}${ainMadiHarakah}${l}`;
  const mSukun = `${f}َ${a}${ainMadiHarakah}${l}ْ`;

  const madi = [
    `${mBase}َ`, // 1. هُوَ فَعَلَ
    `${mBase}ا`, // 2. هُما فَعَلا
    `${mBase}ُوا`, // 3. هُمْ فَعَلُوا
    `${mBase}َتْ`, // 4. هِيَ فَعَلَتْ
    `${mBase}َتا`, // 5. هُما فَعَلَتا
    `${mSukun}نَ`, // 6. هُنَّ فَعَلْنَ
    `${mSukun}تَ`, // 7. أَنْتَ فَعَلْتَ
    `${mSukun}تُما`, // 8. أَنْتُما فَعَلْتُما
    `${mSukun}تُمْ`, // 9. أَنْتُمْ فَعَلْتُمْ
    `${mSukun}تِ`, // 10. أَنْتِ فَعَلْتِ
    `${mSukun}تُما`, // 11. أَنْتُما فَعَلْتُما
    `${mSukun}تُنَّ`, // 12. أَنْتُنَّ فَعَلْتُنَّ
    `${mSukun}تُ`, // 13. أَنَا فَعَلْتُ
    `${mSukun}نا`, // 14. نَحْنُ فَعَلْنا
  ];

  const muBase = `${f}ْ${a}${ainMudariHarakah}${l}`;
  const muSukun = `${f}ْ${a}${ainMudariHarakah}${l}ْ`;

  const mudari = [
    `يَ${muBase}ُ`, // 1. يَفْعُلُ
    `يَ${muBase}انِ`, // 2. يَفْعُلانِ
    `يَ${muBase}ونَ`, // 3. يَفْعُلُونَ
    `تَ${muBase}ُ`, // 4. تَفْعُلُ
    `تَ${muBase}انِ`, // 5. تَفْعُلانِ
    `يَ${muSukun}نَ`, // 6. يَفْعُلْنَ
    `تَ${muBase}ُ`, // 7. تَفْعُلُ
    `تَ${muBase}انِ`, // 8. تَفْعُلانِ
    `تَ${muBase}ونَ`, // 9. تَفْعُلُونَ
    `تَ${muBase}ينَ`, // 10. تَفْعُلينَ
    `تَ${muBase}انِ`, // 11. تَفْعُلانِ
    `تَ${muSukun}نَ`, // 12. تَفْعُلْنَ
    `أَ${muBase}ُ`, // 13. أَفْعُلُ
    `نَ${muBase}ُ`, // 14. نَفْعُلُ
  ];

  return { madi, mudari };
}

/**
 * Generate 14 past and 14 present active forms for augmented Abwab
 */
export function generateAugmentedConjugation(
  root: string,
  babId: BabId
): FormPair | null {
  const parts = root.trim().split(/\s+/);

  if (parts.length === 3) {
    const [f, a, l] = parts;

    // 1. باب إفعال (أَفْعَلَ يُفْعِلُ)
    if (babId === "if'al") {
      const mBase = `أَ${f}ْ${a}َ${l}`;
      const mSukun = `أَ${f}ْ${a}َ${l}ْ`;
      const muBase = `ُ${f}ْ${a}ِ${l}`;
      const muSukun = `ُ${f}ْ${a}ِ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 2. باب تفعيل (فَعَّلَ يُفَعِّلُ)
    if (babId === "taf'il") {
      const mBase = `${f}َ${a}َّ${l}`;
      const mSukun = `${f}َ${a}َّ${l}ْ`;
      const muBase = `ُ${f}َ${a}ِّ${l}`;
      const muSukun = `ُ${f}َ${a}ِّ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 3. باب مفاعلة (فاعَلَ يُفاعِلُ)
    if (babId === "mufa'alah") {
      const mBase = `${f}ا${a}َ${l}`;
      const mSukun = `${f}ا${a}َ${l}ْ`;
      const muBase = `ُ${f}ا${a}ِ${l}`;
      const muSukun = `ُ${f}ا${a}ِ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 4. باب تفعّل (تَفَعَّلَ يَتَفَعَّلُ)
    if (babId === "tafa''ul") {
      const mBase = `تَ${f}َ${a}َّ${l}`;
      const mSukun = `تَ${f}َ${a}َّ${l}ْ`;
      const muBase = `َتَ${f}َ${a}َّ${l}`;
      const muSukun = `َتَ${f}َ${a}َّ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 5. باب تفاعل (تَفاعَلَ يَتَفاعَلُ)
    if (babId === "tafa'ul") {
      const mBase = `تَ${f}ا${a}َ${l}`;
      const mSukun = `تَ${f}ا${a}َ${l}ْ`;
      const muBase = `َتَ${f}ا${a}َ${l}`;
      const muSukun = `َتَ${f}ا${a}َ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 6. باب افتعال (اِفْتَعَلَ يَفْتَعِلُ)
    if (babId === "ifti'al") {
      const mBase = `اِ${f}ْ${a === 'ت' ? 'تّ' : 'تَ' + a}َ${l}`;
      const mSukun = `اِ${f}ْ${a === 'ت' ? 'تّ' : 'تَ' + a}َ${l}ْ`;
      const muBase = `َ${f}ْ${a === 'ت' ? 'تّ' : 'تَ' + a}ِ${l}`;
      const muSukun = `َ${f}ْ${a === 'ت' ? 'تّ' : 'تَ' + a}ِ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 7. باب انفعال (اِنْفَعَلَ يَنْفَعِلُ)
    if (babId === "infi'al") {
      const mBase = `اِنْ${f}َ${a}َ${l}`;
      const mSukun = `اِنْ${f}َ${a}َ${l}ْ`;
      const muBase = `َنْ${f}َ${a}ِ${l}`;
      const muSukun = `َنْ${f}َ${a}ِ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // 8. باب استفعال (اِسْتَفْعَلَ يَسْتَفْعِلُ)
    if (babId === "istif'al") {
      const mBase = `اِسْتَ${f}ْ${a}َ${l}`;
      const mSukun = `اِسْتَ${f}ْ${a}َ${l}ْ`;
      const muBase = `َسْتَ${f}ْ${a}ِ${l}`;
      const muSukun = `َسْتَ${f}ْ${a}ِ${l}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }
  }

  // 4 letters (رباعی)
  if (parts.length === 4) {
    const [f, a, l1, l2] = parts;

    // رباعی مجرد (فَعْلَلَ يُفَعْلِلُ)
    if (babId === 'rubai_mujarrad') {
      const mBase = `${f}َ${a}ْ${l1}َ${l2}`;
      const mSukun = `${f}َ${a}ْ${l1}َ${l2}ْ`;
      const muBase = `ُ${f}َ${a}ْ${l1}ِ${l2}`;
      const muSukun = `ُ${f}َ${a}ْ${l1}ِ${l2}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }

    // رباعی مزید - تفعلل (تَفَعْلَلَ يَتَفَعْلَلُ)
    if (babId === "tafa'lul") {
      const mBase = `تَ${f}َ${a}ْ${l1}َ${l2}`;
      const mSukun = `تَ${f}َ${a}ْ${l1}َ${l2}ْ`;
      const muBase = `َتَ${f}َ${a}ْ${l1}َ${l2}`;
      const muSukun = `َتَ${f}َ${a}ْ${l1}َ${l2}ْ`;

      return {
        madi: [
          `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
          `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
          `${mSukun}تُ`, `${mSukun}نا`
        ],
        mudari: [
          `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
          `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
          `أ${muBase}ُ`, `ن${muBase}ُ`
        ]
      };
    }
  }

  return null;
}

/**
 * Generate 14 Negative Passive Imperative (نهی مجهول) forms
 * e.g. لا يُنْصَرْ (نباید یاری شود)
 */
export function generateNahyMajhul(mudariMajhul: string[]): string[] {
  return generateNahy(mudariMajhul);
}

/**
 * Generate 14 Negative Past (نفی ماضی با ما نافیه)
 * e.g. ما نَصَرَ (یاری نکرد)
 */
export function generateNafyMadi(madi: string[]): string[] {
  return madi.map((f) => `ما ${f}`);
}

/**
 * Generate 14 Negative Present (نفی مضارع با لا نافیه غیرجازمه)
 * e.g. لا يَنْصُرُ (یاری نمی‌کند)
 */
export function generateNafyMudari(mudari: string[]): string[] {
  return mudari.map((f) => `لا ${f}`);
}

/**
 * Generate 14 Negative Passive Past (نفی ماضی مجهول)
 * e.g. ما نُصِرَ (یاری نشد)
 */
export function generateNafyMadiMajhul(madiMajhul: string[]): string[] {
  return madiMajhul.map((f) => `ما ${f}`);
}

/**
 * Generate 14 Negative Passive Present (نفی مضارع مجهول)
 * e.g. لا يُنْصَرُ (یاری نمی‌شود)
 */
export function generateNafyMudariMajhul(mudariMajhul: string[]): string[] {
  return mudariMajhul.map((f) => `لا ${f}`);
}

/**
 * Generate 14 Negative Imperative (نهی) forms from active present (مضارع)
 * Applies classical Arabic jazm rules:
 * - 5 singular/first person forms: drop final damma -> sukun
 * - 7 five-verb forms: drop final noon
 * - 2 feminine plural forms: keep noon al-niswah
 */
export function generateNahy(mudari: string[]): string[] {
  return mudari.map((form, idx) => {
    // 5 forms ending with damma: 0 (هُوَ), 3 (هِيَ), 6 (أَنْتَ), 12 (أَنَا), 13 (نَحْنُ)
    if (idx === 0 || idx === 3 || idx === 6 || idx === 12 || idx === 13) {
      const stem = form.replace(/ُ$/, 'ْ');
      return `لا ${stem}`;
    }

    // 2 dual masculine (1, 7) and 2 dual feminine (4, 10): drop نِ
    if (idx === 1 || idx === 4 || idx === 7 || idx === 10) {
      const stem = form.replace(/نِ$/, '');
      return `لا ${stem}`;
    }

    // 2 plural masculine (2, 8): drop نَ and add الف فارقة
    if (idx === 2 || idx === 8) {
      const stem = form.replace(/نَ$/, 'ا');
      return `لا ${stem}`;
    }

    // 1 singular feminine mukhatebah (9): drop نَ
    if (idx === 9) {
      const stem = form.replace(/نَ$/, '');
      return `لا ${stem}`;
    }

    // 2 plural feminine (5, 11): keep نون النسوة (مبنية)
    return `لا ${form}`;
  });
}

/**
 * Generate 14 Imperative (امر) forms:
 * - 6 forms for Mukhateb (امر حاضر): ص ۷ تا ۱۲
 * - 8 forms for Ghayeb & Mutakallem with Lam of Imperative (امر به لام): ص ۱ تا ۶، ۱۳، ۱۴
 */
export function generateAmr(
  madi: string[],
  mudari: string[],
  babId: BabId,
  root: string,
  ainMudariHarakah: 'َ' | 'ِ' | 'ُ' = 'َ'
): string[] {
  const parts = root.trim().split(/\s+/);
  const nahyForms = generateNahy(mudari); // Get jazm forms (stripped of "لا ")

  const amrForms: string[] = [];

  for (let idx = 0; idx < 14; idx++) {
    const jazmRaw = nahyForms[idx].replace(/^لا\s+/, '');

    // 1. امر به لام برای غائب (ص ۱ تا ۶) و متکلم (ص ۱۳ و ۱۴)
    if (idx < 6 || idx >= 12) {
      amrForms.push(`لِ${jazmRaw}`);
      continue;
    }

    // 2. امر حاضر برای مخاطب (ص ۷ تا ۱۲)
    if (parts.length === 3) {
      const [f, a, l] = parts;

      // ثلاثی مجرد
      if (babId.startsWith('mujarrad')) {
        // Strip prefix تَـ
        const stemWithoutTa = jazmRaw.replace(/^تَـ?|^تُـ?/, '');
        // Prefix hamzat al-wasl: مضمومة if ain is damma, else مکسورة
        const hamzah = ainMudariHarakah === 'ُ' ? 'اُ' : 'اِ';
        amrForms.push(`${hamzah}${stemWithoutTa}`);
        continue;
      }

      // إفعال: أَکْرِمْ
      if (babId === "if'al") {
        const stemWithoutTu = jazmRaw.replace(/^تُـ?/, '');
        amrForms.push(`أَ${stemWithoutTu}`);
        continue;
      }

      // تفعيل: عَلِّمْ
      if (babId === "taf'il") {
        const stemWithoutTu = jazmRaw.replace(/^تُـ?/, '');
        amrForms.push(stemWithoutTu);
        continue;
      }

      // مفاعلة: قاتِلْ
      if (babId === "mufa'alah") {
        const stemWithoutTu = jazmRaw.replace(/^تُـ?/, '');
        amrForms.push(stemWithoutTu);
        continue;
      }

      // تفعّل: تَعَلَّمْ
      if (babId === "tafa''ul") {
        amrForms.push(jazmRaw); // Starts with ت already (تَتَعَلَّمْ -> تَعَلَّمْ)
        continue;
      }

      // تفاعل: تَقابَلْ
      if (babId === "tafa'ul") {
        amrForms.push(jazmRaw);
        continue;
      }

      // افتعال: اِجْتَمِعْ
      if (babId === "ifti'al") {
        const stemWithoutTa = jazmRaw.replace(/^تَـ?/, '');
        amrForms.push(`اِ${stemWithoutTa}`);
        continue;
      }

      // انفعال: اِنْکَسِرْ
      if (babId === "infi'al") {
        const stemWithoutTa = jazmRaw.replace(/^تَـ?/, '');
        amrForms.push(`اِ${stemWithoutTa}`);
        continue;
      }

      // استفعال: اِسْتَغْفِرْ
      if (babId === "istif'al") {
        const stemWithoutTa = jazmRaw.replace(/^تَـ?/, '');
        amrForms.push(`اِ${stemWithoutTa}`);
        continue;
      }
    }

    // رباعی مجرد: دَحْرِجْ
    if (babId === 'rubai_mujarrad') {
      const stemWithoutTu = jazmRaw.replace(/^تُـ?/, '');
      amrForms.push(stemWithoutTu);
      continue;
    }

    // رباعی تفعلل: تَدَحْرَجْ
    if (babId === "tafa'lul") {
      amrForms.push(jazmRaw);
      continue;
    }

    // Default fallback
    amrForms.push(`لِ${jazmRaw}`);
  }

  return amrForms;
}

/**
 * Generate 14 Passive Past (ماضی مجهول) forms:
 * فُعِلَ، أُفْعِلَ، فُعِّلَ، فُوعِلَ...
 */
export function generateMadiMajhul(root: string, babId: BabId): string[] | null {
  const parts = root.trim().split(/\s+/);

  // Verbs of bab 5 (حَسُنَ) and infi'al (انفعال) are intrinsically intransitive (لازم) and have no passive!
  if (babId === 'mujarrad_hasuna' || babId === "infi'al" || babId === 'if\'ilal' || babId === 'if\'i\'al') {
    return null;
  }

  if (parts.length === 3) {
    const [f, a, l] = parts;

    let mBase = '';
    let mSukun = '';

    if (babId.startsWith('mujarrad')) {
      // فُعِلَ
      mBase = `${f}ُ${a}ِ${l}`;
      mSukun = `${f}ُ${a}ِ${l}ْ`;
    } else if (babId === "if'al") {
      // أُفْعِلَ
      mBase = `أُ${f}ْ${a}ِ${l}`;
      mSukun = `أُ${f}ْ${a}ِ${l}ْ`;
    } else if (babId === "taf'il") {
      // فُعِّلَ
      mBase = `${f}ُ${a}ِّ${l}`;
      mSukun = `${f}ُ${a}ِّ${l}ْ`;
    } else if (babId === "mufa'alah") {
      // فُوعِلَ
      mBase = `${f}ُو${a}ِ${l}`;
      mSukun = `${f}ُو${a}ِ${l}ْ`;
    } else if (babId === "tafa''ul") {
      // تُفُعِّلَ
      mBase = `تُ${f}ُ${a}ِّ${l}`;
      mSukun = `تُ${f}ُ${a}ِّ${l}ْ`;
    } else if (babId === "tafa'ul") {
      // تُفُوعِلَ
      mBase = `تُ${f}ُو${a}ِ${l}`;
      mSukun = `تُ${f}ُو${a}ِ${l}ْ`;
    } else if (babId === "ifti'al") {
      // اُفْتُعِلَ
      mBase = `اُ${f}ْ${a === 'ت' ? 'تُّ' : 'تُ' + a}ِ${l}`;
      mSukun = `اُ${f}ْ${a === 'ت' ? 'تُّ' : 'تُ' + a}ِ${l}ْ`;
    } else if (babId === "istif'al") {
      // اُسْتُفْعِلَ
      mBase = `اُسْتُ${f}ْ${a}ِ${l}`;
      mSukun = `اُسْتُ${f}ْ${a}ِ${l}ْ`;
    } else {
      return null;
    }

    return [
      `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
      `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
      `${mSukun}تُ`, `${mSukun}نا`
    ];
  }

  if (parts.length === 4 && babId === 'rubai_mujarrad') {
    const [f, a, l1, l2] = parts;
    const mBase = `${f}ُ${a}ْ${l1}ِ${l2}`;
    const mSukun = `${f}ُ${a}ْ${l1}ِ${l2}ْ`;
    return [
      `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mSukun}نَ`,
      `${mSukun}تَ`, `${mSukun}تُما`, `${mSukun}تُمْ`, `${mSukun}تِ`, `${mSukun}تُما`, `${mSukun}تُنَّ`,
      `${mSukun}تُ`, `${mSukun}نا`
    ];
  }

  return null;
}

/**
 * Generate 14 Passive Present (مضارع مجهول) forms:
 * يُفْعَلُ، يُکْرَمُ، يُعَلَّمُ، يُقاتَلُ...
 */
export function generateMudariMajhul(root: string, babId: BabId): string[] | null {
  const parts = root.trim().split(/\s+/);

  if (babId === 'mujarrad_hasuna' || babId === "infi'al" || babId === 'if\'ilal' || babId === 'if\'i\'al') {
    return null;
  }

  if (parts.length === 3) {
    const [f, a, l] = parts;

    let muBase = '';
    let muSukun = '';

    if (babId.startsWith('mujarrad') || babId === "if'al") {
      // يُفْعَلُ / يُکْرَمُ
      muBase = `ُ${f}ْ${a}َ${l}`;
      muSukun = `ُ${f}ْ${a}َ${l}ْ`;
    } else if (babId === "taf'il") {
      // يُعَلَّمُ
      muBase = `ُ${f}َ${a}َّ${l}`;
      muSukun = `ُ${f}َ${a}َّ${l}ْ`;
    } else if (babId === "mufa'alah") {
      // يُقاتَلُ
      muBase = `ُ${f}ا${a}َ${l}`;
      muSukun = `ُ${f}ا${a}َ${l}ْ`;
    } else if (babId === "tafa''ul") {
      // يُتَعَلَّمُ
      muBase = `ُتَ${f}َ${a}َّ${l}`;
      muSukun = `ُتَ${f}َ${a}َّ${l}ْ`;
    } else if (babId === "tafa'ul") {
      // يُتَقابَلُ
      muBase = `ُتَ${f}ا${a}َ${l}`;
      muSukun = `ُتَ${f}ا${a}َ${l}ْ`;
    } else if (babId === "ifti'al") {
      // يُجْتَمَعُ
      muBase = `ُ${f}ْ${a === 'ت' ? 'تّ' : 'تَ' + a}َ${l}`;
      muSukun = `ُ${f}ْ${a === 'ت' ? 'تّ' : 'تَ' + a}َ${l}ْ`;
    } else if (babId === "istif'al") {
      // يُسْتَغْفَرُ
      muBase = `ُسْتَ${f}ْ${a}َ${l}`;
      muSukun = `ُسْتَ${f}ْ${a}َ${l}ْ`;
    } else {
      return null;
    }

    return [
      `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
      `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
      `أ${muBase}ُ`, `ن${muBase}ُ`
    ];
  }

  if (parts.length === 4 && babId === 'rubai_mujarrad') {
    const [f, a, l1, l2] = parts;
    const muBase = `ُ${f}َ${a}ْ${l1}َ${l2}`;
    const muSukun = `ُ${f}َ${a}ْ${l1}َ${l2}ْ`;
    return [
      `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muSukun}نَ`,
      `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBase}ينَ`, `ت${muBase}انِ`, `ت${muSukun}نَ`,
      `أ${muBase}ُ`, `ن${muBase}ُ`
    ];
  }

  return null;
}

/**
 * Generate 14 active, passive, amr & nahy forms for Triliteral Mudha'af (ثلاثی مجرد مضاعف)
 * e.g. م د د (مَدَّ يَمُدُّ), ف ر ر (فَرَّ يَفِرُّ), م س س (مَسَّ يَمَسُّ)
 */
export function generateMudaafMujarrad(
  root: string,
  ainMadi: 'َ' | 'ِ' | 'ُ',
  ainMudari: 'َ' | 'ِ' | 'ُ'
): FullConjugationSet {
  const parts = root.trim().split(/\s+/);
  const f = parts[0];
  const l = parts[parts.length - 1]; // Geminate letter

  // Past Active (ماضی معلوم)
  // صیغه‌های ۱ تا ۵ با ادغام واجب: مَدَّ، مَدَّا، مَدُّوا، مَدَّتْ، مَدَّتا
  // صیغه‌های ۶ تا ۱۴ با فک ادغام: مَدَدْنَ، مَدَدْتَ، مَدَدْتُما...
  const madiBaseMerged = `${f}َ${l}َّ`;
  const madiBaseFakk = ainMadi === 'ِ' ? `${f}َ${l}ِ${l}ْ` : ainMadi === 'ُ' ? `${f}َ${l}ُ${l}ْ` : `${f}َ${l}َ${l}ْ`;

  const madi = [
    `${madiBaseMerged}َ`, // 1. هُوَ مَدَّ
    `${madiBaseMerged}ا`, // 2. هُما مَدَّا
    `${madiBaseMerged}ُوا`, // 3. هُمْ مَدُّوا
    `${madiBaseMerged}َتْ`, // 4. هِيَ مَدَّتْ
    `${madiBaseMerged}َتا`, // 5. هُما مَدَّتا
    `${madiBaseFakk}نَ`, // 6. هُنَّ مَدَدْنَ
    `${madiBaseFakk}تَ`, // 7. أَنْتَ مَدَدْتَ
    `${madiBaseFakk}تُما`, // 8. أَنْتُما مَدَدْتُما
    `${madiBaseFakk}تُمْ`, // 9. أَنْتُمْ مَدَدْتُمْ
    `${madiBaseFakk}تِ`, // 10. أَنْتِ مَدَدْتِ
    `${madiBaseFakk}تُما`, // 11. أَنْتُما مَدَدْتُما
    `${madiBaseFakk}تُنَّ`, // 12. أَنْتُنَّ مَدَدْتُنَّ
    `${madiBaseFakk}تُ`, // 13. أَنَا مَدَدْتُ
    `${madiBaseFakk}نا`, // 14. نَحْنُ مَدَدْنا
  ];

  // Present Active (مضارع معلوم)
  // ص ۱ تا ۵ و ۷ تا ۱۱ و ۱۳ و ۱۴: ادغام واجب (يَمُدُّ، يَمُدَّانِ، يَمُدُّونَ...)
  // ص ۶ و ۱۲: فک ادغام واجب (يَمْدُدْنَ، تَمْدُدْنَ)
  let muVowel = ainMudari;
  let muMergedPrefix = `${f}${muVowel}${l}َّ`;
  let muFakkStem = `${f}ْ${l}${muVowel}${l}ْ`;

  const mudari = [
    `يَ${muMergedPrefix}ُ`, // 1. يَمُدُّ
    `يَ${muMergedPrefix}انِ`, // 2. يَمُدَّانِ
    `يَ${muMergedPrefix}ونَ`, // 3. يَمُدُّونَ
    `تَ${muMergedPrefix}ُ`, // 4. تَمُدُّ
    `تَ${muMergedPrefix}انِ`, // 5. تَمُدَّانِ
    `يَ${muFakkStem}نَ`, // 6. يَمْدُدْنَ
    `تَ${muMergedPrefix}ُ`, // 7. تَمُدُّ
    `تَ${muMergedPrefix}انِ`, // 8. تَمُدَّانِ
    `تَ${muMergedPrefix}ونَ`, // 9. تَمُدُّونَ
    `تَ${f}${muVowel}${l}ِّينَ`, // 10. تَمُدِّينَ
    `تَ${muMergedPrefix}انِ`, // 11. تَمُدَّانِ
    `تَ${muFakkStem}نَ`, // 12. تَمْدُدْنَ
    `أَ${muMergedPrefix}ُ`, // 13. أَمُدُّ
    `نَ${muMergedPrefix}ُ`, // 14. نَمُدُّ
  ];

  // Past Passive (ماضی مجهول)
  // ص ۱ تا ۵: مُدَّ / ص ۶ تا ۱۴: مُدِدْنَ
  const madiMajhulBase = `مُ${l}َّ`;
  const madiMajhulFakk = `${f}ُ${l}ِ${l}ْ`;
  const madiMajhul = [
    `${f}ُ${l}ََّ`,
    `${f}ُ${l}َّا`,
    `${f}ُ${l}َُّوا`,
    `${f}ُ${l}ََّتْ`,
    `${f}ُ${l}ََّتا`,
    `${madiMajhulFakk}نَ`,
    `${madiMajhulFakk}تَ`,
    `${madiMajhulFakk}تُما`,
    `${madiMajhulFakk}تُمْ`,
    `${madiMajhulFakk}تِ`,
    `${madiMajhulFakk}تُما`,
    `${madiMajhulFakk}تُنَّ`,
    `${madiMajhulFakk}تُ`,
    `${madiMajhulFakk}نا`,
  ];

  // Present Passive (مضارع مجهول)
  // ص ۱ تا ۵: يُمَدُّ / ص ۶: يُمْدَدْنَ / ص ۱۲: تُمْدَدْنَ
  const mudariMajhulBase = `${f}َ${l}َّ`;
  const mudariMajhulFakk = `${f}ْ${l}َ${l}ْ`;
  const mudariMajhul = [
    `يُ${mudariMajhulBase}ُ`,
    `يُ${mudariMajhulBase}انِ`,
    `يُ${mudariMajhulBase}ونَ`,
    `تُ${mudariMajhulBase}ُ`,
    `تُ${mudariMajhulBase}انِ`,
    `يُ${mudariMajhulFakk}نَ`,
    `تُ${mudariMajhulBase}ُ`,
    `تُ${mudariMajhulBase}انِ`,
    `تُ${mudariMajhulBase}ونَ`,
    `تُ${f}َ${l}ِّينَ`,
    `تُ${mudariMajhulBase}انِ`,
    `تُ${mudariMajhulFakk}نَ`,
    `أُ${mudariMajhulBase}ُ`,
    `نُ${mudariMajhulBase}ُ`,
  ];

  // Amr (امر)
  // امر مخاطب (ص ۷ تا ۱۲): مُدَّ، مُدَّا، مُدُّوا، مُدِّي، مُدَّا، اُُمْدُدْنَ
  const amrPrefixHader = `${f}${muVowel}${l}َّ`;
  const hamzahAmr = muVowel === 'ُ' ? 'اُ' : 'اِ';
  const amr = [
    `لِيَ${muMergedPrefix}َ`, // 1
    `لِيَ${muMergedPrefix}انِ`,
    `لِيَ${muMergedPrefix}ونَ`,
    `لِتَ${muMergedPrefix}َ`,
    `لِتَ${muMergedPrefix}انِ`,
    `لِيَ${muFakkStem}نَ`,
    `${amrPrefixHader}َ`, // 7. مُدَّ / فِرَّ / مَسَّ
    `${amrPrefixHader}ا`, // 8. مُدَّا
    `${amrPrefixHader}ُوا`, // 9. مُدُّوا
    `${f}${muVowel}${l}ِّي`, // 10. مُدِّي
    `${amrPrefixHader}ا`, // 11. مُدَّا
    `${hamzahAmr}${muFakkStem}نَ`, // 12. اُُمْدُدْنَ / اِفْرِرْنَ / اِمْسَسْنَ
    `لِأَ${muMergedPrefix}َ`,
    `لِنَ${muMergedPrefix}َ`,
  ];

  // Nahy (نهی)
  const nahy = [
    `لا يَ${muMergedPrefix}َ`,
    `لا يَ${muMergedPrefix}ا`,
    `لا يَ${muMergedPrefix}وا`,
    `لا تَ${muMergedPrefix}َ`,
    `لا تَ${muMergedPrefix}ا`,
    `لا يَ${muFakkStem}نَ`,
    `لا تَ${muMergedPrefix}َ`,
    `لا تَ${muMergedPrefix}ا`,
    `لا تَ${muMergedPrefix}وا`,
    `لا تَ${f}${muVowel}${l}ِي`,
    `لا تَ${muMergedPrefix}ا`,
    `لا تَ${muFakkStem}نَ`,
    `لا أَ${muMergedPrefix}َ`,
    `لا نَ${muMergedPrefix}َ`,
  ];

  return { madi, mudari, amr, nahy, madiMajhul, mudariMajhul };
}

/**
 * Generate 14 active, passive, amr & nahy forms for Augmented Mudha'af (ثلاثی مزید مضاعف)
 * e.g. أَمَدَّ يُمِدُّ (إفعال)، اِمْتَدَّ يَمْتَدُّ (افتعال)، اِنْشَقَّ يَنْشَقُّ (انفعال)، اِسْتَمَدَّ يَسْتَمِدُّ (استفعال)
 */
export function generateMudaafAugmented(root: string, babId: BabId): FullConjugationSet | null {
  const parts = root.trim().split(/\s+/);
  const f = parts[0];
  const l = parts[parts.length - 1];

  let mBase = '';
  let mFakk = '';
  let muBase = '';
  let muFakk = '';
  let amr7 = '';
  let amr12 = '';

  if (babId === "if'al") {
    // إفعال: أَمَدَّ - يُمِدُّ
    mBase = `أَ${f}َ${l}َّ`;
    mFakk = `أَ${f}ْ${l}َ${l}ْ`;
    muBase = `ُ${f}ِ${l}َّ`;
    muFakk = `ُ${f}ْ${l}ِ${l}ْ`;
    amr7 = `أَ${f}ِ${l}َّ`;
    amr12 = `أَ${f}ْ${l}ِ${l}ْنَ`;
  } else if (babId === "ifti'al") {
    // افتعال: اِمْتَدَّ - يَمْتَدُّ
    mBase = `اِ${f}ْتَ${l}َّ`;
    mFakk = `اِ${f}ْتَ${l}َ${l}ْ`;
    muBase = `َ${f}ْتَ${l}َّ`;
    muFakk = `َ${f}ْتَ${l}ِ${l}ْ`;
    amr7 = `اِ${f}ْتَ${l}َّ`;
    amr12 = `اِ${f}ْتَ${l}ِ${l}ْنَ`;
  } else if (babId === "infi'al") {
    // انفعال: اِنْشَقَّ - يَنْشَقُّ
    mBase = `اِنْ${f}َ${l}َّ`;
    mFakk = `اِنْ${f}َ${l}َ${l}ْ`;
    muBase = `َنْ${f}َ${l}َّ`;
    muFakk = `َنْ${f}َ${l}ِ${l}ْ`;
    amr7 = `اِنْ${f}َ${l}َّ`;
    amr12 = `اِنْ${f}َ${l}ِ${l}ْنَ`;
  } else if (babId === "istif'al") {
    // استفعال: اِسْتَمَدَّ - يَسْتَمِدُّ
    mBase = `اِسْتَ${f}َ${l}َّ`;
    mFakk = `اِسْتَ${f}ْ${l}َ${l}ْ`;
    muBase = `َسْتَ${f}ِ${l}َّ`;
    muFakk = `َسْتَ${f}ْ${l}ِ${l}ْ`;
    amr7 = `اِسْتَ${f}ِ${l}َّ`;
    amr12 = `اِسْتَ${f}ْ${l}ِ${l}ْنَ`;
  } else if (babId === "mufa'alah") {
    // مفاعلة: حَاجَّ - يُحَاجُّ
    mBase = `${f}ا${l}َّ`;
    mFakk = `${f}ا${l}َ${l}ْ`;
    muBase = `ُ${f}ا${l}َّ`;
    muFakk = `ُ${f}ا${l}ِ${l}ْ`;
    amr7 = `${f}ا${l}َّ`;
    amr12 = `${f}ا${l}ِ${l}ْنَ`;
  } else if (babId === "tafa'ul") {
    // تفاعل: تَمَاسَّ - يَتَمَاسُّ
    mBase = `تَ${f}ا${l}َّ`;
    mFakk = `تَ${f}ا${l}َ${l}ْ`;
    muBase = `َتَ${f}ا${l}َّ`;
    muFakk = `َتَ${f}ا${l}َ${l}ْ`;
    amr7 = `تَ${f}ا${l}َّ`;
    amr12 = `تَ${f}ا${l}َ${l}ْنَ`;
  } else if (babId === "if'ilal") {
    // افعلال: اِحْمَرَّ - يَحْمَرُّ
    mBase = `اِ${f}ْ${l}َ${l}َّ`;
    mFakk = `اِ${f}ْ${l}َ${l}َ${l}ْ`;
    muBase = `َ${f}ْ${l}َ${l}َّ`;
    muFakk = `َ${f}ْ${l}َ${l}ِ${l}ْ`;
    amr7 = `اِ${f}ْ${l}َ${l}َّ`;
    amr12 = `اِ${f}ْ${l}َ${l}ِ${l}ْنَ`;
  } else {
    return null;
  }

  const muBaseKasrah = muBase.replace(/َّ$/, 'ِّ');
  const amr7Kasrah = amr7.replace(/َّ$/, 'ِّ');

  const madi = [
    `${mBase}َ`, `${mBase}ا`, `${mBase}ُوا`, `${mBase}َتْ`, `${mBase}َتا`, `${mFakk}نَ`,
    `${mFakk}تَ`, `${mFakk}تُما`, `${mFakk}تُمْ`, `${mFakk}تِ`, `${mFakk}تُما`, `${mFakk}تُنَّ`,
    `${mFakk}تُ`, `${mFakk}نا`
  ];

  const mudari = [
    `ي${muBase}ُ`, `ي${muBase}انِ`, `ي${muBase}ونَ`, `ت${muBase}ُ`, `ت${muBase}انِ`, `ي${muFakk}نَ`,
    `ت${muBase}ُ`, `ت${muBase}انِ`, `ت${muBase}ونَ`, `ت${muBaseKasrah}ينَ`, `ت${muBase}انِ`, `ت${muFakk}نَ`,
    `أ${muBase}ُ`, `ن${muBase}ُ`
  ];

  const amr = [
    `لِي${muBase}َ`, `لِي${muBase}انِ`, `لِي${muBase}ونَ`, `لِت${muBase}َ`, `لِت${muBase}انِ`, `لِي${muFakk}نَ`,
    `${amr7}َ`, `${amr7}ا`, `${amr7}ُوا`, `${amr7Kasrah}ي`, `${amr7}ا`, `${amr12}`,
    `لِأ${muBase}َ`, `لِن${muBase}َ`
  ];

  const nahy = [
    `لا ي${muBase}َ`, `لا ي${muBase}ا`, `لا ي${muBase}وا`, `لا ت${muBase}َ`, `لا ت${muBase}ا`, `لا ي${muFakk}نَ`,
    `لا ت${muBase}َ`, `لا ت${muBase}ا`, `لا ت${muBase}وا`, `لا ت${muBaseKasrah}ي`, `لا ت${muBase}ا`, `لا ت${muFakk}نَ`,
    `لا أ${muBase}َ`, `لا ن${muBase}َ`
  ];

  let madiMajhul: string[] | undefined;
  let mudariMajhul: string[] | undefined;

  if (babId === "if'al") {
    const majBase = `أُ${f}ِ${l}َّ`;
    const majFakk = `أُ${f}ْ${l}ِ${l}ْ`;
    madiMajhul = [
      `${majBase}َ`, `${majBase}ا`, `${majBase}ُوا`, `${majBase}َتْ`, `${majBase}َتا`, `${majFakk}نَ`,
      `${majFakk}تَ`, `${majFakk}تُما`, `${majFakk}تُمْ`, `${majFakk}تِ`, `${majFakk}تُما`, `${majFakk}تُنَّ`,
      `${majFakk}تُ`, `${majFakk}نا`
    ];
    const muMajBase = `ُ${f}َ${l}َّ`;
    const muMajFakk = `ُ${f}ْ${l}َ${l}ْ`;
    const muMajKasrah = `ُ${f}َ${l}ِّ`;
    mudariMajhul = [
      `ي${muMajBase}ُ`, `ي${muMajBase}انِ`, `ي${muMajBase}ونَ`, `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ي${muMajFakk}نَ`,
      `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ت${muMajBase}ونَ`, `ت${muMajKasrah}ينَ`, `ت${muMajBase}انِ`, `ت${muMajFakk}نَ`,
      `أ${muMajBase}ُ`, `ن${muMajBase}ُ`
    ];
  } else if (babId === "istif'al") {
    const majBase = `اُسْتُ${f}ِ${l}َّ`;
    const majFakk = `اُسْتُ${f}ْ${l}ِ${l}ْ`;
    madiMajhul = [
      `${majBase}َ`, `${majBase}ا`, `${majBase}ُوا`, `${majBase}َتْ`, `${majBase}َتا`, `${majFakk}نَ`,
      `${majFakk}تَ`, `${majFakk}تُما`, `${majFakk}تُمْ`, `${majFakk}تِ`, `${majFakk}تُما`, `${majFakk}تُنَّ`,
      `${majFakk}تُ`, `${majFakk}نا`
    ];
    const muMajBase = `ُسْتَ${f}َ${l}َّ`;
    const muMajFakk = `ُسْتَ${f}ْ${l}َ${l}ْ`;
    const muMajKasrah = `ُسْتَ${f}َ${l}ِّ`;
    mudariMajhul = [
      `ي${muMajBase}ُ`, `ي${muMajBase}انِ`, `ي${muMajBase}ونَ`, `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ي${muMajFakk}نَ`,
      `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ت${muMajBase}ونَ`, `ت${muMajKasrah}ينَ`, `ت${muMajBase}انِ`, `ت${muMajFakk}نَ`,
      `أ${muMajBase}ُ`, `ن${muMajBase}ُ`
    ];
  } else if (babId === "mufa'alah") {
    const majBase = `${f}ُو${l}َّ`;
    const majFakk = `${f}ُو${l}ِ${l}ْ`;
    madiMajhul = [
      `${majBase}َ`, `${majBase}ا`, `${majBase}ُوا`, `${majBase}َتْ`, `${majBase}َتا`, `${majFakk}نَ`,
      `${majFakk}تَ`, `${majFakk}تُما`, `${majFakk}تُمْ`, `${majFakk}تِ`, `${majFakk}تُما`, `${majFakk}تُنَّ`,
      `${majFakk}تُ`, `${majFakk}نا`
    ];
    const muMajBase = `ُ${f}ا${l}َّ`;
    const muMajFakk = `ُ${f}ا${l}َ${l}ْ`;
    const muMajKasrah = `ُ${f}ا${l}ِّ`;
    mudariMajhul = [
      `ي${muMajBase}ُ`, `ي${muMajBase}انِ`, `ي${muMajBase}ونَ`, `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ي${muMajFakk}نَ`,
      `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ت${muMajBase}ونَ`, `ت${muMajKasrah}ينَ`, `ت${muMajBase}انِ`, `ت${muMajFakk}نَ`,
      `أ${muMajBase}ُ`, `ن${muMajBase}ُ`
    ];
  } else if (babId === "ifti'al") {
    const majBase = `اُ${f}ْتُ${l}َّ`;
    const majFakk = `اُ${f}ْتُ${l}ِ${l}ْ`;
    madiMajhul = [
      `${majBase}َ`, `${majBase}ا`, `${majBase}ُوا`, `${majBase}َتْ`, `${majBase}َتا`, `${majFakk}نَ`,
      `${majFakk}تَ`, `${majFakk}تُما`, `${majFakk}تُمْ`, `${majFakk}تِ`, `${majFakk}تُما`, `${majFakk}تُنَّ`,
      `${majFakk}تُ`, `${majFakk}نا`
    ];
    const muMajBase = `ُ${f}ْتَ${l}َّ`;
    const muMajFakk = `ُ${f}ْتَ${l}َ${l}ْ`;
    const muMajKasrah = `ُ${f}ْتَ${l}ِّ`;
    mudariMajhul = [
      `ي${muMajBase}ُ`, `ي${muMajBase}انِ`, `ي${muMajBase}ونَ`, `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ي${muMajFakk}نَ`,
      `ت${muMajBase}ُ`, `ت${muMajBase}انِ`, `ت${muMajBase}ونَ`, `ت${muMajKasrah}ينَ`, `ت${muMajBase}انِ`, `ت${muMajFakk}نَ`,
      `أ${muMajBase}ُ`, `ن${muMajBase}ُ`
    ];
  }

  return { madi, mudari, amr, nahy, madiMajhul, mudariMajhul };
}

