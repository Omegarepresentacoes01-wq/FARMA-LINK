
import React, { useState } from 'react';
import { UserRole, MerchantUser, Quote } from '../types';
import { Percent, ArrowRightLeft, Search, Save, UserCog, PiggyBank, Clock, TrendingUp, AlertTriangle, Calendar, CheckCircle, DollarSign, Wallet, CalendarClock } from 'lucide-react';

interface FinancialsProps {
  role: UserRole;
  merchants?: MerchantUser[];
  quotes?: Quote[];
  onUpdateMerchant?: (merchant: MerchantUser) => void;
  onProcessPayout?: (quoteId: string) => void;
  // Mock current user ID for demo purposes
  currentUserId?: string;
}

const Financials: React.FC<FinancialsProps> = ({ 
  role, 
  merchants = [], 
  quotes = [], 
  onUpdateMerchant, 
  onProcessPayout,
  currentUserId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  
  // Editing states for custom rates
  const [customDiscountRate, setCustomDiscountRate] = useState<string>('');
  const [customFixedFee, setCustomFixedFee] = useState<string>('');

  // Lógica do Admin: Filtrar pagamentos pendentes
  const pendingPayouts = quotes.filter(q => 
    q.deliveryStatus === 'confirmed' && 
    q.paymentStatus === 'pending_payout'
  );

  if (role === UserRole.MERCHANT) {
    // Em produção, usaríamos o contexto de usuário real. Aqui buscamos pelo ID mockado (m1)
    // Se não passar currentUserId, assume o m1 por padrão para demo
    const me = merchants.find(m => m.id === (currentUserId || 'm1')) || merchants[0];

    // Filtrar recebimentos futuros deste lojista específico
    const myFuturePayouts = quotes.filter(q => {
        const winner = q.proposals.find(p => p.id === q.winnerProposalId);
        return winner?.merchantId === me.id && q.paymentStatus === 'pending_payout';
    });

    return (
        <div className="max-w-4xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Financeiro e Antecipação</h2>
            
            {/* Info Badge sobre Prazo de Pagamento */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                      <CalendarClock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">Seu Contrato de Recebimento</h4>
                    <p className="text-sm text-blue-700">O seu prazo acordado para recebimento após a entrega confirmada é de <strong className="text-blue-900 text-lg">{me?.paymentTermsDays || 30} dias</strong>.</p>
                  </div>
               </div>
               <span className="text-xs text-blue-500 font-medium">Atualizado pelo Admin</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-brand-darkBlue to-blue-800 text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <PiggyBank size={20} />
                        <span className="text-sm font-medium uppercase tracking-wide">Saldo Disponível (Liquidado)</span>
                    </div>
                    <h3 className="text-4xl font-bold tracking-tight">R$ {me?.balanceAvailable?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}</h3>
                    <div className="mt-4 flex items-center justify-between text-xs bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                        <span>Taxa de antecipação acordada:</span>
                        <span className="font-bold">{me?.discountRate || 1.99}% a.m.</span>
                    </div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-gray-500">
                        <Clock size={20} />
                        <span className="text-sm font-medium uppercase tracking-wide">A Receber (Vendas Entregues)</span>
                    </div>
                    <h3 className="text-4xl font-bold text-gray-800 tracking-tight">R$ {me?.balanceReceivable?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}</h3>
                    <p className="text-sm text-gray-400 mt-2">Valores aguardando prazo de recebimento padrão ({me?.paymentTermsDays || 30} dias).</p>
                </div>
            </div>

            {/* Nova Seção: Tabela de Previsão de Recebimentos */}
            {myFuturePayouts.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-8">
                   <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <CalendarClock size={20} className="mr-2 text-brand-darkBlue"/>
                      Previsão de Recebimentos (Futuros)
                   </h4>
                   <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Referência / Pedido</th>
                                    <th className="px-4 py-3">Data Prevista (Recebimento)</th>
                                    <th className="px-4 py-3 text-right rounded-r-lg">Valor Bruto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {myFuturePayouts.map(payout => {
                                    const winner = payout.proposals.find(p => p.id === payout.winnerProposalId);
                                    const dueDate = payout.paymentDueDate ? new Date(payout.paymentDueDate) : new Date();
                                    const daysLeft = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                    
                                    return (
                                        <tr key={payout.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <span className="font-bold text-gray-800">{payout.title}</span>
                                                <div className="text-xs text-gray-400">REQ: {payout.requisitionCode}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-brand-darkBlue bg-blue-50 px-2 py-1 rounded">
                                                        {dueDate.toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        (em {daysLeft} dias)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-700">
                                                R$ {winner?.priceTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                   </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-gray-800 flex items-center">
                        <TrendingUp size={20} className="mr-2 text-brand-darkBlue" />
                        Simular Antecipação
                    </h4>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-end p-6 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-gray-600 mb-2">Valor a antecipar hoje</label>
                        <input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-medium bg-white text-gray-900" placeholder="0,00" />
                    </div>
                    <div className="flex-1 w-full">
                         <div className="text-sm text-gray-500 mb-2">Custo Estimado (Taxa {me?.discountRate}%)</div>
                         <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">R$ 0,00</div>
                    </div>
                    <button className="w-full md:w-auto bg-amber-400 text-brand-darkBlue font-bold px-8 py-3 rounded-lg hover:bg-amber-300 shadow-md transition-colors border border-amber-500/20">
                        Solicitar Saque
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // Admin View Logic
  const filteredMerchants = searchTerm 
    ? merchants.filter(m => m.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || m.cnpj.includes(searchTerm))
    : [];

  const handleSelectMerchant = (merchant: MerchantUser) => {
    setSelectedMerchantId(merchant.id);
    setSearchTerm('');
    setCustomDiscountRate(merchant.discountRate.toString());
    setCustomFixedFee((merchant.fixedFee || 0).toString());
  };

  const handleSaveCustomRates = () => {
    if (selectedMerchantId && onUpdateMerchant) {
        const merchant = merchants.find(m => m.id === selectedMerchantId);
        if (merchant) {
            onUpdateMerchant({
                ...merchant,
                discountRate: parseFloat(customDiscountRate),
                fixedFee: parseFloat(customFixedFee)
            });
            setSelectedMerchantId(null);
        }
    }
  };

  const selectedMerchant = merchants.find(m => m.id === selectedMerchantId);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Financeiro & Receita</h2>
        
        {/* PAYOUTS SECTION (New) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-blue-100 rounded-lg text-blue-600">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Programação de Repasses</h3>
                        <p className="text-xs text-gray-500">Valores líquidos a pagar aos fornecedores (já descontadas as taxas).</p>
                    </div>
                </div>
                {pendingPayouts.length > 0 && (
                     <div className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
                        <AlertTriangle size={14} className="mr-1" />
                        {pendingPayouts.length} pagamentos pendentes
                     </div>
                )}
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Fornecedor / Cotação</th>
                            <th className="px-6 py-4">Vencimento</th>
                            <th className="px-6 py-4 text-right">Valor Bruto</th>
                            <th className="px-6 py-4 text-right">Taxas (Interm. + Fixa)</th>
                            <th className="px-6 py-4 text-right">Valor Líquido</th>
                            <th className="px-6 py-4 text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pendingPayouts.map(payout => {
                            const winnerProposal = payout.proposals.find(p => p.id === payout.winnerProposalId);
                            if (!winnerProposal || !winnerProposal.merchantId) return null;

                            const merchant = merchants.find(m => m.id === winnerProposal.merchantId);
                            const grossAmount = winnerProposal.priceTotal;
                            
                            // Calculate Fees
                            const rate = merchant?.discountRate || 2.5; // Default logic fallback
                            const fixed = merchant?.fixedFee || 0;
                            const feeAmount = (grossAmount * (rate / 100)) + fixed;
                            const netAmount = grossAmount - feeAmount;

                            const isOverdue = payout.paymentDueDate ? new Date(payout.paymentDueDate) <= new Date() : false;

                            return (
                                <tr key={payout.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{winnerProposal.merchantName}</div>
                                        <div className="text-xs text-gray-400">Ref: {payout.title} ({payout.requisitionCode})</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                            <Calendar size={14} />
                                            {payout.paymentDueDate ? new Date(payout.paymentDueDate).toLocaleDateString() : 'Imediato'}
                                        </div>
                                        {isOverdue && <span className="text-[10px] text-red-500 uppercase font-bold">A Pagar Hoje</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500">
                                        R$ {grossAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-red-500 text-xs">
                                        - R$ {feeAmount.toFixed(2)}
                                        <div className="text-gray-300 text-[10px]">({rate}% + R$ {fixed})</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-brand-darkBlue text-lg">
                                        R$ {netAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => onProcessPayout && onProcessPayout(payout.id)}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center justify-center w-full"
                                        >
                                            <DollarSign size={14} className="mr-1" />
                                            Realizar Repasse
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {pendingPayouts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    <CheckCircle size={48} className="mx-auto mb-3 text-gray-200" />
                                    Nenhum repasse pendente no momento.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-light text-emerald-600 rounded-lg">
                        <Percent size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Taxa de Intermediação (Default)</h3>
                        <p className="text-gray-500 text-sm mb-4">Take Rate global sobre vendas.</p>
                        <div className="flex items-center gap-3">
                            <input type="number" defaultValue={2.5} className="w-24 px-3 py-2 border border-gray-300 rounded-lg font-bold text-right text-gray-700 bg-white" />
                            <span className="text-gray-500 font-bold">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
                        <ArrowRightLeft size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Taxa de Antecipação (Default)</h3>
                        <p className="text-gray-500 text-sm mb-4">Taxa base para adiantamentos.</p>
                        <div className="flex items-center gap-3">
                            <input type="number" defaultValue={1.99} className="w-24 px-3 py-2 border border-gray-300 rounded-lg font-bold text-right text-gray-700 bg-white" />
                            <span className="text-gray-500 font-bold">% a.m.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Custom Rates Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-brand-darkBlue">
                        <UserCog size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Personalização por Lojista</h3>
                        <p className="text-xs text-gray-500">Defina taxas específicas (exceções) para parceiros estratégicos.</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {!selectedMerchant ? (
                    <div className="relative max-w-lg">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Lojista para Configurar</label>
                         <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue bg-white text-gray-900"
                                placeholder="Digite o nome da farmácia ou CNPJ..."
                            />
                         </div>
                         {searchTerm && (
                             <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                 {filteredMerchants.length > 0 ? (
                                     filteredMerchants.map(m => (
                                         <div 
                                            key={m.id} 
                                            onClick={() => handleSelectMerchant(m)}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                                         >
                                             <div className="font-bold text-gray-800">{m.companyName}</div>
                                             <div className="text-xs text-gray-500">CNPJ: {m.cnpj}</div>
                                         </div>
                                     ))
                                 ) : (
                                     <div className="p-3 text-sm text-gray-500">Nenhum lojista encontrado.</div>
                                 )}
                             </div>
                         )}
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                             <div>
                                <h4 className="text-xl font-bold text-brand-darkBlue">{selectedMerchant.companyName}</h4>
                                <p className="text-sm text-gray-500">CNPJ: {selectedMerchant.cnpj}</p>
                             </div>
                             <button 
                                onClick={() => setSelectedMerchantId(null)}
                                className="text-sm text-gray-500 hover:text-gray-800 underline"
                             >
                                Alterar Lojista
                             </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Taxa de Antecipação (%)</label>
                                <div className="flex items-center">
                                    <input 
                                        type="number" 
                                        value={customDiscountRate}
                                        onChange={(e) => setCustomDiscountRate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-brand-darkBlue focus:border-brand-darkBlue bg-white text-gray-900"
                                        step="0.01"
                                    />
                                    <span className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 font-medium">%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Taxa padrão: 1.99%</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Taxa Fixa por Operação (R$)</label>
                                <div className="flex items-center">
                                    <span className="px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 font-medium">R$</span>
                                    <input 
                                        type="number" 
                                        value={customFixedFee}
                                        onChange={(e) => setCustomFixedFee(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-brand-darkBlue focus:border-brand-darkBlue bg-white text-gray-900"
                                        step="0.01"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Valor cobrado além da porcentagem.</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={handleSaveCustomRates}
                                className="flex items-center px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md transition-all"
                            >
                                <Save size={18} className="mr-2" />
                                Salvar Personalização
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Financials;
