import { useState, useEffect, useCallback } from 'react';
import { DATA, Question } from '@/data/questions';

const STORAGE_KEY = 'gampt_state_v1';

interface QuizStats {
  [questionId: number]: {
    score: number;
  };
}

interface QuizState {
  order: number[];
  fullOrder: number[];
  idx: number;
  stats: QuizStats;
  answers: { [key: number]: string };
  saved: { [key: number]: boolean };
}

const getInitialState = (): QuizState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.order)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load state from localStorage');
  }
  
  const baseOrder = Array.from(DATA.keys());
  return {
    order: baseOrder,
    fullOrder: baseOrder,
    idx: 0,
    stats: {},
    answers: {},
    saved: {}
  };
};

export const useQuizState = () => {
  const [state, setState] = useState<QuizState>(getInitialState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage');
    }
  }, [state]);

  const currentQuestion: Question | null = state.order.length > 0 
    ? DATA[state.order[currentIndex]] || null 
    : null;

  const totalQuestions = state.order.length;

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < state.order.length) {
      setCurrentIndex(index);
    }
  }, [state.order.length]);

  const goNext = useCallback(() => {
    if (currentIndex < state.order.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, state.order.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const filterByUnit = useCallback((unit: string) => {
    setSelectedUnit(unit);
    const allIdx = Array.from(DATA.keys());
    const filtered = unit 
      ? allIdx.filter(i => DATA[i]?.unit === unit)
      : allIdx;
    
    setState(prev => ({
      ...prev,
      order: filtered,
      idx: 0
    }));
    setCurrentIndex(0);
    setIsShuffled(false);
  }, []);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      // Restore original order
      const ordered = selectedUnit
        ? state.fullOrder.filter(id => DATA[id]?.unit === selectedUnit)
        : state.fullOrder;
      
      setState(prev => ({
        ...prev,
        order: ordered,
        idx: 0
      }));
      setCurrentIndex(0);
      setIsShuffled(false);
    } else {
      // Shuffle
      const shuffled = [...state.order];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setState(prev => ({
        ...prev,
        order: shuffled,
        idx: 0
      }));
      setCurrentIndex(0);
      setIsShuffled(true);
    }
  }, [isShuffled, selectedUnit, state.fullOrder, state.order]);

  const updateStats = useCallback((questionId: number, score: number) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [questionId]: { score }
      }
    }));
  }, []);

  const saveAnswer = useCallback((questionId: number, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  }, []);

  const toggleSaveQuestion = useCallback((questionId: number) => {
    setState(prev => ({
      ...prev,
      saved: {
        ...prev.saved,
        [questionId]: !prev.saved[questionId]
      }
    }));
  }, []);

  const isSaved = useCallback((questionId: number) => {
    return !!state.saved[questionId];
  }, [state.saved]);

  const getScore = useCallback((questionId: number) => {
    return state.stats[questionId]?.score || 0;
  }, [state.stats]);

  const getSavedQuestions = useCallback(() => {
    return Object.entries(state.saved)
      .filter(([_, saved]) => saved)
      .map(([id]) => Number(id));
  }, [state.saved]);

  const showOnlySaved = useCallback(() => {
    const savedIds = getSavedQuestions();
    if (savedIds.length === 0) {
      return false;
    }
    setState(prev => ({
      ...prev,
      order: savedIds,
      idx: 0
    }));
    setCurrentIndex(0);
    return true;
  }, [getSavedQuestions]);

  const showAll = useCallback(() => {
    filterByUnit(selectedUnit);
  }, [filterByUnit, selectedUnit]);

  return {
    state,
    currentIndex,
    currentQuestion,
    totalQuestions,
    isShuffled,
    selectedUnit,
    goToQuestion,
    goNext,
    goPrev,
    filterByUnit,
    toggleShuffle,
    updateStats,
    saveAnswer,
    toggleSaveQuestion,
    isSaved,
    getScore,
    getSavedQuestions,
    showOnlySaved,
    showAll
  };
};
