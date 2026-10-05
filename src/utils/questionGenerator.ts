import { BabId, Question, QuestionType, SeeghehInfo, VerbConjugation } from '../types/sarf';
import { ABWAB_LIST, SEEGHEHS, VERB_LIBRARY, getBabById, getSeeghehByIndex } from '../data/abwab';
import { COMPREHENSIVE_NOUN_LIBRARY, NounDerivative } from '../data/nounLibrary';
import { conjugatePersianVerb } from './persianConjugator';

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate smart distractor options for single-player multiple choice
function generateDistractors(
  correctForm: string,
  verb: VerbConjugation,
  targetIndex: number, // 0 to 13
  tense: 'madi' | 'mudari'
): string[] {
  const targetForms = tense === 'madi' ? verb.madi : verb.mudari;
  const pool: string[] = [];

  // Add adjacent seeghehs
  [-1, 1, -2, 2, 3, -3].forEach((offset) => {
    const idx = targetIndex + offset;
    if (idx >= 0 && idx < 14 && targetForms[idx] !== correctForm) {
      pool.push(targetForms[idx]);
    }
  });

  // Add opposite tense counterpart
  const oppositeForms = tense === 'madi' ? verb.mudari : verb.madi;
  if (oppositeForms[targetIndex] && oppositeForms[targetIndex] !== correctForm) {
    pool.push(oppositeForms[targetIndex]);
  }

  // Add other verbs in same tense and index if available
  VERB_LIBRARY.forEach((other) => {
    if (other.root !== verb.root) {
      const otherForms = tense === 'madi' ? other.madi : other.mudari;
      if (otherForms[targetIndex] && otherForms[targetIndex] !== correctForm) {
        pool.push(otherForms[targetIndex]);
      }
    }
  });

  const unique = Array.from(new Set(pool.filter((f) => f && f !== correctForm)));
  const chosenDistractors = shuffleArray(unique).slice(0, 3);
  return shuffleArray([correctForm, ...chosenDistractors]);
}

export function generateQuestion(
  selectedBabIds: BabId[],
  selectedTypes: QuestionType[]
): Question {
  const babId = getRandomItem(selectedBabIds.length > 0 ? selectedBabIds : ABWAB_LIST.map((b) => b.id));
  const type = getRandomItem(
    selectedTypes.length > 0
      ? selectedTypes
      : ['sequential', 'reverse', 'targeted', 'tense_inversion', 'passive', 'amr', 'nahy', 'nafy', 'ism_fael', 'ism_mafool']
  );

  const matchingVerbs = VERB_LIBRARY.filter((v) => {
    if (babId === 'mujarrad') {
      return v.babId.startsWith('mujarrad');
    }
    return v.babId === babId;
  });
  const verb = matchingVerbs.length > 0 ? getRandomItem(matchingVerbs) : getRandomItem(VERB_LIBRARY);
  const bab = getBabById(verb.babId);
  const tense: 'madi' | 'mudari' = Math.random() > 0.5 ? 'madi' : 'mudari';
  const tenseNameFa = tense === 'madi' ? 'ماضی (گذشته)' : 'مضارع (حال و آینده)';
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // =========================================================================
  // A. بخش اسماء و مشتقات (Noun Morphology)
  // =========================================================================
  if (
    type === 'ism_fael' ||
    type === 'ism_mafool' ||
    type === 'sefat_moshabbahah' ||
    type === 'ism_tafdil' ||
    type === 'ism_makan_zaman' ||
    type === 'ism_ala' ||
    type === 'ism_mobalagheh' ||
    type === 'jam_taksir'
  ) {
    const matchingNouns = COMPREHENSIVE_NOUN_LIBRARY.filter((n) => n.type === type);
    const noun = matchingNouns.length > 0 ? getRandomItem(matchingNouns) : getRandomItem(COMPREHENSIVE_NOUN_LIBRARY);

    // Question subtypes:
    // 0: ساخت مشتق مستقیم از ریشه و باب
    // 1: تأنیث (مؤنث مشتق)
    // 2: تثنیه و جمع (سالم و مکسر)
    // 3: وزن‌شناسی صرفی (میزان الصرف)
    // 4: تشخیص نوع مشتق از روی کلمه
    // 5: شاهد قرآنی مشتق
    const subType = Math.floor(Math.random() * 6);

    if (subType === 0) {
      // ۱. ساخت مشتق مستقیم
      const correctForm = noun.singularMasc;
      const otherNouns = COMPREHENSIVE_NOUN_LIBRARY.filter((n) => n.id !== noun.id);
      const distractors = shuffleArray(otherNouns.map((n) => n.singularMasc)).slice(0, 3);
      const options = shuffleArray([correctForm, ...distractors]);

      return {
        id,
        type,
        babId: verb.babId,
        babName: noun.babName,
        root: noun.root,
        title: `اشتقاق و ساخت ${noun.typeNameFa}`,
        prompt: `«${noun.typeNameFa}» (مفرد مذکر) از ریشه [ ${noun.root} ] در ${noun.babName} به معنای «${noun.meaning}» کدام کلمه است؟`,
        subPrompt: `وزن قیاسی: ${noun.wazn} ${noun.quranicAyah ? `· شاهد قرآنی: ﴿ ${noun.quranicAyah} ﴾` : ''}`,
        correctAnswer: correctForm,
        options,
        explanation: `پاسخ صحیح: «${correctForm}» است. وزن آن «${noun.wazn}» می‌باشد. ${noun.ruleDescription}`,
        pedagogicalTip: `در زبان عربی مشتقات اسم (مانند فاعل، مفعول، تفضیل و مکان) بر اساس اوزان قیاسی منظم تولید می‌شوند.`,
      };
    } else if (subType === 1 && noun.singularFem) {
      // ۲. صیغه مؤنث مشتق
      const correctForm = noun.singularFem;
      const pool = [
        correctForm,
        noun.singularMasc,
        noun.dualFem || `${noun.singularMasc}انِ`,
        noun.pluralFem || `${noun.singularMasc}اتٌ`,
      ];
      const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

      return {
        id,
        type,
        babId: verb.babId,
        babName: noun.babName,
        root: noun.root,
        title: `تأنیث در ${noun.typeNameFa}`,
        prompt: `صورت «مؤنث» کلمه «${noun.singularMasc}» (${noun.typeNameFa} به معنای «${noun.meaning}») کدام گزینه است؟`,
        subPrompt: `مفرد مذکر: ${noun.singularMasc} · ریشه: [ ${noun.root} ]`,
        correctAnswer: correctForm,
        options,
        explanation: `پاسخ صحیح: «${correctForm}» است. مؤنث این کلمه بر این وزن ساخته می‌شود. ${noun.ruleDescription}`,
        pedagogicalTip: `نشانه‌های تأنیث در اسم عبارتند از: تاء تأنیث (ـَة)، الف مقصوره (ـَى در فُعْلى)، و الف ممدوده (ـاء در فَعْلاء).`,
      };
    } else if (subType === 2) {
      // ۳. پرسش تثنیه یا جمع (سالم و مکسر)
      const askPlural = Math.random() > 0.5;
      const correctForm = askPlural
        ? (noun.jamTaksir ? noun.jamTaksir.split(' ')[0] : noun.pluralMasc)
        : noun.dualMasc;
      const askTitle = askPlural ? (noun.jamTaksir ? 'جمع مکسر' : 'جمع مذکر سالم') : 'مثنی (تثنیه مذکر)';

      const otherNouns = COMPREHENSIVE_NOUN_LIBRARY.filter((n) => n.id !== noun.id);
      const otherPlurals = otherNouns.map((n) => n.jamTaksir?.split(' ')[0] || n.pluralMasc).filter(Boolean);

      const pool = [
        correctForm,
        noun.singularMasc,
        noun.dualMasc !== correctForm ? noun.dualMasc : noun.pluralFem,
        ...otherPlurals.slice(0, 2),
      ].filter(Boolean);
      const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

      return {
        id,
        type,
        babId: verb.babId,
        babName: noun.babName,
        root: noun.root,
        title: `انواع جمع و تثنیه در ${noun.typeNameFa}`,
        prompt: `حالت «${askTitle}» کلمه «${noun.singularMasc}» (${noun.typeNameFa} به معنای «${noun.meaning}») کدام گزینه است؟`,
        subPrompt: `ریشه: [ ${noun.root} ] · مفرد: ${noun.singularMasc}`,
        correctAnswer: correctForm,
        options,
        explanation: `پاسخ صحیح: «${correctForm}» است. ${noun.ruleDescription}`,
        pedagogicalTip: `برای ساخت مثنی علامت «ـانِ» و برای جمع مذکر سالم «ـُونَ» در حالت رفعی افزوده می‌شود. جمع مکسر با تغییر ساختار درونی مفرد ساخته می‌شود.`,
      };
    } else if (subType === 3) {
      // ۴. پرسش وزن و تطبیق (میزان الصرف)
      const correctForm = noun.wazn.split(' ')[0];
      const waznDistractors = ['مَفْعُول', 'فاعِل', 'فَعِيل', 'مَفْعَل', 'أَفْعَل', 'مِفْعال', 'فَعّال', 'مُفْعِل', 'مُفَعِّل', 'مُسْتَفْعِل', 'فُعْلى'].filter(
        (w) => w !== correctForm
      );
      const options = shuffleArray([correctForm, ...shuffleArray(waznDistractors).slice(0, 3)]);

      return {
        id,
        type,
        babId: verb.babId,
        babName: noun.babName,
        root: noun.root,
        title: `وزن‌شناسی صرفی ${noun.typeNameFa}`,
        prompt: `کلمه «${noun.singularMasc}» (${noun.meaning}) دارای چه وزن صرفی است؟`,
        subPrompt: `نوع مشتق: ${noun.typeNameFa} · ریشه: [ ${noun.root} ]`,
        correctAnswer: correctForm,
        options,
        explanation: `وزن کلمه «${noun.singularMasc}» برابر با «${correctForm}» است. نوع مشتق: ${noun.typeNameFa}.`,
        pedagogicalTip: `میزان الصرف (ف - ع - ل) ترازوی تشخیص حروف اصلی از زائد در کلمات عربی است.`,
      };
    } else if (subType === 4) {
      // ۵. تشخیص نوع مشتق از روی کلمه
      const correctForm = noun.typeNameFa;
      const typeDistractors = [
        'اسم فاعل',
        'اسم مفعول',
        'صفت مشبهه',
        'اسم تفضیل',
        'اسم مکان و زمان',
        'اسم آلت',
        'اسم مبالغه',
        'جمع مکسر',
      ].filter((t) => t !== correctForm);
      const options = shuffleArray([correctForm, ...shuffleArray(typeDistractors).slice(0, 3)]);

      return {
        id,
        type,
        babId: verb.babId,
        babName: noun.babName,
        root: noun.root,
        title: `تشخیص نوع مشتق و اسم`,
        prompt: `کلمه «${noun.singularMasc}» به معنای «${noun.meaning}» از نظر دسته‌بندی صرفی چه نوع مشتقی است؟`,
        subPrompt: `ریشه: [ ${noun.root} ] · وزن: ${noun.wazn}`,
        correctAnswer: correctForm,
        options,
        explanation: `کلمه «${noun.singularMasc}» یک «${correctForm}» است. ${noun.ruleDescription}`,
        pedagogicalTip: `مشتقات هشت‌گانه عربی شامل: اسم فاعل، مفعول، صفت مشبهه، اسم تفضیل، اسم مکان، اسم زمان، اسم آلت و اسم مبالغه است.`,
      };
    } else {
      // ۶. تحلیل شاهد قرآنی یا معنای مشتق
      if (noun.quranicAyah) {
        const correctForm = noun.singularMasc.replace(/[ًٌٍ]/g, '');
        const otherAyahNouns = COMPREHENSIVE_NOUN_LIBRARY.filter((n) => n.quranicAyah && n.id !== noun.id);
        const distractors = shuffleArray(otherAyahNouns.map((n) => n.singularMasc.replace(/[ًٌٍ]/g, ''))).slice(0, 3);
        const options = shuffleArray([correctForm, ...distractors]);

        return {
          id,
          type,
          babId: verb.babId,
          babName: noun.babName,
          root: noun.root,
          title: `شاهد قرآنی ${noun.typeNameFa}`,
          prompt: `در آیه شریفه ﴿ ${noun.quranicAyah} ﴾، کدام کلمه نمونه‌ای از «${noun.typeNameFa}» است؟`,
          subPrompt: `ریشه: [ ${noun.root} ] · وزن: ${noun.wazn} · معنا: «${noun.meaning}»`,
          correctAnswer: correctForm,
          options,
          explanation: `در این آیه مبارکه، کلمه «${correctForm}» بر وزن «${noun.wazn}» نقش «${noun.typeNameFa}» را ایفا می‌کند.`,
          pedagogicalTip: `قرآن کریم والاترین و دقیق‌ترین الگوی فصاحت و کاربرد مشتقات و ابواب صرفی است.`,
        };
      } else {
        // معناشناسی مشتق
        const correctForm = noun.meaning;
        const otherNouns = COMPREHENSIVE_NOUN_LIBRARY.filter((n) => n.id !== noun.id);
        const distractors = shuffleArray(otherNouns.map((n) => n.meaning)).slice(0, 3);
        const options = shuffleArray([correctForm, ...distractors]);

        return {
          id,
          type,
          babId: verb.babId,
          babName: noun.babName,
          root: noun.root,
          title: `مفهوم و معنای ${noun.typeNameFa}`,
          prompt: `کلمه «${noun.singularMasc}» (${noun.typeNameFa} بر وزن ${noun.wazn}) بیانگر چه مفهومی است؟`,
          subPrompt: `ریشه: [ ${noun.root} ] · باب: ${noun.babName}`,
          correctAnswer: correctForm,
          options,
          explanation: `پاسخ صحیح: «${correctForm}» است. ${noun.ruleDescription}`,
          pedagogicalTip: `هر وزن صرفی قالب معنایی خاصی به ریشه می‌دهد؛ شناخت وزن، کلید فهم دقیق ترجمه است.`,
        };
      }
    }
  }

  // =========================================================================
  // B. بخش افعال (Verb Morphology)
  // =========================================================================

  // 1. نوع اول: صرف ترتیبی ۱ تا ۱۴
  if (type === 'sequential') {
    const forms = tense === 'madi' ? verb.madi : verb.mudari;
    const correctAnswersList = SEEGHEHS.map((s, idx) => ({
      seegheh: s,
      form: forms[idx],
    }));

    return {
      id,
      type: 'sequential',
      babId: verb.babId,
      babName: bab.name,
      root: verb.root,
      title: 'صرف ترتیبی صیغه‌های ۱۴ گانه',
      prompt: `فعل «${tense === 'madi' ? verb.madi[0] : verb.mudari[0]}» از باب «${bab.name}» را به صورت کامل و به ترتیب در زمان ${tenseNameFa} صرف کنید (صیغه ۱ تا ۱۴).`,
      subPrompt: `ریشه: [ ${verb.root} ] · باب: ${bab.name} · وزن: ${tense === 'madi' ? bab.waznMadi : bab.waznMudari}`,
      tense,
      correctAnswer: forms.join(' · '),
      correctAnswersList,
      explanation: `ترتیب استاندارد صیغه‌ها از غائب (۱ تا ۶) آغاز شده، به مخاطب (۷ تا ۱۲) ادامه یافته و با متکلم (۱۳ و ۱۴) پایان می‌پذیرد.`,
      pedagogicalTip: `برای تسلط بر مکالمه و آزمون حوزه و دانشگاه، ریتم صیغه‌ها را ۳ تا ۳ تا (مفرد، مثنی، جمع) به خاطر بسپارید.`,
    };
  }

  // 2. نوع دوم: صرف معکوس (۱۴ به ۱)
  if (type === 'reverse') {
    const forms = tense === 'madi' ? verb.madi : verb.mudari;
    const reverseRangeChoice = Math.random();
    let startIdx = 13;
    let endIdx = 0;
    let titleRange = '۱۴ تا ۱ (کامل)';

    if (reverseRangeChoice < 0.33) {
      startIdx = 13;
      endIdx = 6;
      titleRange = '۱۴ تا ۷ (متکلم و مخاطب به صورت معکوس)';
    } else if (reverseRangeChoice < 0.66) {
      startIdx = 5;
      endIdx = 0;
      titleRange = '۶ تا ۱ (غائب به صورت معکوس)';
    }

    const correctSubList: { seegheh: SeeghehInfo; form: string }[] = [];
    const correctFormsStrings: string[] = [];
    for (let i = startIdx; i >= endIdx; i--) {
      correctSubList.push({ seegheh: SEEGHEHS[i], form: forms[i] });
      correctFormsStrings.push(forms[i]);
    }

    return {
      id,
      type: 'reverse',
      babId: verb.babId,
      babName: bab.name,
      root: verb.root,
      title: `چالش صرف معکوس: صیغه ${titleRange}`,
      prompt: `فعل «${tense === 'madi' ? verb.madi[0] : verb.mudari[0]}» (${bab.name}) را در زمان ${tenseNameFa} از صیغه ${startIdx + 1} معکوساً تا صیغه ${endIdx + 1} بخوانید/بنویسید.`,
      subPrompt: `آغاز از: ${SEEGHEHS[startIdx].nameFa} (${SEEGHEHS[startIdx].pronoun}) تا ${SEEGHEHS[endIdx].nameFa} (${SEEGHEHS[endIdx].pronoun})`,
      tense,
      seeghehRange: { start: startIdx + 1, end: endIdx + 1, description: titleRange },
      correctAnswer: correctFormsStrings.join(' · '),
      correctAnswersList: correctSubList,
      explanation: `صرف معکوس نشان‌دهنده تسلط فعال و تسلط بر ضمائر متصل فاعلی بدون تکیه بر حفظ طوطی‌وار است.`,
      pedagogicalTip: `در صرف معکوس ابتدا متکلم مع‌الغیر (ـنا)، متکلم وحده (ـتُ)، سپس جمع مؤنث مخاطب (ـتُنَّ) و به همین ترتیب به عقب برگردید.`,
    };
  }

  // 3. نوع سوم: نقطه‌زنی (Targeted Seegheh)
  if (type === 'targeted') {
    const seeghehIdx = Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];
    const correctForm = tense === 'madi' ? verb.madi[seeghehIdx] : verb.mudari[seeghehIdx];
    const persianTranslation = conjugatePersianVerb(verb, targetSeegheh.index, tense);
    const options = generateDistractors(correctForm, verb, seeghehIdx, tense);

    return {
      id,
      type: 'targeted',
      babId: verb.babId,
      babName: bab.name,
      root: verb.root,
      title: `نقطه‌زنی صیغه: ${targetSeegheh.nameFa}`,
      prompt: `صیغه «${targetSeegheh.index} (${targetSeegheh.nameFa} - ${targetSeegheh.pronoun})» از فعل «${verb.root}» در باب «${bab.name}» زمان ${tenseNameFa} کدام است؟`,
      subPrompt: `معنای فارسی: «${persianTranslation.fullSentence}» · ضمیر: ${targetSeegheh.pronoun}`,
      tense,
      targetSeegheh,
      correctAnswer: correctForm,
      options,
      explanation: `پاسخ صحیح: «${correctForm}» است. ضمیر فاعلی آن «${targetSeegheh.pronoun}» و در زبان فارسی معادل «${persianTranslation.fullSentence}» می‌باشد.`,
      pedagogicalTip: tense === 'madi' ? targetSeegheh.markerMadi : targetSeegheh.markerMudari,
    };
  }

  // 4. نوع چهارم: تطبیق با ترجمه فارسی (Translation matching)
  if (type === 'translation') {
    const seeghehIdx = Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];
    const correctForm = tense === 'madi' ? verb.madi[seeghehIdx] : verb.mudari[seeghehIdx];
    const persianTranslation = conjugatePersianVerb(verb, targetSeegheh.index, tense);
    const options = generateDistractors(correctForm, verb, seeghehIdx, tense);

    return {
      id,
      type: 'translation',
      babId: verb.babId,
      babName: bab.name,
      root: verb.root,
      title: 'تطبیق عربی و معادل دقیق فارسی صیغه',
      prompt: `کدام صیغه عربی دقیقاً معادل جمله فارسی «${persianTranslation.fullSentence}» است؟`,
      subPrompt: `ریشه: [ ${verb.root} ] · باب: ${bab.name} · زمان: ${tenseNameFa}`,
      tense,
      targetSeegheh,
      correctAnswer: correctForm,
      options,
      explanation: `جمله «${persianTranslation.fullSentence}» بیانگر صیغه ${targetSeegheh.nameFa} (${targetSeegheh.pronoun}) است، که در عربی «${correctForm}» خوانده می‌شود.`,
      pedagogicalTip: `به مطابقت جنسیت (مذکر/مؤنث) و تعداد (مفرد/مثنی/جمع) در ترجمه فارسی دقت نمایید.`,
    };
  }

  // 5. نوع پنجم: تبدیل متقابل ماضی <-> مضارع (Tense Inversion)
  if (type === 'tense_inversion') {
    const seeghehIdx = Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];
    const sourceIsMadi = Math.random() > 0.5;

    const sourceVerb = sourceIsMadi ? verb.madi[seeghehIdx] : verb.mudari[seeghehIdx];
    const targetVerb = sourceIsMadi ? verb.mudari[seeghehIdx] : verb.madi[seeghehIdx];
    const sourceTenseName = sourceIsMadi ? 'ماضی' : 'مضارع';
    const targetTenseName = sourceIsMadi ? 'مضارع' : 'ماضی';

    const sourcePers = conjugatePersianVerb(verb, targetSeegheh.index, sourceIsMadi ? 'madi' : 'mudari');
    const targetPers = conjugatePersianVerb(verb, targetSeegheh.index, sourceIsMadi ? 'mudari' : 'madi');

    const prompt = `فعل «${sourceVerb}» (${sourceTenseName} در باب ${bab.name} به معنای «${sourcePers.verbPhrase}») را به «${targetTenseName}» در همان صیغه تبدیل کنید.`;
    const subPrompt = `صیغه ${targetSeegheh.index}: ${targetSeegheh.nameFa} (${targetSeegheh.nameAr}) · معنای مورد انتظار: «${targetPers.fullSentence}»`;

    const options = generateDistractors(
      targetVerb,
      verb,
      seeghehIdx,
      sourceIsMadi ? 'mudari' : 'madi'
    );

    return {
      id,
      type: 'tense_inversion',
      babId: verb.babId,
      babName: bab.name,
      root: verb.root,
      title: `تبدیل متقابل ${sourceTenseName} به ${targetTenseName}`,
      prompt,
      subPrompt,
      sourceVerb,
      sourceTense: sourceIsMadi ? 'madi' : 'mudari',
      tense: sourceIsMadi ? 'mudari' : 'madi',
      targetSeegheh,
      correctAnswer: targetVerb,
      options,
      explanation: `فعل «${sourceVerb}» در زمان ${sourceTenseName} («${sourcePers.fullSentence}»)، صیغه ${targetSeegheh.nameFa} است. معادل ${targetTenseName} آن در باب ${bab.name} برابر است با «${targetVerb}» («${targetPers.fullSentence}»).`,
      pedagogicalTip: `برای انتقال به مضارع در باب ${bab.name}، حرف مضارع مناسب به همراه علامت آخر صیغه اضافه می‌شود.`,
    };
  }

  // 6. نوع ششم: مجهول (Passive - ماضی و مضارع مجهول)
  if (type === 'passive') {
    const passiveVerb = verb.madiMajhul && verb.mudariMajhul
      ? verb
      : VERB_LIBRARY.find((v) => v.madiMajhul && v.mudariMajhul) || verb;
    const passiveBab = getBabById(passiveVerb.babId);

    const isMadi = Math.random() > 0.5;
    const seeghehIdx = Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];

    const activeList = isMadi ? passiveVerb.madi : passiveVerb.mudari;
    const passiveList = isMadi ? passiveVerb.madiMajhul! : passiveVerb.mudariMajhul!;
    const activeVerb = activeList[seeghehIdx];
    const correctForm = passiveList[seeghehIdx];
    const tenseName = isMadi ? 'ماضی مجهول' : 'مضارع مجهول';
    const activeTenseName = isMadi ? 'ماضی معلوم' : 'مضارع معلوم';

    const pers = conjugatePersianVerb(passiveVerb, targetSeegheh.index, isMadi ? 'madi_majhul' : 'mudari_majhul');

    const prompt = `فعل معلوم «${activeVerb}» (${activeTenseName} در باب ${passiveBab.name}) را به «${tenseName}» در همان صیغه تبدیل کنید.`;
    const subPrompt = `صیغه ${targetSeegheh.index}: ${targetSeegheh.nameFa} (${targetSeegheh.nameAr}) · معنای مجهول: «${pers.fullSentence}»`;

    const pool = [
      correctForm,
      activeVerb,
      isMadi ? passiveVerb.mudariMajhul?.[seeghehIdx] || activeVerb : passiveVerb.madiMajhul?.[seeghehIdx] || activeVerb,
      passiveList[(seeghehIdx + 1) % 14],
      passiveList[(seeghehIdx + 13) % 14],
    ].filter(Boolean);

    const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

    return {
      id,
      type: 'passive',
      babId: passiveVerb.babId,
      babName: passiveBab.name,
      root: passiveVerb.root,
      title: `قاعده ساخت ${tenseName}`,
      prompt,
      subPrompt,
      sourceVerb: activeVerb,
      sourceTense: isMadi ? 'madi' : 'mudari',
      verbMode: isMadi ? 'madi_majhul' : 'mudari_majhul',
      targetSeegheh,
      correctAnswer: correctForm,
      options,
      explanation: `فعل معلوم «${activeVerb}» در حالت ${tenseName} به صورت «${correctForm}» درمی‌آید. معنای مجهول: «${pers.fullSentence}». در ماضی مجهول اول فعل مضموم و ماقبل آخر مکسور می‌شود (فُعِلَ)، و در مضارع مجهول اول مضموم و ماقبل آخر مفتوح می‌گردد (يُفْعَلُ).`,
      pedagogicalTip: `افعال لازم مانند باب انفعال یا باب ۵ مجرد، به دلیل عدم پذیرش مفعول، صیغه مجهول ندارند.`,
    };
  }

  // 7. نوع هفتم: امر (Imperative - امر حاضر و امر به لام)
  if (type === 'amr') {
    const amrVerb = verb.amr ? verb : VERB_LIBRARY.find((v) => v.amr) || verb;
    const amrBab = getBabById(amrVerb.babId);

    const seeghehIdx = Math.random() < 0.7 ? Math.floor(Math.random() * 6) + 6 : Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];
    const isHader = seeghehIdx >= 6 && seeghehIdx <= 11;

    const correctForm = amrVerb.amr![seeghehIdx];
    const pers = conjugatePersianVerb(amrVerb, targetSeegheh.index, 'amr');
    const amrTitle = isHader ? 'امر حاضر (مخاطب)' : 'امر به لام (غائب)';

    const prompt = `صیغه «${targetSeegheh.nameFa} (${targetSeegheh.pronoun})» در حالت «${amrTitle}» از ریشه [ ${amrVerb.root} ] در باب «${amrBab.name}» چه می‌شود؟`;
    const subPrompt = `معنای مورد انتظار: «${pers.fullSentence}» · ضمیر: ${targetSeegheh.pronoun}`;

    const pool = [
      correctForm,
      amrVerb.mudari[seeghehIdx],
      amrVerb.nahy?.[seeghehIdx] || amrVerb.madi[seeghehIdx],
      amrVerb.amr![(seeghehIdx + 1) % 14],
      amrVerb.amr![(seeghehIdx + 13) % 14],
    ].filter(Boolean);

    const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

    return {
      id,
      type: 'amr',
      babId: amrVerb.babId,
      babName: amrBab.name,
      root: amrVerb.root,
      title: `ساخت و تطبیق ${amrTitle}`,
      prompt,
      subPrompt,
      verbMode: 'amr',
      targetSeegheh,
      correctAnswer: correctForm,
      options,
      explanation: `پاسخ صحیح: «${correctForm}» است. معنای فارسی: «${pers.fullSentence}». ${
        isHader
          ? 'امر حاضر از مضارع مخاطب با حذف حرف مضارع و افزودن همزه وصل (در صورت ساکن بودن حرف اول) ساخته می‌شود.'
          : 'امر غائب با افزودن لام امر جازمه (لِـ) به اول مضارع مجزوم ساخته می‌شود.'
      }`,
      pedagogicalTip: `علامت جزم در صیغه‌های دارای نون اعرابی، حذف نون است (مگر نون نسوه در جمع مؤنث).`,
    };
  }

  // 8. نوع هشتم: نهی مجهول (Nahy Majhul - لا يُفْعَلْ / لا تُنْصَرْ)
  if (type === 'nahy_majhul') {
    const nahyVerb = verb.nahyMajhul ? verb : VERB_LIBRARY.find((v) => v.nahyMajhul) || verb;
    const nahyBab = getBabById(nahyVerb.babId);
    const seeghehIdx = Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];

    const correctForm = nahyVerb.nahyMajhul![seeghehIdx];
    const pers = conjugatePersianVerb(nahyVerb, targetSeegheh.index, 'nahy_majhul');
    const nahyTitle = 'نهی مجهول (لا تُفْعَلْ)';

    const prompt = `معادل عربی عبارت ${nahyTitle} «${pers.fullSentence}» را از ریشه [ ${nahyVerb.root} ] در باب «${nahyBab.name}» بگویید.`;
    const subPrompt = `صیغه هدف: ${targetSeegheh.index} (${targetSeegheh.nameFa} - ${targetSeegheh.pronoun}) · باب: ${nahyBab.name}`;

    const pool = [
      correctForm,
      `لا ${nahyVerb.mudariMajhul ? nahyVerb.mudariMajhul[seeghehIdx] : nahyVerb.mudari[seeghehIdx]}`, // Distractor without jazm
      nahyVerb.nahy ? nahyVerb.nahy[seeghehIdx] : `لا ${nahyVerb.madi[seeghehIdx]}`, // Active nahy distractor
      nahyVerb.nahyMajhul![(seeghehIdx + 1) % 14],
      nahyVerb.nahyMajhul![(seeghehIdx + 13) % 14],
    ].filter(Boolean);

    const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

    return {
      id,
      type: 'nahy_majhul',
      babId: nahyVerb.babId,
      babName: nahyBab.name,
      root: nahyVerb.root,
      title: nahyTitle,
      prompt,
      subPrompt,
      verbMode: 'nahy_majhul',
      targetSeegheh,
      correctAnswer: correctForm,
      options,
      explanation: `پاسخ صحیح: «${correctForm}» است. معنای دقیق فارسی: «${pers.fullSentence}». نهی مجهول با ورود «لا»ی ناهیه جازمه بر مضارع مجهول ساخته می‌شود و آخر آن مجزوم می‌گردد (مانند: لا يُنْصَرْ / لا تُضْرَبْ).`,
      pedagogicalTip: `فعل مجهول نیز مانند فعل معلوم دارای نهی است: «لا يُفْعَلْ، لا يُفْعَلا، لا يُفْعَلُوا...».`,
    };
  }

  // 9. نوع نهم: نهی معلوم (با لا جازمه)
  if (type === 'nahy') {
    const isMajhulNahy = Math.random() > 0.6 && verb.nahyMajhul;
    const nahyVerb = isMajhulNahy && verb.nahyMajhul ? verb : VERB_LIBRARY.find((v) => v.nahy) || verb;
    const nahyBab = getBabById(nahyVerb.babId);

    const seeghehIdx = Math.floor(Math.random() * 14);
    const targetSeegheh = SEEGHEHS[seeghehIdx];

    const correctForm = isMajhulNahy ? nahyVerb.nahyMajhul![seeghehIdx] : nahyVerb.nahy![seeghehIdx];
    const pers = conjugatePersianVerb(nahyVerb, targetSeegheh.index, isMajhulNahy ? 'nahy_majhul' : 'nahy');
    const nahyTitle = isMajhulNahy ? 'نهی مجهول (لا تُفْعَلْ)' : 'نهی معلوم با لا جازمه';

    const prompt = `معادل عربی عبارت ${nahyTitle} «${pers.fullSentence}» را از ریشه [ ${nahyVerb.root} ] در باب «${nahyBab.name}» بگویید.`;
    const subPrompt = `صیغه هدف: ${targetSeegheh.index} (${targetSeegheh.nameFa} - ${targetSeegheh.pronoun}) · باب: ${nahyBab.name}`;

    const pool = [
      correctForm,
      `لا ${isMajhulNahy && nahyVerb.mudariMajhul ? nahyVerb.mudariMajhul[seeghehIdx] : nahyVerb.mudari[seeghehIdx]}`, // Distractor without jazm
      nahyVerb.amr?.[seeghehIdx] || nahyVerb.madi[seeghehIdx],
      (isMajhulNahy ? nahyVerb.nahyMajhul! : nahyVerb.nahy!)[(seeghehIdx + 1) % 14],
      (isMajhulNahy ? nahyVerb.nahyMajhul! : nahyVerb.nahy!)[(seeghehIdx + 13) % 14],
    ].filter(Boolean);

    const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

    return {
      id,
      type: 'nahy',
      babId: nahyVerb.babId,
      babName: nahyBab.name,
      root: nahyVerb.root,
      title: nahyTitle,
      prompt,
      subPrompt,
      verbMode: isMajhulNahy ? 'nahy_majhul' : 'nahy',
      targetSeegheh,
      correctAnswer: correctForm,
      options,
      explanation: `پاسخ صحیح: «${correctForm}» است. معنای دقیق فارسی: «${pers.fullSentence}». نهی مجهول نیز با ورود «لا»ی ناهیه بر سر مضارع مجهول و جزم آن ساخته می‌شود (مانند «لا يُنْصَرْ» / «لا يُقْتَلْ»).`,
      pedagogicalTip: `در نهی، صیغه آخر فعل مجزوم می‌شود (ساکن یا حذف نون اعرابی).`,
    };
  }

  // 9. نوع نهم: احکام ادغام و فک ادغام در افعال مضاعف (مضاعف و ادغام)
  if (type === 'mudaaf_fakk' || type === 'mudaaf_conjugation') {
    const mudaafVerbs = VERB_LIBRARY.filter((v) => v.verbType === 'mudaaf');
    const mVerb = mudaafVerbs.length > 0 ? getRandomItem(mudaafVerbs) : verb;
    const mBab = getBabById(mVerb.babId);

    const fakkSubtype = Math.floor(Math.random() * 4);

    if (fakkSubtype === 0 || type === 'mudaaf_conjugation') {
      // صیغه‌های دارای فک ادغام (ص ۶ تا ۱۴ ماضی یا ص ۶ و ۱۲ مضارع)
      const isPastFakk = Math.random() > 0.5;
      const fakkIndex = isPastFakk ? 5 + Math.floor(Math.random() * 9) : Math.random() > 0.5 ? 5 : 11; // 5 = ص ۶, 11 = ص ۱۲
      const sInfo = SEEGHEHS[fakkIndex];
      const correctForm = isPastFakk ? mVerb.madi[fakkIndex] : mVerb.mudari[fakkIndex];

      const distractors = [
        isPastFakk ? mVerb.madi[0] + 'ْنَ' : mVerb.mudari[0] + 'ْنَ',
        isPastFakk ? mVerb.madi[0] : mVerb.mudari[0],
        isPastFakk ? mVerb.madi[1] : mVerb.mudari[1],
      ];
      const options = shuffleArray(Array.from(new Set([correctForm, ...distractors]))).slice(0, 4);

      return {
        id,
        type,
        babId: mVerb.babId,
        babName: mBab.name,
        root: mVerb.root,
        title: `صرف و فک ادغام فعل مضاعف (${isPastFakk ? 'ماضی' : 'مضارع'})`,
        prompt: `کدام گزینه صورت صحیح صیغه ${sInfo.index} (${sInfo.nameFa} - «${sInfo.pronoun}») از فعل مضاعف «${mVerb.madi[0]} / ${mVerb.mudari[0]}» بر وزن ${mBab.name} است؟`,
        subPrompt: `ریشه: [ ${mVerb.root} ] · معنا: «${mVerb.meaningBase}» · توجه به حکم فک ادغام`,
        targetSeegheh: sInfo,
        correctAnswer: correctForm,
        options,
        explanation: `پاسخ صحیح: «${correctForm}» است. در افعال مضاعف (که دو حرف اصلی یکسان دارند)، هرگاه حرف دوم ساکن شود (به علت اتصال به ضمائر بارز متحرک مانند نون نسوه یا تاء فاعل)، ادغام گشوده شده و «فک ادغام» رخ می‌دهد (مانند مَدَدْنَ، مَدَدْتَ، يَمْدُدْنَ).`,
        pedagogicalTip: `قانون کلیدی مضاعف: در ماضی از صیغه ۶ تا ۱۴ (هنّ تا نحن) و در مضارع در صیغه ۶ و ۱۲ (هنّ و انتنّ) فک ادغام واجب است.`,
      };
    } else if (fakkSubtype === 1) {
      // امر حاضر افعال مضاعف (مُدَّ / أُمُدُدْ یا ص ۱۲: اُُمْدُدْنَ)
      const sIndex = Math.random() > 0.3 ? 6 : 11; // ص ۷ (أنت) یا ص ۱۲ (أنتن)
      const sInfo = SEEGHEHS[sIndex];
      const correctForm = mVerb.amr ? mVerb.amr[sIndex] : `مُدَّ`;

      const options = shuffleArray([
        correctForm,
        mVerb.madi[0],
        mVerb.mudari[sIndex],
        sIndex === 6 ? `اُمْدُدْ` : `مُدْنَ`,
      ]);

      return {
        id,
        type,
        babId: mVerb.babId,
        babName: mBab.name,
        root: mVerb.root,
        title: `امر حاضر در افعال مضاعف`,
        prompt: `صورت امر حاضر صیغه ${sInfo.index} (${sInfo.nameFa} - «${sInfo.pronoun}») برای فعل مضاعف «${mVerb.madi[0]} / ${mVerb.mudari[0]}» کدام است؟`,
        subPrompt: `ریشه: [ ${mVerb.root} ] · باب: ${mBab.name}`,
        targetSeegheh: sInfo,
        correctAnswer: correctForm,
        options,
        explanation: `پاسخ صحیح: «${correctForm}» است. در امر حاضر مفرد مذکر مخاطب فعل مضاعف، ادغام می‌تواند باقی بماند (مُدَّ / فِرَّ / مَسَّ) یا باز شود (أُمُدُدْ/اِفْرِرْ)؛ اما در جمع مؤنث مخاطب (صیغه ۱۲) فک ادغام و آوردن همزه امر الزامی است (اُُمْدُدْنَ/اِفْرِرْنَ/اِمْسَسْنَ).`,
        pedagogicalTip: `در امر حاضر صیغه ۷ فعل مضاعف حرکت آخر به فتح تغییر می‌کند و ادغام جائز است.`,
      };
    } else if (fakkSubtype === 2) {
      // حکم‌شناسی کلی ادغام (واجب، ممتنع/فک، جائز)
      const qCase = Math.floor(Math.random() * 3);
      let title = '';
      let prompt = '';
      let correctForm = '';
      let explanation = '';

      if (qCase === 0) {
        title = 'شناخت ادغام واجب';
        prompt = 'در کدام‌یک از صیغه‌های زیر در فعل مضاعف، «ادغام واجب» است؟';
        correctForm = 'صیغه‌های ۱ تا ۵ ماضی (مَدَّ، مَدَّا...)';
        explanation = 'هرگاه دو حرف متماثل متحرک باشند یا اولی ساکن و دومی متحرک، ادغام واجب است (مانند مَدَّ، يَمُدُّ).';
      } else if (qCase === 1) {
        title = 'شناخت ادغام ممتنع (فک ادغام)';
        prompt = 'در کدام صیغه‌های فعل مضاعف، «ادغام ممتنع» است و فک ادغام (گشودن ادغام) رخ می‌دهد؟';
        correctForm = 'صیغه‌های ۶ تا ۱۴ ماضی و صیغه ۶ و ۱۲ مضارع';
        explanation = 'به دلیل اتصال ضمائر بارز متحرک (ـْنَ، ـْتَ، ـْتُ...) و ساکن شدن لام‌الفعل، ادغام ممتنع و فک ادغام واجب می‌گردد.';
      } else {
        title = 'شناخت ادغام جائز';
        prompt = 'در کدام حالت از فعل مضاعف، ادغام «جائز» (هم ادغام و هم فک ادغام مجاز) است؟';
        correctForm = 'حالت جزم مفرد و امر حاضر صیغه ۷ (لَمْ يَمُدَّ / لَمْ يَمْدُدْ)';
        explanation = 'در مضارع مجزوم مفرد و امر حاضر مفرد مذکر (مانند لَمْ يَمُدَّ / لَمْ يَمْدُدْ و مُدَّ / أُمُدُدْ)، هر دو وجه جایز است.';
      }

      const options = shuffleArray([
        correctForm,
        'تمام صیغه‌های ۱۴گانه بدون استثنا',
        'فقط در باب‌های ثلاثی مزید',
        'فقط در حالت مجهول',
      ]);

      return {
        id,
        type,
        babId: mVerb.babId,
        babName: mBab.name,
        root: mVerb.root,
        title,
        prompt,
        subPrompt: `احکام سه‌گانه ادغام در صرف (واجب، ممتنع، جائز)`,
        correctAnswer: correctForm,
        options,
        explanation,
        pedagogicalTip: `ادغام دارای ۳ حکم است: واجب (مانند مَدَّ)، ممتنع/فک ادغام (مانند مَدَدْنَ) و جائز (مانند لَمْ يَمُدَّ/يَمْدُدْ).`,
      };
    } else {
      // شاهد قرآنی فعل مضاعف
      const quranVerbs = VERB_LIBRARY.filter((v) => v.verbType === 'mudaaf' && v.quranicAyah);
      const qv = quranVerbs.length > 0 ? getRandomItem(quranVerbs) : mVerb;
      const correctForm = qv.madi[0];

      const options = shuffleArray([
        correctForm,
        'نَصَرَ',
        'كَتَبَ',
        'جَعَلَ',
      ]);

      return {
        id,
        type,
        babId: qv.babId,
        babName: getBabById(qv.babId).name,
        root: qv.root,
        title: 'شاهد قرآنی فعل مضاعف',
        prompt: `در آیه مبارکه ﴿ ${qv.quranicAyah} ﴾، کدام فعل نمونه‌ای از «فعل مضاعف» است؟`,
        subPrompt: `ریشه: [ ${qv.root} ] · معنا: «${qv.meaningBase}»`,
        correctAnswer: correctForm,
        options,
        explanation: `پاسخ صحیح: «${correctForm}» است. ریشه این فعل [ ${qv.root} ] بوده و دو حرف پایانی آن یکسان است که دچار ادغام شده‌اند.`,
        pedagogicalTip: `افعال مضاعف در قرآن بسیار پرکاربردند (مانند مَدَّ، صَدَّ، مَسَّ، زَلْزَلَ).`,
      };
    }
  }

  // 10. نوع دهم: نفی (ماضی و مضارع معلوم و مجهول)
  const nafyVerb = verb;
  const seeghehIdx = Math.floor(Math.random() * 14);
  const targetSeegheh = SEEGHEHS[seeghehIdx];
  const isNafyMadi = Math.random() > 0.5;

  let correctForm = '';
  let persMode: any = 'nafy_madi';
  let nafyTitle = '';

  if (isNafyMadi) {
    correctForm = nafyVerb.nafyMadi ? nafyVerb.nafyMadi[seeghehIdx] : `ما ${nafyVerb.madi[seeghehIdx]}`;
    persMode = 'nafy_madi';
    nafyTitle = 'نفی ماضی (با ما نافیه)';
  } else {
    correctForm = nafyVerb.nafyMudari ? nafyVerb.nafyMudari[seeghehIdx] : `لا ${nafyVerb.mudari[seeghehIdx]}`;
    persMode = 'nafy_mudari';
    nafyTitle = 'نفی مضارع (با لا نافیه غیرجازمه)';
  }

  const pers = conjugatePersianVerb(nafyVerb, targetSeegheh.index, persMode);

  const prompt = `معادل عربی «${pers.fullSentence}» در حالت «${nafyTitle}» از ریشه [ ${nafyVerb.root} ] باب ${bab.name} چیست؟`;
  const subPrompt = `صیغه ${targetSeegheh.index} (${targetSeegheh.nameFa}) · دقت به تفاوت نفی (غیرجازم) و نهی (جازم)`;

  const pool = [
    correctForm,
    nafyVerb.nahy ? nafyVerb.nahy[seeghehIdx] : `لا ${nafyVerb.madi[seeghehIdx]}`, // Distractor with jazm (نهی)
    nafyVerb.madi[seeghehIdx],
    nafyVerb.mudari[seeghehIdx],
  ].filter(Boolean);

  const options = shuffleArray(Array.from(new Set(pool))).slice(0, 4);

  return {
    id,
    type: 'nafy',
    babId: nafyVerb.babId,
    babName: bab.name,
    root: nafyVerb.root,
    title: nafyTitle,
    prompt,
    subPrompt,
    verbMode: isNafyMadi ? 'nafy_madi' : 'nafy_mudari',
    targetSeegheh,
    correctAnswer: correctForm,
    options,
    explanation: `پاسخ صحیح: «${correctForm}» است. معنای فارسی: «${pers.fullSentence}». نفی مضارع با «لا» یا «ما» ساخته می‌شود و بر خلاف نهی، اعراب فعل مضارع را تغییر نمی‌دهد و فعل مرفوع باقی می‌ماند.`,
    pedagogicalTip: `تفاوت اساسی نفی و نهی: در نفی فقط خبر از رخ ندادن کار داده می‌شود (لا یَضْرِبُ: نمی‌زند)، اما در نهی از انجام کار بازداشته می‌شود و فعل مجزوم می‌گردد (لا یَضْرِبْ: نباید بزند).`,
  };
}
