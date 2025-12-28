import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { QuestionCard } from '@/components/QuestionCard';
import { QuestionList } from '@/components/QuestionList';
import { useQuizState } from '@/hooks/useQuizState';
import { Helmet } from 'react-helmet';

const Index = () => {
  const {
    state,
    currentIndex,
    currentQuestion,
    totalQuestions,
    isShuffled,
    selectedUnit,
    isLoading,
    goToQuestion,
    goNext,
    goPrev,
    filterByUnit,
    toggleShuffle,
    updateStats,
    toggleSaveQuestion,
    isSaved,
    showOnlySaved,
    showAll
  } = useQuizState();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCardMode, setIsCardMode] = useState(false);
  const [isMyListMode, setIsMyListMode] = useState(false);

  const currentQuestionId = state.order[currentIndex] ?? -1;

  const handleGrade = useCallback((hits: string[], misses: string[], score: number) => {
    if (currentQuestionId >= 0) {
      updateStats(currentQuestionId, score);
    }
  }, [currentQuestionId, updateStats]);

  const handleToggleSave = useCallback(() => {
    if (currentQuestionId >= 0) {
      toggleSaveQuestion(currentQuestionId);
    }
  }, [currentQuestionId, toggleSaveQuestion]);

  const handleMyListToggle = useCallback(() => {
    if (isMyListMode) {
      showAll();
      setIsMyListMode(false);
    } else {
      const success = showOnlySaved();
      if (success) {
        setIsMyListMode(true);
      } else {
        alert('아직 저장한 문제가 없습니다.');
      }
    }
  }, [isMyListMode, showAll, showOnlySaved]);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>감PT - 회계감사 공부의 동반자</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="orb w-12 h-12 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">문제 데이터를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>감PT - 회계감사 공부의 동반자</title>
        <meta name="description" content="감PT는 회계감사 공부를 위한 키워드 기반 학습 플랫폼입니다. 효율적인 학습과 체계적인 문제 풀이로 회계감사 시험을 준비하세요." />
        <meta property="og:title" content="감PT - 회계감사 공부의 동반자" />
        <meta property="og:description" content="회계감사 공부를 위한 키워드 기반 학습 플랫폼" />
        <meta property="og:image" content="https://i.ibb.co/d45hQ507/Plugin-icon-3.jpg" />
        <link rel="icon" href="https://i.ibb.co/d45hQ507/Plugin-icon-3.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          selectedUnit={selectedUnit}
          onUnitChange={filterByUnit}
          onPrev={goPrev}
          onNext={goNext}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isShuffled={isShuffled}
          isCardMode={isCardMode}
          isMyListMode={isMyListMode}
          onShuffleToggle={() => {
            toggleShuffle();
          }}
          onCardModeToggle={() => setIsCardMode(!isCardMode)}
          onMyListToggle={handleMyListToggle}
        />

        <main className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
            <QuestionCard
              question={currentQuestion}
              questionId={currentQuestionId}
              isCardMode={isCardMode}
              isSaved={currentQuestionId >= 0 ? isSaved(currentQuestionId) : false}
              onGrade={handleGrade}
              onToggleSave={handleToggleSave}
              onNext={goNext}
            />

            <QuestionList
              order={state.order}
              currentIndex={currentIndex}
              stats={state.stats}
              onSelect={goToQuestion}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex justify-center gap-3 sm:hidden">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex-1 py-2 px-4 bg-muted text-foreground rounded-xl font-medium disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex >= totalQuestions - 1}
              className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
