import { Task, Skill } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Star, Zap, Calendar, Target, Flame, Award, Crown } from 'lucide-react';

interface AchievementsProps {
  tasks: Task[];
  skills: Skill[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'streak' | 'xp' | 'tasks' | 'skills' | 'special';
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  reward?: string;
}

export function Achievements({ tasks, skills }: AchievementsProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const totalXP = completedTasks.reduce((sum, task) => sum + task.xp, 0);
  const totalLevels = skills.reduce((sum, skill) => sum + skill.level, 0);
  
  // Calcular streak atual
  const calculateCurrentStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (streak < 365) { // Limite de segurança
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => {
        if (task.recurrence === 'never' && task.startDate === dateStr) return true;
        if (task.generatedDate === dateStr) return true;
        return false;
      });
      
      if (dayTasks.length === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      
      const completedOnDay = dayTasks.filter(task => task.completed).length;
      if (completedOnDay === dayTasks.length && dayTasks.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const currentStreak = calculateCurrentStreak();
  
  // Definir conquistas
  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'first-day',
      title: 'Primeiro Passo',
      description: 'Complete todas as tarefas de um dia',
      icon: '🎯',
      color: '#10b981',
      category: 'streak',
      isUnlocked: currentStreak >= 1,
      progress: Math.min(currentStreak, 1),
      maxProgress: 1,
      reward: '+50 XP bônus'
    },
    {
      id: 'week-warrior',
      title: 'Guerreiro Semanal',
      description: 'Mantenha um streak de 7 dias',
      icon: '⚔️',
      color: '#f59e0b',
      category: 'streak',
      isUnlocked: currentStreak >= 7,
      progress: Math.min(currentStreak, 7),
      maxProgress: 7,
      reward: '+100 XP bônus'
    },
    {
      id: 'month-master',
      title: 'Mestre do Mês',
      description: 'Mantenha um streak de 30 dias',
      icon: '👑',
      color: '#8b5cf6',
      category: 'streak',
      isUnlocked: currentStreak >= 30,
      progress: Math.min(currentStreak, 30),
      maxProgress: 30,
      reward: 'Título especial'
    },
    
    // XP Achievements
    {
      id: 'hundred-club',
      title: 'Clube dos 100',
      description: 'Ganhe 100 XP total',
      icon: '💯',
      color: '#3b82f6',
      category: 'xp',
      isUnlocked: totalXP >= 100,
      progress: Math.min(totalXP, 100),
      maxProgress: 100
    },
    {
      id: 'thousand-master',
      title: 'Mestre dos Mil',
      description: 'Ganhe 1000 XP total',
      icon: '🌟',
      color: '#f59e0b',
      category: 'xp',
      isUnlocked: totalXP >= 1000,
      progress: Math.min(totalXP, 1000),
      maxProgress: 1000,
      reward: 'Novo tema desbloqueado'
    },
    
    // Task Achievements
    {
      id: 'task-starter',
      title: 'Iniciante',
      description: 'Complete 10 tarefas',
      icon: '📋',
      color: '#10b981',
      category: 'tasks',
      isUnlocked: completedTasks.length >= 10,
      progress: Math.min(completedTasks.length, 10),
      maxProgress: 10
    },
    {
      id: 'task-veteran',
      title: 'Veterano',
      description: 'Complete 100 tarefas',
      icon: '🏆',
      color: '#f59e0b',
      category: 'tasks',
      isUnlocked: completedTasks.length >= 100,
      progress: Math.min(completedTasks.length, 100),
      maxProgress: 100
    },
    
    // Skill Achievements
    {
      id: 'skill-rookie',
      title: 'Aprendiz',
      description: 'Atinja nível 5 total em habilidades',
      icon: '⚡',
      color: '#8b5cf6',
      category: 'skills',
      isUnlocked: totalLevels >= 10,
      progress: Math.min(totalLevels, 10),
      maxProgress: 10
    },
    {
      id: 'skill-expert',
      title: 'Especialista',
      description: 'Atinja nível 30 total em habilidades',
      icon: '🧠',
      color: '#ec4899',
      category: 'skills',
      isUnlocked: totalLevels >= 30,
      progress: Math.min(totalLevels, 30),
      maxProgress: 30,
      reward: 'Nova habilidade desbloqueada'
    },
    
    // Special Achievements
    {
      id: 'early-bird',
      title: 'Madrugador',
      description: 'Complete 10 tarefas matinais',
      icon: '🌅',
      color: '#f59e0b',
      category: 'special',
      isUnlocked: completedTasks.filter(t => t.period === 'morning').length >= 10,
      progress: Math.min(completedTasks.filter(t => t.period === 'morning').length, 10),
      maxProgress: 10
    },
    {
      id: 'night-owl',
      title: 'Coruja Noturna',
      description: 'Complete 10 tarefas noturnas',
      icon: '🦉',
      color: '#6366f1',
      category: 'special',
      isUnlocked: completedTasks.filter(t => t.period === 'night').length >= 10,
      progress: Math.min(completedTasks.filter(t => t.period === 'night').length, 10),
      maxProgress: 10
    }
  ];
  
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);
  
  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'xp': return <Zap className="w-4 h-4" />;
      case 'tasks': return <Target className="w-4 h-4" />;
      case 'skills': return <Star className="w-4 h-4" />;
      case 'special': return <Crown className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };
  
  const categoryLabels = {
    streak: 'Sequência',
    xp: 'Experiência',
    tasks: 'Tarefas',
    skills: 'Habilidades',
    special: 'Especiais'
  };
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  {unlockedAchievements.length}/{achievements.length}
                </div>
                <div className="text-sm text-gray-300">Conquistas Desbloqueadas</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
              </div>
              <div className="text-xs text-gray-400">Concluído</div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress 
              value={(unlockedAchievements.length / achievements.length) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card className="bg-gray-800/30 border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Conquistas Desbloqueadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockedAchievements.map(achievement => (
              <div 
                key={achievement.id}
                className="flex items-center gap-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-green-300">{achievement.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ backgroundColor: `${achievement.color}20`, color: achievement.color }}
                    >
                      {getCategoryIcon(achievement.category)}
                      <span className="ml-1">{categoryLabels[achievement.category]}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                  {achievement.reward && (
                    <div className="text-xs text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded">
                      🎁 {achievement.reward}
                    </div>
                  )}
                </div>
                
                <div className="text-green-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <Card className="bg-gray-800/30 border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Próximas Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lockedAchievements.slice(0, 5).map(achievement => (
              <div 
                key={achievement.id}
                className="flex items-center gap-4 p-3 bg-gray-700/30 border border-gray-600/30 rounded-lg"
              >
                <div className="text-2xl grayscale opacity-60">{achievement.icon}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-300">{achievement.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs opacity-60"
                    >
                      {getCategoryIcon(achievement.category)}
                      <span className="ml-1">{categoryLabels[achievement.category]}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">
                        {achievement.progress} / {achievement.maxProgress}
                      </span>
                      <span className="text-gray-500">
                        {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                          backgroundColor: achievement.color 
                        }}
                      />
                    </div>
                  </div>
                  
                  {achievement.reward && (
                    <div className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded mt-2">
                      🎁 {achievement.reward}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {lockedAchievements.length > 5 && (
              <div className="text-center py-2 text-gray-400 text-sm">
                +{lockedAchievements.length - 5} conquistas restantes
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Achievement Tips */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-blue-400" />
            <h4 className="font-medium text-blue-300">Dicas para Conquistas</h4>
          </div>
          <div className="space-y-2 text-sm text-gray-300">
            <div>• Mantenha uma rotina diária para desbloquear conquistas de streak</div>
            <div>• Complete tarefas de diferentes períodos para conquistas especiais</div>
            <div>• Foque em habilidades específicas para acelerar o progresso</div>
            <div>• Conquistas desbloqueadas podem oferecer recompensas especiais!</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}