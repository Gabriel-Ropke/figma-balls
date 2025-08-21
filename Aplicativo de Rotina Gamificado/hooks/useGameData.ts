import { useState, useEffect } from 'react';
import { Task, Skill } from '../types';

const initialSkills: Skill[] = [
  { id: 'strength', name: 'Força', icon: '💪', level: 1, currentXP: 0, xpToNextLevel: 100, color: '#ef4444' },
  { id: 'intelligence', name: 'Inteligência', icon: '🧠', level: 1, currentXP: 0, xpToNextLevel: 100, color: '#3b82f6' },
  { id: 'resilience', name: 'Resiliência', icon: '🛡️', level: 1, currentXP: 0, xpToNextLevel: 100, color: '#10b981' },
  { id: 'creativity', name: 'Criatividade', icon: '🎨', level: 1, currentXP: 0, xpToNextLevel: 100, color: '#8b5cf6' },
  { id: 'social', name: 'Social', icon: '👥', level: 1, currentXP: 0, xpToNextLevel: 100, color: '#f59e0b' },
  { id: 'health', name: 'Saúde', icon: '❤️', level: 1, currentXP: 0, xpToNextLevel: 100, color: '#ec4899' },
];

export function useGameData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  useEffect(() => {
    const savedTasks = localStorage.getItem('rpg-life-tasks');
    const savedSkills = localStorage.getItem('rpg-life-skills');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rpg-life-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('rpg-life-skills', JSON.stringify(skills));
  }, [skills]);

  // Função para gerar tarefas recorrentes
  const generateRecurringTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const recurringTasks = tasks.filter(task => 
      task.recurrence !== 'never' && !task.originalTaskId
    );

    const newTasks: Task[] = [];

    recurringTasks.forEach(originalTask => {
      const startDate = new Date(originalTask.startDate);
      const todayDate = new Date(today);
      
      // Verifica se já existe uma tarefa gerada para hoje
      const existsForToday = tasks.some(task => 
        task.originalTaskId === originalTask.id && task.generatedDate === today
      );

      if (!existsForToday && shouldGenerateTask(originalTask, startDate, todayDate)) {
        const newTask: Task = {
          ...originalTask,
          id: crypto.randomUUID(),
          originalTaskId: originalTask.id,
          generatedDate: today,
          completed: false,
        };
        newTasks.push(newTask);
      }
    });

    if (newTasks.length > 0) {
      setTasks(prev => [...prev, ...newTasks]);
    }
  };

  // Função para verificar se deve gerar a tarefa para determinada data
  const shouldGenerateTask = (task: Task, startDate: Date, targetDate: Date): boolean => {
    // Não gera tarefas para datas anteriores à data de início
    if (targetDate < startDate) return false;

    const daysDifference = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (task.recurrence) {
      case 'daily':
        return daysDifference >= 0;
      
      case 'weekly':
        return daysDifference >= 0 && daysDifference % 7 === 0;
      
      case 'custom':
        if (!task.recurEveryXDays) return false;
        return daysDifference >= 0 && daysDifference % task.recurEveryXDays === 0;
      
      default:
        return false;
    }
  };

  // Gerar tarefas recorrentes sempre que os tasks mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      generateRecurringTasks();
    }, 1000); // Delay para evitar loops infinitos

    return () => clearTimeout(timer);
  }, [tasks.length]); // Só executa quando o número de tarefas muda

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'originalTaskId' | 'generatedDate'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return { leveledUp: false, skill: null };

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));

    // Add XP to skill
    const skill = skills.find(s => s.id === task.skill);
    if (!skill) return { leveledUp: false, skill: null };

    const newCurrentXP = skill.currentXP + task.xp;
    let leveledUp = false;
    let newLevel = skill.level;
    let newXPToNext = skill.xpToNextLevel;

    if (newCurrentXP >= skill.xpToNextLevel) {
      leveledUp = true;
      newLevel += 1;
      newXPToNext = newLevel * 100; // Each level requires 100 more XP
    }

    setSkills(prev => prev.map(s => 
      s.id === task.skill 
        ? { 
            ...s, 
            currentXP: newCurrentXP >= s.xpToNextLevel ? newCurrentXP - s.xpToNextLevel : newCurrentXP,
            level: newLevel,
            xpToNextLevel: newXPToNext
          }
        : s
    ));

    return { leveledUp, skill: skill.name, xpGained: task.xp };
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    
    if (taskToDelete?.originalTaskId) {
      // Se for uma tarefa gerada, delete apenas ela
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      // Se for uma tarefa original, delete ela e todas as geradas
      setTasks(prev => prev.filter(t => 
        t.id !== taskId && t.originalTaskId !== taskId
      ));
    }
  };

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      // Tarefas únicas programadas para hoje
      if (task.recurrence === 'never' && task.startDate === today) {
        return true;
      }
      
      // Tarefas geradas para hoje
      if (task.generatedDate === today) {
        return true;
      }
      
      return false;
    });
  };

  const getAllTasks = () => {
    return tasks.filter(task => !task.originalTaskId); // Retorna apenas tarefas originais
  };

  return {
    tasks,
    skills,
    addTask,
    completeTask,
    deleteTask,
    getTodayTasks,
    getAllTasks,
  };
}