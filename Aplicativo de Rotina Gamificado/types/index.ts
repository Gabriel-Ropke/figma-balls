export interface Task {
  id: string;
  name: string;
  startDate: string; // Data de início ao invés de data única
  period: 'morning' | 'afternoon' | 'night';
  time?: string;
  skill: string;
  xp: number;
  completed: boolean;
  recurrence: RecurrenceType;
  recurEveryXDays?: number; // Para recorrência personalizada
  originalTaskId?: string; // Para identificar tarefas geradas automaticamente
  generatedDate?: string; // Data para qual a tarefa foi gerada
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  color: string;
}

export type Period = 'morning' | 'afternoon' | 'night';

export type RecurrenceType = 'never' | 'daily' | 'weekly' | 'custom';

export interface RecurrenceOption {
  value: RecurrenceType | 'custom';
  label: string;
}