import { Agency, CostCenter, Medicine, MerchantUser, Quote, QuoteStatus, UserRole } from "./types";

export const APP_NAME = "Farma Link";

export const INITIAL_MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Dipirona 500mg', unit: 'cx' },
  { id: 'm2', name: 'Amoxicilina 875mg', unit: 'cx' },
  { id: 'm3', name: 'Paracetamol 750mg', unit: 'cx' },
  { id: 'm4', name: 'Ibuprofeno 600mg', unit: 'cx' },
  { id: 'm5', name: 'Soro Fisiológico 0.9%', unit: 'un' },
];

export const INITIAL_COST_CENTERS: CostCenter[] = [
  { id: 'cc1', name: 'Secretaria de Saúde', budget: 500000, spent: 125000 },
  { id: 'cc2', name: 'Hospital Municipal', budget: 1200000, spent: 850000 },
  { id: 'cc3', name: 'UBS Centro', budget: 200000, spent: 45000 },
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'q101',
    title: 'Reposição Antibióticos - HM',
    costCenterId: 'cc2',
    createdAt: '2023-10-25',
    deadline: '2023-10-30',
    status: QuoteStatus.OPEN,
    items: [
      { medicineId: 'm2', medicineName: 'Amoxicilina 875mg', quantity: 500 },
      { medicineId: 'm5', medicineName: 'Soro Fisiológico 0.9%', quantity: 200 }
    ],
    proposals: []
  },
  {
    id: 'q102',
    title: 'Insumos Básicos - UBS',
    costCenterId: 'cc3',
    createdAt: '2023-10-20',
    deadline: '2023-10-24',
    status: QuoteStatus.CLOSED, // Ready for decision
    items: [
      { medicineId: 'm1', medicineName: 'Dipirona 500mg', quantity: 100 },
      { medicineId: 'm3', medicineName: 'Paracetamol 750mg', quantity: 100 }
    ],
    proposals: [
      {
        id: 'p1',
        merchantName: 'FarmaDistri Ltda',
        merchantId: 'm1',
        priceTotal: 1500,
        deliveryDays: 3,
        items: [{ medicineId: 'm1', priceUnit: 5 }, { medicineId: 'm3', priceUnit: 10 }]
      },
      {
        id: 'p2',
        merchantName: 'MediExpress',
        merchantId: 'm2',
        priceTotal: 1400,
        deliveryDays: 5,
        items: [{ medicineId: 'm1', priceUnit: 4.50 }, { medicineId: 'm3', priceUnit: 9.50 }]
      }
    ]
  }
];

export const INITIAL_AGENCIES: Agency[] = [
  { id: 'a1', name: 'Prefeitura de São João', city: 'São João', state: 'SP', totalBudget: 5000000, spent: 1250000, status: 'active' },
  { id: 'a2', name: 'Prefeitura de Nova Esperança', city: 'Nova Esperança', state: 'PR', totalBudget: 2500000, spent: 750000, status: 'active' },
];

export const INITIAL_MERCHANTS: MerchantUser[] = [
  { 
    id: 'm1', 
    companyName: 'FarmaDistri Ltda', 
    cnpj: '12.345.678/0001-90', 
    email: 'contato@farmadistri.com', 
    status: 'active', 
    joinedAt: '2023-01-15', 
    discountRate: 1.99,
    paymentTermsDays: 30, // Padrão 30 dias
    fixedFee: 2.50,
    balanceAvailable: 0,
    balanceReceivable: 0
  },
  { 
    id: 'm2', 
    companyName: 'MediExpress', 
    cnpj: '98.765.432/0001-10', 
    email: 'vendas@mediexpress.com.br', 
    status: 'pending', 
    joinedAt: '2023-10-20', 
    discountRate: 2.50,
    paymentTermsDays: 15, // Padrão 15 dias
    fixedFee: 0,
    balanceAvailable: 0,
    balanceReceivable: 0
  },
];

export const ROLES_CONFIG = {
  [UserRole.ADMIN]: { label: 'Super Admin', color: 'bg-gray-800' },
  [UserRole.MANAGER]: { label: 'Gestor (Prefeitura)', color: 'bg-brand-dark' },
  [UserRole.INTERNAL]: { label: 'Requisitante (Interno)', color: 'bg-brand-primary' },
  [UserRole.MERCHANT]: { label: 'Lojista (Farmácia)', color: 'bg-orange-600' },
};