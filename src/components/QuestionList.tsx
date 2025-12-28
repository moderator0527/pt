import { getData } from '@/data/questions';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionListProps {
  order: number[];
  currentIndex: number;
  stats: { [key: number]: { score: number } };
  onSelect: (index: number) => void;
}

export const QuestionList = ({
  order,
  currentIndex,
  stats,
  onSelect
}: QuestionListProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 50) return 'text-warning';
    if (score > 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <aside className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-bold mb-3 tracking-tight">목록</h3>
      
      <ScrollArea className="h-[400px]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 border-b border-border text-muted-foreground font-semibold">#</th>
              <th className="text-left py-2 px-3 border-b border-border text-muted-foreground font-semibold">제목</th>
              <th className="text-right py-2 px-3 border-b border-border text-muted-foreground font-semibold">정답률</th>
            </tr>
          </thead>
          <tbody>
            {order.map((questionId, idx) => {
              const data = getData();
              const question = data[questionId];
              const score = stats[questionId]?.score || 0;
              const isActive = idx === currentIndex;

              return (
                <tr
                  key={questionId}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/50",
                    isActive && "bg-primary/10"
                  )}
                  onClick={() => onSelect(idx)}
                >
                  <td className="py-2 px-3 border-b border-border text-muted-foreground">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-b border-border">
                    <span className="line-clamp-1">{question?.title || '-'}</span>
                  </td>
                  <td className={cn(
                    "py-2 px-3 border-b border-border text-right font-medium",
                    getScoreColor(score)
                  )}>
                    {score > 0 ? `${score}%` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>
    </aside>
  );
};
