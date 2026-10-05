import React, { useState, useMemo } from 'react';
import { X, Search, Volume2, BookOpen, Sparkles, Filter, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { NounDerivative, QuestionType } from '../types/sarf';
import { COMPREHENSIVE_NOUN_LIBRARY } from '../data/nounLibrary';
import { speakArabic } from '../utils/speech';

interface NounExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNounTypeForSession?: (type: QuestionType) => void;
}

export const NounExplorerModal: React.FC<NounExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectNounTypeForSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const filteredNouns = useMemo(() => {
    return COMPREHENSIVE_NOUN_LIBRARY.filter((n) => {
      // Type filter
      if (selectedTypeFilter !== 'all' && n.type !== selectedTypeFilter) {
        return false;
      }

      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const rootNorm = n.root.replace(/\s+/g, '');
        const qNorm = q.replace(/\s+/g, '');
        const singular = n.singularMasc;
        const wazn = n.wazn;
        const meaning = n.meaning.toLowerCase();
        const typeName = n.typeNameFa;

        return (
          n.root.includes(q) ||
          rootNorm.includes(qNorm) ||
          singular.includes(q) ||
          wazn.includes(q) ||
          meaning.includes(q) ||
          typeName.includes(q) ||
          (n.babName && n.babName.includes(q)) ||
          (n.ruleDescription && n.ruleDescription.includes(q)) ||
          (n.jamTaksir && n.jamTaksir.includes(q))
        );
      }

      return true;
    });
  }, [searchQuery, selectedTypeFilter]);

  const handlePlayAudio = async (text: string) => {
    setPlayingWord(text);
    await speakArabic(text, () => setPlayingWord(null));
    setTimeout(() => setPlayingWord(null), 2500);
  };

  if (!isOpen) return null;

  const nounCategories: { id: string; name: string; count: number }[] = [
    { id: 'all', name: 'همه مشتقات و اسماء', count: COMPREHENSIVE_NOUN_LIBRARY.length },
    { id: 'ism_fael', name: 'اسم فاعل', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'ism_fael').length },
    { id: 'ism_mafool', name: 'اسم مفعول', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'ism_mafool').length },
    { id: 'sefat_moshabbahah', name: 'صفت مشبهه', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'sefat_moshabbahah').length },
    { id: 'ism_tafdil', name: 'اسم تفضیل', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'ism_tafdil').length },
    { id: 'ism_makan_zaman', name: 'اسم مکان و زمان', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'ism_makan_zaman').length },
    { id: 'ism_ala', name: 'اسم آلت', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'ism_ala').length },
    { id: 'ism_mobalagheh', name: 'اسم مبالغه', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'ism_mobalagheh').length },
    { id: 'jam_taksir', name: 'جمع مکسر', count: COMPREHENSIVE_NOUN_LIBRARY.filter(n => n.type === 'jam_taksir').length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-teal-900/90 to-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-teal-200 flex items-center justify-center border border-white/15">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">
                  دانشنامه و بانک جامع مشتقات و اسماء
                </h2>
                <span className="text-[11px] bg-teal-800/80 px-2 py-0.5 rounded-full border border-teal-500/30 text-teal-200 font-medium">
                  {COMPREHENSIVE_NOUN_LIBRARY.length} کلمه مرجع
                </span>
              </div>
              <p className="text-xs text-teal-100/90 mt-0.5">
                فرهنگ تحلیلی مشتقات هشت‌گانه: فاعل، مفعول، تفضیل، صفت مشبهه، مکان، زمان، آلت، مبالغه و جموع تکسیر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/60 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس کلمه، ریشه (مثلاً: ن ص ر)، وزن (فاعِل، مَفْعُول...) یا معنا..."
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {nounCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedTypeFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedTypeFilter === cat.id
                    ? 'bg-teal-700 text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-stone-200/80 text-stone-600 border border-stone-200/70'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedTypeFilter === cat.id ? 'bg-teal-800 text-white' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Noun Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-100/40">
          {filteredNouns.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
              <p className="text-sm font-medium">موردی با این مشخصات یافت نشد.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTypeFilter('all');
                }}
                className="text-xs text-teal-700 underline cursor-pointer"
              >
                پاک‌سازی فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNouns.map((noun, idx) => {
                const isSelectedForPlay = playingWord === noun.singularMasc;

                return (
                  <div
                    key={`${noun.id}_${idx}`}
                    className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:border-teal-400 hover:shadow-md transition-all p-4 space-y-3.5"
                  >
                    {/* Top Row: Word, Wazn, Audio */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePlayAudio(noun.singularMasc)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                            isSelectedForPlay
                              ? 'bg-teal-100 border-teal-400 text-teal-800 animate-pulse'
                              : 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700'
                          }`}
                          title="شنیدن تلفظ با Gemini Studio TTS"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-arabic font-extrabold text-2xl text-stone-900">
                              {noun.singularMasc}
                            </span>
                            {noun.singularFem && (
                              <>
                                <span className="text-stone-300">/</span>
                                <span className="font-arabic font-bold text-lg text-emerald-800">
                                  {noun.singularFem}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-stone-700 font-medium mt-0.5">
                            معنا: «{noun.meaning}»
                          </div>
                        </div>
                      </div>

                      {/* Derivative Badge */}
                      <span className="text-[11px] px-2.5 py-1 rounded-lg font-bold bg-teal-50 text-teal-800 border border-teal-200/60 shrink-0">
                        {noun.typeNameFa}
                      </span>
                    </div>

                    {/* Metadata Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg font-mono font-semibold">
                        ریشه: [ {noun.root} ]
                      </span>
                      <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-arabic font-bold border border-amber-200/60">
                        وزن: {noun.wazn}
                      </span>
                      <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg">
                        {noun.babName}
                      </span>
                    </div>

                    {/* Inflection Table (Singular, Dual, Plural) */}
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70 text-xs space-y-1.5">
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div>
                          <span className="text-stone-400 block text-[10px] mb-0.5">مفرد</span>
                          <span className="font-arabic font-bold text-stone-900 block truncate">
                            {noun.singularMasc}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] mb-0.5">مثنی (تثنیه)</span>
                          <span className="font-arabic font-bold text-stone-900 block truncate">
                            {noun.dualMasc || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] mb-0.5">
                            {noun.jamTaksir ? 'جمع مکسر / سالم' : 'جمع سالم'}
                          </span>
                          <span className="font-arabic font-bold text-teal-900 block truncate">
                            {noun.jamTaksir || noun.pluralMasc || noun.pluralFem || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quranic Ayah if available */}
                    {noun.quranicAyah && (
                      <div className="px-3 py-1.5 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs text-amber-900 flex items-center gap-2 font-arabic">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="line-clamp-1">شاهد قرآنی: ﴿ {noun.quranicAyah} ﴾</span>
                      </div>
                    )}

                    {/* Rule Description */}
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {noun.ruleDescription}
                    </p>

                    {/* Action Button */}
                    {onSelectNounTypeForSession && (
                      <button
                        onClick={() => {
                          onSelectNounTypeForSession(noun.type as QuestionType);
                          onClose();
                        }}
                        className="w-full py-2 bg-stone-100 hover:bg-teal-50 hover:text-teal-900 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-stone-200/60 flex items-center justify-center gap-1.5"
                      >
                        <span>آغاز تمرین مباحثه روی «{noun.typeNameFa}»</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
