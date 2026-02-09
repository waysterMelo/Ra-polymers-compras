
import React, { useState } from 'react';
import { Requisition, Status, SupplierQuote } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Play, DollarSign, Ban, CheckCircle2, X, ShoppingBag, Trash2, Trophy, Calculator } from 'lucide-react';

interface QuoteListProps {
  requisitions: Requisition[];
  onUpdateStatus: (id: string, status: Status, finalCost?: number, paymentTerms?: string) => void;
  onUpdateQuotes: (id: string, quotes: SupplierQuote[]) => void;
  onDelete: (id: string) => void;
}

const COMMON_PAYMENT_TERMS = ['À Vista', 'Antecipado', '28dd', '30/60dd', '28/35/42dd'];

export const QuoteList: React.FC<QuoteListProps> = ({ requisitions, onUpdateStatus, onUpdateQuotes, onDelete }) => {
  const [finishingId, setFinishingId] = useState<string | null>(null);
  const [negotiatedPrice, setNegotiatedPrice] = useState<string>('');
  const [selectedTerms, setSelectedTerms] = useState<string>('28dd');
  const [customTerms, setCustomTerms] = useState<string>('');
  const [isCustomTerms, setIsCustomTerms] = useState<boolean>(false);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar permanentemente esta cotação?')) {
      onDelete(id);
    }
  };

  const handleQuoteChange = (reqId: string, quoteIndex: number, field: 'supplierName' | 'price', value: string | number, currentQuotes: SupplierQuote[]) => {
    const newQuotes = [...currentQuotes];
    while (newQuotes.length < 3) {
      newQuotes.push({ id: Math.random().toString(), supplierName: '', price: 0, isSelected: false });
    }
    if (field === 'price') {
      newQuotes[quoteIndex].price = parseFloat(value as string) || 0;
    } else {
      newQuotes[quoteIndex].supplierName = value as string;
    }
    onUpdateQuotes(reqId, newQuotes);
  };

  const handleSelectWinner = (reqId: string, quoteIndex: number, currentQuotes: SupplierQuote[]) => {
    const newQuotes = currentQuotes.map((q, idx) => ({
      ...q,
      isSelected: idx === quoteIndex
    }));
    onUpdateQuotes(reqId, newQuotes);
  };

  const handleFinishPurchase = (req: Requisition) => {
    if (!negotiatedPrice) return;
    const finalVal = parseFloat(negotiatedPrice);
    const finalTerms = isCustomTerms ? customTerms : selectedTerms;
    
    onUpdateStatus(req.id, 'Comprado', finalVal, finalTerms);
    
    setFinishingId(null);
    setNegotiatedPrice('');
    setCustomTerms('');
    setIsCustomTerms(false);
  };

  const items = requisitions.filter(r => r.status === 'Solicitado' || r.status === 'Cotando');

  if (items.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-200" />
        </div>
        <p className="font-extrabold text-slate-600 text-xl">Nenhuma cotação ativa</p>
        <p className="text-sm mt-1">Sua lista está limpa. Use o botão "Nova Requisição" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {items.map((req) => {
        const safeQuotes = [...(req.quotes || [])];
        while (safeQuotes.length < 3) {
          safeQuotes.push({ id: Math.random().toString(), supplierName: '', price: 0, isSelected: false });
        }
        const winningQuote = safeQuotes.find(q => q.isSelected);

        // Preview de Saving: (Preço da Cotação Vencedora - Preço Negociado)
        const initialOffer = winningQuote ? winningQuote.price : 0;
        const currentPrice = parseFloat(negotiatedPrice) || 0;
        
        const unitDiff = Math.round((initialOffer - currentPrice) * 100) / 100;
        const totalSaving = Math.round(unitDiff * req.quantity * 100) / 100;
        
        const isSavingPositive = totalSaving > 0;
        // Se negociou pior que a oferta, é "excedente" (negativo)
        const isNegative = totalSaving < 0;

        return (
          <div key={req.id} className="bg-white rounded-[2rem] p-6 shadow-soft border border-slate-50 flex flex-col hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-500 group">
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={req.status} />
                <PriorityBadge priority={req.priority} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.id}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{req.name}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">{req.department} • <span className="text-slate-400">por {req.requester}</span></p>

            <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="bg-white px-4 py-1.5 rounded-xl shadow-sm border border-slate-100">
                <span className="text-sm font-extrabold text-slate-700">{req.quantity} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">{req.unit}</span></span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex-1">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Status do Pedido</p>
                <p className="text-xs font-bold text-slate-600">{req.status === 'Solicitado' ? 'Aguardando Cotação' : 'Em Negociação'}</p>
              </div>
            </div>

            {req.status === 'Cotando' && finishingId !== req.id && (
              <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mapa de Cotação (Max 3)</p>
                {safeQuotes.map((quote, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-2 rounded-xl transition-all ${quote.isSelected ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'bg-slate-50/50 border border-transparent'}`}>
                    <div className="flex-1 grid grid-cols-10 gap-2">
                      <input 
                        type="text" 
                        placeholder={`Fornecedor ${idx + 1}`}
                        className="col-span-6 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-400"
                        value={quote.supplierName}
                        onChange={(e) => handleQuoteChange(req.id, idx, 'supplierName', e.target.value, safeQuotes)}
                      />
                      <input 
                        type="number" 
                        placeholder="R$ 0,00"
                        className="col-span-4 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-400"
                        value={quote.price || ''}
                        onChange={(e) => handleQuoteChange(req.id, idx, 'price', e.target.value, safeQuotes)}
                      />
                    </div>
                    <button 
                      onClick={() => handleSelectWinner(req.id, idx, safeQuotes)}
                      disabled={!quote.supplierName || !quote.price}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${quote.isSelected ? 'bg-blue-500 text-white shadow-md scale-105' : 'bg-white text-slate-300 hover:text-blue-400 hover:bg-blue-50'}`}
                    >
                      <Trophy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto">
              {finishingId === req.id ? (
                <div className="bg-emerald-50/50 p-5 rounded-3xl animate-in fade-in zoom-in-95 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-emerald-100">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Vencedor: {winningQuote?.supplierName}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Oferta Inicial: {formatCurrency(winningQuote?.price || 0)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Preço Final Negociado (Unitário)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">R$</span>
                        <input 
                          autoFocus
                          type="number" 
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-black text-emerald-700 shadow-inner bg-white"
                          value={negotiatedPrice}
                          onChange={(e) => setNegotiatedPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* LIVE SAVING CALCULATION (Initial vs Final) */}
                    {negotiatedPrice && (
                      <div className={`bg-white p-3 rounded-xl border shadow-sm ${isNegative ? 'border-rose-100' : 'border-emerald-100/50'}`}>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                           <Calculator className="w-3 h-3" /> Resultado da Negociação
                        </div>
                        <div className="flex items-center justify-between text-xs mb-1">
                           <span className="text-slate-500">
                             Oferta ({formatCurrency(initialOffer)}) - Final ({formatCurrency(currentPrice)})
                           </span>
                           <span className={`font-bold ${isSavingPositive ? 'text-emerald-600' : isNegative ? 'text-rose-500' : 'text-slate-400'}`}>
                             {isSavingPositive ? 'Economia' : isNegative ? 'Acréscimo' : 'Neutro'}
                           </span>
                        </div>
                        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-50">
                           <span className="font-bold text-slate-700">Saving Gerado:</span>
                           <span className={`font-black ${isSavingPositive ? 'text-emerald-600' : isNegative ? 'text-rose-500' : 'text-slate-400'}`}>
                              {formatCurrency(Math.abs(totalSaving))}
                           </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Condição de Pagamento</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {COMMON_PAYMENT_TERMS.map(term => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => { setSelectedTerms(term); setIsCustomTerms(false); }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${!isCustomTerms && selectedTerms === term ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'}`}
                          >
                            {term}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setIsCustomTerms(true)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${isCustomTerms ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                        >
                          Outro...
                        </button>
                      </div>

                      {isCustomTerms && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <input 
                            type="text" 
                            placeholder="Ex: 15/30/45/60 ou Entrada + 30dd"
                            className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-indigo-700 bg-white"
                            value={customTerms}
                            onChange={(e) => setCustomTerms(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button 
                      type="button"
                      onClick={() => handleFinishPurchase(req)}
                      disabled={!negotiatedPrice}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 font-black flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Confirmar Compra
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setFinishingId(null); setIsCustomTerms(false); }}
                      className="bg-white text-slate-400 px-4 rounded-2xl hover:text-rose-500 border border-slate-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {req.status === 'Solicitado' && (
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(req.id, 'Cotando'); }}
                      className="w-full flex items-center justify-center gap-2 py-4 border-2 border-blue-50 text-blue-600 font-black rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current" /> Iniciar Cotação
                    </button>
                  )}
                  
                  {req.status === 'Cotando' && (
                    <button 
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (!winningQuote) {
                          alert("Selecione uma cotação vencedora antes de finalizar.");
                          return;
                        }
                        setNegotiatedPrice(winningQuote.price.toString());
                        setFinishingId(req.id); 
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-4 font-black rounded-2xl transition-all active:scale-[0.98] ${winningQuote ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      <DollarSign className="w-5 h-5" /> {winningQuote ? 'Fechar com Pagamento' : 'Selecione Vencedor'}
                    </button>
                  )}

                  <div className="flex gap-3 pt-2 border-t border-slate-50 mt-2">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Tem certeza que deseja suspender esta compra?')) {
                          onUpdateStatus(req.id, 'Rejeitado');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-400 text-[10px] font-black rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspender
                    </button>

                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(req.id); }}
                      className="flex items-center justify-center px-4 py-2 text-slate-300 text-[10px] font-black rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
    