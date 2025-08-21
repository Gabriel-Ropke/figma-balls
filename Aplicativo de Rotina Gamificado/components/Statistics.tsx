import { Task, Skill } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Zap, Target, Calendar, TrendingUp, Award, Flame } from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
  skills: Skill[];
}

interface DailyStats {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

export function Statistics({ tasks, skills }: StatisticsProps) {
  // Calcular estatísticas gerais
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalXPGained = tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.xp, 0);
  
  const overallCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calcular streak atual (dias consecutivos com tarefas completas)
  const calculateCurrentStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayTasks = tasks.filter(task => {
        if (task.recurrence === 'never' && task.startDate === dateStr) return true;
        if (task.generatedDate === dateStr) return true;
        return false;
      });
      
      if (dayTasks.length === 0) {
        // Se não há tarefas para este dia, pular
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
      
      // Limite para evitar loops infinitos
      if (streak > 365) break;
    }
    
    return streak;
  };
  
  // Estatísticas dos últimos 7 dias
  const getLast7DaysStats = (): DailyStats[] => {
    const stats: DailyStats[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTasks = tasks.filter(task => {
        if (task.recurrence === 'never' && task.startDate === dateStr) return true;
        if (task.generatedDate === dateStr) return true;
        return false;
      });
      
      const completed = dayTasks.filter(task => task.completed).length;
      const total = dayTasks.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      stats.push({
        date: dateStr,
        completed,
        total,
        percentage
      });
    }
    
    return stats;
  };
  
  // Estatísticas por habilidade
  const getSkillStats = () => {
    return skills.map(skill => {
      const skillTasks = tasks.filter(task => task.skill === skill.id);
      const completedSkillTasks = skillTasks.filter(task => task.completed);
      const totalXP = completedSkillTasks.reduce((sum, task) => sum + task.xp, 0);
      
      return {
        ...skill,
        tasksCompleted: completedSkillTasks.length,
        totalTasks: skillTasks.length,
        totalXPGained: totalXP,
        completionRate: skillTasks.length > 0 ? Math.round((completedSkillTasks.length / skillTasks.length) * 100) : 0
      };
    }).sort((a, b) => b.totalXPGained - a.totalXPGained);
  };
  
  const currentStreak = calculateCurrentStreak();
  const last7Days = getLast7DaysStats();
  const skillStats = getSkillStats();
  const weeklyAverage = Math.round(last7Days.reduce((sum, day) => sum + day.percentage, 0) / 7);
  
  // Melhor dia da semana
  const weeklyTasks = last7Days.filter(day => day.total > 0);
  const bestDay = weeklyTasks.length > 0 
    ? weeklyTasks.reduce((best, day) => day.percentage > best.percentage ? day : best)
    : null;
  
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-300">Streak Atual</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
            <div className="text-xs text-gray-400">dias consecutivos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">XP Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{totalXPGained}</div>
            <div className="text-xs text-gray-400">experiência ganha</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Overall Progress */}
      <Card className="bg-gray-800/30 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Conclusão de Tarefas</span>
              <span className="text-gray-300">{overallCompletion}%</span>
            </div>
            <Progress value={overallCompletion} className="h-2" />
            <div className="text-xs text-gray-400 mt-1">
              {completedTasks} de {totalTasks} tarefas concluídas
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{weeklyAverage}%</div>
              <div className="text-xs text-gray-400">Média da Semana</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{skills.reduce((sum, skill) => sum + skill.level, 0)}</div>
              <div className="text-xs text-gray-400">Nível Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{skillStats.length}</div>
              <div className="text-xs text-gray-400">Habilidades</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly Progress */}
      <Card className="bg-gray-800/30 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Últimos 7 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {last7Days.map((day, index) => {
              const date = new Date(day.date + 'T12:00:00');
              const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
              const dayNumber = date.getDate();
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <div className="w-12 text-xs text-gray-400">
                    <div>{dayName}</div>
                    <div>{dayNumber}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        {day.total === 0 ? 'Sem tarefas' : `${day.completed}/${day.total}`}
                      </span>
                      <span className="text-gray-300">{day.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          day.percentage === 100 ? 'bg-green-500' :
                          day.percentage >= 50 ? 'bg-yellow-500' :
                          day.percentage > 0 ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                        style={{ width: `${day.total > 0 ? day.percentage : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {bestDay && (
            <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Award className="w-4 h-4" />
                <span>
                  Melhor dia: {new Date(bestDay.date + 'T12:00:00').toLocaleDateString('pt-BR', { 
                    weekday: 'long' 
                  })} ({bestDay.percentage}%)
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Skills Performance */}
      <Card className="bg-gray-800/30 border-gray-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance por Habilidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillStats.slice(0, 3).map((skillStat, index) => (
            <div key={skillStat.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{skillStat.icon}</span>
                  <span className="text-white font-medium">{skillStat.name}</span>
                  {index === 0 && <Award className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-300">{skillStat.totalXPGained} XP</div>
                  <div className="text-xs text-gray-400">{skillStat.completionRate}% conclusão</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${skillStat.completionRate}%`,
                    backgroundColor: skillStat.color
                  }}
                />
              </div>
              
              <div className="text-xs text-gray-400">
                {skillStat.tasksCompleted} de {skillStat.totalTasks} tarefas • Nível {skillStat.level}
              </div>
            </div>
          ))}
          
          {skillStats.length > 3 && (
            <div className="text-center pt-2">
              <div className="text-sm text-gray-400">
                e mais {skillStats.length - 3} habilidades...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}