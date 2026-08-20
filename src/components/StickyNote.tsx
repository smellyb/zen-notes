import React, { useState, useRef, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Pin, 
  Maximize2, 
  Minimize2, 
  Plus, 
  Trash2, 
  Check, 
  Square, 
  CheckSquare, 
  MoreHorizontal, 
  Copy, 
  Palette, 
  Eye, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  CheckCircle2,
  FileText,
  ListTodo
} from 'lucide-react';
import { StickyNoteData, NoteColor, NoteVariant, NoteType, TodoItem } from '../types';
import { COLOR_THEMES } from '../data/defaultNotes';

interface StickyNoteProps {
  note: StickyNoteData;
  onUpdate: (updatedNote: StickyNoteData) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
  containerBounds?: { width: number; height: number };
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  onBringToFront,
  containerBounds
}) => {
  const theme = COLOR_THEMES[note.color] || COLOR_THEMES.yellow;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [lockedShake, setLockedShake] = useState(false);

  // 拖拽移动状态
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null);

  // 尺寸缩放状态
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ 
    startX: number; 
    startY: number; 
    startWidth: number; 
    startHeight: number;
    direction: 'se' | 'e' | 's';
  } | null>(null);

  // 触发锁定防误触震动提示
  const triggerLockedNotice = () => {
    if (note.isLocked) {
      setLockedShake(true);
      setTimeout(() => setLockedShake(false), 500);
    }
  };

  // 开始拖拽
  const handleDragStart = (e: React.MouseEvent) => {
    if (note.isLocked) {
      triggerLockedNotice();
      return;
    }
    // 忽略特定按钮点击
    if ((e.target as HTMLElement).closest('button, input, textarea, .no-drag')) {
      return;
    }

    onBringToFront(note.id);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      noteX: note.x,
      noteY: note.y,
    };
  };

  // 开始缩放
  const handleResizeStart = (e: React.MouseEvent, direction: 'se' | 'e' | 's' = 'se') => {
    e.stopPropagation();
    if (note.isLocked) {
      triggerLockedNotice();
      return;
    }
    onBringToFront(note.id);
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: note.width,
      startHeight: note.height,
      direction
    };
  };

  // 全局鼠标移动与松开事件监听
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        const deltaX = e.clientX - dragStartRef.current.startX;
        const deltaY = e.clientY - dragStartRef.current.startY;
        
        let newX = dragStartRef.current.noteX + deltaX;
        let newY = dragStartRef.current.noteY + deltaY;

        // 边界保护
        newX = Math.max(10, newX);
        newY = Math.max(10, newY);
        if (containerBounds) {
          newX = Math.min(newX, Math.max(20, containerBounds.width - 100));
          newY = Math.min(newY, Math.max(20, containerBounds.height - 60));
        }

        onUpdate({
          ...note,
          x: Math.round(newX),
          y: Math.round(newY),
          updatedAt: Date.now()
        });
      }

      if (isResizing && resizeStartRef.current) {
        const deltaX = e.clientX - resizeStartRef.current.startX;
        const deltaY = e.clientY - resizeStartRef.current.startY;
        const { startWidth, startHeight, direction } = resizeStartRef.current;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (direction === 'se' || direction === 'e') {
          newWidth = Math.max(note.variant === 'strip' ? 340 : 260, startWidth + deltaX);
        }
        if (direction === 'se' || direction === 's') {
          newHeight = Math.max(note.variant === 'strip' ? 120 : 160, startHeight + deltaY);
        }

        onUpdate({
          ...note,
          width: Math.round(newWidth),
          height: Math.round(newHeight),
          updatedAt: Date.now()
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        dragStartRef.current = null;
      }
      if (isResizing) {
        setIsResizing(false);
        resizeStartRef.current = null;
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, note, onUpdate, containerBounds]);

  // 待办事项操作
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.isLocked || !newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4),
      text: newTodoText.trim(),
      completed: false
    };

    const updatedTodos = [...(note.todos || []), newTodo];
    onUpdate({
      ...note,
      todos: updatedTodos,
      updatedAt: Date.now()
    });
    setNewTodoText('');
  };

  const handleToggleTodo = (todoId: string) => {
    if (note.isLocked) {
      triggerLockedNotice();
      return;
    }
    const updatedTodos = (note.todos || []).map(t => 
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    onUpdate({
      ...note,
      todos: updatedTodos,
      updatedAt: Date.now()
    });
  };

  const handleDeleteTodo = (todoId: string) => {
    if (note.isLocked) {
      triggerLockedNotice();
      return;
    }
    const updatedTodos = (note.todos || []).filter(t => t.id !== todoId);
    onUpdate({
      ...note,
      todos: updatedTodos,
      updatedAt: Date.now()
    });
  };

  // 切换长条形态与卡片形态
  const handleToggleVariant = () => {
    if (note.isLocked) {
      triggerLockedNotice();
      return;
    }
    const nextVariant: NoteVariant = note.variant === 'strip' ? 'card' : 'strip';
    const newWidth = nextVariant === 'strip' ? Math.max(480, note.width) : Math.min(340, note.width);
    const newHeight = nextVariant === 'strip' ? 180 : Math.max(260, note.height);

    onUpdate({
      ...note,
      variant: nextVariant,
      width: newWidth,
      height: newHeight,
      updatedAt: Date.now()
    });
  };

  // 复制内容
  const handleCopy = () => {
    let copyText = `${note.title}\n`;
    if (note.type === 'todo' && note.todos) {
      copyText += note.todos.map(t => `${t.completed ? '[x]' : '[ ]'} ${t.text}`).join('\n');
    } else {
      copyText += note.content;
    }
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const todoStats = note.todos ? {
    total: note.todos.length,
    completed: note.todos.filter(t => t.completed).length,
    percent: note.todos.length ? Math.round((note.todos.filter(t => t.completed).length / note.todos.length) * 100) : 0
  } : null;

  return (
    <div
      id={`sticky-note-${note.id}`}
      style={{
        transform: `translate3d(${note.x}px, ${note.y}px, 0)`,
        width: `${note.width}px`,
        height: note.isCollapsed ? 'auto' : `${note.height}px`,
        zIndex: note.isPinned ? 9999 : note.zIndex,
        opacity: note.opacity / 100,
      }}
      onMouseDown={() => onBringToFront(note.id)}
      className={`absolute select-none transition-shadow duration-200 group rounded-2xl flex flex-col border shadow-xl ${
        theme.bg
      } ${theme.border} ${theme.shadow} ${
        isDragging ? 'shadow-2xl scale-[1.01] cursor-grabbing' : ''
      } ${
        note.isLocked ? 'ring-1 ring-amber-500/40 dark:ring-amber-400/30' : 'hover:shadow-2xl'
      } ${lockedShake ? 'animate-bounce' : ''}`}
    >
      {/* 顶部标题栏 / 拖拽把手区 */}
      <div
        onMouseDown={handleDragStart}
        onDoubleClick={() => onUpdate({ ...note, isCollapsed: !note.isCollapsed })}
        className={`px-3.5 py-2.5 rounded-t-2xl flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 transition-colors ${
          theme.headerBg
        } ${note.isLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
      >
        {/* 左侧：拖拽把手点、形态标识、标题 */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {!note.isLocked ? (
            <GripHorizontal className="w-3.5 h-3.5 opacity-40 hover:opacity-80 shrink-0" />
          ) : (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30 shrink-0">
              已锁定
            </span>
          )}

          {/* 标题输入 */}
          <input
            type="text"
            id={`note-title-input-${note.id}`}
            value={note.title}
            disabled={note.isLocked}
            onChange={(e) => onUpdate({ ...note, title: e.target.value, updatedAt: Date.now() })}
            placeholder="便签标题..."
            className={`font-semibold text-sm bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 rounded px-1 w-full truncate ${
              theme.text
            } ${note.isLocked ? 'cursor-default select-text opacity-95' : ''}`}
          />
        </div>

        {/* 右侧：状态指示与核心控制按钮组 */}
        <div className="flex items-center gap-1 shrink-0 no-drag">
          {/* 待办进度小标（若有） */}
          {todoStats && todoStats.total > 0 && (
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${theme.badge}`}>
              {todoStats.completed}/{todoStats.total} ({todoStats.percent}%)
            </span>
          )}

          {/* 形态切换按钮（长条 / 卡片） */}
          <button
            id={`toggle-variant-${note.id}`}
            title={note.variant === 'strip' ? '切换为卡片形态' : '切换为长条形态'}
            onClick={handleToggleVariant}
            disabled={note.isLocked}
            className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${
              note.isLocked 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-75 hover:opacity-100'
            }`}
          >
            {note.variant === 'strip' ? (
              <span className="flex items-center text-[11px] font-medium">
                <span className="w-4 h-2 rounded-sm border border-current mr-1 inline-block"></span>
                长条
              </span>
            ) : (
              <span className="flex items-center text-[11px] font-medium">
                <span className="w-3 h-3 rounded-sm border border-current mr-1 inline-block"></span>
                卡片
              </span>
            )}
          </button>

          {/* ⭐ 核心功能：锁定/解锁按钮 */}
          <button
            id={`toggle-lock-${note.id}`}
            title={note.isLocked ? '点击解锁便签（恢复移动与编辑）' : '点击锁定便签（防止误触移动与修改）'}
            onClick={() => onUpdate({ ...note, isLocked: !note.isLocked, updatedAt: Date.now() })}
            className={`p-1.5 rounded-lg transition-all flex items-center gap-1 font-medium text-xs ${
              note.isLocked
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/50 hover:bg-amber-600 scale-105'
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 text-black dark:text-white'
            }`}
          >
            {note.isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[11px] pr-0.5">已锁</span>
              </>
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </button>

          {/* 置顶按钮 */}
          <button
            id={`toggle-pin-${note.id}`}
            title={note.isPinned ? '取消置顶' : '固定置顶'}
            onClick={() => onUpdate({ ...note, isPinned: !note.isPinned, updatedAt: Date.now() })}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned 
                ? 'bg-red-500 text-white' 
                : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'rotate-45' : ''}`} />
          </button>

          {/* 折叠/展开 */}
          <button
            id={`toggle-collapse-${note.id}`}
            title={note.isCollapsed ? '展开便签' : '折叠便签'}
            onClick={() => onUpdate({ ...note, isCollapsed: !note.isCollapsed })}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-colors"
          >
            {note.isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

          {/* 更多菜单下拉 */}
          <div className="relative">
            <button
              id={`more-menu-btn-${note.id}`}
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => { setShowMenu(false); setShowColorPicker(false); }}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 py-1.5 z-50 text-xs text-zinc-700 dark:text-zinc-200">
                  {/* 类型切换 */}
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400">便签模式</div>
                  <button
                    disabled={note.isLocked}
                    onClick={() => {
                      onUpdate({ ...note, type: 'text', updatedAt: Date.now() });
                      setShowMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                      note.type === 'text' ? 'text-indigo-600 font-medium' : ''
                    } ${note.isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> 纯文本记事
                    </span>
                    {note.type === 'text' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    disabled={note.isLocked}
                    onClick={() => {
                      onUpdate({ 
                        ...note, 
                        type: 'todo', 
                        todos: note.todos || [
                          { id: 't1', text: '第一项任务', completed: false }
                        ],
                        updatedAt: Date.now() 
                      });
                      setShowMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-700 ${
                      note.type === 'todo' ? 'text-indigo-600 font-medium' : ''
                    } ${note.isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <ListTodo className="w-3.5 h-3.5" /> 待办清单 (Checklist)
                    </span>
                    {note.type === 'todo' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="my-1 border-t border-zinc-200 dark:border-zinc-700"></div>

                  {/* 调色盘 */}
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400">选择色彩</div>
                  <div className="px-3 py-1 grid grid-cols-4 gap-1.5">
                    {(Object.keys(COLOR_THEMES) as NoteColor[]).map((colorKey) => (
                      <button
                        key={colorKey}
                        disabled={note.isLocked}
                        title={COLOR_THEMES[colorKey].name}
                        onClick={() => {
                          onUpdate({ ...note, color: colorKey, updatedAt: Date.now() });
                          setShowMenu(false);
                        }}
                        className={`w-6 h-6 rounded-full border border-black/10 transition-transform ${
                          COLOR_THEMES[colorKey].headerBg
                        } ${note.color === colorKey ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'} ${
                          note.isLocked ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      />
                    ))}
                  </div>

                  <div className="my-1 border-t border-zinc-200 dark:border-zinc-700"></div>

                  {/* 复制与删除 */}
                  <button
                    onClick={handleCopy}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {isCopied ? '已复制到剪贴板' : '复制便签内容'}
                  </button>

                  <button
                    disabled={note.isLocked}
                    onClick={() => {
                      if (!note.isLocked) {
                        onDelete(note.id);
                        setShowMenu(false);
                      }
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 ${
                      note.isLocked ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    删除便签 {note.isLocked && '(需先解锁)'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 主体内容区（若折叠则隐藏） */}
      {!note.isCollapsed && (
        <div className="p-3.5 flex-1 flex flex-col overflow-hidden text-sm relative">
          {/* 模式一：待办清单 (Todo Checklist) */}
          {note.type === 'todo' ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* 待办列表滚动区 */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 min-h-[60px]">
                {(!note.todos || note.todos.length === 0) && (
                  <div className="text-center py-4 opacity-50 text-xs">
                    暂无待办事项，在下方输入添加
                  </div>
                )}
                {note.todos?.map((todo) => (
                  <div
                    key={todo.id}
                    className={`group/todo flex items-center justify-between gap-2 p-1.5 rounded-lg transition-colors ${
                      todo.completed 
                        ? 'opacity-60 bg-black/5 dark:bg-white/5' 
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={note.isLocked}
                      onClick={() => handleToggleTodo(todo.id)}
                      className={`shrink-0 transition-transform ${
                        note.isLocked ? 'cursor-default' : 'hover:scale-110'
                      }`}
                    >
                      {todo.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 opacity-60 hover:opacity-100" />
                      )}
                    </button>
                    
                    <span 
                      onClick={() => !note.isLocked && handleToggleTodo(todo.id)}
                      className={`flex-1 text-xs select-text break-words leading-relaxed ${
                        todo.completed ? 'line-through opacity-75' : ''
                      } ${theme.text} ${note.isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {todo.text}
                    </span>

                    {!note.isLocked && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover/todo:opacity-100 p-1 hover:text-rose-600 transition-opacity"
                        title="删除该条待办"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 添加待办输入行 */}
              {!note.isLocked && (
                <form onSubmit={handleAddTodo} className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 flex gap-1.5">
                  <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="+ 添加待办，按回车确认..."
                    className={`flex-1 px-2.5 py-1 text-xs rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-black/20 ${theme.text}`}
                  />
                  <button
                    type="submit"
                    disabled={!newTodoText.trim()}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                      newTodoText.trim() ? theme.accent : 'opacity-40 bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* 模式二：自由文本记事 (Text Note) */
            <textarea
              id={`note-textarea-${note.id}`}
              value={note.content}
              disabled={note.isLocked}
              onChange={(e) => onUpdate({ ...note, content: e.target.value, updatedAt: Date.now() })}
              placeholder="在此输入便签内容，支持自由记录..."
              className={`w-full h-full resize-none bg-transparent focus:outline-none leading-relaxed text-xs sm:text-sm select-text ${
                theme.text
              } ${
                note.isLocked ? 'cursor-default select-text opacity-90' : ''
              }`}
            />
          )}

          {/* 底部状态提示条（防误触锁定状态提示） */}
          {note.isLocked && (
            <div className="absolute bottom-1.5 right-2 flex items-center gap-1 text-[10px] text-amber-800/80 dark:text-amber-300/80 bg-amber-400/20 px-2 py-0.5 rounded-md pointer-events-none backdrop-blur-xs">
              <Lock className="w-2.5 h-2.5" />
              <span>锁定保护中 (只读/防移动)</span>
            </div>
          )}
        </div>
      )}

      {/* 自由缩放手柄（当未锁定且未折叠时生效） */}
      {!note.isLocked && !note.isCollapsed && (
        <>
          {/* 右下角对角线缩放 */}
          <div
            id={`resize-handle-se-${note.id}`}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            title="拖拽拉伸便签大小"
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 opacity-40 hover:opacity-100 group-hover:opacity-80 transition-opacity"
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-current rounded-br-xs" />
          </div>

          {/* 右侧边沿横向拉伸（特别适合长条模式扩展） */}
          <div
            id={`resize-handle-e-${note.id}`}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            title="拖拽扩展宽度"
            className="absolute top-8 right-0 bottom-4 w-2 cursor-e-resize hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          />

          {/* 底部边沿纵向拉伸 */}
          <div
            id={`resize-handle-s-${note.id}`}
            onMouseDown={(e) => handleResizeStart(e, 's')}
            title="拖拽扩展高度"
            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          />
        </>
      )}
    </div>
  );
};
