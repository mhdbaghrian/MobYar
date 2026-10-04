import React, { useState } from 'react';
import { X, Volume2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { ABWAB_LIST } from '../data/abwab';
import { BabId, BabInfo } from '../types/sarf';
import { speakArabic } from '../utils/speech';

interface RuleWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBabForSession?: (babId: BabId) => void;
}

export const RuleWorkshopModal: React.FC<RuleWorkshopModalProps> = ({
  isOpen,
  onClose,
  onSelectBabForSession,
}) => {
  const [selectedBab, setSelectedBab] = useState<BabInfo>(ABWAB_LIST[0]);
  const [babCategoryFilter, setBabCategoryFilter] = useState<'all' | 'thulathi_mujarrad' | 'thulathi_mazid' | 'rubai'>('all');

  if (!isOpen) return null;

  const filteredAbwab = ABWAB_LIST.filter((b) => {
    if (babCategoryFilter === 'thulathi_mujarrad') {
      return b.category === 'thulathi_mujarrad';
    }
    if (babCategoryFilter === 'thulathi_mazid') {
      return b.category === 'thulathi_mazid';
    }
    if (babCategoryFilter === 'rubai') {
      return b.category === 'rubai_mujarrad' || b.category === 'rubai_mazid';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                کارگاه آموزشی قواعد و اوزان ابواب صرف
              </h2>
              <p className="text-xs text-stone-500">
                مرور کارگاهی وزن ماضی، مضارع، مصدر و خاصیت‌های معنایی ابواب قبل از مباحثه
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-zone content */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Right sidebar: List of Abwab */}
          <div className="md:col-span-4 border-l border-stone-200 p-4 overflow-y-auto space-y-2 bg-stone-50/40">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-semibold text-stone-500">
                فهرست ابواب ({ABWAB_LIST.length} باب)
              </span>
            </div>

            {/* Category tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-200/60 rounded-xl text-[10px] font-medium mb-3">
              <button
                type="button"
                onClick={() => setBabCategoryFilter('all')}
                className={`py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  babCategoryFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                همه ({ABWAB_LIST.length})
              </button>
              <button
                type="button"
                onClick={() => setBabCategoryFilter('thulathi_mujarrad')}
                className={`py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  babCategoryFilter === 'thulathi_mujarrad'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                مجرد (۷)
              </button>
              <button
                type="button"
                onClick={() => setBabCategoryFilter('thulathi_mazid')}
                className={`py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  babCategoryFilter === 'thulathi_mazid'
                    ? 'bg-white text-blue-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                مزید (۱۰)
              </button>
              <button
                type="button"
                onClick={() => setBabCategoryFilter('rubai')}
                className={`py-1 rounded-lg transition-colors cursor-pointer text-center ${
                  babCategoryFilter === 'rubai'
                    ? 'bg-white text-purple-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                رباعی (۴)
              </button>
            </div>

            <div className="space-y-1.5">
              {filteredAbwab.map((bab) => {
                const isSelected = selectedBab.id === bab.id;
                const isRubai = bab.category === 'rubai_mujarrad' || bab.category === 'rubai_mazid';
                return (
                  <button
                    key={bab.id}
                    onClick={() => setSelectedBab(bab)}
                    className={`w-full text-right p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? isRubai
                          ? 'bg-purple-50 border-purple-300 text-purple-950 shadow-xs'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-xs'
                        : 'bg-white border-stone-200/60 text-stone-700 hover:border-stone-300 hover:bg-stone-100/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-arabic font-bold text-base truncate">
                          {bab.name}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 block mt-0.5 font-arabic truncate">
                        {bab.waznMadi} · {bab.waznMudari}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 mr-1 ${
                        isRubai
                          ? 'bg-purple-100 text-purple-800 font-bold'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {bab.category === 'rubai_mujarrad'
                        ? 'رباعی مجرد'
                        : bab.category === 'rubai_mazid'
                        ? 'رباعی مزید'
                        : bab.category === 'thulathi_mujarrad'
                        ? 'مجرد'
                        : 'ثلاثی مزید'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Left panel: Detailed Workshop Card */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold font-arabic text-emerald-950">
                    باب {selectedBab.name}
                  </h3>
                  <button
                    onClick={() =>
                      speakArabic(
                        `${selectedBab.waznMadi}، ${selectedBab.waznMudari}، ${selectedBab.waznMasdar}`
                      )
                    }
                    className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                    title="تلفظ اوزان"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-stone-600">
                  شناسنامه کامل، اوزان سه‌گانه و ویژگی‌های صرفی
                </p>
              </div>

              {onSelectBabForSession && (
                <button
                  onClick={() => {
                    onSelectBabForSession(selectedBab.id);
                    onClose();
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>مباحثه ویژه این باب</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>

            {/* Weights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 block mb-1">وزن ماضی:</span>
                <span className="text-xl font-bold font-arabic text-stone-900">
                  {selectedBab.waznMadi}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 block mb-1">وزن مضارع:</span>
                <span className="text-xl font-bold font-arabic text-stone-900">
                  {selectedBab.waznMudari}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 block mb-1">وزن مصدر:</span>
                <span className="text-xl font-bold font-arabic text-stone-900">
                  {selectedBab.waznMasdar}
                </span>
              </div>
            </div>

            {/* Meaning & Characteristics */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>معانی و کاربردهای اصلی باب:</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {selectedBab.meaning}
              </p>
            </div>

            {/* Extra letters & Morphology */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-1">حروف زائده:</span>
                <span className="font-semibold text-stone-800">
                  {selectedBab.extraLetters}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-stone-200 bg-white">
                <span className="text-stone-400 block mb-1">ریشه نمونه کارگاهی:</span>
                <span className="font-arabic font-bold text-stone-900 text-sm">
                  [ {selectedBab.exampleRoot} ]
                </span>
              </div>
            </div>

            {/* Example Conjugation Spotlight */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 block">
                  نمونه عینی در جمله و صرف:
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-medium">
                  برای شنیدن تلفظ روی فعل کلیک کنید
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => speakArabic(selectedBab.exampleMadi)}
                  className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer group"
                  title="شنیدن تلفظ ماضی"
                >
                  <span className="text-xs text-stone-500">ماضی:</span>
                  <span className="font-arabic font-bold text-emerald-900 text-base group-hover:underline">
                    {selectedBab.exampleMadi}
                  </span>
                  <Volume2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700" />
                </button>
                <button
                  type="button"
                  onClick={() => speakArabic(selectedBab.exampleMudari)}
                  className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors cursor-pointer group"
                  title="شنیدن تلفظ مضارع"
                >
                  <span className="text-xs text-stone-500">مضارع:</span>
                  <span className="font-arabic font-bold text-emerald-900 text-base group-hover:underline">
                    {selectedBab.exampleMudari}
                  </span>
                  <Volume2 className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700" />
                </button>
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <span>ترجمه:</span>
                  <span className="font-medium text-stone-800">
                    «{selectedBab.exampleTranslation}»
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            برای شروع تسلط، پرسش و پاسخ‌های کارگاهی را در بخش مباحثه آغاز کنید.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            بستن کارگاه
          </button>
        </div>
      </div>
    </div>
  );
};
