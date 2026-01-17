import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const { currentUser, logout } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      {/* Mobile container simulation */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative flex flex-col">
        {/* Header */}
        <header className="bg-teal-600 text-white p-4 pt-6 pb-6 rounded-b-3xl shadow-md z-10 sticky top-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{title || 'Serenity'}</h1>
              {currentUser && (
                <p className="text-teal-100 text-sm">Olá, {currentUser.name.split(' ')[0]}</p>
              )}
            </div>
            {currentUser && (
              <div className="flex gap-2">
                 <div className="w-10 h-10 rounded-full bg-teal-800 overflow-hidden border-2 border-teal-400">
                    <img src={currentUser.avatarUrl} alt="avatar" className="w-full h-full object-cover"/>
                 </div>
                 <button 
                  onClick={logout}
                  className="p-2 bg-teal-700 rounded-full text-white hover:bg-teal-800 transition-colors"
                  aria-label="Sair"
                 >
                   <LogOut size={18} />
                 </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto pb-24">
          {children}
        </main>

        {/* Bottom decorative element if needed, or simple footer */}
      </div>
    </div>
  );
};