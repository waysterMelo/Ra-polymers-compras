import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Requisition } from '../types';

interface ActivityCalendarProps {
  requisitions: Requisition[];
  onDayClick?: (date: string, items: Requisition[]) => void;
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ requisitions, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Mapear dias com movimentação e agrupar itens
  const activityMap = requisitions.reduce((acc: Record<string, Requisition[]>, req) => {
    const date = req.requestDate; // YYYY-MM-DD
    if (!acc[date]) acc[date] = [];
    acc[date].push(req);
    return acc;
  }, {});

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const getDayKey = (day: number) => {
    const d = day.toString().padStart(2, '0');
    const m = (month + 1).toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-slate-50 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Calendário</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{monthNames[month]} {year}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-blue-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-300 uppercase py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {padding.map(p => <div key={`p-${p}`} />)}
        {days.map(day => {
          const key = getDayKey(day);
          const dayItems = activityMap[key] || [];
          const hasActivity = dayItems.length > 0;
          
          return (
            <div 
              key={day} 
              onClick={() => hasActivity && onDayClick?.(key, dayItems)}
              className={`relative flex items-center justify-center aspect-square rounded-xl text-sm font-bold transition-all group
                ${isToday(day) ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}
                ${hasActivity ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
              `}
            >
              {day}
              {hasActivity && !isToday(day) && (
                <div className="absolute bottom-1.5 flex gap-0.5">
                   <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></div>
                </div>
              )}
              {hasActivity && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                  {dayItems.length} {dayItems.length === 1 ? 'movimentação' : 'movimentações'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Atividade</span>
        </div>
        <span className="text-[10px] font-bold text-slate-300 font-mono">RA_PROC_V2</span>
      </div>
    </div>
  );
};