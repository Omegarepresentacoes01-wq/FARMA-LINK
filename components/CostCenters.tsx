
import React, { useState } from 'react';
import { CostCenter } from '../types';
import { Plus, Wallet, TrendingUp, AlertCircle, XCircle, CheckCircle, Building2, Search } from 'lucide-react';

interface CostCentersProps {
  costCenters: CostCenter[];
  onAddCostCenter: (costCenter: CostCenter) => void;
}

const CostCenters: React.FC<CostCentersProps> = ({ costCenters, onAddCostCenter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const handleSave = () => {
    if (!newName || !newBudget) return;

    const newCC: CostCenter = {
      id: `cc-${Date.now()}`,
      name: newName,
      budget: parseFloat(newBudget),
      spent: 0
    };

    onAddCostCenter(newCC);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewName('');
    setNewBudget('');
  };

  const filteredCenters = costCenters.filter(cc => 
    cc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = costCenters.reduce((acc, cc) => acc + cc.budget, 0);
  const totalSpent = costCenters.reduce((acc, cc) => acc + cc.spent, 0);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Centros de Custo</h2>
          <p className="text-gray-500">Gerencie o orçamento distribuído entre as secretarias e unidades.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-darkBlue text-white px-5 py-2.5 rounded-lg flex items-center font-medium hover:bg-blue-900 transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" />
          Novo Centro de Custo
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Orçamento Total Aprovado</p>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">R$ {totalBudget.toLocaleString('pt-BR')}</h3>
                <div className="p-2 bg-blue-50 text-brand-darkBlue rounded-lg"><Wallet size={20} /></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Executado (Gasto)</p>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">R$ {totalSpent.toLocaleString('pt-BR')}</h3>
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><TrendingUp size={20} /></div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Saldo Disponível</p>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-emerald-600">R$ {(totalBudget - totalSpent).toLocaleString('pt-BR')}</h3>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={20} /></div>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-900" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar unidade..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue bg-white text-gray-900" 
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCenters.map(cc => {
                const percent = (cc.spent / cc.budget) * 100;
                const isCritical = percent > 85;

                return (
                    <div key={cc.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{cc.name}</h4>
                                    <span className="text-xs text-gray-400">ID: {cc.id}</span>
                                </div>
                            </div>
                            {isCritical && <AlertCircle size={18} className="text-red-500" />}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 font-medium">
                                    <span className="text-gray-500">Execução Orçamentária</span>
                                    <span className={isCritical ? 'text-red-600' : 'text-brand-darkBlue'}>{percent.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${isCritical ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                        style={{width: `${percent}%`}}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-50 pt-4">
                                <div>
                                    <p className="text-gray-400 text-xs uppercase mb-1">Orçamento</p>
                                    <p className="font-semibold text-gray-800">R$ {cc.budget.toLocaleString('pt-BR')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs uppercase mb-1">Disponível</p>
                                    <p className="font-bold text-emerald-600">R$ {(cc.budget - cc.spent).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">Novo Centro de Custo</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Unidade / Secretaria</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-darkBlue/20 focus:border-brand-darkBlue bg-white text-gray-900"
                  placeholder="Ex: UBS Central"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orçamento Inicial (R$)</label>
                <input 
                  type="number" 
                  value={newBudget} 
                  onChange={e => setNewBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white bg-white">
                Cancelar
              </button>
              <button onClick={handleSave} className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md">
                <CheckCircle size={18} className="inline mr-2" />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCenters;
