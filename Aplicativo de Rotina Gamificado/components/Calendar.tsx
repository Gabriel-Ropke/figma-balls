import { useState } from 'react';
import { Task, Skill } from '../types';
import { TaskItem } from './TaskItem';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarProps {
  tasks: Task[];
  skills: Skill[];
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask?: () => void;
}

export function Calendar({ tasks, skills, onCompleteTask, onDeleteTask, onAddTask }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({
        date: day.toISOString().split('T')[0],
        day: day.getDate(),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Current month's days
    const today = new Date().toISOString().split('T')[0];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: date === today
      });
    }
    
    // Next month's leading days
    const remaining = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day).toISOString().split('T')[0];
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };
  
  const getTasksForDate = (date: string) => {
    return tasks.filter(task => {
      // Tarefas únicas programadas para esta data
      if (task.recurrence === 'never' && task.startDate === date) {
        return true;
      }
      
      // Tarefas geradas para esta data
      if (task.generatedDate === date) {
        return true;
      }
      
      return false;
    });
  };
  
  const hasTasksOnDate = (date: string) => {
    return getTasksForDate(date).length > 0;
  };
  
  const getTaskCompletionForDate = (date: string) => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return null;
    
    const completed = dateTasks.filter(task => task.completed).length;
    const total = dateTasks.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };
  
  const selectedDateTasks = getTasksForDate(selectedDate);
  const selectedDateCompletion = getTaskCompletionForDate(selectedDate);
  
  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="bg-gray-800/30 border-gray-600/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousMonth}
              className="text-gray-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <CardTitle className="text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              className="text-gray-300 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((dayInfo, index) => {
              const hasTasks = hasTasksOnDate(dayInfo.date);
              const completion = getTaskCompletionForDate(dayInfo.date);
              const isSelected = dayInfo.date === selectedDate;
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(dayInfo.date)}
                  className={`
                    relative aspect-square rounded-lg p-1 text-sm transition-all duration-200
                    ${isSelected 
                      ? 'bg-purple-500/30 border-2 border-purple-400 text-white' 
                      : 'hover:bg-gray-700/50'
                    }
                    ${!dayInfo.isCurrentMonth 
                      ? 'text-gray-600' 
                      : dayInfo.isToday 
                        ? 'text-blue-400 font-bold' 
                        : 'text-gray-300'
                    }
                  `}
                >
                  <span>{dayInfo.day}</span>
                  
                  {/* Task Indicator */}
                  {hasTasks && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {completion?.percentage === 100 ? (
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      ) : completion && completion.percentage > 0 ? (
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Date Tasks */}
      <Card className="bg-gray-800/30 border-gray-600/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
            
            {selectedDateCompletion && (
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {selectedDateCompletion.completed}/{selectedDateCompletion.total} tarefas
                </div>
                <div className="text-xs text-gray-400">
                  {selectedDateCompletion.percentage}% concluído
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {selectedDateTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p>Nenhuma tarefa para este dia</p>
              {onAddTask && (
                <Button
                  onClick={onAddTask}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              )}
            </div>
          ) : (
            selectedDateTasks
              .sort((a, b) => {
                // Sort by period first, then by time, then by name
                const periodOrder = { morning: 1, afternoon: 2, night: 3 };
                if (a.period !== b.period) {
                  return periodOrder[a.period] - periodOrder[b.period];
                }
                if (a.time && b.time) {
                  return a.time.localeCompare(b.time);
                }
                if (a.time && !b.time) return -1;
                if (!a.time && b.time) return 1;
                return a.name.localeCompare(b.name);
              })
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  skill={skills.find(s => s.id === task.skill)}
                  onComplete={() => onCompleteTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))
          )}
        </CardContent>
      </Card>
      
      {/* Legend */}
      <Card className="bg-gray-800/30 border-gray-600/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-gray-300">Completo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <span className="text-gray-300">Parcial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-gray-300">Pendente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}