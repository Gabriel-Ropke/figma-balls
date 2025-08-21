import { useState } from 'react';
import { Task, Skill, RecurrenceType } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Info } from 'lucide-react';

interface TaskFormProps {
  skills: Skill[];
  onSubmit: (task: Omit<Task, 'id' | 'completed' | 'originalTaskId' | 'generatedDate'>) => void;
  onClose: () => void;
}

const recurrenceOptions = [
  { value: 'never' as RecurrenceType, label: '📅 Nunca (apenas uma vez)' },
  { value: 'daily' as RecurrenceType, label: '🔄 Diariamente' },
  { value: 'weekly' as RecurrenceType, label: '📆 Semanalmente' },
  { value: 'custom' as RecurrenceType, label: '⚙️ A cada X dias' },
];

export function TaskForm({ skills, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    period: 'morning' as Task['period'],
    time: '',
    skill: skills[0]?.id || '',
    xp: 10,
    recurrence: 'never' as RecurrenceType,
    recurEveryXDays: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.skill) return;
    
    onSubmit({
      name: formData.name,
      startDate: formData.startDate,
      period: formData.period,
      time: formData.time || undefined,
      skill: formData.skill,
      xp: formData.xp,
      recurrence: formData.recurrence,
      recurEveryXDays: formData.recurrence === 'custom' ? formData.recurEveryXDays : undefined,
    });
  };

  const selectedSkill = skills.find(s => s.id === formData.skill);

  const getRecurrenceDescription = () => {
    switch (formData.recurrence) {
      case 'daily':
        return 'A tarefa aparecerá todos os dias a partir da data de início.';
      case 'weekly':
        return 'A tarefa aparecerá semanalmente (a cada 7 dias) a partir da data de início.';
      case 'custom':
        return `A tarefa aparecerá a cada ${formData.recurEveryXDays} dias a partir da data de início.`;
      default:
        return 'A tarefa aparecerá apenas na data escolhida.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-600 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Nova Tarefa</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome da Tarefa</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Fazer exercícios, Estudar React..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-white">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Recurrence */}
            <div className="space-y-2">
              <Label className="text-white">Recorrência</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value: RecurrenceType) => 
                  setFormData(prev => ({ ...prev, recurrence: value }))
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {recurrenceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Custom Recurrence Days */}
              {formData.recurrence === 'custom' && (
                <div className="mt-2">
                  <Label htmlFor="recurEveryXDays" className="text-white text-sm">
                    Repetir a cada quantos dias?
                  </Label>
                  <Input
                    id="recurEveryXDays"
                    type="number"
                    min="2"
                    max="365"
                    value={formData.recurEveryXDays}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      recurEveryXDays: parseInt(e.target.value) || 2 
                    }))}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
              )}

              {/* Recurrence Description */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mt-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-200">
                    {getRecurrenceDescription()}
                  </div>
                </div>
              </div>
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label className="text-white">Período do Dia</Label>
              <Select
                value={formData.period}
                onValueChange={(value: Task['period']) => 
                  setFormData(prev => ({ ...prev, period: value }))
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="morning">🌅 Manhã</SelectItem>
                  <SelectItem value="afternoon">☀️ Tarde</SelectItem>
                  <SelectItem value="night">🌙 Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">Horário (Opcional)</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Skill */}
            <div className="space-y-2">
              <Label className="text-white">Habilidade</Label>
              <Select
                value={formData.skill}
                onValueChange={(value) => setFormData(prev => ({ ...prev, skill: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {skills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      <div className="flex items-center gap-2">
                        <span>{skill.icon}</span>
                        <span>{skill.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* XP */}
            <div className="space-y-2">
              <Label htmlFor="xp" className="text-white">XP Reward</Label>
              <Select
                value={formData.xp.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, xp: parseInt(value) }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="5">5 XP - Muito Fácil</SelectItem>
                  <SelectItem value="10">10 XP - Fácil</SelectItem>
                  <SelectItem value="15">15 XP - Médio</SelectItem>
                  <SelectItem value="25">25 XP - Difícil</SelectItem>
                  <SelectItem value="50">50 XP - Muito Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview */}
            {selectedSkill && (
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-300 mb-2">Preview:</div>
                <div className="flex items-center gap-2">
                  <span>{selectedSkill.icon}</span>
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${selectedSkill.color}20`,
                      color: selectedSkill.color,
                      border: `1px solid ${selectedSkill.color}30`
                    }}
                  >
                    +{formData.xp} {selectedSkill.name}
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}