export type UserRole = 'patient' | 'therapist';

export type MoodType = 'Radiante' | 'Bem' | 'Neutro' | 'Triste' | 'Devastado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // For patients, this links them to a therapist
  therapistId?: string;
}

export interface MoodLog {
  id: string;
  userId: string;
  timestamp: string; // ISO String
  mood: MoodType;
  note: string; // Journal entry
  reflectionCompleted: boolean;
}

export interface DailyReflection {
  id: string;
  therapistId: string;
  date: string; // Format YYYY-MM-DD to ensure daily uniqueness
  content: string;
  audioUrl?: string;
  duration?: string;
}

// Helper for charts
export interface MoodChartData {
  day: string;
  score: number; // 1-5 representation of mood
  mood: MoodType;
}