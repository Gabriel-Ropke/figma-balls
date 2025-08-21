import { Task, Skill } from '../types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Trash2, Clock, Repeat, Calendar } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  skill?: Skill;
  onComplete: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, skill, onComplete, onDelete }: TaskItemProps) {
  const getRecurrenceIcon = () => {
    if (task.recurrence === 'never') return null;
    
    return (
      <div className="flex items-center gap-1 text-xs text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded">
        <Repeat className="w-3 h-3" />
        {task.recurrence === 'daily' && 'Diário'}
        {task.recurrence === 'weekly' && 'Semanal'}
        {task.recurrence === 'custom' && `${task.recurEveryXDays}d`}
      </div>
    );
  };

  const isGeneratedTask = !!task.originalTaskId;

  return (
    <div className={`bg-gray-800/30 rounded-lg p-4 border transition-all duration-200 ${
      task.completed 
        ? 'border-green-500/30 bg-green-900/10' 
        : 'border-gray-600/30 hover:border-gray-500/50'
    }`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onComplete}
          className="border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 mt-0.5"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium leading-snug ${
                task.completed ? 'line-through text-gray-400' : 'text-white'
              }`}>
                {task.name}
              </h4>
              
              {/* Horário - destacado conforme especificação */}
              {task.time && (
                <div className="flex items-center gap-1 text-sm text-blue-300 mt-1 font-medium">
                  <Clock className="w-4 h-4" />
                  {task.time}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 -mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Recompensa XP - destacada conforme especificação "+15 Força 💪" */}
          {skill && (
            <div className="flex items-center justify-between">
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border"
                style={{ 
                  backgroundColor: `${skill.color}15`,
                  color: skill.color,
                  border: `1px solid ${skill.color}40`
                }}
              >
                <span className="text-base">{skill.icon}</span>
                <span>+{task.xp} {skill.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {getRecurrenceIcon()}
                
                {isGeneratedTask && (
                  <div className="flex items-center gap-1 text-xs text-purple-400 bg-purple-900/20 px-1.5 py-0.5 rounded">
                    <Calendar className="w-3 h-3" />
                    Auto
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Warning for recurring task deletion */}
      {!isGeneratedTask && task.recurrence !== 'never' && (
        <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 px-3 py-2 rounded border-l-2 border-yellow-400">
          💡 Deletar esta tarefa removerá também todas as futuras ocorrências
        </div>
      )}
    </div>
  );
}