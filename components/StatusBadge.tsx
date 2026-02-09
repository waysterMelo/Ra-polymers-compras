import React from 'react';
import { Status, Priority } from '../types';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Soft Pastel Pills - Friendly and clear
  const styles = {
    'Solicitado': 'bg-slate-100 text-slate-600 border-slate-200',
    'Cotando': 'bg-blue-50 text-blue-600 border-blue-100',
    'Aprovado': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Comprado': 'bg-violet-50 text-violet-600 border-violet-100',
    'Entregue': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Rejeitado': 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const dots = {
     'Solicitado': 'bg-slate-400',
    'Cotando': 'bg-blue-400',
    'Aprovado': 'bg-indigo-400',
    'Comprado': 'bg-violet-400',
    'Entregue': 'bg-emerald-400',
    'Rejeitado': 'bg-rose-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`}></span>
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
   const styles = {
    'Baixa': 'text-slate-500 bg-slate-50 border-slate-100',
    'Normal': 'text-blue-600 bg-blue-50 border-blue-100',
    'Alta': 'text-amber-600 bg-amber-50 border-amber-100',
    'Urgente': 'text-rose-600 bg-rose-50 border-rose-100',
  };
  
  return (
     <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${styles[priority]}`}>
      {priority}
    </span>
  )
}