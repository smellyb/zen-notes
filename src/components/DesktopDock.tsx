import React from 'react';
import { 
  Plus, 
  Lock, 
  Unlock, 
  LayoutGrid, 
  Search, 
  Trash2, 
  Download, 
  Upload, 
  Palette, 
  Sparkles, 
  Layers,
  StretchHorizontal,
  SquareCheck,
  StickyNote as NoteIcon
} from 'lucide-react';
import { StickyNoteData, DesktopBackground } from '../types';

interface DesktopDockProps {
  notes: StickyNoteData[];
  onAddNote: (variant: 'strip' | 'card', type: 'text' | 'todo') => void;
  onToggleLockAll: () => void;
  onAutoArrange: () => void;
  onOpenSearch: () => void;
  onOpenTrash: () => void;
  background: DesktopBackground;
  onChangeBackground: (bg: DesktopBackground) => void;
  onExportData: () => void;
  onImportData: () => void;
}

export const DesktopDock: React.FC<DesktopDockProps> = ({
  notes,
  onAddNote,
  onToggleLockAll,
  onAutoArrange,
  onOpenSearch,
  onOpenTrash,
  background,
  onChangeBackground,
  onExportData,
  onImportData
}) => {
  const allLocked = notes.length > 0 && notes.every(n => n.isLocked);
  const lockedCount = notes.filter(n => n.isLocked).length;

  const bgOptions: { id: DesktopBackground; name: string }[] = [
    { id: 'canvas-grid', name: '工程点阵网格' },
    { id: 'clean-gray', name: '极简素雅白' },
    { id: 'soft-warm', name: '温暖杏仁' },
    { id: 'gradient-nordic', name: '北欧冰蓝' },
    { id: 'dark-wood', name: '深色暗调' },
    { id: 'deep-space', name: '黑曜深空' }
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xl transition-all">
      {/* 快捷新建长条便签 */}
      <button
        id="dock-add-strip-note"
        onClick={() => onAddNote('strip', 'text')}
        title="新建长条便签（适合桌面横向放置）"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95"
      >
        <StretchHorizontal className="w-4 h-4" />
        <span>+ 长条便签</span>
      </button>

      {/* 快捷新建待办清单便签 */}
      <button
        id="dock-add-todo-note"
        onClick={() => onAddNote('strip', 'todo')}
        title="新建待办长条清单"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
      >
        <SquareCheck className="w-4 h-4" />
        <span>+ 待办清单</span>
      </button>

      {/* 快捷新建卡片便签 */}
      <button
        id="dock-add-card-note"
        onClick={() => onAddNote('card', 'text')}
        title="新建方形卡片便签"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
      >
        <NoteIcon className="w-4 h-4" />
        <span>+ 卡片</span>
      </button>

      <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* 全局防误触锁定/解锁按钮 */}
      <button
        id="dock-lock-all"
        onClick={onToggleLockAll}
        title={allLocked ? '一键解锁全部便签' : '一键锁定所有便签（防误触）'}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
          allLocked
            ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40 hover:bg-amber-600'
            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
        }`}
      >
        {allLocked ? (
          <>
            <Lock className="w-3.5 h-3.5" />
            <span>已全锁 ({lockedCount})</span>
          </>
        ) : (
          <>
            <Unlock className="w-3.5 h-3.5" />
            <span>全锁防误触 {lockedCount > 0 ? `(${lockedCount}/${notes.length})` : ''}</span>
          </>
        )}
      </button>

      {/* 自动整齐排列 */}
      <button
        id="dock-auto-arrange"
        onClick={onAutoArrange}
        title="一键规整排列便签"
        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>

      {/* 搜索查找 */}
      <button
        id="dock-search-notes"
        onClick={onOpenSearch}
        title="搜索便签内容 (快捷键: Ctrl/Cmd + K)"
        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

      {/* 背景壁纸选择 */}
      <div className="relative group">
        <button
          id="dock-change-bg"
          title="切换桌面背景"
          className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* 悬浮壁纸选择菜单 */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col gap-1 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 text-xs w-32 z-50">
          <div className="text-[10px] text-zinc-400 font-semibold px-2 py-0.5">桌面背景</div>
          {bgOptions.map((bg) => (
            <button
              key={bg.id}
              onClick={() => onChangeBackground(bg.id)}
              className={`px-2 py-1.5 text-left rounded-lg text-xs transition-colors flex items-center justify-between ${
                background === bg.id 
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-medium' 
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200'
              }`}
            >
              <span>{bg.name}</span>
              {background === bg.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* 数据备份与导出 */}
      <button
        id="dock-export-data"
        onClick={onExportData}
        title="备份导出便签数据 (JSON)"
        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* 数据导入 */}
      <button
        id="dock-import-data"
        onClick={onImportData}
        title="导入备份数据"
        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
      >
        <Upload className="w-4 h-4" />
      </button>

      {/* 回收站 */}
      <button
        id="dock-trash-bin"
        onClick={onOpenTrash}
        title="便签回收站"
        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
