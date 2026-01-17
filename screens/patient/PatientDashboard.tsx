import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useApp } from '../../context/AppContext';
import { PatientStats } from '../../components/PatientStats';
import { MoodType, MoodLog } from '../../types';
import { MOOD_EMOJIS, MOOD_COLORS } from '../../services/mockData';
import { Play, Pause, BookHeart, BarChart2, PenLine, Edit3, CheckCircle2 } from 'lucide-react';

interface CheckInViewProps {
  onComplete: () => void;
  existingLog?: MoodLog;
}

const CheckInView: React.FC<CheckInViewProps> = ({ onComplete, existingLog }) => {
  const { addLog } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');

  // Pre-fill data if editing today's log
  useEffect(() => {
    if (existingLog) {
      setSelectedMood(existingLog.mood);
      setNote(existingLog.note);
    }
  }, [existingLog]);

  const moods: MoodType[] = ['Radiante', 'Bem', 'Neutro', 'Triste', 'Devastado'];

  const handleSubmit = () => {
    if (selectedMood) {
      addLog(selectedMood, note);
      onComplete();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-bold text-slate-800">
          {existingLog ? 'Editar Check-in' : 'Como você está?'}
        </h2>
        {existingLog && (
          <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
            <CheckCircle2 size={12} />
            Registrado
          </span>
        )}
      </div>
      
      <p className="text-slate-500 mb-8">
        {existingLog 
          ? 'Você já registrou seu humor hoje. Deseja atualizar algo?' 
          : 'Escolha o emoji que melhor representa seu momento.'}
      </p>

      <div className="grid grid-cols-5 gap-2 mb-8">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
              selectedMood === mood 
                ? 'bg-teal-100 scale-110 shadow-md ring-2 ring-teal-400' 
                : 'hover:bg-slate-100 grayscale hover:grayscale-0'
            }`}
          >
            <span className="text-3xl">{MOOD_EMOJIS[mood]}</span>
            <span className="text-[10px] font-semibold text-slate-600">{mood}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Diário das Emoções (Opcional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escreva livremente sobre o que está sentindo..."
          className="w-full h-32 p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-400 resize-none text-slate-700 placeholder-slate-400 shadow-inner"
        />
      </div>

      <button
        disabled={!selectedMood}
        onClick={handleSubmit}
        className="w-full py-4 bg-teal-600 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg shadow-teal-200 transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2"
      >
        {existingLog ? <Edit3 size={18} /> : <PenLine size={18} />}
        {existingLog ? 'Atualizar Check-in de Hoje' : 'Registrar Check-in'}
      </button>
    </div>
  );
};

const ReflectionView: React.FC = () => {
  const { currentUser, getDailyReflection } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!currentUser?.therapistId) return null;

  const reflection = getDailyReflection(currentUser.therapistId);

  if (!reflection) {
    return (
       <div className="animate-fade-in text-center py-10">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <BookHeart size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Aguardando Reflexão</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Seu terapeuta ainda não enviou a reflexão de hoje. Volte mais tarde.</p>
       </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white mb-6 shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-10 translate-y-10"></div>
        
        <h3 className="text-lg font-medium opacity-90 mb-6 flex items-center gap-2">
            <BookHeart size={20} />
            Reflexão do Dia
        </h3>
        
        {reflection.audioUrl && (
            <div className="flex flex-col items-center justify-center mb-6">
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-lg hover:scale-105 transition-transform"
            >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1"/>}
            </button>
            <span className="mt-3 text-sm font-medium opacity-80">
                {isPlaying ? "Ouvindo..." : "Ouvir Áudio de Acolhimento"}
            </span>
            </div>
        )}

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-inner">
           <p className="text-center font-serif italic text-lg leading-relaxed">
             "{reflection.content}"
           </p>
        </div>
      </div>
    </div>
  );
};

export const PatientDashboard: React.FC = () => {
  const { currentUser, getLogsForUser } = useApp();
  const [activeTab, setActiveTab] = useState<'checkin' | 'history' | 'reflection'>('checkin');

  if (!currentUser) return null;

  const logs = getLogsForUser(currentUser.id);

  // Check if there is a log for today
  const today = new Date();
  const todayLog = logs.find(log => {
    const logDate = new Date(log.timestamp);
    return logDate.getDate() === today.getDate() &&
           logDate.getMonth() === today.getMonth() &&
           logDate.getFullYear() === today.getFullYear();
  });

  return (
    <Layout title="Meu Espaço">
      {/* Tab Navigation */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('checkin')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'checkin' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <PenLine size={16} />
          <span>{todayLog ? 'Editar Hoje' : 'Check-in'}</span>
        </button>
        <button 
          onClick={() => setActiveTab('reflection')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'reflection' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookHeart size={16} />
          <span>Reflexão</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart2 size={16} />
          <span>Histórico</span>
        </button>
      </div>

      {activeTab === 'checkin' && (
        <CheckInView 
          onComplete={() => setActiveTab('history')} 
          existingLog={todayLog} 
        />
      )}
      {activeTab === 'reflection' && <ReflectionView />}
      {activeTab === 'history' && (
        <div className="animate-fade-in">
          <PatientStats logs={logs} />
        </div>
      )}
    </Layout>
  );
};