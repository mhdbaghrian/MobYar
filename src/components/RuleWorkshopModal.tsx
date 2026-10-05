import React, { useState } from 'react';
import { X, Volume2, BookOpen, Sparkles, ArrowRight, Layers, Repeat, ShieldCheck } from 'lucide-react';
import { ABWAB_LIST } from '../data/abwab';
import { BabId, BabInfo } from '../types/sarf';
import { speakArabic } from '../utils/speech';

interface RuleWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBabForSession?: (babId: BabId) => void;
  onStartMudaafDrill?: () => void;
}

export const RuleWorkshopModal: React.FC<RuleWorkshopModalProps> = ({
  isOpen,
  onClose,
  onSelectBabForSession,
  onStartMudaafDrill,
}) => {
  const [activeTab, setActiveTab] = useState<'abwab' | 'mudaaf'>('abwab');
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
        <div className="px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                کارگاه تخصصی صرف، قواعد ابواب و افعال مضاعف
              </h2>
              <p className="text-xs text-stone-500">
                مرور کارگاهی اوزان ابواب، احکام ادغام و فک ادغام در افعال مضاعف
              </p>
            </div>
          </div>

          {/* Mode Navigation Pills */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-semibold self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab('abwab')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'abwab'
                  ? 'bg-white text-emerald-950 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>اوزان ابواب ({ABWAB_LIST.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('mudaaf')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'mudaaf'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>کارگاه افعال مضاعف & ادغام</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer hidden sm:block"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: Abwab Rules */}
        {activeTab === 'abwab' && (
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
        )}

        {/* Tab 2: Mudha'af Special Workshop & Idgham Rules */}
        {activeTab === 'mudaaf' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30">
            {/* Header Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Repeat className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-arabic">
                    کارگاه آموزشی افعال مضاعف و احکام سه‌گانه ادغام (صرف کاربردی)
                  </h3>
                </div>
                <p className="text-xs text-amber-100 leading-relaxed max-w-2xl">
                  فعل مضاعف (الفعل المضاعف) فعلی است که دو حرف اصلی آن یکسان باشند (مانند مَدَّ، فَرَّ، مَسَّ، أَمَدَّ، اِمْتَدَّ، زَلْزَلَ).
                </p>
              </div>

              {onStartMudaafDrill && (
                <button
                  onClick={() => {
                    onStartMudaafDrill();
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>شروع تمرین افعال مضاعف</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>

            {/* Three Rules of Idgham */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>۱. ادغام واجب (Obligatory)</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  هرگاه دو حرف یکسان متحرک باشند یا اولی ساکن و دومی متحرک باشد، ادغام واجب است.
                </p>
                <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-900 font-mono">
                  مثال: مَدَدَ ← <strong className="text-emerald-950">مَدَّ</strong> | يَمْدُدُ ← <strong className="text-emerald-950">يَمُدُّ</strong>
                  <br />
                  <span className="text-[10px] text-emerald-700">صیغه‌های ۱ تا ۵ ماضی و اکثر مضارع</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-rose-700" />
                  <span>۲. ادغام ممتنع / فک ادغام (Prohibited)</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">
                  هرگاه لام‌الفعل به دلیل اتصال به ضمائر بارز متحرک ساکن شود، ادغام ممتنع است و گشودن ادغام (فک ادغام) واجب می‌شود.
                </p>
                <div className="pt-2 border-t border-rose-200/60 text-xs text-rose-900 font-mono">
                  مثال: <strong className="text-rose-950">مَدَدْنَ، مَدَدْتَ</strong> (ماضی ص ۶ تا ۱۴)
                  <br />
                  <strong className="text-rose-950">يَمْدُدْنَ، تَمْدُدْنَ</strong> (مضارع ص ۶ و ۱۲)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>۳. ادغام جائز (Permissible)</span>
                </div>
                <p className="text-xs text-blue-950 leading-relaxed">
                  در صورت جزم عارض بر مفرد (مانند مضارع مجزوم مفرد یا امر حاضر مفرد مذکر)، هم ادغام با فتح و هم فک ادغام جایز است.
                </p>
                <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-900 font-mono">
                  مثال: <strong className="text-blue-950">لَمْ يَمُدَّ / لَمْ يَمْدُدْ</strong>
                  <br />
                  امر حاضر ص ۷: <strong className="text-blue-950">مُدَّ / أُمُدُدْ</strong>
                </div>
              </div>
            </div>

            {/* Conjugation Table Comparison */}
            <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 text-sm font-arabic">
                  جدول مقایسه‌ای صیغه‌های ۱۴گانه فعل مضاعف نمونه «مَدَّ يَمُدُّ» (کشید / کمک کرد):
                </h4>
                <span className="text-[11px] text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
                  رنگ قرمز نشان‌دهنده «فک ادغام» است
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <th className="p-2">شماره</th>
                      <th className="p-2">صیغه</th>
                      <th className="p-2">ضمیر</th>
                      <th className="p-2">ماضی (گذشته)</th>
                      <th className="p-2">مضارع (حال)</th>
                      <th className="p-2">امر حاضر / به لام</th>
                      <th className="p-2">وضعیت ادغام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200/70">
                    <tr className="hover:bg-stone-50">
                      <td className="p-2 font-mono">۱</td>
                      <td className="p-2">مفرد مذکر غائب</td>
                      <td className="p-2 font-mono">هُوَ</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">مَدَّ</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">يَمُدُّ</td>
                      <td className="p-2 font-arabic text-stone-700">لِيَمُدَّ</td>
                      <td className="p-2 text-emerald-700 font-medium">ادغام واجب</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-2 font-mono">۲</td>
                      <td className="p-2">مثنی مذکر غائب</td>
                      <td className="p-2 font-mono">هُما</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">مَدَّا</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">يَمُدَّانِ</td>
                      <td className="p-2 font-arabic text-stone-700">لِيَمُدَّا</td>
                      <td className="p-2 text-emerald-700 font-medium">ادغام واجب</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-2 font-mono">۳</td>
                      <td className="p-2">جمع مذکر غائب</td>
                      <td className="p-2 font-mono">هُمْ</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">مَدُّوا</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">يَمُدُّونَ</td>
                      <td className="p-2 font-arabic text-stone-700">لِيَمُدُّوا</td>
                      <td className="p-2 text-emerald-700 font-medium">ادغام واجب</td>
                    </tr>
                    <tr className="bg-rose-50/60 font-bold">
                      <td className="p-2 font-mono text-rose-900">۶</td>
                      <td className="p-2 text-rose-900">جمع مؤنث غائب</td>
                      <td className="p-2 font-mono text-rose-900">هُنَّ</td>
                      <td className="p-2 font-arabic text-rose-700 text-sm">مَدَدْنَ</td>
                      <td className="p-2 font-arabic text-rose-700 text-sm">يَمْدُدْنَ</td>
                      <td className="p-2 font-arabic text-rose-700">لِيَمْدُدْنَ</td>
                      <td className="p-2 text-rose-700">فک ادغام (امتناع)</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="p-2 font-mono">۷</td>
                      <td className="p-2">مفرد مذکر مخاطب</td>
                      <td className="p-2 font-mono">أَنْتَ</td>
                      <td className="p-2 font-arabic text-rose-700 font-bold">مَدَدْتَ</td>
                      <td className="p-2 font-arabic font-bold text-emerald-800">تَمُدُّ</td>
                      <td className="p-2 font-arabic font-bold text-amber-800">مُدَّ / أُمُدُدْ</td>
                      <td className="p-2 text-amber-700 font-medium">ادغام جائز در امر</td>
                    </tr>
                    <tr className="bg-rose-50/60 font-bold">
                      <td className="p-2 font-mono text-rose-900">۱۲</td>
                      <td className="p-2 text-rose-900">جمع مؤنث مخاطب</td>
                      <td className="p-2 font-mono text-rose-900">أَنْتُنَّ</td>
                      <td className="p-2 font-arabic text-rose-700 text-sm">مَدَدْتُنَّ</td>
                      <td className="p-2 font-arabic text-rose-700 text-sm">تَمْدُدْنَ</td>
                      <td className="p-2 font-arabic text-rose-700 font-bold">اُُمْدُدْنَ</td>
                      <td className="p-2 text-rose-700">فک ادغام (امتناع)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quranic Examples */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
              <span className="font-bold text-amber-950 text-sm block font-arabic">
                نمونه‌های برجسته افعال مضاعف در قرآن کریم:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-amber-900">
                <li className="p-2 bg-white/80 rounded-lg border border-amber-200/60">
                  ﴿ أَلَمْ تَرَ إِلَى رَبِّکَ کَيْفَ <strong className="text-amber-950 font-arabic text-sm">مَدَّ</strong> الظِّلَّ ﴾ (فرقان/۴۵) - باب نصر (ادغام واجب)
                </li>
                <li className="p-2 bg-white/80 rounded-lg border border-amber-200/60">
                  ﴿ إِنْ <strong className="text-amber-950 font-arabic text-sm">تَمْسَسْکُمْ</strong> حَسَنَةٌ تَسُؤْهُمْ ﴾ (آل عمران/۱۲۰) - جزم و فک ادغام
                </li>
                <li className="p-2 bg-white/80 rounded-lg border border-amber-200/60">
                  ﴿ وَمَنْ <strong className="text-amber-950 font-arabic text-sm">يَرْتَدَّ / يَرْتَدِدْ</strong> مِنْکُمْ ﴾ (بقره/۲۱۷) - حالت جائز در جزم
                </li>
                <li className="p-2 bg-white/80 rounded-lg border border-amber-200/60">
                  ﴿ إِذَا <strong className="text-amber-950 font-arabic text-sm">زُلْزِلَتِ</strong> الْأَرْضُ زِلْزَالَهَا ﴾ (زلزله/۱) - رباعی مضاعف
                </li>
              </ul>
            </div>
          </div>
        )}

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
