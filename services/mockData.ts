import { User, MoodLog, MoodType, UserRole, DailyReflection } from '../types';

// Password is '123456' for all mocks for demo purposes
export const MOCK_USERS: (User & { password?: string })[] = [
  {
    id: 'u1',
    name: 'Sofia Luz',
    email: 'sofia@exemplo.com',
    role: 'patient',
    therapistId: 't1',
    avatarUrl: 'https://picsum.photos/seed/sofia/200/200',
    password: '123' 
  },
  {
    id: 'u2',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'patient',
    therapistId: 't1',
    avatarUrl: 'https://picsum.photos/seed/joao/200/200',
    password: '123'
  },
  {
    id: 't1',
    name: 'Dr. Andre Santos',
    email: 'andre@clinica.com',
    role: 'therapist',
    avatarUrl: 'https://picsum.photos/seed/andre/200/200',
    password: '123'
  }
];

// Admin Whitelist: Only these emails can register
export const WHITELISTED_INVITES: { email: string; role: UserRole; therapistId?: string }[] = [
  { email: 'sofia@exemplo.com', role: 'patient', therapistId: 't1' },
  { email: 'joao@exemplo.com', role: 'patient', therapistId: 't1' },
  { email: 'andre@clinica.com', role: 'therapist' },
  { email: 'novo@paciente.com', role: 'patient', therapistId: 't1' }, // For testing registration
  { email: 'novo@terapeuta.com', role: 'therapist' } // For testing registration
];

export const MOCK_REFLECTIONS: DailyReflection[] = [
  {
    id: 'r1',
    therapistId: 't1',
    date: new Date().toLocaleDateString('pt-BR'), // Sets for "today" in local format for demo
    content: "A cura não significa que o dano nunca existiu. Significa que o dano não controla mais a sua vida.",
    audioUrl: "mock-audio.mp3",
    duration: "2:15"
  }
];

const generatePastLogs = (userId: string): MoodLog[] => {
  const logs: MoodLog[] = [];
  const moods: MoodType[] = ['Radiante', 'Bem', 'Neutro', 'Triste', 'Devastado'];
  const notes = [
    "Hoje o dia foi produtivo, me senti leve.",
    "Um pouco cansada, mas esperançosa.",
    "Tive uma discussão difícil no trabalho.",
    "A meditação matinal ajudou muito.",
    "Me sentindo um pouco sozinha hoje."
  ];

  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Randomize slightly
    const moodIndex = Math.floor(Math.random() * moods.length);
    
    logs.push({
      id: `log-${userId}-${i}`,
      userId,
      timestamp: date.toISOString(),
      mood: moods[moodIndex],
      note: notes[moodIndex],
      reflectionCompleted: Math.random() > 0.3
    });
  }
  return logs;
};

export const MOCK_LOGS: MoodLog[] = [
  ...generatePastLogs('u1'),
  ...generatePastLogs('u2')
];

export const getMoodScore = (mood: MoodType): number => {
  switch (mood) {
    case 'Radiante': return 5;
    case 'Bem': return 4;
    case 'Neutro': return 3;
    case 'Triste': return 2;
    case 'Devastado': return 1;
    default: return 3;
  }
};

export const MOOD_EMOJIS: Record<MoodType, string> = {
  'Radiante': '🤩',
  'Bem': '🙂',
  'Neutro': '😐',
  'Triste': '😔',
  'Devastado': '😫'
};

export const MOOD_COLORS: Record<MoodType, string> = {
  'Radiante': 'bg-amber-300',
  'Bem': 'bg-emerald-300',
  'Neutro': 'bg-slate-300',
  'Triste': 'bg-blue-300',
  'Devastado': 'bg-indigo-300'
};