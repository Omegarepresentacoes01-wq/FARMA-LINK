
import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER', // Gestor Prefeitura
  INTERNAL = 'INTERNAL', // Usuário Interno/Requisitante
  MERCHANT = 'MERCHANT' // Lojista
}

export enum QuoteStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED'
}

export type DeliveryStatus = 'pending' | 'delivered' | 'confirmed';
export type PaymentStatus = 'pending_payout' | 'paid_out';

export interface Medicine {
  id: string;
  name: string;
  unit: string; // cx, un, cartela
}

export interface CostCenter {
  id: string;
  name: string;
  budget: number;
  spent: number;
}

export interface QuoteItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  observation?: string; // Campo opcional de observação
}

export interface Proposal {
  id: string;
  merchantName: string;
  merchantId?: string; // ID para vincular ao usuário
  priceTotal: number;
  deliveryDays: number;
  items: { medicineId: string; priceUnit: number }[];
  isWinner?: boolean;
  status?: 'pending' | 'rejected'; // Novo campo para controle visual
}

export interface Quote {
  id: string;
  title: string;
  costCenterId: string;
  createdAt: string;
  deadline: string;
  status: QuoteStatus;
  items: QuoteItem[];
  proposals: Proposal[];
  winnerProposalId?: string;
  requisitionCode?: string; // Código da requisição gerado automaticamente
  deliveryStatus?: DeliveryStatus; // Status da entrega física
  paymentStatus?: PaymentStatus; // Status do repasse da plataforma ao lojista
  paymentDueDate?: string; // Data de vencimento do repasse
}

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}

export interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'yellow' | 'red';
}

// Novos tipos para Gestão de Usuários (Admin)
export interface Agency {
  id: string;
  name: string;
  city: string;
  state: string;
  totalBudget: number;
  spent: number;
  status: 'active' | 'inactive';
}

export interface MerchantUser {
  id: string;
  companyName: string;
  cnpj: string;
  email: string;
  status: 'active' | 'pending' | 'blocked';
  joinedAt: string;
  discountRate: number; // Taxa combinada para antecipação
  paymentTermsDays: number; // DIAS PARA PAGAMENTO APÓS ENTREGA (NOVO)
  fixedFee?: number; // Taxa fixa adicional
  balanceAvailable: number; // Saldo já liberado
  balanceReceivable: number; // Saldo futuro (vendas entregues/confirmadas)
}
