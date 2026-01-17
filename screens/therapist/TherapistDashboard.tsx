import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { useApp } from '../../context/AppContext';
import { PatientStats } from '../../components/PatientStats';
import { User, MoodLog } from '../../types';
import { ChevronRight, ArrowLeft, Users, MessageSquareQuote, Mic, Save, Edit3 } from 'lucide-react';
import { MOOD_EMOJIS, MOOD_COLORS } from '../../services/mockData';

// --- Sub-component: Patient List & Detail ---
const PatientManager: React.FC = () => {
  const { currentUser, getPatientsForTherapist, getLogsForUser } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);

  if (!currentUser) return null;
  const patients = getPatientsForTherapist(currentUser.id);

  if (selectedPatient) {
    const patientLogs = getLogsForUser(selectedPatient.id);
    const lastLog = patientLogs[0];

    return (
      <div className="animate-fade-in">
        <button 
          onClick={() => setSelectedPatient(null)}
          className="flex items-center text-teal-600 font-semibold mb-6 hover:underline"
        >
          <ArrowLeft size={20} className="mr-1" />
          Voltar para Lista
        </button>

        <div className="flex items-center gap-4 mb-8">
          <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-16 h-16 rounded-full border-2 border-teal-100" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h2>
            <p className="text-slate-500 text-sm">{selectedPatient.email}</p>
          </div>
        </div>

        {lastLog && (
           <div className={`p-4 rounded-xl mb-6 bg-white shadow-sm border-l-4 ${lastLog.mood === 'Devastado' || lastLog.mood === 'Triste' ? 'border-red-400' : 'border-teal-400'}`}>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status Atual</p>
              <div className="flex items-center gap-2">
                 <span className="text-2xl">{MOOD_EMOJIS[lastLog.mood]}</span>
                 <span className="font-semibold text-slate-700">{lastLog.mood}</span>
              </div>
           </div>
        )}

        <PatientStats logs={patientLogs} />
        
        <h3 className="mt-8 mb-4 text-lg font-bold text-slate-700">Diário Completo</h3>
        <div className="space-y-4">
            {patientLogs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${MOOD_COLORS[log.mood]} bg-opacity-40 font-semibold`}>{log.mood}</span>
                     </div>
                     <p className="text-slate-700 italic">"{log.note}"</p>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="space-y-4">
        {patients.map(patient => {
            const logs = getLogsForUser(patient.id);
            const lastLog = logs[0];
            return (
                <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
                >
                    <div className="relative">
                        <img src={patient.avatarUrl} alt={patient.name} className="w-14 h-14 rounded-full object-cover" />
                        {lastLog && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm text-sm">
                                {MOOD_EMOJIS[lastLog.mood]}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{patient.name}</h3>
                        <p className="text-sm text-slate-500">
                            {lastLog 
                                ? `Último registro: ${new Date(lastLog.timestamp).toLocaleDateString('pt-BR')}` 
                                : 'Nenhum registro recente'}
                        </p>
                    </div>
                    
                    <ChevronRight className="text-slate-300" />
                </button>
            );
        })}

        {patients.length === 0 && (
            <div className="text-center py-10 text-slate-400">
                Nenhum paciente vinculado.
            </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-component: Daily Reflection Manager ---
const ReflectionManager: React.FC = () => {
  const { currentUser, saveReflection, getDailyReflection } = useApp();
  const [content, setContent] = useState('');
  const [hasAudio, setHasAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing reflection for today
  useEffect(() => {
    if (currentUser) {
      const existing = getDailyReflection(currentUser.id);
      if (existing) {
        setContent(existing.content);
        setHasAudio(!!existing.audioUrl);
        setIsSaved(true);
      }
    }
  }, [currentUser, getDailyReflection]);

  const handleSave = () => {
    if (content.trim()) {
      saveReflection(content, hasAudio);
      setIsSaved(true);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  if (isSaved) {
    return (
      <div className="animate-fade-in bg-white p-6 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Save size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Reflexão Enviada!</h2>
        <p className="text-slate-500 mb-6">Todos os seus pacientes receberam a mensagem de hoje.</p>
        
        <div className="bg-slate-50 p-4 rounded-xl text-left mb-6">
          <p className="text-slate-700 italic">"{content}"</p>
          {hasAudio && (
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 font-semibold">
              <Mic size={16} />
              <span>Áudio incluído (2:30)</span>
            </div>
          )}
        </div>

        <button 
          onClick={handleEdit}
          className="flex items-center justify-center gap-2 text-teal-600 font-semibold hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors mx-auto"
        >
          <Edit3 size={18} />
          Editar Mensagem
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Reflexão do Dia</h2>
      <p className="text-slate-500 mb-6 text-sm">Escreva uma mensagem acolhedora. Ela aparecerá para todos os seus pacientes hoje.</p>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Mensagem de Texto</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ex: Respire fundo e lembre-se que cada passo conta..."
          className="w-full h-40 p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-teal-400 text-slate-700 resize-none"
        />
      </div>

      <div 
        onClick={() => setHasAudio(!hasAudio)}
        className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all mb-6 ${hasAudio ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:border-teal-200'}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasAudio ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Mic size={20} />
        </div>
        <div className="flex-1">
          <p className={`font-bold ${hasAudio ? 'text-teal-800' : 'text-slate-600'}`}>
            {hasAudio ? 'Áudio Gravado' : 'Incluir Áudio de Acolhimento'}
          </p>
          <p className="text-xs text-slate-500">
            {hasAudio ? 'Clique para remover' : 'Simular gravação de áudio'}
          </p>
        </div>
        {hasAudio && <div className="text-teal-600 font-bold text-sm">2:30</div>}
      </div>

      <button
        onClick={handleSave}
        disabled={!content.trim()}
        className="w-full py-4 bg-teal-600 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg shadow-teal-200 transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2"
      >
        <Save size={20} />
        Enviar para Pacientes
      </button>
    </div>
  );
};

// --- Main Dashboard ---
export const TherapistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patients' | 'reflection'>('patients');

  return (
    <Layout title={activeTab === 'patients' ? 'Gestão de Pacientes' : 'Comunicar'}>
      {/* Top Tabs */}
      <div className="flex p-1 bg-slate-200 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('patients')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'patients' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={18} />
          <span>Pacientes</span>
        </button>
        <button 
          onClick={() => setActiveTab('reflection')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'reflection' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <MessageSquareQuote size={18} />
          <span>Reflexão Diária</span>
        </button>
      </div>

      {activeTab === 'patients' ? <PatientManager /> : <ReflectionManager />}
    </Layout>
  );
};