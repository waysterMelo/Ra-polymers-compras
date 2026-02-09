import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Requisition } from '../types';
import { StatusBadge } from './StatusBadge';

interface DayDetailsModalProps {
  data: { date: string, items: Requisition[] } | null;
  onClose: () => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const formatDateLabel = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white overflow-hidden relative">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Atividade do Dia</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-tight mt-1">{formatDateLabel(data.date)}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-full hover:bg-white text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {data.items.map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{item.id} • {item.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <StatusBadge status={item.status} />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 italic">por {item.requester}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 pt-0 flex flex-col gap-3">
          <div className="bg-blue-600 rounded-2xl p-4 text-white flex justify-between items-center shadow-lg shadow-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                {data.items.length}
              </div>
              <span className="text-sm font-bold">Total de pedidos no dia</span>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );
};