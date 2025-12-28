import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Question } from '@/data/questions';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question | null;
  questionId: number;
  isCardMode: boolean;
  isSaved: boolean;
  onGrade: (hits: string[], misses: string[], score: number) => void;
  onToggleSave: () => void;
}

interface GradeResult {
  hits: string[];
  misses: string[];
  message: string;
  isCorrect: boolean;
}

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const gradeAnswer = (answer: string, keywords: string[]): GradeResult => {
  const normalized = answer.toLowerCase().replace(/\s+/g, '');
  const hits: string[] = [];
  const misses: string[] = [];

  keywords.forEach(keyword => {
    const kw = keyword.toLowerCase().replace(/\s+/g, '');
    if (normalized.includes(kw)) {
      hits.push(keyword);
    } else {
      misses.push(keyword);
    }
  });

  let message = '';
  let isCorrect = false;

  if (keywords.length && misses.length === 0) {
    message = '정답입니다! 🎉';
    isCorrect = true;
  } else if (hits.length > 0) {
    message = '일부 키워드는 맞았지만, 아직 빠진 내용이 있어요.';
  } else {
    message = '키워드가 거의 보이지 않아요. 기준서를 다시 확인해 보세요.';
  }

  return { hits, misses, message, isCorrect };
};

export const QuestionCard = ({
  question,
  questionId,
  isCardMode,
  isSaved,
  onGrade,
  onToggleSave
}: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [showKeywords, setShowKeywords] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setAnswer('');
    setResult(null);
    setShowKeywords(false);
    setShowAnswer(false);
  }, [questionId]);

  const handleGrade = useCallback(() => {
    if (!question) return;
    
    // 이미 결과가 표시된 상태면 모두 숨기기
    if (result) {
      setResult(null);
      setShowKeywords(false);
      return;
    }
    
    const gradeResult = gradeAnswer(answer, question.keywords);
    setResult(gradeResult);
    setShowKeywords(true); // 채점 후 키워드 자동 표시
    
    const score = question.keywords.length > 0 
      ? Math.round((gradeResult.hits.length / question.keywords.length) * 100)
      : 0;
    
    onGrade(gradeResult.hits, gradeResult.misses, score);
  }, [answer, question, onGrade, result]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleGrade();
    }
  };

  const formatCriteria = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!question) {
    return (
      <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="text-muted-foreground">문제가 없습니다.</div>
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-bold mb-2 tracking-tight">{question.title}</h2>
      
      {/* Card Mode */}
      {isCardMode ? (
        <div className="mt-3">
          {showAnswer && (
            <div className="text-foreground leading-relaxed mb-3 pt-2 border-t border-border">
              {formatCriteria(question.criteria)}
            </div>
          )}
          
          {showKeywords && (
            <div className="flex flex-wrap gap-2 mt-3">
              {question.keywords.map((kw, i) => (
                <span key={i} className="keyword-chip">{kw}</span>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? '정답 숨기기' : '정답 보기'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowKeywords(!showKeywords)}
            >
              {showKeywords ? '키워드 숨기기' : '키워드 보기'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSave}
            >
              {isSaved ? '저장된 목록에서 제거' : '이 문제 저장하기'}
            </Button>
          </div>
        </div>
      ) : (
        /* Text Answer Mode */
        <div className="mt-3">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={6}
            placeholder="여기에 답을 입력하고 Enter 또는 '채점'을 누르세요."
            className="w-full bg-card text-foreground border border-border rounded-2xl px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button onClick={handleGrade}>채점 (Enter)</Button>
            <Button 
              variant="ghost"
              onClick={() => setShowKeywords(!showKeywords)}
            >
              {showKeywords ? '키워드 숨기기' : '키워드 보기'}
            </Button>
            <Button
              variant="ghost"
              onClick={onToggleSave}
            >
              {isSaved ? '저장된 목록에서 제거' : '이 문제 저장하기'}
            </Button>
            <div className="flex-1" />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              단축키: <span className="kbd">Enter</span> 채점 · <span className="kbd">Shift+Enter</span> 줄바꿈
            </span>
          </div>

          {/* Result */}
          {result && (
            <div className={cn(
              "result-box",
              result.isCorrect ? "ok" : "bad"
            )}>
              {result.message}
            </div>
          )}

          {/* Keywords */}
          {showKeywords && (
            <div className="flex flex-wrap gap-2 mt-3">
              {question.keywords.map((kw, i) => {
                const isHit = result?.hits.includes(kw);
                const isMiss = result?.misses.includes(kw);
                return (
                  <span 
                    key={i} 
                    className={cn(
                      "keyword-chip",
                      isHit && "hit",
                      isMiss && "missing"
                    )}
                  >
                    {kw}
                  </span>
                );
              })}
            </div>
          )}

          {/* Answer (Criteria) after grading */}
          {result && (
            <div className="mt-4 pt-3 border-t border-border">
              <div className="text-sm font-semibold mb-2">정답:</div>
              <div className="text-foreground leading-relaxed text-sm">
                {formatCriteria(question.criteria)}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
