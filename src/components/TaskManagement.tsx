import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckCircle2, Circle, Clock, Trash2, Edit2, AlertTriangle, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export function TaskManagement() {
  const { userTasks, addUserTask, updateUserTask, deleteUserTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addUserTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      priority: newTaskPriority,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('medium');
    setIsAdding(false);
  };

  const handleUpdateTask = async (id: string, updates: any) => {
    await updateUserTask(id, updates);
    if (editingId === id) setEditingId(null);
  };

  const sortedTasks = [...userTasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  return (
    <div className="bg-white/95 backdrop-blur-3xl border border-ruru-navy/10 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-brand text-ruru-navy tracking-tight">Personal Tasks</h3>
          <p className="text-[10px] text-[#A8A29E] font-black tracking-widest uppercase mt-1">Management Tool</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-10 h-10 bg-ruru-navy text-white rounded-[1.25rem] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Plus size={20} className={cn("transition-transform", isAdding && "rotate-45")} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-5 bg-[#FDFBF7] rounded-[1.5rem] border border-ruru-navy/10 space-y-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-ruru-navy placeholder:text-[#A8A29E] outline-none border-b border-ruru-navy/10 pb-2 focus:border-ruru-navy"
              />
              <textarea
                placeholder="Optional description..."
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full bg-transparent text-xs text-ruru-navy/80 placeholder:text-[#A8A29E] outline-none flex-1 min-h-[60px] resize-none"
              />
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setNewTaskPriority(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                        newTaskPriority === p 
                          ? p === 'high' ? "bg-red-50 text-red-600 border border-red-200" 
                            : p === 'medium' ? "bg-amber-50 text-amber-600 border border-amber-200" 
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-white border border-ruru-navy/10 text-[#A8A29E] hover:border-ruru-navy/30"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="px-4 py-2 bg-ruru-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full disabled:opacity-50"
                >
                  Save Task
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {sortedTasks.map(task => (
          <motion.div 
            key={task.id}
            layout
            className={cn(
              "p-4 rounded-[1.5rem] border bg-white group transition-all duration-300",
              task.status === 'completed' ? "border-[#A8A29E]/20 opacity-60" : "border-ruru-navy/10 hover:border-ruru-navy/30 hover:shadow-md"
            )}
          >
            <div className="flex items-start gap-4">
              <button 
                onClick={() => handleUpdateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                className="pt-1 text-[#A8A29E] hover:text-ruru-navy transition-colors shrink-0"
              >
                {task.status === 'completed' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} />}
              </button>
              
              <div className="flex-1 min-w-0">
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full text-sm font-medium outline-none bg-transparent"
                      defaultValue={task.title}
                      onBlur={(e) => handleUpdateTask(task.id, { title: e.target.value })}
                    />
                    <textarea
                      className="w-full text-xs text-ruru-navy/70 outline-none bg-transparent resize-none"
                      defaultValue={task.description}
                      onBlur={(e) => handleUpdateTask(task.id, { description: e.target.value })}
                    />
                  </div>
                ) : (
                  <div onDoubleClick={() => setEditingId(task.id)} className="cursor-pointer">
                    <p className={cn("text-sm font-medium", task.status === 'completed' ? "line-through text-[#A8A29E]" : "text-ruru-navy")}>{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-[#A8A29E] mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-3 mt-3">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                    task.priority === 'high' ? "bg-red-50 text-red-600" 
                      : task.priority === 'medium' ? "bg-amber-50 text-amber-600" 
                      : "bg-emerald-50 text-emerald-600"
                  )}>
                    {task.priority}
                  </span>
                  <span className="text-[9px] font-medium text-[#A8A29E] flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setEditingId(editingId === task.id ? null : task.id)}
                  className="p-2 text-[#A8A29E] hover:text-ruru-navy rounded-full transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => deleteUserTask(task.id)}
                  className="p-2 text-[#A8A29E] hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {userTasks.length === 0 && !isAdding && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#F5F5F0] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-[#A8A29E]" />
            </div>
            <p className="text-sm font-medium text-ruru-navy">You're all caught up!</p>
            <p className="text-[10px] text-[#A8A29E] font-black uppercase tracking-widest mt-1">Add tasks to manage your schedule</p>
          </div>
        )}
      </div>
    </div>
  );
}
