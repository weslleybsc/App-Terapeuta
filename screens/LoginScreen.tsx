import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, register, authError, clearError } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isRegistering && !name) return;

    setIsLoading(true);
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    clearError();
    setName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-rose-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">
        <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">Serenity</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">
          {isRegistering ? 'Crie sua conta para começar' : 'Bem-vindo de volta'}
        </p>

        {authError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-sm animate-fade-in">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-700"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-700"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input 
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-700"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{isRegistering ? 'Criar Conta' : 'Entrar'}</span>
                {!isRegistering && <ArrowRight size={18} />}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem acesso?'}
          </p>
          <button 
            onClick={toggleMode}
            className="text-teal-600 font-semibold text-sm hover:underline mt-1"
          >
            {isRegistering ? 'Fazer Login' : 'Criar conta (Requer convite)'}
          </button>
        </div>

        {/* Helper for Demo */}
        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-xs text-slate-400 border border-slate-100">
          <p className="font-semibold mb-1">Dados de Teste (Senha: 123):</p>
          <ul className="space-y-1">
            <li>Terapeuta: andre@clinica.com</li>
            <li>Paciente: sofia@exemplo.com</li>
            <li>Novo Cadastro: novo@paciente.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};