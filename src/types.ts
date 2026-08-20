export type NoteType = 'text' | 'todo' | 'countdown';

export type NoteVariant = 'strip' | 'card' | 'compact';

export type NoteColor = 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'slate' 
  | 'dark';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StickyNoteData {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  todos?: TodoItem[];
  
  // 位置与尺寸
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  
  // 外观与状态
  color: NoteColor;
  variant: NoteVariant; // 'strip' 长条状 | 'card' 卡片状 | 'compact' 极简胶囊
  isLocked: boolean;    // 锁定防误触：无法移动、缩放和编辑
  isPinned: boolean;    // 置顶
  opacity: number;      // 40 - 100
  isCollapsed?: boolean;// 是否折叠
  
  // 提醒或倒计时
  targetDate?: string;
  
  createdAt: number;
  updatedAt: number;
}

export type DesktopBackground = 
  | 'canvas-grid'
  | 'clean-gray'
  | 'soft-warm'
  | 'dark-wood'
  | 'gradient-nordic'
  | 'deep-space'
  | 'transparent';
