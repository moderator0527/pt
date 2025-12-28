import { Menu, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUniqueUnits, getData } from '@/data/questions';

interface HeaderProps {
  currentIndex: number;
  totalQuestions: number;
  selectedUnit: string;
  onUnitChange: (unit: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onMenuClick: () => void;
}

export const Header = ({
  currentIndex,
  totalQuestions,
  selectedUnit,
  onUnitChange,
  onPrev,
  onNext,
  onMenuClick
}: HeaderProps) => {
  const data = getData();
  const units = getUniqueUnits();

  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-2">
          {/* Row 1: Brand + Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-2xl shadow-sm">
              <span className="orb" />
              <span className="text-lg font-bold tracking-tight">감PT</span>
              <span className="text-xs text-primary font-medium ml-1">정식출시</span>
            </div>

            <div className="flex-1" />

            <span className="pill">
              단원
              <select
                value={selectedUnit}
                onChange={(e) => onUnitChange(e.target.value)}
                className="bg-transparent border-none outline-none font-semibold text-foreground min-w-[40px]"
              >
                <option value="">전체</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </span>

            <span className="pill">
              총 문항 <strong>{totalQuestions}</strong>
            </span>

            <span className="pill hidden sm:inline-flex">
              현재 <strong>{totalQuestions > 0 ? currentIndex + 1 : 0}</strong> / <strong>{totalQuestions}</strong>
            </span>

            <Button variant="outline" size="sm" onClick={onPrev} className="hidden sm:inline-flex">
              이전
            </Button>
            <Button variant="default" size="sm" onClick={onNext} className="hidden sm:inline-flex">
              다음
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('https://melodious-virgo-658.notion.site/PT-Personal-Training-Beta-279519deaa6280c985cdd6fccce1de67?pvs=143', '_blank')}
              className="hidden sm:inline-flex gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              도움말
            </Button>

            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
