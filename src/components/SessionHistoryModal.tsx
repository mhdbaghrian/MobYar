import React from 'react';
import { X, Calendar, Trophy, Trash2, BookOpen } from 'lucide-react';
import { SessionSummary } from '../types/sarf';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionSummary[];
  onClearHistory: () => void;
  onSelectSummary: (summary: SessionSummary) => void;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectSummary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              سوابق جلسات مباحثه
            </h2>
            <p className="text-xs text-stone-500">
              مشاهده و بازبینی کارنامه‌های قبلی ذخیره شده در دستگاه
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Calendar className="w-8 h-8 mx-auto opacity-50 text-stone-400" />
              <p className="text-xs">هنوز هیچ جلسه مباحثه‌ای در سیستم ذخیره نشده است.</p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.date).toLocaleDateString('fa-IR');
              const accuracy = Math.round((item.totalScore / item.maxScore) * 100) || 0;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        جلسه مباحثه ({item.config.students.length} نفر)
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {dateStr}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500">
                      افراد: {item.config.students.map((s) => s.name).join('، ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <span className="text-base font-bold text-emerald-800 tabular-nums">
                        {accuracy}٪
                      </span>
                      <span className="text-[11px] text-stone-400 block tabular-nums">
                        {item.totalScore} / {item.maxScore}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectSummary(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      مشاهده کارنامه
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          {history.length > 0 ? (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>پاک‌سازی تاریخچه</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
