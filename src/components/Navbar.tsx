import React from 'react';
import {
  BookOpen,
  Table,
  History,
  RefreshCw,
  Volume2,
  VolumeX,
  Flame,
  User,
  GraduationCap,
} from 'lucide-react';
import { UserProfile } from '../types/gamification';
import { getAvatarById } from '../data/avatars';

interface NavbarProps {
  onOpenWorkshop: () => void;
  onOpenSeeghehTable: () => void;
  onOpenVerbLibrary: () => void;
  onOpenNounLibrary: () => void;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onOpenJourney: () => void;
  onResetSession?: () => void;
  isSessionActive: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeProfile?: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWorkshop,
  onOpenSeeghehTable,
  onOpenVerbLibrary,
  onOpenNounLibrary,
  onOpenHistory,
  onOpenProfile,
  onOpenJourney,
  onResetSession,
  isSessionActive,
  soundEnabled,
  onToggleSound,
  activeProfile,
}) => {
  const avatar = activeProfile ? getAvatarById(activeProfile.avatarId) : null;

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs" dir="rtl">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Logo & Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center font-arabic font-bold text-xl shadow-xs shrink-0">
            ص
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight leading-tight">
                مباحثه یار
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                سامانه هوشمند صرف
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden md:block">
              کارگاه، مباحثه کلاسی و سیر خودآموز ۰ تا ۱۰۰
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-stone-600">
          <button
            onClick={onOpenJourney}
            className="flex items-center gap-1.5 hover:text-emerald-900 transition-colors px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 text-emerald-900 border border-emerald-200/80 cursor-pointer shadow-2xs"
          >
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>سیر مرحله‌بندی (۰ تا ۱۰۰)</span>
          </button>

          <button
            onClick={onOpenVerbLibrary}
            className="flex items-center gap-1.5 hover:text-emerald-800 transition-colors py-1 cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1.5 rounded-xl"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>بانک افعال</span>
          </button>

          <button
            onClick={onOpenNounLibrary}
            className="flex items-center gap-1.5 hover:text-teal-800 transition-colors py-1 cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-800 px-2.5 py-1.5 rounded-xl"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>بانک مشتقات</span>
          </button>

          <button
            onClick={onOpenWorkshop}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors px-2 py-1.5 rounded-xl cursor-pointer"
          >
            <span>قواعد ابواب</span>
          </button>

          <button
            onClick={onOpenSeeghehTable}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors px-2 py-1.5 rounded-xl cursor-pointer"
          >
            <Table className="w-3.5 h-3.5 text-stone-400" />
            <span>جدول ۱۴ صیغه</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors px-2 py-1.5 rounded-xl cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-stone-400" />
            <span>سوابق</span>
          </button>
        </nav>

        {/* Zone 3: Profile Badge & Actions */}
        <div className="flex items-center gap-2">
          {/* Active Student Profile Badge Button */}
          {activeProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 sm:pr-1.5 sm:pl-3 bg-stone-50 hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-300 rounded-2xl transition-all cursor-pointer shadow-2xs group"
              title="پروفایل، حساب کاربری و کارنامه"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-lg shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {avatar?.emoji || '🎓'}
              </div>
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-stone-900 leading-tight">
                    {activeProfile.nickname}
                  </span>
                  {activeProfile.streak > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 font-bold bg-amber-100/70 px-1 rounded">
                      <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {activeProfile.streak}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 block leading-tight">
                  سطح {activeProfile.level} · {activeProfile.title}
                </span>
              </div>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'صدا فعال است' : 'صدا غیرفعال است'}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Reset / End session button if active */}
          {isSessionActive && onResetSession && (
            <button
              onClick={onResetSession}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
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
