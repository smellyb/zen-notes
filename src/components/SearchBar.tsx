import React, { useState, useMemo } from 'react';
import { Search, X, Lock, Unlock, ArrowRight, CheckSquare, FileText } from 'lucide-react';
import { StickyNoteData, NoteColor } from '../types';
import { COLOR_THEMES } from '../data/defaultNotes';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  notes: StickyNoteData[];
  onSelectNote: (id: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  notes,
  onSelectNote
}) => {
  const [query, setQuery] = useState('');
  const [filterLocked, setFilterLocked] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [filterColor, setFilterColor] = useState<NoteColor | 'all'>('all');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // 关键词过滤
      const matchQuery = 
        !query.trim() ||
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        (note.todos && note.todos.some(t => t.text.toLowerCase().includes(query.toLowerCase())));

      // 锁定状态过滤
      const matchLocked = 
        filterLocked === 'all' ? true :
        filterLocked === 'locked' ? note.isLocked : !note.isLocked;

      // 颜色过滤
      const matchColor = 
        filterColor === 'all' ? true : note.color === filterColor;

      return matchQuery && matchLocked && matchColor;
    });
  }, [notes, query, filterLocked, filterColor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in zoom-in-95 duration-150">
        {/* 顶部搜索输入 */}
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            id="global-search-input"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索便签标题、文本内容、待办事项..."
            className="w-full text-sm bg-transparent border-0 focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md hover:bg-zinc-200"
          >
            ESC
          </button>
        </div>

        {/* 快捷过滤条 */}
        <div className="px-3.5 py-2 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">状态:</span>
            <button
              onClick={() => setFilterLocked('all')}
              className={`px-2 py-0.5 rounded-full ${
                filterLocked === 'all' ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              全部 ({notes.length})
            </button>
            <button
              onClick={() => setFilterLocked('locked')}
              className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                filterLocked === 'locked' ? 'bg-amber-500 text-white font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Lock className="w-3 h-3" /> 已锁定 ({notes.filter(n => n.isLocked).length})
            </button>
            <button
              onClick={() => setFilterLocked('unlocked')}
              className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                filterLocked === 'unlocked' ? 'bg-indigo-600 text-white font-medium' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              <Unlock className="w-3 h-3" /> 未锁定 ({notes.filter(n => !n.isLocked).length})
            </button>
          </div>

          {/* 颜色过滤 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterColor('all')}
              className={`w-4 h-4 rounded-full border ${filterColor === 'all' ? 'ring-2 ring-indigo-500' : 'opacity-40'} bg-zinc-300`}
              title="全部颜色"
            />
            {(Object.keys(COLOR_THEMES) as NoteColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setFilterColor(c)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  COLOR_THEMES[c].headerBg
                } ${filterColor === c ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                title={COLOR_THEMES[c].name}
              />
            ))}
          </div>
        </div>

        {/* 便签结果列表 */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 text-xs">
              没有找到匹配的便签
            </div>
          ) : (
            filteredNotes.map((note) => {
              const theme = COLOR_THEMES[note.color] || COLOR_THEMES.yellow;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] ${theme.bg} ${theme.border}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {note.type === 'todo' ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                      <span className={`font-semibold text-sm truncate ${theme.text}`}>
                        {note.title || '无标题便签'}
                      </span>
                      {note.variant === 'strip' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-black/10 dark:bg-white/10 rounded font-medium">
                          长条
                        </span>
                      )}
                      {note.isLocked && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-medium">
                          <Lock className="w-2.5 h-2.5" /> 锁定
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${theme.subText}`}>
                      {note.type === 'todo' && note.todos
                        ? note.todos.map(t => `${t.completed ? '✓' : '•'} ${t.text}`).join(' | ')
                        : note.content || '无内容'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs opacity-60 shrink-0 font-medium">
                    <span>定位</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
