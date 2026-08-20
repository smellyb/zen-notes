import { StickyNoteData } from '../types';

export const INITIAL_NOTES: StickyNoteData[] = [
  {
    id: 'note-1',
    title: '今日专注长条 📌',
    content: '长条便签模式：横向紧凑放置于桌面，不遮挡视线，支持自由拉长拉宽。',
    type: 'todo',
    todos: [
      { id: 't1', text: '点击便签右上角「挂锁图标」测试锁定/解锁防误触', completed: false },
      { id: 't2', text: '拖拽右下角手柄自由缩放尺寸，或切换为长条/卡片形态', completed: true },
      { id: 't3', text: '双击标题栏可快速折叠为长条胶囊', completed: false },
    ],
    x: 48,
    y: 40,
    width: 580,
    height: 180,
    zIndex: 10,
    color: 'yellow',
    variant: 'strip',
    isLocked: false,
    isPinned: true,
    opacity: 100,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: 'note-2',
    title: '🔒 已锁定防误触便签',
    content: '这是一张已锁定的便签：\n• 无法拖动位置\n• 无法拉伸尺寸\n• 无法修改内容或误删\n\n👉 点击右上角【解锁】按钮即可恢复编辑与移动。',
    type: 'text',
    x: 660,
    y: 40,
    width: 320,
    height: 220,
    zIndex: 5,
    color: 'green',
    variant: 'card',
    isLocked: true,
    isPinned: false,
    opacity: 95,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: 'note-3',
    title: '灵感备忘条 💡',
    content: '设计原则：极速输入，一键锁定，随心排列。随时按 N 键新建便签。',
    type: 'text',
    x: 48,
    y: 250,
    width: 420,
    height: 160,
    zIndex: 8,
    color: 'blue',
    variant: 'strip',
    isLocked: false,
    isPinned: false,
    opacity: 100,
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  }
];

export const COLOR_THEMES: Record<
  string, 
  {
    bg: string;
    border: string;
    headerBg: string;
    text: string;
    subText: string;
    accent: string;
    shadow: string;
    badge: string;
    name: string;
  }
> = {
  yellow: {
    bg: 'bg-amber-100/95 dark:bg-amber-950/80',
    border: 'border-amber-300 dark:border-amber-800/80',
    headerBg: 'bg-amber-200/80 dark:bg-amber-900/60',
    text: 'text-amber-950 dark:text-amber-100',
    subText: 'text-amber-800 dark:text-amber-300',
    accent: 'bg-amber-500 text-white hover:bg-amber-600',
    shadow: 'shadow-amber-900/10',
    badge: 'bg-amber-200/90 text-amber-900 dark:bg-amber-900 dark:text-amber-200',
    name: '日光暖黄'
  },
  green: {
    bg: 'bg-emerald-100/95 dark:bg-emerald-950/80',
    border: 'border-emerald-300 dark:border-emerald-800/80',
    headerBg: 'bg-emerald-200/80 dark:bg-emerald-900/60',
    text: 'text-emerald-950 dark:text-emerald-100',
    subText: 'text-emerald-800 dark:text-emerald-300',
    accent: 'bg-emerald-600 text-white hover:bg-emerald-700',
    shadow: 'shadow-emerald-900/10',
    badge: 'bg-emerald-200/90 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200',
    name: '薄荷淡绿'
  },
  blue: {
    bg: 'bg-sky-100/95 dark:bg-sky-950/80',
    border: 'border-sky-300 dark:border-sky-800/80',
    headerBg: 'bg-sky-200/80 dark:bg-sky-900/60',
    text: 'text-sky-950 dark:text-sky-100',
    subText: 'text-sky-800 dark:text-sky-300',
    accent: 'bg-sky-600 text-white hover:bg-sky-700',
    shadow: 'shadow-sky-900/10',
    badge: 'bg-sky-200/90 text-sky-900 dark:bg-sky-900 dark:text-sky-200',
    name: '天空蔚蓝'
  },
  purple: {
    bg: 'bg-purple-100/95 dark:bg-purple-950/80',
    border: 'border-purple-300 dark:border-purple-800/80',
    headerBg: 'bg-purple-200/80 dark:bg-purple-900/60',
    text: 'text-purple-950 dark:text-purple-100',
    subText: 'text-purple-800 dark:text-purple-300',
    accent: 'bg-purple-600 text-white hover:bg-purple-700',
    shadow: 'shadow-purple-900/10',
    badge: 'bg-purple-200/90 text-purple-900 dark:bg-purple-900 dark:text-purple-200',
    name: '薰衣草紫'
  },
  pink: {
    bg: 'bg-rose-100/95 dark:bg-rose-950/80',
    border: 'border-rose-300 dark:border-rose-800/80',
    headerBg: 'bg-rose-200/80 dark:bg-rose-900/60',
    text: 'text-rose-950 dark:text-rose-100',
    subText: 'text-rose-800 dark:text-rose-300',
    accent: 'bg-rose-500 text-white hover:bg-rose-600',
    shadow: 'shadow-rose-900/10',
    badge: 'bg-rose-200/90 text-rose-900 dark:bg-rose-900 dark:text-rose-200',
    name: '樱花浅粉'
  },
  orange: {
    bg: 'bg-orange-100/95 dark:bg-orange-950/80',
    border: 'border-orange-300 dark:border-orange-800/80',
    headerBg: 'bg-orange-200/80 dark:bg-orange-900/60',
    text: 'text-orange-950 dark:text-orange-100',
    subText: 'text-orange-800 dark:text-orange-300',
    accent: 'bg-orange-500 text-white hover:bg-orange-600',
    shadow: 'shadow-orange-900/10',
    badge: 'bg-orange-200/90 text-orange-900 dark:bg-orange-900 dark:text-orange-200',
    name: '日落暖橙'
  },
  slate: {
    bg: 'bg-slate-100/95 dark:bg-slate-900/90',
    border: 'border-slate-300 dark:border-slate-700',
    headerBg: 'bg-slate-200/80 dark:bg-slate-800/80',
    text: 'text-slate-900 dark:text-slate-100',
    subText: 'text-slate-700 dark:text-slate-300',
    accent: 'bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-600',
    shadow: 'shadow-slate-900/10',
    badge: 'bg-slate-200/90 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    name: '石板素灰'
  },
  dark: {
    bg: 'bg-zinc-900/95 dark:bg-black/90',
    border: 'border-zinc-700 dark:border-zinc-800',
    headerBg: 'bg-zinc-800/90 dark:bg-zinc-900',
    text: 'text-zinc-100 dark:text-zinc-100',
    subText: 'text-zinc-400 dark:text-zinc-400',
    accent: 'bg-indigo-600 text-white hover:bg-indigo-500',
    shadow: 'shadow-black/25',
    badge: 'bg-zinc-800 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-300',
    name: '暗夜黑曜'
  }
};
