import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MoodLog, MoodType, DailyReflection } from '../types';
import { MOCK_USERS, MOCK_LOGS, WHITELISTED_INVITES, MOCK_REFLECTIONS } from '../services/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  logs: MoodLog[];
  addLog: (mood: MoodType, note: string) => void;
  getLogsForUser: (userId: string) => MoodLog[];
  getPatientsForTherapist: (therapistId: string) => User[];
  
  // Reflection Methods
  getDailyReflection: (therapistId: string) => DailyReflection | undefined;
  saveReflection: (content: string, hasAudio: boolean) => void;
  
  authError: string | null;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [logs, setLogs] = useState<MoodLog[]>(MOCK_LOGS);
  const [reflections, setReflections] = useState<DailyReflection[]>(MOCK_REFLECTIONS);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, verify session token here
  }, []);

  const clearError = () => setAuthError(null);

  const login = async (email: string, password: string) => {
    clearError();
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = users.find(u => u.email === email);
    
    if (user && user.password === password) {
      setCurrentUser(user);
    } else {
      setAuthError("E-mail ou senha incorretos.");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    clearError();
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Check if user already exists
    if (users.find(u => u.email === email)) {
      setAuthError("Este e-mail já possui uma conta.");
      return;
    }

    // 2. Check whitelist (Admin pre-approval)
    const invite = WHITELISTED_INVITES.find(i => i.email === email);
    if (!invite) {
      setAuthError("E-mail não autorizado. Peça ao administrador/terapeuta para liberar seu acesso.");
      return;
    }

    // 3. Create User
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: invite.role,
      therapistId: invite.therapistId,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
    clearError();
  };

  const addLog = (mood: MoodType, note: string) => {
    if (!currentUser) return;

    const now = new Date();
    
    // Check if log exists for today
    const existingLogIndex = logs.findIndex(log => {
      const logDate = new Date(log.timestamp);
      return log.userId === currentUser.id && 
             logDate.getDate() === now.getDate() &&
             logDate.getMonth() === now.getMonth() &&
             logDate.getFullYear() === now.getFullYear();
    });

    if (existingLogIndex >= 0) {
      // Update existing log
      const updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        mood,
        note,
        timestamp: now.toISOString() // Update timestamp to latest edit
      };
      setLogs(updatedLogs);
    } else {
      // Create new log
      const newLog: MoodLog = {
        id: Date.now().toString(),
        userId: currentUser.id,
        timestamp: now.toISOString(),
        mood,
        note,
        reflectionCompleted: true
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const getLogsForUser = (userId: string) => {
    return logs.filter(log => log.userId === userId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const getPatientsForTherapist = (therapistId: string) => {
    return users.filter(u => u.role === 'patient' && u.therapistId === therapistId);
  };

  // --- Reflection Logic ---

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('pt-BR');
  };

  const getDailyReflection = (therapistId: string) => {
    const today = getTodayDateString();
    return reflections.find(r => r.therapistId === therapistId && r.date === today);
  };

  const saveReflection = (content: string, hasAudio: boolean) => {
    if (!currentUser || currentUser.role !== 'therapist') return;

    const today = getTodayDateString();
    const existingIndex = reflections.findIndex(r => r.therapistId === currentUser.id && r.date === today);

    const newReflection: DailyReflection = {
      id: existingIndex >= 0 ? reflections[existingIndex].id : Date.now().toString(),
      therapistId: currentUser.id,
      date: today,
      content,
      audioUrl: hasAudio ? 'mock-audio.mp3' : undefined,
      duration: hasAudio ? '2:30' : undefined
    };

    if (existingIndex >= 0) {
      const updated = [...reflections];
      updated[existingIndex] = newReflection;
      setReflections(updated);
    } else {
      setReflections(prev => [...prev, newReflection]);
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      login, 
      register,
      logout, 
      logs, 
      addLog, 
      getLogsForUser,
      getPatientsForTherapist,
      getDailyReflection,
      saveReflection,
      authError,
      clearError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};