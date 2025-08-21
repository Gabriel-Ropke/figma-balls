import { Skill } from '../types';
import { Progress } from './ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, Award, Star } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const totalLevel = skills.reduce((sum, skill) => sum + skill.level, 0);
  const averageLevel = Math.round(totalLevel / skills.length);
  const totalCurrentXP = skills.reduce((sum, skill) => sum + skill.currentXP, 0);
  const totalXPToNext = skills.reduce((sum, skill) => sum + skill.xpToNextLevel, 0);

  // Encontrar a habilidade com mais progresso para o próximo nível
  const skillsWithProgress = skills.map(skill => ({
    ...skill,
    progressPercentage: (skill.currentXP / skill.xpToNextLevel) * 100
  })).sort((a, b) => b.progressPercentage - a.progressPercentage);

  const topSkill = skillsWithProgress[0];

  return (
    <div className="space-y-6">
      {/* Character Overview */}
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader className="text-center">
          <div className="text-6xl mb-2">🎮</div>
          <CardTitle className="text-white">Seu Personagem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-purple-400">{totalLevel}</div>
              <div className="text-sm text-gray-400">Nível Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{averageLevel}</div>
              <div className="text-sm text-gray-400">Nível Médio</div>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progresso Geral</span>
              <span className="text-gray-300">
                {totalCurrentXP} / {totalXPToNext} XP
              </span>
            </div>
            <Progress 
              value={(totalCurrentXP / totalXPToNext) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Top Performer */}
      {topSkill && (
        <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 p-2 rounded-full">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{topSkill.icon}</span>
                  <span className="font-medium text-yellow-300">
                    {topSkill.name} está em destaque!
                  </span>
                </div>
                <div className="text-xs text-gray-300">
                  {Math.round(topSkill.progressPercentage)}% para o próximo nível
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  LVL {topSkill.level}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Star className="w-5 h-5" />
          Suas Habilidades
        </h3>
        
        {skills.map(skill => {
          const progressPercentage = (skill.currentXP / skill.xpToNextLevel) * 100;
          
          return (
            <Card key={skill.id} className="bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium text-white">{skill.name}</h4>
                      <div className="flex items-baseline gap-1">
                        <span 
                          className="text-lg font-bold"
                          style={{ color: skill.color }}
                        >
                          {skill.level}
                        </span>
                        <span className="text-xs text-gray-400">LVL</span>
                      </div>
                    </div>
                    
                    {/* Skill badges based on level */}
                    <div className="flex gap-1 mt-1">
                      {skill.level >= 5 && (
                        <div className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">
                          Experiente
                        </div>
                      )}
                      {skill.level >= 10 && (
                        <div className="text-xs bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded">
                          Avançado
                        </div>
                      )}
                      {skill.level >= 20 && (
                        <div className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded">
                          Mestre
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {skill.currentXP} / {skill.xpToNextLevel} XP
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ 
                        width: `${progressPercentage}%`,
                        background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`
                      }}
                    >
                      {/* Animated shine effect */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"
                        style={{ animationDuration: '2s' }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">
                      {skill.xpToNextLevel - skill.currentXP} XP para próximo nível
                    </span>
                    {progressPercentage >= 80 && (
                      <span className="text-green-400 font-medium">
                        Quase lá! 🎯
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <h4 className="font-medium text-purple-300">Dicas de Progressão</h4>
          </div>
          <div className="space-y-1 text-sm text-gray-300">
            <div>• Complete tarefas diariamente para ganhar XP consistente</div>
            <div>• Cada nível requer mais XP que o anterior (Level × 100)</div>
            <div>• Varie entre diferentes tipos de habilidades para crescimento equilibrado</div>
            <div>• Tarefas mais difíceis oferecem mais XP por conclusão</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}