import React from 'react';
import { Trash2, RotateCcw, X, AlertTriangle } from 'lucide-react';
import { StickyNoteData } from '../types';
import { COLOR_THEMES } from '../data/defaultNotes';

interface TrashBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedNotes: StickyNoteData[];
  onRestoreNote: (note: StickyNoteData) => void;
  onPermanentlyDelete: (id: string) => void;
  onClearAllTrash: () => void;
}

export const TrashBinModal: React.FC<TrashBinModalProps> = ({
  isOpen,
  onClose,
  deletedNotes,
  onRestoreNote,
  onPermanentlyDelete,
  onClearAllTrash
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* 顶部标题 */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              便签回收站 ({deletedNotes.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {deletedNotes.length > 0 && (
              <button
                onClick={onClearAllTrash}
                className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              >
                清空回收站
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 列表区 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {deletedNotes.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              回收站是空的，删除的便签会暂存到这里。
            </div>
          ) : (
            deletedNotes.map((note) => {
              const theme = COLOR_THEMES[note.color] || COLOR_THEMES.yellow;
              return (
                <div
                  key={note.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${theme.bg} ${theme.border}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${theme.text}`}>
                      {note.title || '无标题便签'}
                    </h3>
                    <p className={`text-xs truncate ${theme.subText} mt-0.5`}>
                      {note.type === 'todo' && note.todos
                        ? note.todos.map(t => t.text).join(', ')
                        : note.content || '无内容'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onRestoreNote(note)}
                      title="恢复到桌面"
                      className="px-2.5 py-1.5 bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> 恢复
                    </button>
                    <button
                      onClick={() => onPermanentlyDelete(note.id)}
                      title="彻底删除"
                      className="p-1.5 text-rose-600 hover:bg-rose-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
