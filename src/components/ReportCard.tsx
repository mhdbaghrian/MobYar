import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  BarChart3,
  RotateCcw,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { BabId, Question, QuestionResult, QuestionType, SessionSummary } from '../types/sarf';
import { ABWAB_LIST, getBabById } from '../data/abwab';

interface ReportCardProps {
  summary: SessionSummary;
  onRetryMissed?: (missedQuestions: Question[]) => void;
  onRestartSameConfig: () => void;
  onNewSession: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  summary,
  onRetryMissed,
  onRestartSameConfig,
  onNewSession,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    summary.config.students[0]?.id || null
  );

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // Ignore if unavailable
    }
  }, []);

  const { results, config } = summary;

  // Student metrics
  const studentMetrics = config.students.map((student) => {
    const studentResults = results.filter((r) => r.studentId === student.id);
    const totalQ = studentResults.length;
    const earnedScore = studentResults.reduce((sum, r) => sum + r.score, 0);
    const maxScore = totalQ * 10;
    const accuracy = maxScore > 0 ? Math.round((earnedScore / maxScore) * 100) : 0;
    const correctCount = studentResults.filter((r) => r.score === 10).length;
    const partialCount = studentResults.filter((r) => r.score === 5).length;
    const missedCount = studentResults.filter((r) => r.score === 0).length;

    // Breakdown by Bab
    const babBreakdown: Record<BabId, { total: number; score: number }> = {} as any;
    studentResults.forEach((r) => {
      const bId = r.question.babId;
      if (!babBreakdown[bId]) {
        babBreakdown[bId] = { total: 0, score: 0 };
      }
      babBreakdown[bId].total += 10;
      babBreakdown[bId].score += r.score;
    });

    // Breakdown by Type
    const typeBreakdown: Partial<Record<QuestionType, { total: number; score: number }>> = {};
    studentResults.forEach((r) => {
      const qType = r.question.type;
      if (!typeBreakdown[qType]) {
        typeBreakdown[qType] = { total: 0, score: 0 };
      }
      typeBreakdown[qType]!.total += 10;
      typeBreakdown[qType]!.score += r.score;
    });

    // Weakness analysis
    const weaknesses: string[] = [];
    Object.entries(babBreakdown).forEach(([bId, stat]) => {
      const pct = stat.total > 0 ? Math.round((stat.score / stat.total) * 100) : 100;
      if (pct < 70) {
        try {
          const bab = getBabById(bId as BabId);
          weaknesses.push(`باب ${bab.name} (${pct}٪)`);
        } catch {}
      }
    });

    if (
      typeBreakdown.reverse &&
      typeBreakdown.reverse.total > 0 &&
      typeBreakdown.reverse.score / typeBreakdown.reverse.total < 0.7
    ) {
      weaknesses.push('صرف معکوس (چالش تسلط ناخودآگاه)');
    }

    return {
      student,
      studentResults,
      totalQ,
      earnedScore,
      maxScore,
      accuracy,
      correctCount,
      partialCount,
      missedCount,
      babBreakdown,
      typeBreakdown,
      weaknesses,
    };
  });

  // Find Top Performer (MVP)
  const topPerformer = [...studentMetrics].sort((a, b) => b.accuracy - a.accuracy)[0];

  // All missed questions
  const missedResults = results.filter((r) => r.score === 0);
  const missedQuestions = missedResults.map((r) => r.question);

  // Copy text summary to clipboard
  const handleCopySummary = () => {
    let text = `📜 کارنامه جلسه مباحثه صرف عربی\n📅 تاریخ: ${new Date(
      summary.date
    ).toLocaleDateString('fa-IR')}\n`;
    text += `👥 تعداد شرکت‌کنندگان: ${config.students.length} نفر\n`;
    text += `🎯 کل سوالات پرسیده شده: ${results.length} سوال\n\n`;

    text += `🏆 ستاره مباحثه: ${topPerformer.student.name} (با ${topPerformer.accuracy}٪ تسلط)\n\n`;
    text += `📊 نتایج تفکیکی دانشجویان:\n`;

    studentMetrics.forEach((m, idx) => {
      text += `${idx + 1}. ${m.student.name}: ${m.earnedScore}/${m.maxScore} (${m.accuracy}٪)\n`;
      Object.entries(m.babBreakdown).forEach(([bId, stat]) => {
        try {
          const b = getBabById(bId as BabId);
          const p = Math.round((stat.score / stat.total) * 100);
          text += `   - باب ${b.name}: ${p}٪\n`;
        } catch {}
      });
      if (m.weaknesses.length > 0) {
        text += `   ⚠️ نیاز به تمرین: ${m.weaknesses.join('، ')}\n`;
      }
    });

    text += `\n✨ مباحثه یار | سامانه هوشمند کارگاه صرف افعال عربی`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 px-2 sm:px-4" dir="rtl">
      {/* Hero Victory Card */}
      <div className="bg-gradient-to-l from-emerald-800 via-emerald-700 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>پایان جلسه مباحثه و کارگاه صرف</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-arabic">
                کارنامه نهایی مباحثه‌گران
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                تحلیل جامع عملکرد در ابواب، صرف ترتیبی، صرف معکوس و صیغه‌ها
              </p>
            </div>

            {config.students.length > 1 && (
              <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/20 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] text-amber-200 block font-medium">
                    مباحثه‌گر برتر جلسه:
                  </span>
                  <span className="text-base font-extrabold">
                    {topPerformer.student.name}
                  </span>
                  <span className="text-xs text-emerald-200 block">
                    {topPerformer.accuracy}٪ تسلط کامل
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <span className="text-stone-300 block mb-0.5">کل سوالات:</span>
              <span className="font-bold text-lg">{results.length}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <span className="text-stone-300 block mb-0.5">پاسخ‌های کامل:</span>
              <span className="font-bold text-lg text-emerald-300">
                {results.filter((r) => r.score === 10).length}
              </span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <span className="text-stone-300 block mb-0.5">پاسخ‌های با تذکر:</span>
              <span className="font-bold text-lg text-amber-300">
                {results.filter((r) => r.score === 5).length}
              </span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <span className="text-stone-300 block mb-0.5">نیاز به مرور:</span>
              <span className="font-bold text-lg text-rose-300">
                {missedResults.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">کپی شد!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>کپی گزارش برای ایتا / تلگرام / بله</span>
              </>
            )}
          </button>

          {missedQuestions.length > 0 && onRetryMissed && (
            <button
              onClick={() => onRetryMissed(missedQuestions)}
              className="px-4 py-2 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-amber-700" />
              <span>جبران و مرور سوالات اشتباه ({missedQuestions.length} مورد)</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRestartSameConfig}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            ادامه مباحثه با همین افراد
          </button>
          <button
            onClick={onNewSession}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            جلسه جدید
          </button>
        </div>
      </div>

      {/* Student Scorecards List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-stone-900 text-base">
            کارنامه تحلیلی هر مباحثه‌گر
          </h3>
        </div>

        <div className="space-y-3">
          {studentMetrics.map((m) => {
            const isExpanded = expandedStudentId === m.student.id;
            return (
              <div
                key={m.student.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() =>
                    setExpandedStudentId(isExpanded ? null : m.student.id)
                  }
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center ${m.student.color} shadow-xs`}
                    >
                      {m.student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">
                          {m.student.name}
                        </span>
                        {m.accuracy >= 85 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            مسلط و ممتاز
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500">
                        {m.correctCount} درست کامل · {m.partialCount} با تذکر · {m.missedCount} اشتباه
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="font-extrabold text-base text-stone-900 tabular-nums">
                        {m.accuracy}٪
                      </div>
                      <div className="text-[11px] text-stone-400 tabular-nums">
                        {m.earnedScore} از {m.maxScore} امتیاز
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-stone-100 bg-stone-50/40 space-y-5">
                    {/* Performance by Bab */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-stone-700 block">
                        عملکرد در ابواب مختلف:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {Object.entries(m.babBreakdown).map(([bId, stat]) => {
                          const bab = getBabById(bId as BabId);
                          const pct =
                            stat.total > 0
                              ? Math.round((stat.score / stat.total) * 100)
                              : 0;
                          return (
                            <div
                              key={bId}
                              className="p-3 bg-white rounded-xl border border-stone-200 text-right space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-arabic font-bold text-stone-800">
                                  باب {bab.name}
                                </span>
                                <span
                                  className={`font-bold tabular-nums ${
                                    pct >= 80
                                      ? 'text-emerald-700'
                                      : pct >= 50
                                      ? 'text-amber-700'
                                      : 'text-rose-700'
                                  }`}
                                >
                                  {pct}٪
                                </span>
                              </div>
                              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    pct >= 80
                                      ? 'bg-emerald-600'
                                      : pct >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Weakness & Remedial Tips */}
                    {m.weaknesses.length > 0 ? (
                      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">پیشنهاد کارگاهی برای تقویت:</span>
                          <p className="mt-0.5">
                            دانشجو در مباحث {m.weaknesses.join(' و ')} نیاز به تکرار مجدد و صرف معکوس دارد تا تسلط خودکار حاصل شود.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>تسلط کامل و بی‌نقص در تمامی ابواب و صیغه‌های این جلسه!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Missed Questions Review */}
      {missedResults.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-stone-900 text-base">
                مرور سوالات اشتباه شده در جلسه ({missedResults.length} پرسش)
              </h3>
            </div>
            <span className="text-xs text-stone-500">
              کلید صحیح و توضیح برای بازآموزی
            </span>
          </div>

          <div className="space-y-3">
            {missedResults.map((r, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-right"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    دانشجو: {r.studentName}
                  </span>
                  <span className="text-stone-500">
                    باب {r.question.babName} · {r.question.title}
                  </span>
                </div>

                <div className="font-arabic font-bold text-base text-stone-900">
                  {r.question.prompt}
                </div>

                <div className="p-3 bg-white rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 block">پاسخ صحیح:</span>
                    <span className="font-arabic font-bold text-emerald-900 text-lg">
                      {r.question.correctAnswer}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600">
                  {r.question.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
