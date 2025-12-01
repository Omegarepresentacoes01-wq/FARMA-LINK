
import React, { useState } from 'react';
import { Agency, MerchantUser } from '../types';
import { Building2, Store, Plus, Search, CheckCircle, XCircle, MapPin, Mail, Ban, Unlock, Percent, CalendarClock } from 'lucide-react';

interface AdminUsersProps {
  agencies: Agency[];
  merchants: MerchantUser[];
  onAddAgency: (agency: Agency) => void;
  onUpdateAgency: (agency: Agency) => void;
  onAddMerchant: (merchant: MerchantUser) => void;
  onUpdateMerchant: (merchant: MerchantUser) => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ 
  agencies, 
  merchants, 
  onAddAgency, 
  onUpdateAgency, 
  onAddMerchant, 
  onUpdateMerchant 
}) => {
  const [activeTab, setActiveTab] = useState<'agencies' | 'merchants'>('agencies');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  // Form States
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDiscountRate, setNewDiscountRate] = useState('');
  const [newFixedFee, setNewFixedFee] = useState('');
  const [newPaymentTerms, setNewPaymentTerms] = useState(''); // Novo campo: Dias para pagar

  const handleAdd = () => {
    if (activeTab === 'agencies') {
      const newAgency: Agency = {
        id: `a-${Date.now()}`,
        name: newName,
        city: newCity,
        state: newState,
        totalBudget: parseFloat(newBudget) || 0,
        spent: 0,
        status: 'active'
      };
      onAddAgency(newAgency);
    } else {
      const newMerchant: MerchantUser = {
        id: `m-${Date.now()}`,
        companyName: newName,
        cnpj: newCnpj,
        email: newEmail,
        status: 'active',
        joinedAt: new Date().toISOString().split('T')[0],
        discountRate: parseFloat(newDiscountRate) || 0,
        fixedFee: parseFloat(newFixedFee) || 0,
        paymentTermsDays: parseInt(newPaymentTerms) || 30, // Default 30 dias se vazio
        balanceAvailable: 0,
        balanceReceivable: 0
      };
      onAddMerchant(newMerchant);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewName('');
    setNewCity('');
    setNewState('');
    setNewBudget('');
    setNewCnpj('');
    setNewEmail('');
    setNewDiscountRate('');
    setNewFixedFee('');
    setNewPaymentTerms('');
  };

  // Actions for Agencies
  const toggleAgencyStatus = (id: string) => {
    const agency = agencies.find(a => a.id === id);
    if (agency) {
      onUpdateAgency({ ...agency, status: agency.status === 'active' ? 'inactive' : 'active' });
    }
  };

  const startEditingBudget = (agency: Agency) => {
      setEditingAgencyId(agency.id);
      setTempBudget(agency.totalBudget.toString());
  };

  const saveBudget = (id: string) => {
      const agency = agencies.find(a => a.id === id);
      if (agency) {
        onUpdateAgency({ ...agency, totalBudget: parseFloat(tempBudget) || 0 });
      }
      setEditingAgencyId(null);
  };

  // Actions for Merchants
  const toggleMerchantStatus = (id: string, newStatus: 'active' | 'blocked') => {
    const merchant = merchants.find(m => m.id === id);
    if (merchant) {
      onUpdateMerchant({ ...merchant, status: newStatus });
    }
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h2>
          <p className="text-gray-500">Gerencie órgãos públicos e fornecedores cadastrados na plataforma.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-darkBlue text-white px-5 py-2.5 rounded-lg flex items-center font-medium hover:bg-blue-900 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setActiveTab('agencies')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'agencies' 
              ? 'bg-white text-brand-darkBlue shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Building2 size={16} className="mr-2" />
            Prefeituras (Órgãos)
          </div>
        </button>
        <button
          onClick={() => setActiveTab('merchants')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'merchants' 
              ? 'bg-white text-brand-darkBlue shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center">
            <Store size={16} className="mr-2" />
            Lojistas & Farmácias
          </div>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex gap-3">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-900" size={20} />
                <input 
                  type="text" 
                  placeholder={`Buscar ${activeTab === 'agencies' ? 'prefeitura' : 'lojista'}...`} 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue bg-white text-gray-900 placeholder-gray-400" 
                />
            </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              {activeTab === 'agencies' ? (
                <>
                  <th className="px-6 py-4">Nome do Órgão</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4 w-1/3">Execução Orçamentária</th>
                  <th className="px-6 py-4">Status</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4">Razão Social</th>
                  <th className="px-6 py-4">CNPJ / Contato</th>
                  <th className="px-6 py-4">Condições & Prazos</th>
                  <th className="px-6 py-4">Status</th>
                </>
              )}
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {activeTab === 'agencies' ? (
              agencies.map(agency => {
                 const percent = (agency.spent / agency.totalBudget) * 100;
                 return (
                    <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{agency.name}</td>
                      <td className="px-6 py-4 text-gray-600 flex items-center">
                        <MapPin size={14} className="mr-1 text-gray-400" /> {agency.city} - {agency.state}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {editingAgencyId === agency.id ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    value={tempBudget}
                                    onChange={(e) => setTempBudget(e.target.value)}
                                    className="w-32 px-2 py-1 border rounded text-sm bg-white text-gray-900"
                                    autoFocus
                                />
                                <button onClick={() => saveBudget(agency.id)} className="text-green-600 text-xs font-bold hover:underline">Salvar</button>
                                <button onClick={() => setEditingAgencyId(null)} className="text-red-500 text-xs hover:underline">X</button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>R$ {agency.spent.toLocaleString('pt-BR')}</span>
                                    <span className="font-bold text-gray-800">R$ {agency.totalBudget.toLocaleString('pt-BR')}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden flex items-center group cursor-pointer" onClick={() => startEditingBudget(agency)} title="Clique para editar orçamento">
                                    <div className={`h-full ${percent > 90 ? 'bg-red-500' : 'bg-brand-darkBlue'}`} style={{width: `${Math.min(percent, 100)}%`}}></div>
                                </div>
                            </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {agency.status === 'active' ? (
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-gray-700 font-medium text-xs">Ativo</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-gray-700 font-medium text-xs">Inativo</span>
                            </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {agency.status === 'active' ? (
                          <button 
                            onClick={() => toggleAgencyStatus(agency.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Bloquear Prefeitura"
                          >
                            <Ban size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleAgencyStatus(agency.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Ativar Prefeitura"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                 );
              })
            ) : (
              merchants.map(merchant => (
                <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{merchant.companyName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="text-xs text-gray-400">CNPJ: {merchant.cnpj}</div>
                    <div className="flex items-center mt-1"><Mail size={12} className="mr-1"/> {merchant.email}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Taxa:</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-800 text-xs font-mono font-bold w-fit">
                                {merchant.discountRate ? merchant.discountRate.toFixed(2) : '0.00'}%
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-xs text-gray-500">Recebe em:</span>
                             <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 border border-purple-100 text-purple-800 text-xs font-bold w-fit">
                                {merchant.paymentTermsDays || 30} dias
                            </span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     {merchant.status === 'active' ? (
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-gray-700 font-medium text-xs">Verificado</span>
                            </span>
                        ) : merchant.status === 'pending' ? (
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                <span className="text-gray-700 font-medium text-xs">Pendente</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-gray-700 font-medium text-xs">Bloqueado</span>
                            </span>
                        )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {merchant.status === 'active' ? (
                      <button 
                        onClick={() => toggleMerchantStatus(merchant.id, 'blocked')}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Bloquear Lojista"
                      >
                        <Ban size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => toggleMerchantStatus(merchant.id, 'active')}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Aprovar/Ativar Lojista"
                      >
                        {merchant.status === 'pending' ? <CheckCircle size={18} /> : <Unlock size={18} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {((activeTab === 'agencies' && agencies.length === 0) || (activeTab === 'merchants' && merchants.length === 0)) && (
          <div className="p-8 text-center text-gray-400">
            Nenhum registro encontrado.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                {activeTab === 'agencies' ? 'Cadastrar Nova Prefeitura' : 'Cadastrar Novo Lojista'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-white">
              {activeTab === 'agencies' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Órgão</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={e => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Ex: Prefeitura Municipal de..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <input 
                        type="text" 
                        value={newCity} 
                        onChange={e => setNewCity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
                      <input 
                        type="text" 
                        value={newState} 
                        onChange={e => setNewState(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento Anual (R$)</label>
                    <input 
                      type="number" 
                      value={newBudget} 
                      onChange={e => setNewBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="0.00"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={e => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Ex: Farmácia Exemplo Ltda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <input 
                      type="text" 
                      value={newCnpj} 
                      onChange={e => setNewCnpj(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Contato</label>
                    <input 
                      type="email" 
                      value={newEmail} 
                      onChange={e => setNewEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="contato@empresa.com"
                    />
                  </div>

                   {/* Campos Financeiros */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Condições Comerciais</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Prazo de Pagamento</label>
                          <div className="relative">
                              <input 
                              type="number" 
                              value={newPaymentTerms} 
                              onChange={e => setNewPaymentTerms(e.target.value)}
                              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                              placeholder="30"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                  <span className="text-xs font-bold">dias</span>
                              </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">Dias p/ receber após venda.</p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Taxa Antecipação</label>
                          <div className="relative">
                              <input 
                              type="number" 
                              value={newDiscountRate} 
                              onChange={e => setNewDiscountRate(e.target.value)}
                              className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                              placeholder="2.5"
                              step="0.01"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                  <Percent size={14} />
                              </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">Taxa mensal para adiantar valores.</p>
                        </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Taxa Fixa (R$)</label>
                      <input 
                      type="number" 
                      value={newFixedFee} 
                      onChange={e => setNewFixedFee(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="0.00"
                      step="0.01"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white bg-white">
                Cancelar
              </button>
              <button onClick={handleAdd} className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md">
                <CheckCircle size={18} className="inline mr-2" />
                Salvar Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
