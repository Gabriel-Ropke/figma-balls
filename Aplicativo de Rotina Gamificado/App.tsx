import { useState } from 'react';
import { DailyRoutine } from './components/DailyRoutine';
import { Skills } from './components/Skills';
import { Calendar } from './components/Calendar';
import { Statistics } from './components/Statistics';
import { Achievements } from './components/Achievements';
import { TaskForm } from './components/TaskForm';
import { LevelUpAnimation } from './components/LevelUpAnimation';
import { useGameData } from './hooks/useGameData';
import { Button } from './components/ui/button';
import { Calendar as CalendarIcon, Zap, Plus, BarChart3, Home, Trophy } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';

type View = 'routine' | 'calendar' | 'skills' | 'stats' | 'achievements';

interface LevelUpState {
  isVisible: boolean;
  skillName: string;
  newLevel: number;
  skillIcon: string;
  skillColor: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('routine');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [levelUpState, setLevelUpState] = useState<LevelUpState>({
    isVisible: false,
    skillName: '',
    newLevel: 0,
    skillIcon: '',
    skillColor: ''
  });
  const gameData = useGameData();

  const handleCompleteTask = (taskId: string) => {
    const result = gameData.completeTask(taskId);
    
    if (result.xpGained) {
      toast.success(`+${result.xpGained} XP em ${result.skill}!`, {
        duration: 2000,
      });
    }
    
    if (result.leveledUp) {
      // Show level up animation
      const skill = gameData.skills.find(s => s.name === result.skill);
      if (skill) {
        setLevelUpState({
          isVisible: true,
          skillName: skill.name,
          newLevel: skill.level,
          skillIcon: skill.icon,
          skillColor: skill.color
        });
      }
      
      toast.success(`🎉 Level UP em ${result.skill}!`, {
        duration: 3000,
      });
    }
    
    // Check for new achievements (simplified version)
    const completedTasks = gameData.tasks.filter(task => task.completed);
    const totalXP = completedTasks.reduce((sum, task) => sum + task.xp, 0);
    
    // Achievement notifications
    if (completedTasks.length === 1) {
      toast.success('🏆 Conquista desbloqueada: Primeiro Passo!', {
        duration: 4000,
      });
    } else if (completedTasks.length === 10) {
      toast.success('🏆 Conquista desbloqueada: Iniciante!', {
        duration: 4000,
      });
    } else if (totalXP >= 100 && totalXP - (result.xpGained || 0) < 100) {
      toast.success('🏆 Conquista desbloqueada: Clube dos 100!', {
        duration: 4000,
      });
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'routine': return 'Rotina Diária';
      case 'calendar': return 'Agenda';
      case 'skills': return 'Habilidades';
      case 'stats': return 'Estatísticas';
      case 'achievements': return 'Conquistas';
      default: return 'RPG Life';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-md mx-auto bg-gray-900/50 backdrop-blur-sm min-h-screen">
        {/* Header */}
        <div className="p-4 bg-gray-800/30 backdrop-blur-sm border-b border-gray-600/30 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {getViewTitle()}
            </h1>
            {/* Navegação horizontal no topo - design mais moderno */}
            <div className="flex gap-1 bg-gray-800/60 rounded-xl p-1 backdrop-blur-sm border border-gray-600/30">
              <Button
                variant={currentView === 'routine' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('routine')}
                className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                  currentView === 'routine' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('calendar')}
                className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                  currentView === 'calendar' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'skills' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('skills')}
                className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                  currentView === 'skills' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Zap className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'achievements' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('achievements')}
                className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                  currentView === 'achievements' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Trophy className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'stats' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('stats')}
                className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
                  currentView === 'stats' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-20">
          {currentView === 'routine' && (
            <DailyRoutine
              tasks={gameData.getTodayTasks()}
              skills={gameData.skills}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={gameData.deleteTask}
            />
          )}
          {currentView === 'calendar' && (
            <Calendar
              tasks={gameData.tasks}
              skills={gameData.skills}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={gameData.deleteTask}
              onAddTask={() => setShowTaskForm(true)}
            />
          )}
          {currentView === 'skills' && (
            <Skills skills={gameData.skills} />
          )}
          {currentView === 'achievements' && (
            <Achievements 
              tasks={gameData.tasks} 
              skills={gameData.skills} 
            />
          )}
          {currentView === 'stats' && (
            <Statistics 
              tasks={gameData.tasks} 
              skills={gameData.skills} 
            />
          )}
        </div>

        {/* Floating Action Button */}
        {(currentView === 'routine' || currentView === 'calendar') && (
          <Button
            onClick={() => setShowTaskForm(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            skills={gameData.skills}
            onSubmit={(task) => {
              gameData.addTask(task);
              setShowTaskForm(false);
              toast.success('Tarefa adicionada com sucesso!');
            }}
            onClose={() => setShowTaskForm(false)}
          />
        )}

        <Toaster 
          theme="dark" 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgb(31 41 55)',
              border: '1px solid rgb(75 85 99)',
              color: 'white',
            },
          }}
        />
        
        {/* Level Up Animation */}
        <LevelUpAnimation
          isVisible={levelUpState.isVisible}
          skillName={levelUpState.skillName}
          newLevel={levelUpState.newLevel}
          skillIcon={levelUpState.skillIcon}
          skillColor={levelUpState.skillColor}
          onComplete={() => setLevelUpState(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </div>
  );
}