import React from 'react';
import { MoodLog, MoodChartData } from '../types';
import { getMoodScore, MOOD_COLORS, MOOD_EMOJIS } from '../services/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  logs: MoodLog[];
}

export const PatientStats: React.FC<Props> = ({ logs }) => {
  // Process logs for chart
  const data: MoodChartData[] = logs
    .slice(0, 7) // Last 7 entries
    .reverse() // Oldest to newest
    .map(log => {
      const date = new Date(log.timestamp);
      return {
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        score: getMoodScore(log.mood),
        mood: log.mood
      };
    });

  if (logs.length === 0) {
    return <div className="text-center text-slate-400 py-8">Ainda não há registros suficientes.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Humor Semanal</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
            <YAxis hide domain={[0, 6]} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => [`Nível ${value}`, 'Humor']}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#0d9488" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Recent Log List */}
      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Últimos Registros</h4>
        {logs.slice(0, 3).map(log => (
          <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${MOOD_COLORS[log.mood]} bg-opacity-30`}>
              {MOOD_EMOJIS[log.mood]}
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-1">
                 <span className="font-semibold text-slate-700 text-sm">{log.mood}</span>
                 <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleDateString('pt-BR')}</span>
               </div>
               <p className="text-sm text-slate-600 line-clamp-2">{log.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};