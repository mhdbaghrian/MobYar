import React from 'react';
import { BookOpen, Table, History, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  onOpenWorkshop: () => void;
  onOpenSeeghehTable: () => void;
  onOpenVerbLibrary: () => void;
  onOpenNounLibrary: () => void;
  onOpenHistory: () => void;
  onResetSession?: () => void;
  isSessionActive: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWorkshop,
  onOpenSeeghehTable,
  onOpenVerbLibrary,
  onOpenNounLibrary,
  onOpenHistory,
  onResetSession,
  isSessionActive,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-arabic font-bold text-xl shadow-xs">
            ص
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight leading-tight">
              مباحثه یار
            </h1>
            <p className="text-xs text-stone-500 hidden sm:block">
              سامانه هوشمند کارگاه و مباحثه کلاسی صرف
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-xs lg:text-sm font-medium text-stone-600">
          <button
            onClick={onOpenVerbLibrary}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors py-1 cursor-pointer bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-800 px-2.5 py-1 rounded-lg font-bold"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>بانک افعال</span>
          </button>

          <button
            onClick={onOpenNounLibrary}
            className="flex items-center gap-1.5 hover:text-teal-700 transition-colors py-1 cursor-pointer bg-teal-50/70 hover:bg-teal-100/70 text-teal-800 px-2.5 py-1 rounded-lg font-bold border border-teal-200/50"
          >
            <BookOpen className="w-4 h-4 text-teal-700" />
            <span>بانک اسماء و مشتقات</span>
          </button>

          <button
            onClick={onOpenWorkshop}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>کارگاه ابواب</span>
          </button>

          <button
            onClick={onOpenSeeghehTable}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>جدول ۱۴ صیغه</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>سوابق</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile shortcuts */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onOpenVerbLibrary}
              title="بانک افعال"
              className="p-1.5 text-emerald-800 bg-emerald-50 rounded-lg cursor-pointer font-bold text-xs"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenNounLibrary}
              title="بانک اسماء و مشتقات"
              className="p-1.5 text-teal-800 bg-teal-50 rounded-lg cursor-pointer font-bold text-xs"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenWorkshop}
              title="کارگاه اوزان"
              className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSeeghehTable}
              title="جدول صیغه‌ها"
              className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'صدا فعال است' : 'صدا غیرفعال است'}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {isSessionActive && onResetSession && (
            <button
              onClick={onResetSession}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>پایان جلسه</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
