
import React, { useState } from 'react';
import { UserRole, Notification } from '../types';
import { LayoutDashboard, ShoppingCart, FileText, DollarSign, LogOut, Package, Building2, FileBarChart2, Menu, ChevronRight, Settings, Bell, Check, X } from 'lucide-react';
import { APP_NAME, ROLES_CONFIG } from '../constants';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications?: Notification[];
  onMarkNotificationsAsRead?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRole, 
  onLogout, 
  activeTab, 
  onTabChange,
  notifications = [],
  onMarkNotificationsAsRead
}) => {
  const roleInfo = ROLES_CONFIG[currentRole];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    if (!isNotificationsOpen && unreadCount > 0 && onMarkNotificationsAsRead) {
        onMarkNotificationsAsRead();
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const getMenuItems = () => {
    const common = [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }];
    const reports = { id: 'reports', label: 'Relatórios', icon: <FileBarChart2 size={20} /> };
    
    switch (currentRole) {
      case UserRole.ADMIN:
        return [
          ...common,
          { id: 'fees', label: 'Taxas e Receita', icon: <DollarSign size={20} /> },
          { id: 'users', label: 'Prefeituras & Lojistas', icon: <Building2 size={20} /> },
          reports
        ];
      case UserRole.MANAGER:
        return [
          ...common,
          { id: 'quotes', label: 'Cotações', icon: <ShoppingCart size={20} /> },
          { id: 'cost-centers', label: 'Centros de Custo', icon: <FileText size={20} /> },
          reports
        ];
      case UserRole.INTERNAL:
        return [
          ...common,
          { id: 'quotes', label: 'Minhas Cotações', icon: <Package size={20} /> },
        ];
      case UserRole.MERCHANT:
        return [
          ...common,
          { id: 'marketplace', label: 'Oportunidades', icon: <ShoppingCart size={20} /> },
          { id: 'sales', label: 'Minhas Vendas', icon: <Package size={20} /> },
          { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
          reports
        ];
      default:
        return common;
    }
  };

  const menuItems = getMenuItems();

  const NotificationPanel = () => (
    <div className="absolute bottom-full left-0 mb-4 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in origin-bottom-left md:left-4 md:mb-2">
        <div className="bg-brand-dark p-4 flex justify-between items-center border-b border-white/10">
            <h4 className="font-bold text-white text-sm">Notificações</h4>
            <button onClick={() => setIsNotificationsOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
            </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Nenhuma notificação.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex gap-3">
                                <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.read ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                                <div>
                                    <p className={`text-xs ${!notif.read ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>{notif.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">
                                        {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        {notifications.length > 0 && (
             <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                 <button onClick={onMarkNotificationsAsRead} className="text-xs text-brand-darkBlue font-bold hover:underline flex items-center justify-center gap-1 w-full py-1">
                     <Check size={12} /> Marcar todas como lidas
                 </button>
             </div>
        )}
    </div>
  );

  return (
    <div className="flex h-screen bg-brand-gray overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 bg-brand-dark flex-col z-20 relative border-r border-white/5">
        {/* Logo Area */}
        <div className="h-24 flex items-center px-6 border-b border-white/5">
          <div className="mr-3 filter drop-shadow-md transition-transform hover:scale-105">
             <Logo className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">{APP_NAME}</h1>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
               <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Online System</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-[10px] font-bold text-gray-400 opacity-60 uppercase tracking-widest mb-4">Menu Principal</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 group relative ${
                activeTab === item.id
                  ? 'bg-brand-primary text-brand-darkBlue shadow-glow font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`mr-3 ${activeTab === item.id ? 'text-brand-darkBlue' : 'text-gray-500 group-hover:text-brand-primary transition-colors'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
              
              {activeTab === item.id && (
                  <ChevronRight size={16} className="ml-auto opacity-80" />
              )}
            </button>
          ))}
        </div>

        {/* User Profile Footer & Notifications */}
        <div className="p-4 mt-auto border-t border-white/5 relative">
            {isNotificationsOpen && <NotificationPanel />}

            <div className="bg-white/5 rounded-xl p-3 border border-white/5 group hover:border-brand-primary/30 transition-all">
                <div className="flex items-center justify-between gap-2 mb-3">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-emerald-800 flex items-center justify-center text-white font-bold shadow-lg ring-1 ring-brand-dark">
                            {roleInfo.label.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-white text-xs font-bold truncate">Usuário Ativo</p>
                            <p className="text-gray-400 text-[10px] truncate">{roleInfo.label}</p>
                        </div>
                     </div>
                     <button className="text-gray-500 hover:text-white transition-colors">
                        <Settings size={16} />
                     </button>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={toggleNotifications}
                        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors text-xs font-bold relative ${isNotificationsOpen ? 'bg-brand-primary text-brand-darkBlue' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                        <Bell size={14} className="mr-2" />
                        Alertas
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-brand-dark font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={onLogout}
                        className="flex-1 flex items-center justify-center py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors text-xs font-bold"
                    >
                        <LogOut size={14} className="mr-1" /> Sair
                    </button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-brand-gray">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-brand-dark flex items-center px-4 justify-between z-30 shadow-md relative">
           <div className="flex items-center">
             <Logo className="w-8 h-8 mr-2" />
             <span className="font-bold text-white text-lg">{APP_NAME}</span>
           </div>
           
           <div className="flex items-center gap-4">
               {/* Mobile Notification Bell */}
               <button onClick={toggleNotifications} className="relative text-white">
                   <Bell size={24} />
                   {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border border-brand-dark">
                            {unreadCount}
                        </span>
                   )}
               </button>
               
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                 <Menu size={24}/>
               </button>
           </div>

           {/* Mobile Notification Panel Dropdown */}
           {isNotificationsOpen && (
               <div className="absolute top-16 right-4 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 animate-fade-in origin-top-right overflow-hidden">
                   <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
                       <h4 className="font-bold text-gray-800 text-sm">Notificações</h4>
                       <button onClick={() => setIsNotificationsOpen(false)}><X size={16} className="text-gray-500"/></button>
                   </div>
                   <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-center py-6 text-sm text-gray-400">Sem novas notificações.</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="p-3 border-b border-gray-100 text-sm hover:bg-gray-50">
                                    <p className="text-gray-800">{n.message}</p>
                                    <span className="text-xs text-gray-400 block mt-1">{new Date(n.createdAt).toLocaleTimeString()}</span>
                                </div>
                            ))
                        )}
                   </div>
               </div>
           )}
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
           <div className="md:hidden absolute inset-0 bg-brand-dark z-40 p-4 animate-fade-in">
              <div className="flex justify-end mb-8">
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                    <LogOut size={24} className="rotate-180"/>
                 </button>
              </div>
              <div className="space-y-4">
                 {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { onTabChange(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-lg ${
                        activeTab === item.id ? 'bg-brand-primary text-brand-darkBlue font-bold' : 'text-gray-300'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                 ))}
                 <button onClick={onLogout} className="w-full flex items-center px-4 py-3 text-red-400 mt-8 border-t border-white/10 pt-8">
                    <LogOut className="mr-3" /> Sair
                 </button>
              </div>
           </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
