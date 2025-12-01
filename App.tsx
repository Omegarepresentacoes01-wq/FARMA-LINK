
import React, { useState } from 'react';
import { UserRole, Quote, QuoteStatus, Proposal, CostCenter, Agency, MerchantUser, Notification } from './types';
import { INITIAL_COST_CENTERS, INITIAL_MEDICINES, INITIAL_QUOTES, INITIAL_AGENCIES, INITIAL_MERCHANTS, APP_NAME } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Quotes from './components/Quotes';
import Financials from './components/Financials';
import AdminUsers from './components/AdminUsers';
import Reports from './components/Reports';
import CostCenters from './components/CostCenters';
import { Logo } from './components/Logo';

// Login Component (Internal to App for simplicity)
const LoginScreen: React.FC<{ onLogin: (role: UserRole) => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor - Subtle Teal/Blue accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-primary opacity-[0.08] rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-secondary opacity-[0.1] rounded-full blur-[100px]"></div>
      </div>

      {/* Main Card - White for High Contrast */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full z-10 relative border border-gray-100">
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
             <Logo className="w-24 h-24 drop-shadow-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{APP_NAME}</h1>
          <p className="text-gray-500 mt-2 font-medium text-sm">Sistema Inteligente de Compras Públicas</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">Acesse sua conta</p>
          
          <button onClick={() => onLogin(UserRole.MANAGER)} className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-primary hover:bg-brand-light hover:shadow-md transition-all duration-200 flex items-center group">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center font-bold mr-4 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-colors">G</div>
            <div className="text-left">
              <p className="font-bold text-gray-800 group-hover:text-brand-dark transition-colors">Gestor da Prefeitura</p>
              <p className="text-xs text-gray-500 group-hover:text-brand-secondary transition-colors">Aprova compras e analisa cotas</p>
            </div>
          </button>

          <button onClick={() => onLogin(UserRole.MERCHANT)} className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-200 flex items-center group">
             <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center font-bold mr-4 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">L</div>
            <div className="text-left">
              <p className="font-bold text-gray-800 group-hover:text-blue-900 transition-colors">Lojista / Farmácia</p>
              <p className="text-xs text-gray-500 group-hover:text-blue-700 transition-colors">Envia propostas e antecipa valores</p>
            </div>
          </button>

           <button onClick={() => onLogin(UserRole.ADMIN)} className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-800 hover:bg-gray-100 hover:shadow-md transition-all duration-200 flex items-center group">
             <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center font-bold mr-4 group-hover:bg-gray-800 group-hover:text-white group-hover:border-gray-800 transition-colors">A</div>
            <div className="text-left">
              <p className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors">Super Admin</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">Configura taxas e vê métricas</p>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400">© 2025 {APP_NAME} SaaS. Ambiente Seguro.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  
  // App State
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(INITIAL_COST_CENTERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Shared State for Users (Lifted from AdminUsers)
  const [agencies, setAgencies] = useState<Agency[]>(INITIAL_AGENCIES);
  const [merchants, setMerchants] = useState<MerchantUser[]>(INITIAL_MERCHANTS);
  
  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
  };

  // Actions
  const handleCreateQuote = (newQuote: Quote) => {
    setQuotes([newQuote, ...quotes]);
  };

  const handleAddCostCenter = (newCostCenter: CostCenter) => {
    setCostCenters([...costCenters, newCostCenter]);
  };

  // User Management Actions
  const handleAddAgency = (agency: Agency) => setAgencies([...agencies, agency]);
  const handleUpdateAgency = (updatedAgency: Agency) => {
    setAgencies(agencies.map(a => a.id === updatedAgency.id ? updatedAgency : a));
  };

  const handleAddMerchant = (merchant: MerchantUser) => setMerchants([...merchants, merchant]);
  const handleUpdateMerchant = (updatedMerchant: MerchantUser) => {
    setMerchants(merchants.map(m => m.id === updatedMerchant.id ? updatedMerchant : m));
  };

  const handleSubmitProposal = (quoteId: string, proposal: Proposal) => {
    setQuotes(quotes.map(q => {
      if (q.id === quoteId) {
        return { 
          ...q, 
          status: QuoteStatus.CLOSED, 
          proposals: [...q.proposals, proposal] 
        };
      }
      return q;
    }));

    // Trigger Notification for Manager
    const quote = quotes.find(q => q.id === quoteId);
    if (quote) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            message: `Nova proposta de ${proposal.merchantName} recebida para a cotação "${quote.title}" no valor de R$ ${proposal.priceTotal.toFixed(2)}.`,
            createdAt: new Date().toISOString(),
            read: false,
            type: 'info'
        };
        setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const generateRequisitionCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = 'REQ-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 1. Aprovação (Gestor): Gera empenho (debita do centro de custo) e gera código
  const handleSelectWinner = (quoteId: string, proposalId: string) => {
    const requisitionCode = generateRequisitionCode();
    
    // Find Quote and Proposal to get value
    const quote = quotes.find(q => q.id === quoteId);
    const proposal = quote?.proposals.find(p => p.id === proposalId);

    if (quote && proposal) {
        // Debitar do Centro de Custo (Empenho/Bloqueio)
        setCostCenters(prev => prev.map(cc => 
            cc.id === quote.costCenterId 
            ? { ...cc, spent: cc.spent + proposal.priceTotal }
            : cc
        ));

        // Notify Winner
        const winNotification: Notification = {
             id: `notif-win-${Date.now()}`,
             message: `Sua proposta para "${quote.title}" foi APROVADA! Prepare a entrega.`,
             createdAt: new Date().toISOString(),
             read: false,
             type: 'success'
        };
        setNotifications(prev => [winNotification, ...prev]);
    }
    
    setQuotes(prev => prev.map(q => {
        if (q.id === quoteId) {
            return { 
              ...q, 
              winnerProposalId: proposalId, 
              status: QuoteStatus.COMPLETED,
              requisitionCode: requisitionCode,
              deliveryStatus: 'pending' // Começa pendente de entrega
            };
        }
        return q;
    }));
  };

  // 2. Entrega (Lojista): Marca como entregue
  const handleMerchantDelivery = (quoteId: string) => {
    setQuotes(prev => prev.map(q => 
        q.id === quoteId ? { ...q, deliveryStatus: 'delivered' } : q
    ));
    
    // Notify Manager about delivery
    const quote = quotes.find(q => q.id === quoteId);
    if(quote) {
        const delNotification: Notification = {
             id: `notif-del-${Date.now()}`,
             message: `Entrega informada para "${quote.title}". Confirme o recebimento para liberar o pagamento.`,
             createdAt: new Date().toISOString(),
             read: false,
             type: 'alert'
        };
        setNotifications(prev => [delNotification, ...prev]);
    }
  };

  // 3. Confirmação (Gestor): Finaliza e agenda o repasse
  const handleManagerConfirmDelivery = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    const proposal = quote?.proposals.find(p => p.id === quote.winnerProposalId);

    // Calcular data de pagamento com base no prazo do lojista
    let paymentDays = 30; // Default fallback
    if (proposal && proposal.merchantId) {
        const merchant = merchants.find(m => m.id === proposal.merchantId);
        if (merchant && merchant.paymentTermsDays) {
            paymentDays = merchant.paymentTermsDays;
        }
        
        // Creditar Saldo "A Receber" do Lojista (Valor Bruto para visualização)
        setMerchants(prev => prev.map(m => 
            m.id === proposal.merchantId
            ? { ...m, balanceReceivable: m.balanceReceivable + proposal.priceTotal }
            : m
        ));
    }

    // Definir data de vencimento do repasse (Agora + Dias do Contrato)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + paymentDays);

    setQuotes(prev => prev.map(q => 
        q.id === quoteId ? { 
            ...q, 
            deliveryStatus: 'confirmed',
            paymentStatus: 'pending_payout', // Pronto para o Admin pagar
            paymentDueDate: dueDate.toISOString()
        } : q
    ));
  };

  // 4. Repasse (Super Admin): Efetua o pagamento líquido
  const handleAdminPayout = (quoteId: string) => {
    setQuotes(prev => prev.map(q => 
        q.id === quoteId ? { ...q, paymentStatus: 'paid_out' } : q
    ));

    // Opcional: Aqui poderíamos mover o saldo de "A Receber" para "Disponível" no Merchant
    const quote = quotes.find(q => q.id === quoteId);
    const proposal = quote?.proposals.find(p => p.id === quote.winnerProposalId);
    
    if (quote && proposal && proposal.merchantId) {
        const merchant = merchants.find(m => m.id === proposal.merchantId);
        if (merchant) {
            // Calcular líquido
            const rate = merchant.discountRate || 0;
            const fixed = merchant.fixedFee || 0;
            const gross = proposal.priceTotal;
            const fee = (gross * (rate / 100)) + fixed;
            const net = gross - fee;

            setMerchants(prev => prev.map(m => 
                m.id === merchant.id
                ? { 
                    ...m, 
                    balanceReceivable: m.balanceReceivable - gross, // Sai do previsto
                    balanceAvailable: m.balanceAvailable + net // Entra no disponível (líquido)
                  }
                : m
            ));
        }
    }
  };

  const handleViewQuote = (quoteId: string) => {
      setActiveTab('quotes');
      setActiveQuoteId(quoteId);
      setTimeout(() => setActiveQuoteId(null), 500); 
  };

  if (!currentUserRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
                  role={currentUserRole} 
                  quotes={quotes} 
                  costCenters={costCenters}
                  onViewQuote={handleViewQuote} 
               />;
      
      case 'quotes':
      case 'marketplace': // Merchant view of quotes
        return <Quotes 
                  role={currentUserRole} 
                  quotes={quotes} 
                  medicines={INITIAL_MEDICINES}
                  costCenters={costCenters}
                  onCreateQuote={handleCreateQuote}
                  onSubmitProposal={handleSubmitProposal}
                  onSelectWinner={handleSelectWinner}
                  onMerchantDelivery={handleMerchantDelivery}
                  onManagerConfirmDelivery={handleManagerConfirmDelivery}
                  initialQuoteId={activeQuoteId}
                />;
      
      case 'cost-centers':
        return <CostCenters 
                  costCenters={costCenters} 
                  onAddCostCenter={handleAddCostCenter} 
               />;
      
      case 'fees':
      case 'finance':
        return <Financials 
                  role={currentUserRole} 
                  merchants={merchants}
                  quotes={quotes} // Passando quotes para o admin ver repasses
                  onUpdateMerchant={handleUpdateMerchant}
                  onProcessPayout={handleAdminPayout}
                  currentUserId="m1" // Simula o usuário logado para visualização
               />;
      
      case 'users':
        return <AdminUsers 
                  agencies={agencies}
                  merchants={merchants}
                  onAddAgency={handleAddAgency}
                  onUpdateAgency={handleUpdateAgency}
                  onAddMerchant={handleAddMerchant}
                  onUpdateMerchant={handleUpdateMerchant}
               />;

      case 'reports':
        return <Reports role={currentUserRole} />;

      default:
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-lg">Módulo em desenvolvimento</p>
                <p className="text-sm">Volte para o Painel</p>
            </div>
        );
    }
  };

  return (
    <Layout 
      currentRole={currentUserRole} 
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      notifications={notifications}
      onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
