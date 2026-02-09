import React from 'react';
import { Hexagon, Plus, ShoppingBag, List, LayoutGrid, Search } from 'lucide-react';
import { Requisition } from '../types';

interface SidebarProps {
  currentView: 'table' | 'dashboard' | 'quotes' | 'search';
  onViewChange: (view: 'table' | 'dashboard' | 'quotes' | 'search') => void;
  onNewRequest: () => void;
  requisitions: Requisition[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onNewRequest, requisitions }) => {
  const pendingCount = requisitions.filter(r => r.status === 'Solicitado' || r.status === 'Cotando').length;

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-72 bg-white rounded-[2rem] flex flex-col shadow-soft z-50 overflow-hidden border border-slate-100 hidden lg:flex">
      <div className="h-24 flex items-center px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <Hexagon className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">RA Polymers</h1>
            <p className="text-xs text-slate-500 font-medium">Procurement</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <button 
          onClick={onNewRequest}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 font-bold"
        >
          <Plus className="w-5 h-5" />
          Nova Requisição
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button 
          onClick={() => onViewChange('quotes')}
          className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${currentView === 'quotes' ? 'bg-slate-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <ShoppingBag className={`w-5 h-5 mr-4 ${currentView === 'quotes' ? 'text-blue-600' : 'text-slate-400'}`} />
          Cotações
          {currentView === 'quotes' && <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>}
          {pendingCount > 0 && currentView !== 'quotes' && (
            <span className="ml-auto bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
              {pendingCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => onViewChange('search')}
          className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${currentView === 'search' ? 'bg-slate-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <Search className={`w-5 h-5 mr-4 ${currentView === 'search' ? 'text-blue-600' : 'text-slate-400'}`} />
          Busca Rápida
          {currentView === 'search' && <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>}
        </button>

        <button 
          onClick={() => onViewChange('table')}
          className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${currentView === 'table' ? 'bg-slate-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <List className={`w-5 h-5 mr-4 ${currentView === 'table' ? 'text-blue-600' : 'text-slate-400'}`} />
          Histórico
          {currentView === 'table' && <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>}
        </button>

        <button 
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-200 ${currentView === 'dashboard' ? 'bg-slate-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <LayoutGrid className={`w-5 h-5 mr-4 ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`} />
          Dashboard
          {currentView === 'dashboard' && <div className="ml-auto w-2 h-2 rounded-full bg-blue-600"></div>}
        </button>
      </nav>

      <div className="mt-auto p-6">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            RC
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">Ricardo Costa</p>
            <p className="text-xs text-slate-500 font-medium">Comprador Sênior</p>
          </div>
        </div>
      </div>
    </aside>
  );
};