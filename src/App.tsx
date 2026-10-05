/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SessionSetup } from './components/SessionSetup';
import { MobaheseDrill } from './components/MobaheseDrill';
import { ReportCard } from './components/ReportCard';
import { RuleWorkshopModal } from './components/RuleWorkshopModal';
import { FourteenSeeghehModal } from './components/FourteenSeeghehModal';
import { SessionHistoryModal } from './components/SessionHistoryModal';
import { VerbExplorerModal } from './components/VerbExplorerModal';
import { NounExplorerModal } from './components/NounExplorerModal';
import { UserProfileModal } from './components/UserProfileModal';
import {
  BabId,
  Question,
  QuestionResult,
  QuestionType,
  SessionConfig,
  SessionSummary,
  Student,
} from './types/sarf';
import { UserProfile, LearningStage } from './types/gamification';
import {
  getActiveProfile,
  getAllProfiles,
  recordSessionToActiveProfile,
  recordStageCompletionToProfile,
  saveProfile,
} from './utils/userProfileManager';
import { generateQuestion } from './utils/questionGenerator';

const STORAGE_KEY_HISTORY = 'mobahese_sessions_history_v1';
const STORAGE_KEY_SOUND = 'mobahese_sound_enabled_v1';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'setup' | 'drill' | 'report'>('setup');
  const [setupInitialTab, setSetupInitialTab] = useState<'quick' | 'journey' | 'custom'>('quick');

  // Modals state
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);
  const [isSeeghehTableOpen, setIsSeeghehTableOpen] = useState(false);
  const [isVerbLibraryOpen, setIsVerbLibraryOpen] = useState(false);
  const [isNounLibraryOpen, setIsNounLibraryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // User Accounts & Gamification State
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => getActiveProfile());
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => getAllProfiles());

  // Badge / Reward Toast Notification
  const [achievementToast, setAchievementToast] = useState<{
    icon: string;
    title: string;
    xp: number;
  } | null>(null);

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Session History
  const [history, setHistory] = useState<SessionSummary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Session state
  const [config, setConfig] = useState<SessionConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [activeSummary, setActiveSummary] = useState<SessionSummary | null>(null);

  // Offline TTS Notice Toast
  const [offlineToast, setOfflineToast] = useState<string | null>(null);

  useEffect(() => {
    const handleNotice = (e: any) => {
      setOfflineToast(
        e.detail?.message || 'برای دریافت تلفظ جدید استودیویی Gemini به اتصال اینترنت نیاز است.'
      );
      setTimeout(() => setOfflineToast(null), 4500);
    };

    window.addEventListener('tts-offline-notice', handleNotice);
    return () => window.removeEventListener('tts-offline-notice', handleNotice);
  }, []);

  // Save sound setting
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const refreshProfilesList = () => {
    setAllProfiles(getAllProfiles());
    setActiveProfile(getActiveProfile());
  };

  // Start a new session from config
  const handleStartSession = (newConfig: SessionConfig) => {
    const totalQ = newConfig.students.length * newConfig.roundsPerStudent;
    const generated: Question[] = [];

    for (let i = 0; i < totalQ; i++) {
      generated.push(
        generateQuestion(newConfig.selectedBabIds, newConfig.selectedQuestionTypes)
      );
    }

    setConfig(newConfig);
    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setResults([]);
    setSessionStartTime(Date.now());
    setCurrentView('drill');
  };

  // Start Stage Exam from 0-to-100 Journey
  const handleStartStageExam = (stage: LearningStage) => {
    const stageConfig: SessionConfig = {
      mode: 'solo',
      students: [
        {
          id: activeProfile.id,
          name: activeProfile.nickname,
          avatarSeed: '1',
          color: activeProfile.color,
          avatarId: activeProfile.avatarId,
          profileId: activeProfile.id,
        },
      ],
      selectedBabIds: stage.targetBabIds,
      selectedQuestionTypes: stage.targetQuestionTypes,
      roundsPerStudent: stage.questionCount,
      soloAnswerMethod: 'choice',
      stageExamId: stage.id,
    };

    handleStartSession(stageConfig);
  };

  // Record a question result
  const handleRecordResult = (result: QuestionResult) => {
    const updatedResults = [...results, result];
    setResults(updatedResults);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Completed all questions in the session!
      finishSession(updatedResults);
    }
  };

  // Conclude the session and generate the report card
  const finishSession = (finalResults: QuestionResult[]) => {
    if (!config) return;

    const totalScore = finalResults.reduce((sum, r) => sum + r.score, 0);
    const maxScore = finalResults.length * 10;
    const duration = Math.round((Date.now() - sessionStartTime) / 1000);

    const summary: SessionSummary = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString(),
      config,
      results: finalResults,
      totalScore,
      maxScore,
      durationSeconds: duration,
      stageExamId: config.stageExamId,
    };

    // 1. Record to active profile
    const { profile: updatedProf, newBadges, xpEarned } = recordSessionToActiveProfile(
      summary,
      config.students[0]?.id || activeProfile.id
    );

    // 2. If it was a stage exam, record stage completion & star progress
    if (config.stageExamId) {
      const stageRes = recordStageCompletionToProfile(config.stageExamId, totalScore, maxScore);
      setActiveProfile(stageRes.profile);
      if (stageRes.newBadges.length > 0) {
        setAchievementToast({
          icon: stageRes.newBadges[0].badgeIcon,
          title: stageRes.newBadges[0].badgeTitle,
          xp: stageRes.xpEarned,
        });
        setTimeout(() => setAchievementToast(null), 5000);
      }
    } else {
      setActiveProfile(updatedProf);
      if (newBadges.length > 0) {
        setAchievementToast({
          icon: newBadges[0].badgeIcon,
          title: newBadges[0].badgeTitle,
          xp: xpEarned,
        });
        setTimeout(() => setAchievementToast(null), 5000);
      }
    }

    setAllProfiles(getAllProfiles());
    setActiveSummary(summary);
    setHistory((prev) => [summary, ...prev].slice(0, 30)); // Keep last 30
    setCurrentView('report');
  };

  // Early end session confirmation
  const handleEarlyEndSession = () => {
    if (results.length > 0) {
      if (confirm('آیا مایلید جلسه را تا همین نقطه به پایان برسانید و کارنامه را مشاهده کنید؟')) {
        finishSession(results);
      }
    } else {
      setCurrentView('setup');
    }
  };

  // Retry missed questions
  const handleRetryMissed = (missedQuestions: Question[]) => {
    if (!config || missedQuestions.length === 0) return;

    const remedialConfig: SessionConfig = {
      ...config,
      roundsPerStudent: Math.max(1, Math.ceil(missedQuestions.length / config.students.length)),
    };

    setConfig(remedialConfig);
    setQuestions(missedQuestions);
    setCurrentQuestionIndex(0);
    setResults([]);
    setSessionStartTime(Date.now());
    setCurrentView('drill');
  };

  // Restart with same config
  const handleRestartSameConfig = () => {
    if (!config) return;
    handleStartSession(config);
  };

  // Select a Bab directly from Workshop modal for a quick session
  const handleSelectBabForSession = (babId: BabId) => {
    const defaultStudent: Student = {
      id: activeProfile.id,
      name: activeProfile.nickname,
      avatarSeed: '1',
      color: activeProfile.color,
      avatarId: activeProfile.avatarId,
      profileId: activeProfile.id,
    };

    if (!config) {
      const defaultConfig: SessionConfig = {
        mode: 'solo',
        students: [defaultStudent],
        selectedBabIds: [babId],
        selectedQuestionTypes: ['sequential', 'reverse', 'targeted', 'tense_inversion'],
        roundsPerStudent: 4,
        soloAnswerMethod: 'choice',
      };
      handleStartSession(defaultConfig);
    } else {
      const updatedConfig: SessionConfig = {
        ...config,
        selectedBabIds: [babId],
      };
      handleStartSession(updatedConfig);
    }
  };

  const handleSelectNounTypeForSession = (nounType: QuestionType) => {
    const nounConfig: SessionConfig = {
      mode: 'solo',
      students: [
        {
          id: activeProfile.id,
          name: activeProfile.nickname,
          avatarSeed: '1',
          color: activeProfile.color,
          avatarId: activeProfile.avatarId,
          profileId: activeProfile.id,
        },
      ],
      selectedBabIds: ["if'al", "taf'il", "mufa'alah"],
      selectedQuestionTypes: [nounType],
      roundsPerStudent: 6,
      soloAnswerMethod: 'choice',
    };
    handleStartSession(nounConfig);
  };

  const handleStartMudaafDrill = () => {
    const mudaafConfig: SessionConfig = {
      mode: 'solo',
      students: [
        {
          id: activeProfile.id,
          name: activeProfile.nickname,
          avatarSeed: '1',
          color: activeProfile.color,
          avatarId: activeProfile.avatarId,
          profileId: activeProfile.id,
        },
      ],
      selectedBabIds: ['mujarrad_nasara', 'mujarrad_daraba', 'mujarrad_alima', "if'al", "istif'al"],
      selectedQuestionTypes: ['mudaaf_fakk', 'mudaaf_conjugation', 'amr', 'targeted'],
      roundsPerStudent: 8,
      soloAnswerMethod: 'choice',
    };
    handleStartSession(mudaafConfig);
  };

  // Calculate current Asker and Answerer based on mode
  let currentAsker: Student | undefined;
  let currentAnswerer: Student | undefined;

  if (config && config.students.length > 0) {
    if (config.mode === 'circle') {
      const askerIdx = currentQuestionIndex % config.students.length;
      const answererIdx = (currentQuestionIndex + 1) % config.students.length;
      currentAsker = config.students[askerIdx];
      currentAnswerer = config.students[answererIdx];
    } else if (config.mode === 'facilitator') {
      currentAsker =
        config.students.find((s) => s.id === config.facilitatorId) || config.students[0];
      const answererIdx = currentQuestionIndex % config.students.length;
      currentAnswerer = config.students[answererIdx];
    } else {
      // Solo mode
      currentAnswerer = config.students[0];
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans-fa">
      {/* Top Bar */}
      <Navbar
        onOpenWorkshop={() => setIsWorkshopOpen(true)}
        onOpenSeeghehTable={() => setIsSeeghehTableOpen(true)}
        onOpenVerbLibrary={() => setIsVerbLibraryOpen(true)}
        onOpenNounLibrary={() => setIsNounLibraryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenJourney={() => {
          setSetupInitialTab('journey');
          setCurrentView('setup');
        }}
        onResetSession={currentView === 'drill' ? handleEarlyEndSession : undefined}
        isSessionActive={currentView === 'drill'}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeProfile={activeProfile}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {currentView === 'setup' && (
          <SessionSetup
            onStartSession={handleStartSession}
            onOpenWorkshop={() => setIsWorkshopOpen(true)}
            activeProfile={activeProfile}
            allProfiles={allProfiles}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onStartStageExam={handleStartStageExam}
            onProfileUpdated={(up) => {
              setActiveProfile(up);
              setAllProfiles(getAllProfiles());
            }}
            initialTab={setupInitialTab}
          />
        )}

        {currentView === 'drill' && config && questions[currentQuestionIndex] && currentAnswerer && (
          <MobaheseDrill
            config={config}
            currentQuestion={questions[currentQuestionIndex]}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            currentAsker={currentAsker}
            currentAnswerer={currentAnswerer}
            soundEnabled={soundEnabled}
            onRecordResult={handleRecordResult}
            onOpenWorkshop={() => setIsWorkshopOpen(true)}
            onOpenSeeghehTable={() => setIsSeeghehTableOpen(true)}
          />
        )}

        {currentView === 'report' && activeSummary && (
          <ReportCard
            summary={activeSummary}
            activeProfile={activeProfile}
            onRetryMissed={handleRetryMissed}
            onRestartSameConfig={handleRestartSameConfig}
            onNewSession={() => {
              setSetupInitialTab('quick');
              setCurrentView('setup');
            }}
            onOpenJourney={() => {
              setSetupInitialTab('journey');
              setCurrentView('setup');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200 text-center text-xs text-stone-500 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>مباحثه یار | سامانه جامع کارگاه، سیر خودآموز ۰ تا ۱۰۰ و آزمون‌های صرف عربی</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSetupInitialTab('journey');
                setCurrentView('setup');
              }}
              className="text-amber-800 font-bold hover:underline cursor-pointer"
            >
              سیر مرحله‌بندی (۰ تا ۱۰۰)
            </button>
            <span>·</span>
            <button
              onClick={() => setIsVerbLibraryOpen(true)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              بانک افعال
            </button>
            <span>·</span>
            <button
              onClick={() => setIsNounLibraryOpen(true)}
              className="text-teal-700 font-bold hover:underline cursor-pointer"
            >
              بانک مشتقات
            </button>
            <span>·</span>
            <button
              onClick={() => setIsWorkshopOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              قواعد ابواب
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSeeghehTableOpen(true)}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              جدول صیغه‌ها
            </button>
            <span>·</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-emerald-800 font-bold hover:underline cursor-pointer"
            >
              پروفایل و نشان‌ها
            </button>
          </div>
        </div>
      </footer>

      {/* Achievement & Badge Unlock Toast */}
      {achievementToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/40 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center text-2xl shadow-sm shrink-0 font-bold">
            {achievementToast.icon}
          </div>
          <div>
            <span className="text-[11px] text-amber-300 font-bold block">
              🎉 نشان و دستاورد جدید باز شد!
            </span>
            <span className="font-extrabold text-sm text-white block">
              {achievementToast.title}
            </span>
            <span className="text-[10px] text-emerald-300">
              +{achievementToast.xp} امتیاز تجربه (XP) به حساب شما افزوده شد
            </span>
          </div>
        </div>
      )}

      {/* Offline Toast Notification */}
      {offlineToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span>{offlineToast}</span>
          <button
            onClick={() => setOfflineToast(null)}
            className="text-stone-400 hover:text-white mr-2 text-[11px] font-bold cursor-pointer"
          >
            متوجه شدم
          </button>
        </div>
      )}

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        activeProfile={activeProfile}
        allProfiles={allProfiles}
        onProfileUpdated={(updated) => {
          setActiveProfile(updated);
          refreshProfilesList();
        }}
        onProfileSwitched={(newProf) => {
          setActiveProfile(newProf);
          refreshProfilesList();
        }}
        onProfilesListChanged={refreshProfilesList}
      />

      <VerbExplorerModal
        isOpen={isVerbLibraryOpen}
        onClose={() => setIsVerbLibraryOpen(false)}
        onSelectBabForSession={handleSelectBabForSession}
      />

      <NounExplorerModal
        isOpen={isNounLibraryOpen}
        onClose={() => setIsNounLibraryOpen(false)}
        onSelectNounTypeForSession={handleSelectNounTypeForSession}
      />

      <RuleWorkshopModal
        isOpen={isWorkshopOpen}
        onClose={() => setIsWorkshopOpen(false)}
        onSelectBabForSession={handleSelectBabForSession}
        onStartMudaafDrill={handleStartMudaafDrill}
      />

      <FourteenSeeghehModal
        isOpen={isSeeghehTableOpen}
        onClose={() => setIsSeeghehTableOpen(false)}
      />

      <SessionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onSelectSummary={(sum) => {
          setActiveSummary(sum);
          setCurrentView('report');
        }}
      />
    </div>
  );
}
