import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Star,
  Play,
  BookOpen,
  HelpCircle,
  Award,
  ChevronRight,
  Flame,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { LearningStage, UserProfile } from '../types/gamification';
import { LEARNING_STAGES } from '../data/learningStages';

interface LearningJourneyViewProps {
  activeProfile: UserProfile;
  onStartStageExam: (stage: LearningStage) => void;
  onOpenWorkshop?: () => void;
}

export const LearningJourneyView: React.FC<LearningJourneyViewProps> = ({
  activeProfile,
  onStartStageExam,
  onOpenWorkshop,
}) => {
  const [selectedStage, setSelectedStage] = useState<LearningStage | null>(
    LEARNING_STAGES[Math.min(activeProfile.unlockedStageId - 1, LEARNING_STAGES.length - 1)] ||
      LEARNING_STAGES[0]
  );
  const [studyTab, setStudyTab] = useState<'lesson' | 'exam_info'>('lesson');

  const unlockedStageId = activeProfile.unlockedStageId || 1;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-l from-emerald-900 via-teal-900 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium border border-white/15">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>سلوک خودآموز صرف از صفر تا صد (۱۰ مرحله استاندارد)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-arabic">
            سیر آموزش و تسلط مرحله‌ای صرف
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            این بخش برای کسانی طراحی شده که در کلاس حضوری شرکت نمی‌کنند. هر مرحله دارای درسنامه جامع،
            نکات طلایی و آزمون ارتقا است. با قبولی در هر مرحله، ستاره‌ها، امتیاز XP و مرحله بعد برای
            شما باز می‌شود.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-xl text-emerald-100 font-bold border border-white/10">
              مرحله فعال شما: {unlockedStageId} از ۱۰
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl text-amber-200 font-bold border border-white/10">
              مراحل تکمیل شده: {Object.keys(activeProfile.stageScores || {}).length} مرحله
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Roadmap on the right/top, Detailed Lesson/Exam Panel on the left/bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stage Details (Lesson & Exam Start) (7 cols) */}
        <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
          {selectedStage ? (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden flex flex-col">
              {/* Header of selected stage */}
              <div className="p-5 sm:p-6 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                      مرحله شماره {selectedStage.id}
                    </span>
                    {activeProfile.stageScores[selectedStage.id] && (
                      <span className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        {[...Array(activeProfile.stageScores[selectedStage.id].stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-stone-500 mr-1 text-[11px]">
                          (بالاترین نمره: {activeProfile.stageScores[selectedStage.id].bestScorePct}٪)
                        </span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
                    {selectedStage.title}
                  </h3>
                  <p className="text-xs text-stone-500">{selectedStage.subtitle}</p>
                </div>

                {/* Status indicator */}
                {selectedStage.id <= unlockedStageId ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>باز شده و در دسترس</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-500 rounded-xl text-xs font-bold border border-stone-200 self-start sm:self-auto">
                    <Lock className="w-4 h-4" />
                    <span>نیازمند اتمام مرحله {selectedStage.id - 1}</span>
                  </div>
                )}
              </div>

              {/* Sub-tabs: Lesson vs Exam Overview */}
              <div className="flex items-center border-b border-stone-200 px-6 pt-2 bg-white gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStudyTab('lesson')}
                  className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    studyTab === 'lesson'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>درسنامه فشرده و کاربردی</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStudyTab('exam_info')}
                  className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    studyTab === 'exam_info'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>شرایط و پاداش آزمون ارتقا</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {studyTab === 'lesson' && (
                  <div className="space-y-5">
                    {/* Summary box */}
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                      <span className="font-bold block mb-1 text-emerald-900">
                        خلاصه و هدف این درس:
                      </span>
                      {selectedStage.lessonSummary}
                    </div>

                    {/* Lesson Sections */}
                    <div className="space-y-4">
                      {selectedStage.lessonSections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3"
                        >
                          <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span>{sec.title}</span>
                          </h4>

                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                            {sec.content}
                          </p>

                          {/* Examples */}
                          {sec.examples && sec.examples.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-bold text-stone-500 block">
                                نمونه‌های مهم و شواهد:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {sec.examples.map((ex, exIdx) => (
                                  <div
                                    key={exIdx}
                                    className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs flex flex-col justify-between"
                                  >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className="font-arabic font-bold text-sm text-stone-900">
                                        {ex.term}
                                      </span>
                                      {ex.wazn && (
                                        <span className="text-[10px] font-arabic px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                                          وزن: {ex.wazn}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-stone-600">{ex.meaning}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Takeaways */}
                          {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1 text-xs text-amber-900">
                              <span className="font-bold block text-[11px] text-amber-800">
                                💡 نکات کلیدی و آزمونی:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                                {sec.keyTakeaways.map((tip, tIdx) => (
                                  <li key={tIdx}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Practical Tips */}
                    {selectedStage.practicalTips && selectedStage.practicalTips.length > 0 && (
                      <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/70 space-y-1.5">
                        <span className="text-xs font-bold text-teal-900 block">
                          🎯 فرمول طلایی مرور سریع:
                        </span>
                        {selectedStage.practicalTips.map((tip, pIdx) => (
                          <p key={pIdx} className="text-xs text-teal-800 leading-relaxed">
                            • {tip}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {studyTab === 'exam_info' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                        <span className="text-stone-400 text-[11px] block">تعداد سوالات آزمون</span>
                        <span className="font-bold text-stone-900 text-base">
                          {selectedStage.questionCount} سوال
                        </span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                        <span className="text-stone-400 text-[11px] block">حدنصاب قبولی</span>
                        <span className="font-bold text-emerald-700 text-base">
                          حداقل {selectedStage.minPassScorePct}٪
                        </span>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center col-span-2 sm:col-span-1">
                        <span className="text-stone-400 text-[11px] block">پاداش تجربه (XP)</span>
                        <span className="font-bold text-amber-600 text-base">
                          +{selectedStage.xpReward} XP
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600 leading-relaxed">
                      <span className="font-bold text-stone-900 block">
                        سیستم ستاره‌های این مرحله:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                        <span>۱ ستاره: قبولی با نمره ۷۵٪ تا ۷۹٪</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                        <span>۲ ستاره: تسلط خوب با نمره ۸۰٪ تا ۸۹٪</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                        <span>۳ ستاره: تسلط کامل و بی‌نقص با نمره ۹۰٪ به بالا</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Big Action Button */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
                  {selectedStage.id <= unlockedStageId ? (
                    <button
                      type="button"
                      onClick={() => onStartStageExam(selectedStage)}
                      className="w-full sm:flex-1 py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>
                        {activeProfile.stageScores[selectedStage.id]
                          ? 'تکرار آزمون برای بهبود ستاره‌ها'
                          : 'آغاز آزمون عبور از مرحله'}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full py-3 px-4 bg-stone-100 text-stone-500 rounded-2xl text-xs font-bold text-center border border-stone-200 flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>
                        این مرحله قفل است. ابتدا باید در آزمون مرحله {selectedStage.id - 1} پذیرفته شوید.
                      </span>
                    </div>
                  )}

                  {onOpenWorkshop && (
                    <button
                      type="button"
                      onClick={onOpenWorkshop}
                      className="w-full sm:w-auto py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-2xl font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      مشاهده جدول ابواب
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-stone-200 text-center text-stone-400">
              یک مرحله را از ستون روبرو انتخاب فرمایید.
            </div>
          )}
        </div>

        {/* Right Column: 10-Stage Visual Roadmap (5 cols) */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>ایستگاه‌های مسیر یادگیری (۱۰ مرحله):</span>
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              روی هر مرحله کلیک کنید
            </span>
          </div>

          <div className="space-y-2.5">
            {LEARNING_STAGES.map((stg) => {
              const isSelected = selectedStage?.id === stg.id;
              const isUnlocked = stg.id <= unlockedStageId;
              const isPassed = !!activeProfile.stageScores[stg.id];
              const scoreObj = activeProfile.stageScores[stg.id];

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => {
                    setSelectedStage(stg);
                    setStudyTab('lesson');
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : isPassed
                      ? 'bg-white border-emerald-200 hover:border-emerald-300'
                      : isUnlocked
                      ? 'bg-white border-stone-200 hover:border-stone-300'
                      : 'bg-stone-50 border-stone-200/70 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPassed
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : isUnlocked
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : stg.id}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-stone-900 truncate">
                          {stg.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400 block truncate">
                        {stg.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Status & Stars */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isPassed && scoreObj ? (
                      <div className="flex text-amber-500">
                        {[...Array(scoreObj.stars)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    ) : isUnlocked ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        در انتظار آزمون
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
