import React, { useState, useEffect } from 'react';
import {
  Volume2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff,
  Table,
  BookOpen,
  Mic,
  MicOff,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Crown,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { Question, QuestionResult, SessionConfig, Student } from '../types/sarf';
import { speakArabic, checkArabicAnswerMatch } from '../utils/speech';

interface MobaheseDrillProps {
  config: SessionConfig;
  currentQuestion: Question;
  questionIndex: number;
  totalQuestions: number;
  currentAsker?: Student;
  currentAnswerer: Student;
  soundEnabled: boolean;
  onRecordResult: (result: QuestionResult) => void;
  onOpenWorkshop: () => void;
  onOpenSeeghehTable: () => void;
}

export const MobaheseDrill: React.FC<MobaheseDrillProps> = ({
  config,
  currentQuestion,
  questionIndex,
  totalQuestions,
  currentAsker,
  currentAnswerer,
  soundEnabled,
  onRecordResult,
  onOpenWorkshop,
  onOpenSeeghehTable,
}) => {
  // Whether the facilitator is answering their own question
  const isFacilitatorSelfTurn =
    config.mode === 'facilitator' &&
    config.facilitatorId === currentAnswerer.id;

  // Answer visibility
  const [showAnswer, setShowAnswer] = useState<boolean>(
    config.mode === 'circle' || (config.mode === 'facilitator' && !isFacilitatorSelfTurn)
  );

  // Solo mode state
  const [selectedSoloOption, setSelectedSoloOption] = useState<string | null>(null);
  const [soloSubmitted, setSoloSubmitted] = useState<boolean>(false);
  const [soloFlashcardRevealed, setSoloFlashcardRevealed] = useState<boolean>(false);

  // Voice recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceFeedback, setVoiceFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Audio playback state
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  // Question timer
  const [startTime] = useState<number>(Date.now());

  const handlePlayAudio = async (textToSpeak: string) => {
    setAudioPlaying(true);
    await speakArabic(textToSpeak, () => setAudioPlaying(false));
    // Auto reset state after timeout just in case
    setTimeout(() => setAudioPlaying(false), 3000);
  };

  // Reset local state when question changes
  useEffect(() => {
    setShowAnswer(
      config.mode === 'circle' || (config.mode === 'facilitator' && !isFacilitatorSelfTurn)
    );
    setSelectedSoloOption(null);
    setSoloSubmitted(false);
    setSoloFlashcardRevealed(false);
    setIsListening(false);
    setVoiceTranscript('');
    setVoiceFeedback(null);

    // Audio hint if sound enabled
    if (soundEnabled && currentQuestion.sourceVerb) {
      speakArabic(currentQuestion.sourceVerb);
    }
  }, [currentQuestion.id, config.mode, isFacilitatorSelfTurn]);

  // Voice Recognition Handler
  const toggleVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند. لطفاً از گزینه‌ای یا فلش‌کارت استفاده کنید.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('در حال گوش دادن... بفرمایید');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceTranscript(transcript);
        setIsListening(false);

        const isMatch = checkArabicAnswerMatch(transcript, currentQuestion.correctAnswer);
        if (isMatch) {
          setVoiceFeedback('correct');
          if (soundEnabled) speakArabic('أحسنت! ممتاز');
        } else {
          setVoiceFeedback('wrong');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceTranscript('خطا در دریافت صدا. دوباره تلاش کنید.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleGrade = (score: 0 | 5 | 10) => {
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const result: QuestionResult = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      askerStudentId: currentAsker?.id,
      studentId: currentAnswerer.id,
      studentName: currentAnswerer.name,
      score,
      isCorrect: score > 0,
      timeSpentSeconds: timeSpent,
      timestamp: Date.now(),
      userAnswer: selectedSoloOption || voiceTranscript || undefined,
    };
    onRecordResult(result);
  };

  const handleSoloOptionClick = (option: string) => {
    if (soloSubmitted) return;
    setSelectedSoloOption(option);
    setSoloSubmitted(true);
    setShowAnswer(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (soundEnabled) {
      if (isCorrect) {
        speakArabic(currentQuestion.correctAnswer);
      }
    }
  };

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 px-2 sm:px-4" dir="rtl">
      {/* Top Status & Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 text-sm">
              پرسش {questionIndex + 1} از {totalQuestions}
            </span>
            <span>·</span>
            <span>پیشرفت مباحثه: {progressPercent}٪</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWorkshop}
              className="text-stone-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>کارگاه اوزان</span>
            </button>
            <span>·</span>
            <button
              onClick={onOpenSeeghehTable}
              className="text-stone-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <Table className="w-3.5 h-3.5" />
              <span>جدول ۱۴ صیغه</span>
            </button>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Turn Indicator Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {config.mode === 'circle' && currentAsker && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span className="text-xs text-stone-600">گوشی در دست:</span>
              <span className="text-xs font-bold text-stone-900">
                {currentAsker.name}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-stone-400 rotate-180" />

            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs text-emerald-800">پاسخ‌دهنده:</span>
              <span className="text-xs font-extrabold text-emerald-950">
                {currentAnswerer.name}
              </span>
            </div>
          </div>
        )}

        {config.mode === 'facilitator' && currentAsker && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              <Crown className="w-4 h-4 text-blue-700" />
              <span className="text-xs text-blue-800">استاد / سرگروه:</span>
              <span className="text-xs font-bold text-blue-950">
                {currentAsker.name}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-stone-400 rotate-180" />

            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800">پاسخ‌دهنده:</span>
              <span className="text-xs font-bold text-emerald-950">
                {currentAnswerer.name}
              </span>
            </div>
          </div>
        )}

        {config.mode === 'solo' && (
          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-stone-600">دانشجو:</span>
            <span className="text-xs font-bold text-stone-900">
              {currentAnswerer.name} (آزمون انفرادی)
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-500">
            {currentQuestion.title}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        {/* Badges metadata */}
        <div className="flex flex-wrap items-center gap-2">
          {currentQuestion.type.startsWith('ism_') || currentQuestion.type === 'sefat_moshabbahah' || currentQuestion.type === 'jam_taksir' ? (
            <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-bold border border-teal-200/60">
              علم الاشتقاق و اسماء ({currentQuestion.babName})
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold font-arabic">
              باب {currentQuestion.babName}
            </span>
          )}
          <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-mono font-semibold">
            ریشه: [ {currentQuestion.root} ]
          </span>
          {currentQuestion.verbMode && (
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
              currentQuestion.verbMode.includes('majhul')
                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                : currentQuestion.verbMode === 'amr'
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : currentQuestion.verbMode === 'nahy'
                ? 'bg-rose-100 text-rose-900 border border-rose-200'
                : currentQuestion.verbMode.startsWith('nafy')
                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                : 'bg-emerald-100 text-emerald-900'
            }`}>
              حالت: {
                currentQuestion.verbMode === 'madi_majhul' ? 'ماضی مجهول (فُعِلَ)' :
                currentQuestion.verbMode === 'mudari_majhul' ? 'مضارع مجهول (يُفْعَلُ)' :
                currentQuestion.verbMode === 'amr' ? 'فعل امر' :
                currentQuestion.verbMode === 'nahy' ? 'فعل نهی معلوم (لا تَفْعَلْ)' :
                currentQuestion.verbMode === 'nahy_majhul' ? 'نهی مجهول (لا يُفْعَلْ)' :
                currentQuestion.verbMode === 'nafy_madi' ? 'نفی ماضی (ما فَعَلَ)' :
                currentQuestion.verbMode === 'nafy_mudari' ? 'نفی مضارع (لا يَفْعَلُ)' :
                currentQuestion.verbMode === 'nafy_majhul' ? 'نفی مجهول (ما فُعِلَ / لا يُفْعَلُ)' :
                currentQuestion.verbMode === 'madi' ? 'ماضی معلوم' : 'مضارع معلوم'
              }
            </span>
          )}
          {!currentQuestion.verbMode && currentQuestion.tense && (
            <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium">
              زمان: {currentQuestion.tense === 'madi' ? 'ماضی' : 'مضارع'}
            </span>
          )}
          {currentQuestion.seeghehRange && (
            <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold">
              {currentQuestion.seeghehRange.description}
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-arabic leading-relaxed">
              {currentQuestion.prompt}
            </h3>

            {/* Audio Button with Gemini Studio Indicator */}
            <button
              onClick={() => {
                if (currentQuestion.sourceVerb) {
                  handlePlayAudio(currentQuestion.sourceVerb);
                } else if (currentQuestion.correctAnswer) {
                  handlePlayAudio(currentQuestion.correctAnswer);
                }
              }}
              disabled={audioPlaying}
              className={`p-2.5 rounded-xl transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
                audioPlaying
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
              }`}
              title="تلفظ با کیفیت استودیویی Gemini TTS"
            >
              <Volume2 className={`w-5 h-5 ${audioPlaying ? 'animate-bounce' : ''}`} />
              <span className="text-[11px] font-bold hidden sm:inline">
                {audioPlaying ? 'در حال پخش...' : 'تلفظ عربی (Gemini)'}
              </span>
            </button>
          </div>

          {currentQuestion.subPrompt && (
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              {currentQuestion.subPrompt}
            </p>
          )}
        </div>

        {/* Pedagogical Hint Callout */}
        {currentQuestion.pedagogicalTip && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>نکته کارگاهی: {currentQuestion.pedagogicalTip}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* INTERACTION AREA (Group vs Solo) */}
        {/* ------------------------------------------------------------- */}

        {/* A. Group Modes (Circle or Facilitator) */}
        {(config.mode === 'circle' || config.mode === 'facilitator') && (
          <div className="pt-4 border-t border-stone-200 space-y-4">
            {/* Self-check notice if facilitator is answering their own turn */}
            {isFacilitatorSelfTurn && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>نوبت خود شماست! پاسخ پنهان شده تا در ذهن صرف کنید.</span>
                <button
                  type="button"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="px-3 py-1 bg-amber-200/80 hover:bg-amber-300 rounded-lg font-bold text-xs cursor-pointer"
                >
                  {showAnswer ? 'پنهان کردن پاسخ' : 'مشاهده کلید'}
                </button>
              </div>
            )}

            {/* Answer Guide for the Asker */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-700" />
                  <span>کلید و راهنمای بررسی پاسخ (مخصوص پرسش‌گر):</span>
                </span>

                {!isFacilitatorSelfTurn && (
                  <button
                    type="button"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showAnswer ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>پنهان‌سازی</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>نمایش پاسخ</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {showAnswer ? (
                <div className="space-y-4">
                  {/* Detailed 14-form list if sequential or reverse */}
                  {currentQuestion.correctAnswersList ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
                      {currentQuestion.correctAnswersList.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handlePlayAudio(item.form)}
                          className="p-2.5 rounded-xl bg-white border border-stone-200 text-right space-y-0.5 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
                          title="کلیک برای شنیدن تلفظ استودیویی Gemini"
                        >
                          <div className="flex items-center justify-between text-[11px] text-stone-400">
                            <span>صیغه {item.seegheh.index}</span>
                            <span>{item.seegheh.pronoun}</span>
                          </div>
                          <div className="font-arabic font-bold text-emerald-950 text-base flex items-center justify-between">
                            <span>{item.form}</span>
                            <Volume2 className="w-3.5 h-3.5 text-stone-300 group-hover:text-emerald-700 transition-colors" />
                          </div>
                          <div className="text-[10px] text-stone-500 truncate">
                            {item.seegheh.nameFa}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Single target or inverted answer */
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs text-stone-500 block mb-1">
                          پاسخ دقیق مورد انتظار:
                        </span>
                        <span className="text-2xl font-bold font-arabic text-emerald-950">
                          {currentQuestion.correctAnswer}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(currentQuestion.correctAnswer)}
                        className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer w-fit transition-colors border border-emerald-200"
                        title="تلفظ با کیفیت استودیویی Gemini TTS"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-700" />
                        <span>تلفظ فصیح (Gemini)</span>
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-stone-400">
                  جهت جلوگیری از لو رفتن، پاسخ پنهان است.
                </div>
              )}
            </div>

            {/* Grading Buttons for Examiner */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-stone-600 block">
                نتیجه پاسخ دانشجو ({currentAnswerer.name}) را ثبت کنید:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleGrade(10)}
                  className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>درست و مسلط گفت (+۱۰)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade(5)}
                  className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>با تذکر / نیمه‌درست (+۵)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade(0)}
                  className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>اشتباه گفت یا بلد نبود (۰)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* B. Solo Mode */}
        {config.mode === 'solo' && (
          <div className="pt-4 border-t border-stone-200 space-y-5">
            {/* Solo Method 1: Multiple Choice */}
            {config.soloAnswerMethod === 'choice' && currentQuestion.options && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-stone-700 block">
                  یکی از گزینه‌های زیر را انتخاب کنید:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const isSelected = selectedSoloOption === opt;
                    const isCorrect = opt === currentQuestion.correctAnswer;
                    let style = 'bg-stone-50 border-stone-200 hover:border-emerald-300';

                    if (soloSubmitted) {
                      if (isCorrect) {
                        style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        style = 'bg-rose-50 border-rose-500 text-rose-950 font-bold';
                      } else {
                        style = 'bg-stone-50 border-stone-200 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSoloOptionClick(opt)}
                        disabled={soloSubmitted}
                        className={`p-4 rounded-xl border text-right transition-all cursor-pointer font-arabic text-base flex items-center justify-between ${style}`}
                      >
                        <span className="leading-relaxed">{opt}</span>
                        {soloSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {soloSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {soloSubmitted && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleGrade(
                          selectedSoloOption === currentQuestion.correctAnswer ? 10 : 0
                        )
                      }
                      className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>ادامه و سوال بعدی</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Solo Method 2: Flashcard */}
            {config.soloAnswerMethod === 'flashcard' && (
              <div className="space-y-4">
                {!soloFlashcardRevealed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSoloFlashcardRevealed(true);
                      setShowAnswer(true);
                    }}
                    className="w-full py-6 bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-stone-700 hover:bg-stone-100 transition-all font-semibold text-sm cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <Eye className="w-6 h-6 text-emerald-700" />
                    <span>پاسخ را در ذهن خود بگویید، سپس کلیک کنید</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-xs text-stone-500 block mb-1">
                        پاسخ صحیح:
                      </span>
                      <span className="font-arabic font-bold text-2xl text-emerald-950 block">
                        {currentQuestion.correctAnswer}
                      </span>
                      <p className="text-xs text-emerald-900 mt-2">
                        {currentQuestion.explanation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleGrade(10)}
                        className="py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>کاملاً درست گفتم (+۱۰)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGrade(0)}
                        className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>اشتباه گفتم (۰)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Solo Method 3: Voice */}
            {config.soloAnswerMethod === 'voice' && (
              <div className="space-y-4">
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </button>

                  <span className="text-xs text-stone-600 block">
                    {isListening
                      ? 'در حال شنیدن... فعل عربی را به زبان بیاورید'
                      : 'روی میکروفون کلیک کنید و پاسخ را تلفظ کنید'}
                  </span>

                  {voiceTranscript && (
                    <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs font-arabic text-stone-800">
                      صدای دریافت شده: «{voiceTranscript}»
                    </div>
                  )}

                  {voiceFeedback === 'correct' && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>آفرین! تلفظ و صیغه کاملاً منطبق بود.</span>
                    </div>
                  )}

                  {voiceFeedback === 'wrong' && (
                    <div className="text-xs font-bold text-rose-700 flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>با پاسخ مورد انتظار مطابقت نداشت. پاسخ صحیح: {currentQuestion.correctAnswer}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    {showAnswer ? 'پنهان‌سازی کلید' : 'مشاهده کلید پاسخ'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGrade(voiceFeedback === 'correct' ? 10 : 0)}
                    className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    ثبت و سوال بعد
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
