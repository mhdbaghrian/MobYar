import React, { useState, useMemo } from 'react';
import { X, Search, Volume2, BookOpen, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { VerbConjugation, BabId } from '../types/sarf';
import { VERB_LIBRARY, ABWAB_LIST, SEEGHEHS, getBabById } from '../data/abwab';
import { speakArabic } from '../utils/speech';

interface VerbExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBabForSession?: (babId: BabId) => void;
}

export const VerbExplorerModal: React.FC<VerbExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectBabForSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mudaaf' | 'thulathi_mujarrad' | 'thulathi_mazid' | 'rubai'>('all');
  const [selectedBabFilter, setSelectedBabFilter] = useState<string>('all');
  const [expandedVerbKey, setExpandedVerbKey] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const filteredVerbs = useMemo(() => {
    return VERB_LIBRARY.filter((v) => {
      // Category filter
      const bab = getBabById(v.babId);
      if (selectedCategory === 'mudaaf') {
        if (v.verbType !== 'mudaaf') return false;
      } else if (selectedCategory === 'thulathi_mujarrad') {
        if (!v.babId.startsWith('mujarrad')) return false;
      } else if (selectedCategory === 'thulathi_mazid') {
        if (bab.category !== 'thulathi_mazid') return false;
      } else if (selectedCategory === 'rubai') {
        if (bab.category !== 'rubai_mujarrad' && bab.category !== 'rubai_mazid') return false;
      }

      // Bab specific filter
      if (selectedBabFilter !== 'all' && v.babId !== selectedBabFilter) {
        return false;
      }

      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const rootNorm = v.root.replace(/\s+/g, '');
        const qNorm = q.replace(/\s+/g, '');
        const madiStr = v.madi[0];
        const mudariStr = v.mudari[0];
        const meaning = v.meaningBase.toLowerCase();

        return (
          v.root.includes(q) ||
          rootNorm.includes(qNorm) ||
          madiStr.includes(q) ||
          mudariStr.includes(q) ||
          meaning.includes(q) ||
          bab.name.includes(q) ||
          bab.persianName.includes(q)
        );
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedBabFilter]);

  const handlePlayAudio = async (text: string) => {
    setPlayingWord(text);
    await speakArabic(text, () => setPlayingWord(null));
    setTimeout(() => setPlayingWord(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>دانشنامه و بانک جامع افعال صرفی</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold">
                  {filteredVerbs.length} فعل
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                پوشش گسترده ریشه‌ها، ابواب شش‌گانه ثلاثی مجرد، ابواب دهگانه مزید، و رباعی با تلفظ استودیویی Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-stone-200 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجو بر اساس ریشه (مثل ک ر م)، فعل (أَکْرَمَ)، معنی (یاری کرد) یا باب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-600 absolute left-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                >
                  پاک کردن
                </button>
              )}
            </div>

            {/* Bab dropdown filter */}
            <div className="w-full sm:w-64">
              <select
                value={selectedBabFilter}
                onChange={(e) => setSelectedBabFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">همه ابواب ({ABWAB_LIST.length} باب)</option>
                {ABWAB_LIST.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px] ml-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> فیلتر:
            </span>
            {[
              { id: 'all', label: 'همه افعال' },
              { id: 'mudaaf', label: 'افعال مضاعف (مَدَّ، فَرَّ...)' },
              { id: 'thulathi_mujarrad', label: 'ثلاثی مجرد (شش باب)' },
              { id: 'thulathi_mazid', label: 'ثلاثی مزید (۱۰ باب)' },
              { id: 'rubai', label: 'رباعی مجرد و مزید' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id as any);
                  setSelectedBabFilter('all');
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verbs Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-stone-50/40">
          {filteredVerbs.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm font-medium">فعلی با مشخصات جستجو شده یافت نشد.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedBabFilter('all');
                }}
                className="text-xs text-emerald-700 hover:underline cursor-pointer"
              >
                نمایش همه افعال
              </button>
            </div>
          ) : (
            filteredVerbs.map((v, idx) => {
              const bab = getBabById(v.babId);
              const verbKey = `${v.root}_${v.babId}_${v.madi[0]}_${idx}`;
              const isExpanded = expandedVerbKey === verbKey;
              const isRubai = bab.category === 'rubai_mujarrad' || bab.category === 'rubai_mazid';

              return (
                <div
                  key={verbKey}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all overflow-hidden"
                >
                  {/* Summary Bar */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Audio Button */}
                      <button
                        onClick={() => handlePlayAudio(`${v.madi[0]}، ${v.mudari[0]}`)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                          playingWord === `${v.madi[0]}، ${v.mudari[0]}`
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-pulse'
                            : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                        }`}
                        title="شنیدن تلفظ با هوش مصنوعی Gemini TTS"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Verb and Root info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-arabic font-extrabold text-xl text-stone-900">
                            {v.madi[0]}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="font-arabic font-bold text-lg text-emerald-800">
                            {v.mudari[0]}
                          </span>
                          {v.masdar && (
                            <>
                              <span className="text-stone-300">·</span>
                              <span className="text-xs font-arabic text-stone-500">
                                {v.masdar}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="font-mono text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded">
                            ریشه: [ {v.root} ]
                          </span>
                          <span className="text-stone-700 font-medium">
                            «{v.meaningBase}»
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bab tag and actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold font-arabic shrink-0 ${
                          isRubai
                            ? 'bg-purple-100 text-purple-800'
                            : bab.category === 'thulathi_mazid'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                        }`}
                      >
                        {bab.name}
                      </span>

                      {onSelectBabForSession && (
                        <button
                          onClick={() => {
                            onSelectBabForSession(v.babId);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          تمرین این باب
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedVerbKey(isExpanded ? null : verbKey)}
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title={isExpanded ? 'بستن جدول' : 'مشاهده جدول ۱۴ صیغه'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quranic Ayah if available */}
                  {v.quranicAyah && (
                    <div className="px-4 py-1.5 bg-stone-50/70 border-t border-stone-100 text-xs text-stone-600 flex items-center gap-2 font-arabic">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>شاهد قرآنی: ﴿ {v.quranicAyah} ﴾</span>
                    </div>
                  )}

                  {/* Expanded 14-form Table */}
                  {isExpanded && (
                    <div className="p-4 border-t border-stone-200 bg-stone-50/50 space-y-3">
                      {/* Sub-tabs for modes: معلوم، مجهول، امر، نهی */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-stone-700 ml-1">حالت صیغه:</span>
                          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            ماضی و مضارع معلوم
                          </span>
                          {v.amr && (
                            <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded">
                              امر حاضر و غائب
                            </span>
                          )}
                          {v.nahy && (
                            <span className="text-[11px] text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded">
                              نهی (با لا جازمه)
                            </span>
                          )}
                          {v.madiMajhul ? (
                            <span className="text-[11px] text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded">
                              مجهول (ماضی و مضارع)
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                              (لازم - بدون مجهول)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-emerald-700">
                          روی هر صیغه برای تلفظ استودیویی Gemini کلیک کنید
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {SEEGHEHS.map((s, idx) => (
                          <div
                            key={s.index}
                            className="p-2.5 bg-white rounded-xl border border-stone-200/80 text-right space-y-1.5 hover:border-emerald-300 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-[10px] text-stone-400">
                              <span>#{s.index}</span>
                              <span className="font-bold text-stone-600">{s.pronoun}</span>
                            </div>

                            {/* Madi */}
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-stone-400 block">ماضی معلوم:</span>
                              <button
                                onClick={() => handlePlayAudio(v.madi[idx])}
                                className="w-full text-right hover:text-emerald-700 transition-colors cursor-pointer group flex items-center justify-between"
                                title="شنیدن ماضی معلوم"
                              >
                                <span className="font-arabic font-bold text-emerald-950 text-sm">
                                  {v.madi[idx]}
                                </span>
                                <Volume2 className="w-3 h-3 text-stone-300 group-hover:text-emerald-700 shrink-0" />
                              </button>
                            </div>

                            {/* Mudari */}
                            <div className="space-y-0.5 pt-1 border-t border-stone-100">
                              <span className="text-[9px] text-stone-400 block">مضارع معلوم:</span>
                              <button
                                onClick={() => handlePlayAudio(v.mudari[idx])}
                                className="w-full text-right hover:text-emerald-700 transition-colors cursor-pointer group flex items-center justify-between"
                                title="شنیدن مضارع معلوم"
                              >
                                <span className="font-arabic font-bold text-stone-700 text-xs">
                                  {v.mudari[idx]}
                                </span>
                                <Volume2 className="w-3 h-3 text-stone-300 group-hover:text-emerald-700 shrink-0" />
                              </button>
                            </div>

                            {/* Amr */}
                            {v.amr && (
                              <div className="space-y-0.5 pt-1 border-t border-amber-100/80 bg-amber-50/30 -mx-1 px-1 rounded">
                                <span className="text-[9px] text-amber-700 block font-medium">
                                  {idx >= 6 && idx <= 11 ? 'امر حاضر:' : 'امر به لام:'}
                                </span>
                                <button
                                  onClick={() => handlePlayAudio(v.amr![idx])}
                                  className="w-full text-right hover:text-amber-800 transition-colors cursor-pointer group flex items-center justify-between"
                                  title="شنیدن امر"
                                >
                                  <span className="font-arabic font-bold text-amber-950 text-xs">
                                    {v.amr[idx]}
                                  </span>
                                  <Volume2 className="w-3 h-3 text-amber-300 group-hover:text-amber-800 shrink-0" />
                                </button>
                              </div>
                            )}

                            {/* Nahy */}
                            {v.nahy && (
                              <div className="space-y-0.5 pt-1 border-t border-rose-100/80 bg-rose-50/30 -mx-1 px-1 rounded">
                                <span className="text-[9px] text-rose-700 block font-medium">نهی:</span>
                                <button
                                  onClick={() => handlePlayAudio(v.nahy![idx])}
                                  className="w-full text-right hover:text-rose-800 transition-colors cursor-pointer group flex items-center justify-between"
                                  title="شنیدن نهی"
                                >
                                  <span className="font-arabic font-bold text-rose-950 text-xs truncate">
                                    {v.nahy[idx]}
                                  </span>
                                  <Volume2 className="w-3 h-3 text-rose-300 group-hover:text-rose-800 shrink-0" />
                                </button>
                              </div>
                            )}

                            {/* Majhul */}
                            {v.madiMajhul && v.mudariMajhul && (
                              <div className="space-y-0.5 pt-1 border-t border-purple-100/80 bg-purple-50/30 -mx-1 px-1 rounded">
                                <span className="text-[9px] text-purple-700 block font-medium">مجهول:</span>
                                <button
                                  onClick={() => handlePlayAudio(`${v.madiMajhul![idx]}، ${v.mudariMajhul![idx]}`)}
                                  className="w-full text-right hover:text-purple-800 transition-colors cursor-pointer group flex items-center justify-between"
                                  title="شنیدن ماضی و مضارع مجهول"
                                >
                                  <span className="font-arabic font-semibold text-purple-950 text-[11px] truncate">
                                    {v.madiMajhul[idx]} · {v.mudariMajhul[idx]}
                                  </span>
                                  <Volume2 className="w-3 h-3 text-purple-300 group-hover:text-purple-800 shrink-0" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
