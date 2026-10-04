import React, { useState } from 'react';
import { X, Volume2, Info } from 'lucide-react';
import { SEEGHEHS } from '../data/abwab';
import { speakArabic } from '../utils/speech';

interface FourteenSeeghehModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleVerbMadi?: string;
  sampleVerbMudari?: string;
}

export const FourteenSeeghehModal: React.FC<FourteenSeeghehModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filterGroup, setFilterGroup] = useState<'all' | 'ghayeb' | 'mukhateb' | 'mutakallem'>('all');

  if (!isOpen) return null;

  const filtered = SEEGHEHS.filter(
    (s) => filterGroup === 'all' || s.group === filterGroup
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ۱۴
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                جدول صیغه‌های ۱۴ گانه و علائم صرف
              </h2>
              <p className="text-xs text-stone-500">
                شناسنامه ضمایر، علامت‌های ماضی، مضارع و دسته‌بندی‌های غائب، مخاطب و متکلم
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

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-stone-100 flex items-center gap-2 bg-white">
          <span className="text-xs font-medium text-stone-500 ml-2">دسته‌بندی:</span>
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterGroup('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterGroup === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              همه صیغه‌ها (۱ تا ۱۴)
            </button>
            <button
              onClick={() => setFilterGroup('ghayeb')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterGroup === 'ghayeb'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              غائب (۱ تا ۶)
            </button>
            <button
              onClick={() => setFilterGroup('mukhateb')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterGroup === 'mukhateb'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              مخاطب (۷ تا ۱۲)
            </button>
            <button
              onClick={() => setFilterGroup('mutakallem')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterGroup === 'mutakallem'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              متکلم (۱۳ و ۱۴)
            </button>
          </div>
        </div>

        {/* Seegheh Table Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-100/80 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">شماره</th>
                  <th className="py-3 px-4">عنوان عربی و ضمیر</th>
                  <th className="py-3 px-4">عنوان فارسی</th>
                  <th className="py-3 px-4">علامت و خصوصیت ماضی</th>
                  <th className="py-3 px-4">علامت و حرف مضارع</th>
                  <th className="py-3 px-3 text-center w-16">تلفظ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((s) => (
                  <tr
                    key={s.index}
                    className="hover:bg-emerald-50/40 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-bold text-stone-500 tabular-nums">
                      {s.index}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-arabic font-bold text-base text-stone-900">
                          {s.nameAr}
                        </span>
                        <span className="font-arabic font-semibold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                          {s.pronoun}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {s.nameFa}
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-arabic text-sm">
                      {s.markerMadi}
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-arabic text-sm">
                      {s.markerMudari}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => speakArabic(`${s.nameAr}، ${s.pronoun}`)}
                        className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-stone-100 rounded-md cursor-pointer transition-colors"
                        title="شنیدن تلفظ"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick study tip */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-1">
              <span className="font-bold">قاعده طلایی کارگاه صرف برای مباحثه:</span>
              <p className="leading-relaxed">
                در مضارع، صیغه‌های ۱، ۲، ۳ و ۶ با حرف <strong>«یـ»</strong> شروع می‌شوند.
                صیغه‌های ۴، ۵ و کل صیغه‌های مخاطب (۷ تا ۱۲) با <strong>«تـ»</strong> آغاز می‌شوند.
                صیغه ۱۳ با <strong>«أ»</strong> و صیغه ۱۴ با <strong>«نـ»</strong> ساخته می‌شود.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            متوجه شدم و بستن
          </button>
        </div>
      </div>
    </div>
  );
};
