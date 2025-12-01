
import React, { useState, useEffect } from 'react';
import { Quote, UserRole, QuoteStatus, Medicine, CostCenter, QuoteItem, Proposal } from '../types';
import { Plus, Search, Calendar, CheckCircle, Clock, X, DollarSign, FileCheck, ArrowRight, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Printer, Copy, Truck, PackageCheck, AlertTriangle, Hash, Package, Filter, ChevronRight, Activity, MessageSquare } from 'lucide-react';

interface QuotesProps {
  role: UserRole;
  quotes: Quote[];
  medicines: Medicine[];
  costCenters: CostCenter[];
  onCreateQuote: (quote: Quote) => void;
  onSubmitProposal: (quoteId: string, proposal: Proposal) => void;
  onSelectWinner: (quoteId: string, proposalId: string) => void;
  onMerchantDelivery: (quoteId: string) => void;
  onManagerConfirmDelivery: (quoteId: string) => void;
  initialQuoteId?: string | null;
}

const Quotes: React.FC<QuotesProps> = ({ 
  role, 
  quotes, 
  medicines, 
  costCenters, 
  onCreateQuote, 
  onSubmitProposal, 
  onSelectWinner, 
  onMerchantDelivery,
  onManagerConfirmDelivery,
  initialQuoteId 
}) => {
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [rejectedProposals, setRejectedProposals] = useState<string[]>([]);
  const [expandedProposals, setExpandedProposals] = useState<string[]>([]);

  // Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [proposalToApprove, setProposalToApprove] = useState<string | null>(null);

  // Mock ID do lojista logado (Em produção viria do contexto de auth)
  const CURRENT_MERCHANT_ID = 'm1'; 

  // Effect to handle deep linking from dashboard
  useEffect(() => {
    if (initialQuoteId) {
        const found = quotes.find(q => q.id === initialQuoteId);
        if (found) {
            setSelectedQuote(found);
            setView('details');
        }
    }
  }, [initialQuoteId, quotes]);

  // Update local selectedQuote when props change (specifically for status updates like COMPLETED)
  useEffect(() => {
    if (selectedQuote) {
        const updated = quotes.find(q => q.id === selectedQuote.id);
        if (updated) setSelectedQuote(updated);
    }
  }, [quotes]);

  // Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [selectedCC, setSelectedCC] = useState('');
  const [cartItems, setCartItems] = useState<QuoteItem[]>([]);

  // New Item Input State (Manual Entry)
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemObservation, setItemObservation] = useState('');
  
  // Proposal Form States
  const [proposalPrices, setProposalPrices] = useState<{[key: string]: number}>({});

  const handleCreate = () => {
    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      title: newTitle,
      costCenterId: selectedCC,
      createdAt: new Date().toISOString().split('T')[0],
      deadline: newDeadline,
      status: QuoteStatus.OPEN,
      items: cartItems,
      proposals: []
    };
    onCreateQuote(newQuote);
    setView('list');
    setNewTitle('');
    setNewDeadline('');
    setSelectedCC('');
    setCartItems([]);
  };

  const handleAddItem = () => {
    if (!itemName.trim()) return;

    const newItem: QuoteItem = {
        medicineId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        medicineName: itemName,
        quantity: itemQuantity,
        observation: itemObservation.trim()
    };
    
    setCartItems([...cartItems, newItem]);
    
    // Reset inputs
    setItemName('');
    setItemQuantity(1);
    setItemObservation('');
  };

  const handleUpdateQuantity = (idx: number, qty: number) => {
    const newItems = [...cartItems];
    newItems[idx].quantity = qty;
    setCartItems(newItems);
  };

  const handleSubmitProposal = () => {
    if (!selectedQuote) return;
    const items = selectedQuote.items.map(item => ({
      medicineId: item.medicineId,
      priceUnit: proposalPrices[item.medicineId] || 0
    }));
    
    const total = items.reduce((acc, curr, idx) => acc + (curr.priceUnit * selectedQuote.items[idx].quantity), 0);

    const proposal: Proposal = {
      id: `p-${Date.now()}`,
      merchantName: 'Minha Farmácia Ltda (Eu)',
      merchantId: CURRENT_MERCHANT_ID,
      deliveryDays: 3,
      priceTotal: total,
      items,
      status: 'pending'
    };
    onSubmitProposal(selectedQuote.id, proposal);
    setView('list');
  };

  const handleRejectProposal = (proposalId: string) => {
      setRejectedProposals([...rejectedProposals, proposalId]);
  };

  const toggleProposalExpansion = (proposalId: string) => {
    setExpandedProposals(prev => 
      prev.includes(proposalId) 
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId]
    );
  };

  // Approval Flow Handlers
  const initiateApproval = (proposalId: string) => {
    setProposalToApprove(proposalId);
    setIsConfirmModalOpen(true);
  };

  const confirmApproval = () => {
    if (selectedQuote && proposalToApprove) {
        onSelectWinner(selectedQuote.id, proposalToApprove);
        setIsConfirmModalOpen(false);
        setProposalToApprove(null);
    }
  };

  const cancelApproval = () => {
    setIsConfirmModalOpen(false);
    setProposalToApprove(null);
  };

  // Helper for status styling - UPDATED FOR MORE VIBRANT LOOK
  const getStatusStyle = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.OPEN: 
        return { 
          border: 'border-l-blue-500', 
          badge: 'bg-blue-600 text-white shadow-blue-200', 
          icon: <Activity size={14} className="mr-1" />,
          label: 'Aberta para Lances' 
        };
      case QuoteStatus.CLOSED: 
        return { 
          border: 'border-l-amber-500', 
          badge: 'bg-amber-500 text-white shadow-amber-200', 
          icon: <Clock size={14} className="mr-1" />,
          label: 'Em Análise' 
        };
      case QuoteStatus.COMPLETED: 
        return { 
          border: 'border-l-emerald-500', 
          badge: 'bg-emerald-600 text-white shadow-emerald-200', 
          icon: <CheckCircle size={14} className="mr-1" />,
          label: 'Finalizada' 
        };
      default: 
        return { 
          border: 'border-l-gray-300', 
          badge: 'bg-gray-500 text-white', 
          icon: null,
          label: 'Desconhecido' 
        };
    }
  };

  // Render Functions
  const renderList = () => (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {role === UserRole.MERCHANT ? 'Oportunidades de Venda' : 'Gestão de Cotações'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Acompanhe as solicitações e propostas em tempo real.</p>
        </div>
        {(role === UserRole.INTERNAL || role === UserRole.MANAGER) && (
          <button 
            onClick={() => setView('create')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={20} className="mr-2" />
            Nova Cotação
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-900" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por número, produto ou departamento..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-transparent rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm font-bold text-gray-900 placeholder-gray-400" 
              />
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-bold hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2 transition-colors">
            <Filter size={18} />
            <span className="hidden md:inline">Filtros Avançados</span>
          </button>
      </div>

      {/* Modern Card List - UPDATED DESIGN */}
      <div className="grid grid-cols-1 gap-5">
          {quotes.map(q => {
              const myProposal = role === UserRole.MERCHANT ? q.proposals.find(p => p.merchantId === CURRENT_MERCHANT_ID) : null;
              const amIWinner = myProposal && q.winnerProposalId === myProposal.id;
              const statusStyle = getStatusStyle(q.status);

              return (
                <div 
                  key={q.id} 
                  className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative pl-5`}
                >
                    {/* Thicker Status Border Indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${statusStyle.border}`}></div>

                    <div className="p-6 flex flex-col md:flex-row gap-6">
                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                                {/* Vibrant Status Badge */}
                                <span className={`w-fit px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide shadow-md flex items-center ${statusStyle.badge}`}>
                                    {statusStyle.icon}
                                    {statusStyle.label}
                                </span>
                                {role === UserRole.MERCHANT && amIWinner && (
                                    <span className="w-fit px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center">
                                       <CheckCircle size={14} className="mr-1" /> Você Venceu
                                    </span>
                                )}
                            </div>
                            
                            {/* Larger, Bolder Title */}
                            <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 group-hover:text-emerald-700 transition-colors leading-tight mb-2">
                                {q.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                  <Hash size={14} className="text-gray-400" />
                                  <span className="font-mono text-xs text-gray-500 font-bold">ID: {q.id}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={16} className={q.status === QuoteStatus.OPEN ? "text-emerald-600" : "text-gray-400"} />
                                  <span className={`font-medium ${q.status === QuoteStatus.OPEN ? "text-gray-800" : ""}`}>
                                    Encerra em: {new Date(q.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Package size={16} className="text-gray-400" />
                                  <span className="font-medium">{q.items.length} itens solicitados</span>
                                </div>
                            </div>
                        </div>

                        {/* Action / Right Side */}
                        <div className="flex flex-col items-end justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 min-w-[220px]">
                            <div className="w-full text-right mb-3">
                                {role === UserRole.MERCHANT && !amIWinner && myProposal && (
                                    <span className="text-gray-500 text-xs font-bold italic">Proposta enviada</span>
                                )}
                            </div>

                            <button 
                                onClick={() => { setSelectedQuote(q); setView('details'); }}
                                className={`w-full flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-sm
                                  ${role === UserRole.MANAGER && q.status === QuoteStatus.CLOSED 
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 border border-transparent' 
                                    : q.status === QuoteStatus.COMPLETED
                                        ? 'bg-brand-darkBlue text-white hover:bg-blue-900 hover:shadow-md border border-transparent'
                                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-darkBlue hover:bg-brand-light/30'
                                  }`}
                            >
                                {role === UserRole.MANAGER && q.status === QuoteStatus.CLOSED ? (
                                  <>Avaliar Propostas <ChevronRight size={20} className="ml-2"/></>
                                ) : q.status === QuoteStatus.COMPLETED ? (
                                   <>Ver Pedido Finalizado <FileCheck size={18} className="ml-2" /></>
                                ) : (
                                  <>Ver Detalhes <ArrowRight size={18} className="ml-2 opacity-60 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all"/></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
              );
          })}
          
          {quotes.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Nenhuma cotação encontrada.</p>
            </div>
          )}
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
        <div className="bg-emerald-900 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Nova Requisição de Compra</h2>
              <p className="text-emerald-200/80 text-sm mt-1">Preencha os dados e descreva os itens para cotação.</p>
            </div>
            <button onClick={() => setView('list')} className="text-emerald-200 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
              <X size={20} />
            </button>
        </div>

        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">Título da Cotação</label>
                    <input 
                      value={newTitle} 
                      onChange={e => setNewTitle(e.target.value)} 
                      type="text" 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 font-medium" 
                      placeholder="Ex: Reposição Mensal Antibióticos" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">Prazo para Propostas</label>
                    <input 
                      value={newDeadline} 
                      onChange={e => setNewDeadline(e.target.value)} 
                      type="date" 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Centro de Custo</label>
                <div className="relative">
                  <select 
                    value={selectedCC} 
                    onChange={e => setSelectedCC(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900"
                  >
                      <option value="">Selecione a unidade pagadora...</option>
                      {costCenters.map(cc => <option key={cc.id} value={cc.id}>{cc.name} (Disponível: R$ {(cc.budget - cc.spent).toLocaleString('pt-BR')})</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-3 text-gray-500 pointer-events-none" size={16} />
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2 text-emerald-600" size={20}/> 
                  Itens da Requisição
                </h3>
                
                {/* Manual Item Entry */}
                <div className="flex flex-col gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <div className="md:col-span-3">
                           <label className="block text-xs font-bold text-gray-600 mb-1">Nome do Produto / Medicamento</label>
                           <input 
                              type="text"
                              value={itemName}
                              onChange={(e) => setItemName(e.target.value)}
                              placeholder="Digite o nome do item..."
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-600 mb-1">Quantidade</label>
                           <input 
                              type="number"
                              value={itemQuantity}
                              min={1}
                              onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                           />
                       </div>
                   </div>
                   
                   <div>
                       <label className="block text-xs font-bold text-gray-600 mb-1">Observação / Especificação (Opcional)</label>
                       <div className="flex gap-2">
                           <input 
                              type="text"
                              value={itemObservation}
                              onChange={(e) => setItemObservation(e.target.value)}
                              placeholder="Ex: Marca específica, dosagem exata, validade mínima..."
                              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                           />
                           <button 
                                onClick={handleAddItem}
                                disabled={!itemName.trim()}
                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center whitespace-nowrap"
                            >
                                <Plus size={18} className="mr-2" />
                                Adicionar Item
                            </button>
                       </div>
                   </div>
                </div>
                
                {cartItems.length > 0 ? (
                    <div className="space-y-3">
                        {cartItems.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-bold text-gray-900 text-lg">{item.medicineName}</span>
                                        {item.observation && (
                                            <div className="flex items-start text-sm text-gray-500 mt-1">
                                                <MessageSquare size={14} className="mr-1.5 mt-0.5 text-blue-400 shrink-0" />
                                                <span className="italic">{item.observation}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-100 px-3 py-1 rounded text-sm font-bold text-gray-700 border border-gray-200">Qtd: {item.quantity}</span>
                                        <button onClick={() => {
                                            const newItems = [...cartItems];
                                            newItems.splice(idx, 1);
                                            setCartItems(newItems);
                                        }} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors">
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    A lista de itens está vazia. Adicione produtos acima.
                  </div>
                )}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button onClick={() => setView('list')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button 
                    onClick={handleCreate} 
                    disabled={!newTitle || !newDeadline || !selectedCC || cartItems.length === 0}
                    className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lançar Cotação
                </button>
            </div>
        </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedQuote) return null;

    const isManager = role === UserRole.MANAGER;
    const isMerchant = role === UserRole.MERCHANT;
    const winnerProposal = selectedQuote.proposals.find(p => p.id === selectedQuote.winnerProposalId);
    
    // Check if current merchant is the winner
    const amIWinner = isMerchant && winnerProposal?.merchantId === CURRENT_MERCHANT_ID;
    
    // Status visual control
    const isPendingDelivery = selectedQuote.deliveryStatus === 'pending';
    const isDelivered = selectedQuote.deliveryStatus === 'delivered';
    const isConfirmed = selectedQuote.deliveryStatus === 'confirmed';

    return (
        <div className="animate-fade-in space-y-6 pb-10">
            <button onClick={() => setView('list')} className="text-gray-500 hover:text-emerald-700 flex items-center mb-4 transition-colors font-medium">
                 <ArrowRight className="rotate-180 mr-2" size={18} /> Voltar para lista
            </button>

            {/* STATUS BAR - FASE DE ENTREGA */}
            {selectedQuote.status === QuoteStatus.COMPLETED && (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                    
                    <div className="flex justify-between items-end mb-6">
                       <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Rastreamento de Compra</h3>
                       <div className="text-xs font-mono text-gray-400">REQ: {selectedQuote.requisitionCode}</div>
                    </div>

                    <div className="relative flex items-center justify-between px-4 md:px-12">
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10"></div>
                         <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-700 -z-10"
                              style={{ width: isConfirmed ? '100%' : isDelivered ? '66%' : '33%' }}></div>

                         {/* Step 1: Approved */}
                         <div className="flex flex-col items-center gap-3 bg-white px-2 z-10">
                             <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                 <FileCheck size={18} />
                             </div>
                             <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Aprovado</span>
                         </div>

                         {/* Step 2: Delivered */}
                         <div className="flex flex-col items-center gap-3 bg-white px-2 z-10">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${isDelivered || isConfirmed ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                 <Truck size={18} />
                             </div>
                             <span className={`text-xs font-bold uppercase tracking-wide ${isDelivered || isConfirmed ? 'text-emerald-800' : 'text-gray-400'}`}>Entregue</span>
                         </div>

                         {/* Step 3: Confirmed */}
                         <div className="flex flex-col items-center gap-3 bg-white px-2 z-10">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                                ${isConfirmed ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                 <PackageCheck size={18} />
                             </div>
                             <span className={`text-xs font-bold uppercase tracking-wide ${isConfirmed ? 'text-emerald-800' : 'text-gray-400'}`}>Finalizado</span>
                         </div>
                    </div>

                    {/* ACTIONS FOR DELIVERY FLOW */}
                    <div className="mt-8 flex justify-center md:justify-end">
                        {/* AÇÃO DO LOJISTA: MARCAR COMO ENTREGUE */}
                        {amIWinner && isPendingDelivery && (
                             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between w-full gap-4">
                                <div className="text-sm text-blue-800 flex items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                                    <div><span className="font-bold">Ação Necessária:</span> O gestor aguarda a entrega dos produtos.</div>
                                </div>
                                <button 
                                    onClick={() => onMerchantDelivery(selectedQuote.id)}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center shadow-lg hover:shadow-blue-500/30 transition-all"
                                >
                                    <Truck size={18} className="mr-2" />
                                    Informar Entrega Realizada
                                </button>
                             </div>
                        )}

                        {/* MENSAGEM PARA O LOJISTA: AGUARDANDO CONFIRMAÇÃO */}
                        {amIWinner && isDelivered && (
                             <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl w-full text-center text-amber-800 text-sm font-medium">
                                 <Clock size={16} className="inline mr-2" />
                                 Entrega informada. Aguardando conferência e aceite do Gestor para liberação do saldo.
                             </div>
                        )}

                        {/* AÇÃO DO GESTOR: CONFIRMAR RECEBIMENTO */}
                        {isManager && isDelivered && (
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between w-full gap-4">
                                <div className="text-sm text-orange-900 flex items-center">
                                     <AlertTriangle className="text-orange-500 mr-2" size={20} />
                                    <div><span className="font-bold">Confirmação Pendente:</span> O fornecedor informou a entrega.</div>
                                </div>
                                <button 
                                    onClick={() => onManagerConfirmDelivery(selectedQuote.id)}
                                    className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 flex items-center shadow-lg hover:shadow-emerald-500/30 transition-all"
                                >
                                    <CheckCircle size={18} className="mr-2" />
                                    Confirmar Recebimento e Finalizar
                                </button>
                            </div>
                        )}
                         
                         {/* MENSAGEM FINAL */}
                        {isConfirmed && (
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl w-full text-center text-emerald-800 text-sm font-bold flex items-center justify-center">
                                <CheckCircle size={20} className="mr-2" />
                                Processo de compra finalizado com sucesso.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* REQUISITION DIGITAL VOUCHER */}
            {selectedQuote.status === QuoteStatus.COMPLETED && selectedQuote.requisitionCode && (
                <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-xl p-8 relative overflow-hidden shadow-2xl text-white">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FileCheck size={180} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center mb-2">
                                <CheckCircle className="mr-3 text-emerald-400" size={28} />
                                Requisição de Compra Aprovada
                            </h2>
                            <p className="text-emerald-200 text-sm max-w-lg leading-relaxed">
                                Este documento digital serve como autorização oficial para faturamento e entrega. 
                                A validade deste token é garantida pelo sistema Medicota.
                            </p>
                            
                            <div className="mt-8 flex gap-8">
                                <div>
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">Fornecedor Autorizado</span>
                                    <p className="font-bold text-xl">{winnerProposal?.merchantName}</p>
                                </div>
                                <div>
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">Valor Total</span>
                                    <p className="font-bold text-xl">R$ {winnerProposal?.priceTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center min-w-[280px]">
                            <div className="text-xs text-emerald-300 uppercase font-bold tracking-widest mb-2">Código da Requisição</div>
                            <div className="text-4xl font-mono font-bold tracking-widest text-white drop-shadow-md">
                                {selectedQuote.requisitionCode}
                            </div>
                            <div className="mt-4 flex justify-center gap-2">
                                <button className="flex items-center px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors">
                                    <Copy size={14} className="mr-1" /> Copiar
                                </button>
                                <button className="flex items-center px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors">
                                    <Printer size={14} className="mr-1" /> Imprimir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                             <h1 className="text-2xl font-bold text-gray-900">{selectedQuote.title}</h1>
                             <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono text-gray-500">#{selectedQuote.id}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center"><Clock size={16} className="mr-1 text-gray-400"/> Prazo: {new Date(selectedQuote.deadline).toLocaleDateString()}</span>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span className="flex items-center"><Package size={16} className="mr-1 text-gray-400"/> {selectedQuote.items.length} itens</span>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm
                        ${selectedQuote.status === QuoteStatus.OPEN ? 'bg-blue-600 text-white' : 
                          selectedQuote.status === QuoteStatus.COMPLETED ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                        {selectedQuote.status === QuoteStatus.OPEN ? 'Aberta para Lances' : selectedQuote.status === QuoteStatus.COMPLETED ? 'Finalizada' : 'Em Análise'}
                    </div>
                </div>

                <div className="p-8">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide flex items-center">
                        <Package className="mr-2 text-emerald-600" size={18}/>
                        Itens Solicitados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedQuote.items.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col justify-between shadow-sm hover:border-emerald-300 transition-colors gap-2">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-gray-900">{item.medicineName}</span>
                                    <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-bold text-gray-700 border border-gray-200 whitespace-nowrap">{item.quantity} un</span>
                                </div>
                                {item.observation && (
                                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 italic flex items-start">
                                        <MessageSquare size={12} className="mr-1.5 mt-0.5 text-gray-400 shrink-0" />
                                        {item.observation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Merchant View: Submit Proposal */}
                {isMerchant && selectedQuote.status === QuoteStatus.OPEN && (
                    <div className="p-8 border-t border-gray-100 bg-blue-50/30">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <DollarSign size={20} className="mr-2 text-blue-600"/>
                            Enviar Proposta Comercial
                        </h3>
                        <div className="space-y-4 bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
                            {selectedQuote.items.map((item) => (
                                <div key={item.medicineId} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 gap-3">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{item.medicineName} ({item.quantity} un)</div>
                                        {item.observation && <div className="text-xs text-gray-500 italic mt-1">Obs: {item.observation}</div>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500 font-medium">Preço Unitário R$:</span>
                                        <input 
                                            type="number" 
                                            className="w-32 bg-white border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-right text-gray-900"
                                            onChange={(e) => setProposalPrices({...proposalPrices, [item.medicineId]: parseFloat(e.target.value)})}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4">
                                <button onClick={handleSubmitProposal} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30">
                                    Finalizar e Enviar Proposta
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manager View: Compare Proposals */}
                {isManager && selectedQuote.proposals.length > 0 && (
                    <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <FileCheck className="mr-2 text-emerald-600" size={20}/>
                                Análise de Propostas Recebidas
                            </h3>
                            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                                {selectedQuote.proposals.length} propostas
                            </span>
                        </div>
                        
                        <div className="grid gap-5">
                            {selectedQuote.proposals.map(p => {
                                const isRejected = rejectedProposals.includes(p.id);
                                const isWinner = selectedQuote.winnerProposalId === p.id;
                                const isExpanded = expandedProposals.includes(p.id);
                                
                                return (
                                    <div key={p.id} className={`bg-white rounded-xl border transition-all duration-200 
                                        ${isWinner ? 'border-emerald-500 shadow-lg shadow-emerald-100 ring-1 ring-emerald-500 z-10' : 
                                          isRejected ? 'border-gray-200 opacity-60 bg-gray-50 grayscale' : 'border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300'}`}>
                                        
                                        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-bold text-lg text-gray-900">{p.merchantName}</h4>
                                                    {isWinner && <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center border border-emerald-200"><CheckCircle size={12} className="mr-1.5"/> VENCEDOR</span>}
                                                    {isRejected && <span className="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-red-200">RECUSADO</span>}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center"><Truck size={14} className="mr-1.5 text-gray-400"/> Entrega: <span className="font-medium text-gray-700 ml-1">{p.deliveryDays} dias</span></span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>{p.items.length} itens cotados</span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-gray-900">R$ {p.priceTotal.toFixed(2)}</div>
                                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">Valor Total</div>
                                            </div>

                                            {selectedQuote.status !== QuoteStatus.COMPLETED && !isRejected && (
                                                <div className="flex items-center gap-3 border-l border-gray-100 pl-6 ml-2">
                                                    <button 
                                                        onClick={() => handleRejectProposal(p.id)}
                                                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                                                        title="Recusar Proposta"
                                                    >
                                                        <ThumbsDown size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => initiateApproval(p.id)}
                                                        className="flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md font-bold text-sm"
                                                    >
                                                        <CheckCircle size={18} className="mr-2" />
                                                        Aprovar
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {!isRejected && (
                                            <div>
                                                <div 
                                                    onClick={() => toggleProposalExpansion(p.id)}
                                                    className="bg-gray-50/50 px-5 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                                >
                                                    <span className="font-bold text-gray-600 flex items-center">
                                                        {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes dos Itens'}
                                                    </span>
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </div>

                                                {isExpanded && (
                                                    <div className="p-5 bg-gray-50 border-t border-gray-100 animate-fade-in">
                                                        <table className="w-full text-sm">
                                                            <thead className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-200">
                                                                <tr>
                                                                    <th className="text-left py-2 pb-3">Medicamento</th>
                                                                    <th className="text-right py-2 pb-3">Qtd</th>
                                                                    <th className="text-right py-2 pb-3">Preço Unit.</th>
                                                                    <th className="text-right py-2 pb-3">Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200">
                                                                {p.items.map((propItem) => {
                                                                    const originalItem = selectedQuote.items.find(i => i.medicineId === propItem.medicineId);
                                                                    const quantity = originalItem?.quantity || 0;
                                                                    const subtotal = propItem.priceUnit * quantity;

                                                                    return (
                                                                        <tr key={propItem.medicineId}>
                                                                            <td className="py-3 text-gray-900 font-medium">
                                                                                {originalItem?.medicineName}
                                                                                {originalItem?.observation && <div className="text-xs text-gray-400 italic">Obs: {originalItem.observation}</div>}
                                                                            </td>
                                                                            <td className="py-3 text-right text-gray-600">{quantity}</td>
                                                                            <td className="py-3 text-right text-gray-600">R$ {propItem.priceUnit.toFixed(2)}</td>
                                                                            <td className="py-3 text-right font-bold text-gray-900">R$ {subtotal.toFixed(2)}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  }

  return (
    <div>
        {view === 'list' && renderList()}
        {view === 'create' && renderCreate()}
        {view === 'details' && renderDetails()}
        
        {/* APPROVAL CONFIRMATION MODAL */}
        {isConfirmModalOpen && (
            <div className="fixed inset-0 bg-emerald-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all scale-100">
                    <div className="bg-amber-50 p-6 flex items-start gap-4 border-b border-amber-100">
                        <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600 shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Confirmar Aprovação</h3>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                Você está prestes a aprovar esta compra. Esta ação é irreversível e gerará obrigações financeiras.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Gera Requisição Digital com força de contrato.
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Empenha o valor no Centro de Custo.
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Notifica o fornecedor para entrega imediata.
                        </div>
                    </div>
                    <div className="p-5 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
                        <button 
                            onClick={cancelApproval}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={confirmApproval}
                            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30 transition-all"
                        >
                            Confirmar Aprovação
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Quotes;
