import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  Lock, 
  Unlock, 
  StretchHorizontal, 
  HelpCircle, 
  Sparkles, 
  Grid, 
  Check, 
  Layers,
  FileText
} from 'lucide-react';
import { StickyNoteData, DesktopBackground, NoteVariant, NoteType, NoteColor } from './types';
import { INITIAL_NOTES } from './data/defaultNotes';
import { StickyNote } from './components/StickyNote';
import { DesktopDock } from './components/DesktopDock';
import { SearchBar } from './components/SearchBar';
import { TrashBinModal } from './components/TrashBinModal';

const STORAGE_KEY = 'desktop_sticky_notes_data_v2';
const TRASH_STORAGE_KEY = 'desktop_sticky_notes_trash_v2';
const BG_STORAGE_KEY = 'desktop_sticky_notes_bg_v2';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBounds, setContainerBounds] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800
  });

  // 便签数据
  const [notes, setNotes] = useState<StickyNoteData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
    }
    return INITIAL_NOTES;
  });

  // 回收站数据
  const [deletedNotes, setDeletedNotes] = useState<StickyNoteData[]>(() => {
    try {
      const saved = localStorage.getItem(TRASH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load trash', e);
    }
    return [];
  });

  // 桌面背景
  const [background, setBackground] = useState<DesktopBackground>(() => {
    return (localStorage.getItem(BG_STORAGE_KEY) as DesktopBackground) || 'canvas-grid';
  });

  // 弹窗状态
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 提示 Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 持久化保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Error saving notes', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(deletedNotes));
    } catch (e) {
      console.error('Error saving trash', e);
    }
  }, [deletedNotes]);

  useEffect(() => {
    localStorage.setItem(BG_STORAGE_KEY, background);
  }, [background]);

  // 动态监听容器尺寸
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerBounds({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 置顶置前
  const handleBringToFront = useCallback((id: string) => {
    setNotes((prevNotes) => {
      const maxZ = Math.max(1, ...prevNotes.map((n) => n.zIndex || 1));
      return prevNotes.map((note) =>
        note.id === id ? { ...note, zIndex: maxZ + 1 } : note
      );
    });
  }, []);

  // 更新便签
  const handleUpdateNote = useCallback((updatedNote: StickyNoteData) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  }, []);

  // 删除便签（存入回收站）
  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target) {
        setDeletedNotes((trash) => [target, ...trash]);
        showToast(`便签「${target.title || '无标题'}」已移至回收站`);
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  // 恢复便签
  const handleRestoreNote = useCallback((noteToRestore: StickyNoteData) => {
    setDeletedNotes((prev) => prev.filter((n) => n.id !== noteToRestore.id));
    setNotes((prev) => [
      {
        ...noteToRestore,
        x: Math.min(noteToRestore.x, containerBounds.width - 200),
        y: Math.min(noteToRestore.y, containerBounds.height - 100),
        zIndex: Math.max(1, ...prev.map((n) => n.zIndex || 1)) + 1
      },
      ...prev
    ]);
    showToast(`已恢复便签「${noteToRestore.title || '无标题'}」`);
  }, [containerBounds]);

  // 新建便签
  const handleAddNote = useCallback(
    (variant: NoteVariant = 'strip', type: NoteType = 'text') => {
      const colors: NoteColor[] = ['yellow', 'green', 'blue', 'purple', 'pink', 'orange'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const isStrip = variant === 'strip';
      const width = isStrip ? 520 : 320;
      const height = isStrip ? 170 : 240;

      // 错落放置在合适位置
      const offset = (notes.length % 5) * 30;
      const newX = Math.min(60 + offset, Math.max(20, containerBounds.width - width - 40));
      const newY = Math.min(60 + offset, Math.max(20, containerBounds.height - height - 80));

      const newNote: StickyNoteData = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title: type === 'todo' ? '待办任务清单' : (isStrip ? '条状快捷便签' : '桌面记事便签'),
        content: type === 'todo' ? '' : '记录灵感、待办、备忘事项...',
        type,
        todos: type === 'todo' ? [
          { id: 't_' + Date.now(), text: '第一项任务（回车继续添加）', completed: false }
        ] : undefined,
        x: newX,
        y: newY,
        width,
        height,
        zIndex: Math.max(1, ...notes.map((n) => n.zIndex || 1)) + 1,
        color: randomColor,
        variant,
        isLocked: false,
        isPinned: false,
        opacity: 100,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      setNotes((prev) => [...prev, newNote]);
      showToast(`已创建新${isStrip ? '长条' : '卡片'}便签`);
    },
    [notes, containerBounds]
  );

  // 全局锁定 / 解锁切换
  const handleToggleLockAll = useCallback(() => {
    const areAllLocked = notes.length > 0 && notes.every((n) => n.isLocked);
    const nextLocked = !areAllLocked;
    setNotes((prev) =>
      prev.map((n) => ({
        ...n,
        isLocked: nextLocked,
        updatedAt: Date.now()
      }))
    );
    showToast(nextLocked ? '🔒 已一键锁定所有便签（防误触生效）' : '🔓 已解锁全部便签（可自由移动与修改）');
  }, [notes]);

  // 自动网格排列
  const handleAutoArrange = useCallback(() => {
    const startX = 40;
    const startY = 40;
    const gap = 24;
    const maxWidth = containerBounds.width || 1200;

    let currentX = startX;
    let currentY = startY;
    let rowMaxHeight = 0;

    setNotes((prev) => {
      return prev.map((note) => {
        if (currentX + note.width > maxWidth - 40 && currentX !== startX) {
          currentX = startX;
          currentY += rowMaxHeight + gap;
          rowMaxHeight = 0;
        }

        const positioned = {
          ...note,
          x: currentX,
          y: currentY,
          updatedAt: Date.now()
        };

        currentX += note.width + gap;
        rowMaxHeight = Math.max(rowMaxHeight, note.height);

        return positioned;
      });
    });
    showToast('✨ 已自动对齐整理所有桌面便签');
  }, [containerBounds]);

  // 搜索选中定位
  const handleSelectNoteFromSearch = useCallback((id: string) => {
    handleBringToFront(id);
    const el = document.getElementById(`sticky-note-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-indigo-500');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-indigo-500');
      }, 1500);
    }
  }, [handleBringToFront]);

  // 数据导出
  const handleExportData = () => {
    const exportObj = {
      version: 2,
      exportDate: new Date().toISOString(),
      notes,
      deletedNotes,
      background
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `desktop-sticky-notes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已导出便签备份文件');
  };

  // 数据导入
  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (Array.isArray(data.notes)) {
          setNotes(data.notes);
          if (Array.isArray(data.deletedNotes)) setDeletedNotes(data.deletedNotes);
          if (data.background) setBackground(data.background);
          showToast(`成功恢复 ${data.notes.length} 张便签！`);
        } else {
          alert('导入失败：无效的便签备份格式');
        }
      } catch (err) {
        alert('解析文件出错，请确保是正确的 JSON 备份');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在输入框内触发全局热键
      const isInput = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA';

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        handleToggleLockAll();
      } else if (!isInput && e.key === 'n') {
        e.preventDefault();
        handleAddNote('strip', 'text');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAddNote, handleToggleLockAll]);

  // 背景样式映射
  const getBackgroundStyle = () => {
    switch (background) {
      case 'canvas-grid':
        return 'bg-zinc-100 dark:bg-zinc-950 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]';
      case 'clean-gray':
        return 'bg-slate-100 dark:bg-zinc-900';
      case 'soft-warm':
        return 'bg-amber-50/80 dark:bg-stone-900';
      case 'gradient-nordic':
        return 'bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 dark:from-zinc-950 dark:via-slate-900 dark:to-indigo-950';
      case 'dark-wood':
        return 'bg-zinc-900 text-zinc-100';
      case 'deep-space':
        return 'bg-black text-white';
      default:
        return 'bg-zinc-100 dark:bg-zinc-950';
    }
  };

  const lockedCount = notes.filter((n) => n.isLocked).length;

  return (
    <div
      ref={containerRef}
      id="desktop-main-container"
      className={`relative w-screen h-screen overflow-hidden select-none transition-colors duration-300 font-sans ${getBackgroundStyle()}`}
    >
      {/* 隐藏的导入文件 input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* 顶部极简状态与指示条 */}
      <header className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* 左侧：Logo & 概览 */}
        <div className="flex items-center gap-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs pointer-events-auto">
          <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            📌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                桌面便签
              </h1>
              <span className="text-[11px] px-1.5 py-0.2 bg-zinc-200 dark:bg-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400 font-medium">
                {notes.length} 张便签
              </span>
            </div>
          </div>
        </div>

        {/* 右侧：锁定状态指示与帮助提示 */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {lockedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-medium backdrop-blur-md">
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lockedCount} 张便签已防误触锁定</span>
            </div>
          )}

          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium border border-zinc-200/70 dark:border-zinc-800/70 shadow-xs backdrop-blur-md transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>使用提示</span>
          </button>
        </div>
      </header>

      {/* 快捷指南悬浮卡片 */}
      {showTips && (
        <div className="absolute top-16 right-6 z-40 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100 pb-1 border-b border-zinc-200 dark:border-zinc-800">
            <span>💡 桌面便签使用小贴士</span>
            <button onClick={() => setShowTips(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
          </div>
          <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">🔒</span>
              <span><strong>防误触锁定</strong>：点击便签右上角挂锁按钮，便签将被锁定为只读状态，无法误拖、无法误删与误改。</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-indigo-500 font-bold">↔️</span>
              <span><strong>长条形态 / 自由拉伸</strong>：支持长条状横向放置与自由卡片切换，拖动右下角或右侧把手自由缩放宽高。</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-500 font-bold">⌨️</span>
              <span><strong>快捷键</strong>：<kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">N</kbd> 新建便签，<kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">Ctrl/Cmd + K</kbd> 搜索，<kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">Ctrl/Cmd + L</kbd> 一键全锁。</span>
            </li>
          </ul>
        </div>
      )}

      {/* 便签画板渲染区 */}
      <main className="w-full h-full relative">
        {notes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-3xl mb-3 shadow-inner">
              📝
            </div>
            <h2 className="font-bold text-base text-zinc-800 dark:text-zinc-200 mb-1">
              桌面干净如初
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-4">
              点击下方 Dock 栏的「+ 长条便签」或「+ 待办清单」，即刻开始记录
            </p>
            <button
              onClick={() => handleAddNote('strip', 'text')}
              className="pointer-events-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
            >
              + 创建第一张长条便签
            </button>
          </div>
        ) : (
          notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={handleDeleteNote}
              onBringToFront={handleBringToFront}
              containerBounds={containerBounds}
            />
          ))
        )}
      </main>

      {/* 底部悬浮控制 Dock 坞 */}
      <DesktopDock
        notes={notes}
        onAddNote={handleAddNote}
        onToggleLockAll={handleToggleLockAll}
        onAutoArrange={handleAutoArrange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrash={() => setIsTrashOpen(true)}
        background={background}
        onChangeBackground={setBackground}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* 全局搜索弹窗 */}
      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        notes={notes}
        onSelectNote={handleSelectNoteFromSearch}
      />

      {/* 回收站弹窗 */}
      <TrashBinModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        deletedNotes={deletedNotes}
        onRestoreNote={handleRestoreNote}
        onPermanentlyDelete={(id) => setDeletedNotes((prev) => prev.filter((n) => n.id !== id))}
        onClearAllTrash={() => setDeletedNotes([])}
      />

      {/* 浮动操作反馈 Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[10001] px-4 py-2 rounded-xl bg-zinc-900/90 text-white dark:bg-white/90 dark:text-zinc-900 text-xs font-medium shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
