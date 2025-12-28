import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isShuffled: boolean;
  isCardMode: boolean;
  isMyListMode: boolean;
  onShuffleToggle: () => void;
  onCardModeToggle: () => void;
  onMyListToggle: () => void;
}

export const Sidebar = ({
  isOpen,
  onClose,
  isShuffled,
  isCardMode,
  isMyListMode,
  onShuffleToggle,
  onCardModeToggle,
  onMyListToggle
}: SidebarProps) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/25 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-screen w-64 max-w-[80vw] bg-card shadow-xl z-50 p-5 flex flex-col gap-3 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-base">메뉴</span>
          <button 
            className="bg-transparent border-none text-xl cursor-pointer p-1 leading-none"
            onClick={onClose}
            aria-label="사이드바 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 py-2 px-1 mb-2 border-b border-border text-sm">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">게스트</span>
            <span className="text-xs text-muted-foreground">로그인하면 정보가 저장돼요</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          <li>
            <button
              className={cn("sidebar-item", isShuffled && "active")}
              onClick={() => {
                onShuffleToggle();
                onClose();
              }}
            >
              {isShuffled ? '랜덤화 해제' : '랜덤화'}
            </button>
          </li>
          <li>
            <button
              className={cn("sidebar-item", isCardMode && "active")}
              onClick={() => {
                onCardModeToggle();
                onClose();
              }}
            >
              {isCardMode ? '카드 모드 해제' : '카드 모드'}
            </button>
          </li>
          <li>
            <button
              className={cn("sidebar-item", isMyListMode && "active")}
              onClick={() => {
                onMyListToggle();
                onClose();
              }}
            >
              {isMyListMode ? '리스트 해제' : '나만의 리스트'}
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};
