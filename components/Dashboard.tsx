import React, { useState, useEffect } from 'react';
import { UserRole, Quote, CostCenter, QuoteStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Wallet, ShoppingBag, Clock, AlertCircle, ArrowUpRight, Activity, Building2, Users, FileText, Calendar, Download, ChevronRight } from 'lucide-react';
import { APP_NAME } from '../constants';

interface DashboardProps {
  role: UserRole;
  quotes: Quote[];
  costCenters: CostCenter[];
  onViewQuote: (quoteId: string) => void;
}

// Styled Stat Card based on "Agrotec" reference
const StatCard: React.FC<{
  title: string;
  value: string;
  subValue?: string;
  trendPositive?: boolean;
  icon: React.ReactNode;
}> = ({ title, value, subValue, trendPositive = true, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-soft border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-extrabold text-brand-dark tracking-tight">{value}</h3>
        {subValue && (
            <div className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-md ${trendPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                {trendPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingUp size={12} className="mr-1 rotate-180" />}
                {subValue}
            </div>
        )}
      </div>
      <div className="p-3.5 bg-brand-light rounded-xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 shadow-sm">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-dark text-white text-xs p-3 rounded-lg shadow-xl border border-white/10">
        <p className="font-bold mb-1 text-brand-primary">{label}</p>
        <p>{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ role, quotes, costCenters, onViewQuote }) => {
  // Dados Mockados
  const dataRevenue = [
    { name: 'Jan', value: 42000 },
    { name: 'Fev', value: 38000 },
    { name: 'Mar', value: 55000 },
    { name: 'Abr', value: 48000 },
    { name: 'Mai', value: 62000 },
    { name: 'Jun', value: 75000 },
  ];

  const dataQuotes = [
    { name: 'Sem 1', value: 12 },
    { name: 'Sem 2', value: 18 },
    { name: 'Sem 3', value: 15 },
    { name: 'Sem 4', value: 24 },
  ];

  // Real-time Clock State
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const formattedTime = currentDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto pb-8">
      
      {/* HERO BANNER - MATCHING REFERENCE */}
      <div className="relative bg-brand-dark rounded-3xl p-8 md:p-14 mb-10 overflow-hidden shadow-2xl group">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary opacity-5 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 group-hover:opacity-10 transition-opacity duration-700"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500 opacity-5 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-sm font-bold mb-6 backdrop-blur-md shadow-sm">
                  <Clock size={16} className="text-emerald-400" />
                  <span className="tracking-wide">{formattedDate}</span>
                  <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                  <span className="font-mono tabular-nums text-white/90">{formattedTime}</span>
              </div>
              
              <div className="max-w-3xl">
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                      {APP_NAME}
                  </h1>
                  
                  <div className="flex items-start gap-6">
                      <div className="w-1.5 h-16 bg-brand-primary rounded-full hidden md:block"></div>
                      <p className="text-emerald-100/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                          A plataforma de gestão de compras de medicamentos entre farmácias, distribuidoras e órgãos públicos.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 px-1">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Painel Gerencial</h2>
           <p className="text-gray-500 mt-1 font-medium">Visão geral em tempo real dos indicadores.</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-brand-darkBlue text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Download size={18} className="mr-2" />
            Exportar Relatório Completo
        </button>
      </div>

      {/* RENDER CONTENT BASED ON ROLE */}
      {role === UserRole.ADMIN && (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Receita Recorrente" 
                    value="R$ 124.500" 
                    subValue="+12% vs. 2024"
                    icon={<TrendingUp />} 
                />
                <StatCard 
                    title="Cotações Ativas" 
                    value={quotes.filter(q => q.status === QuoteStatus.OPEN).length.toString()} 
                    subValue="Volume Recorde"
                    icon={<Activity />} 
                />
                <StatCard 
                    title="Farmácias / Distrib." 
                    value={quotes.length.toString()} // Mock logic
                    subValue="+5 Novos"
                    icon={<Building2 />} 
                />
                <StatCard 
                    title="Ticket Médio" 
                    value="R$ 1.250" 
                    subValue="Estável"
                    icon={<Wallet />} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-transparent shadow-soft hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                           <h3 className="font-bold text-gray-900 text-lg">Volume de Negócios</h3>
                           <p className="text-sm text-gray-400">Distribuição regional de vendas</p>
                        </div>
                        <div className="px-3 py-1 bg-brand-light text-brand-dark font-bold rounded-lg text-xs">Top 5 Cidades</div>
                    </div>
                    <div className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataRevenue}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                              <Tooltip content={<CustomTooltip />} />
                              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                         </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-transparent shadow-soft hover:shadow-lg transition-shadow flex flex-col justify-between">
                     <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Distribuição por Categoria</h3>
                        <p className="text-gray-400 text-sm mb-8">Perfil dos participantes</p>
                        <div className="h-60">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataQuotes}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={5} />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                                </BarChart>
                             </ResponsiveContainer>
                        </div>
                     </div>
                     <button className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-sm hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                        Ver Detalhes Completos <ChevronRight size={16} />
                     </button>
                </div>
            </div>
        </div>
      )}

      {/* OTHER ROLES DASHBOARDS (Keeping functional logic but updating styling) */}
      {role !== UserRole.ADMIN && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title={role === UserRole.MERCHANT ? "Minhas Vendas" : "Total Gasto"} 
                    value={role === UserRole.MERCHANT ? "R$ 45.200" : "R$ 850.000"} 
                    subValue={role === UserRole.MERCHANT ? "+5% vs. mês anterior" : "65% do orçamento"}
                    icon={<Wallet />} 
                />
                <StatCard 
                    title="Processos em Aberto" 
                    value={quotes.filter(q => q.status === QuoteStatus.OPEN).length.toString()} 
                    subValue="Aguardando ação"
                    icon={<Clock />} 
                    trendPositive={false}
                />
                <StatCard 
                    title="Processos Finalizados" 
                    value={quotes.filter(q => q.status === QuoteStatus.COMPLETED).length.toString()} 
                    subValue="Sucesso"
                    icon={<ShoppingBag />} 
                />
                 <StatCard 
                    title="Itens Cotados" 
                    value="1.240" 
                    subValue="Total acumulado"
                    icon={<FileText />} 
                />
          </div>
      )}

      {/* Recent Activity Table Style Update */}
      {role !== UserRole.ADMIN && (
          <div className="mt-8 bg-white rounded-2xl shadow-soft border border-transparent overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 text-lg">Cotações Recentes</h3>
                  <button className="text-brand-primary font-bold text-sm hover:underline">Ver todas</button>
              </div>
              <div className="p-0">
                  {quotes.slice(0, 3).map((quote, idx) => (
                      <div key={quote.id} className="flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onViewQuote(quote.id)}>
                          <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${quote.status === QuoteStatus.OPEN ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                  <ShoppingBag size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-gray-900">{quote.title}</h4>
                                  <p className="text-sm text-gray-500">{quote.items.length} itens • {new Date(quote.createdAt).toLocaleDateString()}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                  quote.status === QuoteStatus.OPEN ? 'bg-blue-100 text-blue-700' : 
                                  quote.status === QuoteStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                  {quote.status === QuoteStatus.OPEN ? 'Em Aberto' : quote.status === QuoteStatus.COMPLETED ? 'Finalizada' : 'Em Análise'}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;