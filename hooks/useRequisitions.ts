
import { useState } from 'react';
import { Requisition, Department, Status, Priority, SupplierQuote } from '../types';

const MOCK_DATA: Requisition[] = [
  {
    id: 'REQ-9082',
    name: 'Chave Combinada 36mm 1b-36 Gedore',
    quantity: 1,
    unit: 'un',
    estimatedCost: null,
    finalCost: 150.00,
    paymentTerms: '28dd',
    requestDate: '2025-12-12',
    deliveryDate: '2025-12-12',
    status: 'Entregue',
    department: 'Produção',
    priority: 'Baixa',
    requester: 'Ricardo',
    quotes: []
  },
  {
    id: 'REQ-3321',
    name: 'BARRA ROSCADA POLIDA M16',
    quantity: 4,
    unit: 'un',
    estimatedCost: null,
    finalCost: 205.20,
    paymentTerms: '30/60dd',
    requestDate: '2025-12-23',
    deliveryDate: '2025-12-23',
    status: 'Entregue',
    department: 'Ferramentaria',
    priority: 'Urgente',
    requester: 'Rafael',
    quotes: []
  }
];

export const useRequisitions = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>(MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'Todos'>('Todos');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'Todos'>('Todos');
  const [deptFilter, setDeptFilter] = useState<Department | 'Todos'>('Todos');

  const generateId = () => `REQ-${Math.floor(Math.random() * 9000) + 1000}`;

  const addRequisitionsFromText = (text: string, department: Department) => {
    const lines = text.split('\n').filter(line => line.trim());
    const today = new Date().toISOString().split('T')[0];
    
    const unitPattern = /^(x|un|unid|pç|pc|cx|caixa|kg|kilo|g|gr|mg|lt|l|ml|m|mt|mts|cm|mm|rolo|pct|pacote|saco|saca|lata|par|kit|jogo|sc|br|fardo|galão|gl|vidro|bisnaga|tb|tubo|fr|frasco|bd|balde)$/i;
    // Removed price pattern logic as we don't use target anymore

    const newItems: Requisition[] = lines.map(line => {
      let name = line.trim();
      let quantity = 1;
      let unit = 'un';

      const qtyMatch = name.match(/^(\d+)(.*)$/);
      
      if (qtyMatch) {
          quantity = parseInt(qtyMatch[1], 10);
          const rest = qtyMatch[2].trim();
          const firstWordMatch = rest.match(/^([a-zA-ZçÇãõÃÕáéíóúÁÉÍÓÚ]+|[xX*])\.?(\s+(.*))?$/);
          
          if (firstWordMatch) {
              const potentialUnit = firstWordMatch[1];
              const potentialName = firstWordMatch[3] || "";
              
              if (unitPattern.test(potentialUnit)) {
                  unit = ['x', 'X', '*'].includes(potentialUnit) ? 'un' : potentialUnit.toLowerCase();
                  name = potentialName.trim();
              } else {
                  name = rest;
              }
          } else {
              name = rest;
          }
      }
      
      name = name.replace(/^(de\s+|-\s+|\.\s+)/i, '').trim();
      if (!name) name = "Item sem descrição";

      return {
        id: generateId(),
        name,
        quantity,
        unit,
        department,
        priority: 'Normal',
        requester: 'Ricardo (WhatsApp)',
        status: 'Solicitado',
        requestDate: today,
        estimatedCost: null,
        finalCost: null,
        deliveryDate: null,
        quotes: []
      };
    });

    setRequisitions(prev => [...newItems, ...prev]);
  };

  const updateStatus = (id: string, newStatus: Status, finalCost?: number, paymentTerms?: string) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
          finalCost: finalCost !== undefined ? finalCost : r.finalCost,
          paymentTerms: paymentTerms !== undefined ? paymentTerms : r.paymentTerms,
        };
      }
      return r;
    }));
  };

  const updateQuotes = (id: string, quotes: SupplierQuote[]) => {
    setRequisitions(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, quotes };
      }
      return r;
    }));
  };

  const deleteRequisition = (id: string) => {
    setRequisitions(prev => prev.filter(r => r.id !== id));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
    setPriorityFilter('Todos');
    setDeptFilter('Todos');
  };

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'Todos' || req.priority === priorityFilter;
    const matchesDept = deptFilter === 'Todos' || req.department === deptFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDept;
  });

  const isFilterActive = searchTerm !== '' || statusFilter !== 'Todos' || priorityFilter !== 'Todos' || deptFilter !== 'Todos';

  return {
    requisitions,
    filteredRequisitions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    deptFilter,
    setDeptFilter,
    clearFilters,
    isFilterActive,
    addRequisitionsFromText,
    updateStatus,
    updateQuotes,
    deleteRequisition
  };
};
