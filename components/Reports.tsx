import React, { useState } from 'react';
import { UserRole } from '../types';
import { FileText, Download, Calendar, Filter, PieChart, TrendingUp, DollarSign, Building2, Loader2, CheckCircle } from 'lucide-react';

interface ReportsProps {
  role: UserRole;
}

interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  lastGenerated?: string;
}

const Reports: React.FC<ReportsProps> = ({ role }) => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Define reports based on role
  const getReports = (): ReportDefinition[] => {
    switch (role) {
      case UserRole.ADMIN:
        return [
          { id: 'revenue', title: 'Relatório de Faturamento (Taxas)', description: 'Detalhamento mensal de taxas de intermediação e antecipação.', icon: <DollarSign className="text-green-600" /> },
          { id: 'growth', title: 'Crescimento da Plataforma', description: 'Novos cadastros de prefeituras e lojistas nos últimos 12 meses.', icon: <TrendingUp className="text-blue-600" /> },
          { id: 'audit', title: 'Auditoria de Transações', description: 'Log completo de cotações, propostas e compras realizadas.', icon: <FileText className="text-gray-600" /> },
        ];
      case UserRole.MANAGER:
        return [
          { id: 'cost_center', title: 'Gastos por Centro de Custo', description: 'Análise de execução orçamentária por unidade de saúde.', icon: <PieChart className="text-purple-600" /> },
          { id: 'savings', title: 'Relatório de Economia', description: 'Comparativo entre valores de referência e valores fechados em cotações.', icon: <TrendingUp className="text-green-600" /> },
          { id: 'suppliers', title: 'Desempenho de Fornecedores', description: 'Avaliação de prazos de entrega e conformidade dos pedidos.', icon: <Building2 className="text-orange-600" /> },
        ];
      case UserRole.MERCHANT:
        return [
          { id: 'sales', title: 'Histórico de Vendas', description: 'Registro completo de todas as vendas realizadas e status de pagamento.', icon: <DollarSign className="text-green-600" /> },
          { id: 'taxes', title: 'Extrato de Taxas', description: 'Relatório de comissões pagas à plataforma e custos de antecipação.', icon: <FileText className="text-red-500" /> },
        ];
      default:
        return [];
    }
  };

  const reports = getReports();

  const handleDownload = (reportId: string) => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    // Simulate API/PDF Generation delay
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  // Mock data for preview table
  const renderPreview = () => {
    if (!selectedReport) return null;

    return (
      <div className="mt-8 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Prévia dos Dados</h3>
          <span className="text-sm text-gray-500">Últimos 30 dias</span>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
           <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 text-gray-500 font-medium">
               <tr>
                 <th className="px-4 py-3">Data</th>
                 <th className="px-4 py-3">Referência</th>
                 <th className="px-4 py-3">Categoria</th>
                 <th className="px-4 py-3 text-right">Valor</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               <tr className="hover:bg-gray-50"><td className="px-4 py-3">25/10/2023</td><td className="px-4 py-3">REF-00123</td><td className="px-4 py-3">Medicamentos A</td><td className="px-4 py-3 text-right">R$ 1.250,00</td></tr>
               <tr className="hover:bg-gray-50"><td className="px-4 py-3">24/10/2023</td><td className="px-4 py-3">REF-00124</td><td className="px-4 py-3">Insumos B</td><td className="px-4 py-3 text-right">R$ 890,50</td></tr>
               <tr className="hover:bg-gray-50"><td className="px-4 py-3">23/10/2023</td><td className="px-4 py-3">REF-00125</td><td className="px-4 py-3">Medicamentos C</td><td className="px-4 py-3 text-right">R$ 3.400,00</td></tr>
               <tr className="bg-gray-50 font-bold"><td className="px-4 py-3" colSpan={3}>Total</td><td className="px-4 py-3 text-right">R$ 5.540,50</td></tr>
             </tbody>
           </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatórios e Análises</h2>
          <p className="text-gray-500">Exporte dados detalhados para gestão e prestação de contas.</p>
        </div>
        
        {/* Date Filter Simulation */}
        <div className="flex gap-2">
           <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white bg-gray-50 text-sm">
             <Calendar size={16} className="mr-2" />
             Este Mês
           </button>
           <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white bg-gray-50 text-sm">
             <Filter size={16} className="mr-2" />
             Filtrar
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div 
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`cursor-pointer rounded-xl p-6 border transition-all duration-200 flex flex-col justify-between h-52
              ${selectedReport === report.id 
                ? 'border-brand-darkBlue bg-blue-50/50 shadow-md ring-1 ring-brand-darkBlue' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-white border border-gray-100 shadow-sm`}>
                  {report.icon}
                </div>
                {selectedReport === report.id && (
                    <span className="text-xs font-bold text-brand-darkBlue bg-blue-100 px-2 py-1 rounded-full">Selecionado</span>
                )}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{report.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-lg animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                {reports.find(r => r.id === selectedReport)?.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Gerado em {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}</p>
            </div>
            
            <button 
              onClick={() => handleDownload(selectedReport)}
              disabled={isDownloading}
              className={`flex items-center px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all
                ${downloadSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-brand-darkBlue hover:bg-blue-900'}
                ${isDownloading ? 'opacity-75 cursor-wait' : ''}
              `}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Gerando PDF...
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Baixado com Sucesso!
                </>
              ) : (
                <>
                  <Download size={20} className="mr-2" />
                  Baixar Relatório PDF
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center mb-6">
            <p className="text-sm text-gray-600">
              O arquivo PDF conterá todos os gráficos, tabelas detalhadas e assinaturas digitais necessárias para auditoria.
            </p>
          </div>

          {renderPreview()}
        </div>
      )}
    </div>
  );
};

export default Reports;