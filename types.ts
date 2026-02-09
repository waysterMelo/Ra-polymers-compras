
export type Status = 'Solicitado' | 'Cotando' | 'Aprovado' | 'Comprado' | 'Entregue' | 'Rejeitado';
export type Priority = 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
export type Department = 'Produção' | 'Ferramentaria' | 'Manutenção' | 'Escritório' | 'Logística';

export interface SupplierQuote {
  id: string;
  supplierName: string;
  price: number;
  isSelected: boolean;
}

export interface Installment {
  date: string;
  value: number;
  label: string;
}

export interface Requisition {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number | null;
  finalCost: number | null;
  paymentTerms?: string; // Ex: "28/35/42" ou "Entrada + 30dd"
  requestDate: string;
  deliveryDate: string | null;
  status: Status;
  department: Department;
  priority: Priority;
  requester: string;
  notes?: string;
  quotes: SupplierQuote[];
}

export interface StatsData {
  totalRequests: number;
  totalSpent: number;
  pendingCount: number;
  completedCount: number;
}
