import React, { useState } from 'react';
import { Search, CheckCircle2, RotateCcw, Download, Briefcase } from 'lucide-react';
import { Requisition, Status, Department, Priority, SupplierQuote } from './types';

// Custom Hook
import { useRequisitions } from './hooks/useRequisitions';

// Components
import { Sidebar } from './components/Sidebar';
import { SmartCreateModal } from './components/SmartCreateModal';
import { StatsCards } from './components/StatsCards';
import { QuoteList } from './components/QuoteList';
import { HistoryTable } from './components/HistoryTable';
import { ActivityCalendar } from './components/ActivityCalendar';
import { DayDetailsModal } from './components/DayDetailsModal';
import { QuickSearch } from './components/QuickSearch';
import { ItemDetailsModal } from './components/ItemDetailsModal';

function App() {
  const { 
    requisitions, 
    filteredRequisitions, 
    addRequisitionsFromText, 
    updateStatus,
    updateQuotes,
    deleteRequisition,
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    deptFilter, setDeptFilter,
    isFilterActive, clearFilters
  } = useRequisitions();

  const [view, setView] = useState<'table' | 'dashboard' | 'quotes' | 'search'>('quotes');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDayActivity, setSelectedDayActivity] = useState<{date: string, items: Requisition[]} | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<Requisition | null>(null);

  const displayData = filteredRequisitions;

  const handleSmartSubmit = (text: string, department: Department) => {
    addRequisitionsFromText(text, department);
    setView('quotes');
  };

  const getPageTitle = () => {
    switch(view) {
      case 'table': return 'Histórico de Itens';
      case 'dashboard': return 'Dashboard Gerencial';
      case 'search': return 'Busca Rápida';
      default: return 'Gestão de Cotações';
    }
  };

  const getPageSubtitle = () => {
    switch(view) {
      case 'table': return 'Registro completo de todas as movimentações.';
      case 'dashboard': return 'Indicadores de performance e saving.';
      case 'search': return 'Pesquisa de preços e fornecedores históricos.';
      default: return `Você tem ${requisitions.filter(r => r.status === 'Solicitado' || r.status === 'Cotando').length} itens aguardando ação.`;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex font-sans bg-slate-50/50">
      
      <Sidebar 
        currentView={view} 
        onViewChange={setView} 
        onNewRequest={() => setIsFormOpen(true)}
        requisitions={requisitions}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 mr-4 lg:mr-8 my-6 lg:my-8 flex flex-col transition-all duration-500">
        
        {/* Top Header (Ocultar na Busca Rápida pois ela tem seu próprio header) */}
        {view !== 'search' && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 pl-2">
             <div>
               <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                 {getPageTitle()}
               </h1>
               <p className="text-sm text-slate-500 font-medium mt-1">
                 {getPageSubtitle()}
               </p>
             </div>
          </div>
        )}

        {view === 'dashboard' ? (
          <StatsCards requisitions={requisitions} />
        ) : view === 'search' ? (
          <QuickSearch requisitions={requisitions} />
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Filter Bar (Compartilhada entre Table e Quotes) */}
            <div className="bg-white p-4 rounded-[1.5rem] shadow-soft border border-slate-50 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder={view === 'quotes' ? "Filtrar cotações..." : "Pesquisar histórico..."}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <select 
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value as Department | 'Todos')}
                  className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none cursor-pointer pr-2"
                >
                  <option value="Todos">Setor: Todos</option>
                  <option value="Produção">Produção</option>
                  <option value="Ferramentaria">Ferramentaria</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Escritório">Escritório</option>
                  <option value="Logística">Logística</option>
                </select>
              </div>

              {view === 'table' && (
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Status | 'Todos')}
                    className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="Todos">Status: Todos</option>
                    <option value="Solicitado">Solicitado</option>
                    <option value="Cotando">Cotando</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Comprado">Comprado</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Rejeitado">Rejeitado</option>
                  </select>
                </div>
              )}

              {isFilterActive && (
                <button onClick={clearFilters} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all">
                  <RotateCcw className="w-3.5 h-3.5" /> Limpar Filtros
                </button>
              )}
            </div>

            {view === 'quotes' ? (
              <QuoteList 
                requisitions={displayData} 
                onUpdateStatus={updateStatus} 
                onUpdateQuotes={updateQuotes}
                onDelete={deleteRequisition}
              />
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3">
                  <HistoryTable 
                    requisitions={displayData} 
                    onItemClick={(item) => setSelectedHistoryItem(item)}
                  />
                </div>
                <div className="xl:col-span-1">
                   <ActivityCalendar 
                      requisitions={requisitions} 
                      onDayClick={(date, items) => setSelectedDayActivity({date, items})}
                   />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <DayDetailsModal 
        data={selectedDayActivity} 
        onClose={() => setSelectedDayActivity(null)} 
      />

      <ItemDetailsModal 
        data={selectedHistoryItem}
        onClose={() => setSelectedHistoryItem(null)}
      />

      <SmartCreateModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSmartSubmit} 
      />

    </div>
  );
}

export default App;