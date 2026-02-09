import React from 'react';
import { Requisition } from '../types';
import { StatusBadge } from './StatusBadge';
import { Eye } from 'lucide-react';

interface HistoryTableProps {
  requisitions: Requisition[];
  onItemClick?: (item: Requisition) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ requisitions, onItemClick }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-50 overflow-hidden flex flex-col min-h-[600px]">
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Item / Descrição</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Qtd</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Solicitante</th>
              <th className="px-8 py-6 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requisitions.map((req) => (
              <tr 
                key={req.id} 
                onClick={() => onItemClick && onItemClick(req)}
                className="group hover:bg-blue-50/40 transition-all duration-200 cursor-pointer"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{req.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{req.id} • {req.department}</span>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-center">
                  <div className="text-sm font-extrabold text-slate-700 bg-slate-100 inline-block px-4 py-1.5 rounded-xl">
                    {req.quantity} <span className="text-slate-400 text-[10px] ml-0.5 uppercase">{req.unit}</span>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                      {req.requester.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-600">{req.requester}</span>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                   <button className="p-2 rounded-xl text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-100/50 transition-colors">
                      <Eye className="w-5 h-5" />
                   </button>
                </td>
              </tr>
            ))}
            {requisitions.length === 0 && (
              <tr><td colSpan={5} className="text-center py-24 text-slate-400 font-medium">Nenhum resultado encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};