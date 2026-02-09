import React, { useState } from 'react';
import { X, ClipboardList, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { Department } from '../types';

interface SmartCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string, department: Department) => void;
}

export const SmartCreateModal: React.FC<SmartCreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [pastedText, setPastedText] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department>('Manutenção');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pastedText, selectedDept);
    setPastedText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl border border-white relative overflow-hidden">
        
        <div className="p-10 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-sm border border-blue-100">
              <ClipboardList className="w-8 h-8" />
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Captura Inteligente</h2>
          <p className="text-slate-500 mt-2 font-medium">Cole as informações do WhatsApp, E-mail ou Planilha. Identificamos quantidades e itens automaticamente por linha.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-6">
          <div className="relative">
            <textarea 
              required 
              autoFocus
              rows={8}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-6 px-8 focus:bg-white focus:border-blue-500 transition-all shadow-inner text-lg font-medium placeholder-slate-300 resize-none leading-relaxed" 
              value={pastedText} 
              onChange={e => setPastedText(e.target.value)} 
              placeholder={`Exemplo:\n5x Rolamento 6204\n10 pacotes de Luva G\nCimento Votoran 50kg`} 
            />
            <div className="absolute right-6 bottom-6 flex gap-2 pointer-events-none opacity-50">
              <MessageSquare className="w-5 h-5" />
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Setor Responsável</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(['Manutenção', 'Produção', 'Ferramentaria', 'Logística', 'Escritório'] as Department[]).map(dept => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${selectedDept === dept ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'}`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!pastedText.trim()}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-extrabold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Criar Requisições e Iniciar Cotação
          </button>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Tecnologia RA_PROC_V2 • Automação de Carga</p>
        </div>
      </div>
    </div>
  );
};