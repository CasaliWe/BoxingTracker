import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import StatCard from '@/components/dashboard/StatCard';
import { useComboContext } from '@/context/ComboContext';

const DashboardPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { combos } = useComboContext();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar para desktop */}
      <Sidebar className="hidden md:flex" />
      
      {/* Sidebar móvel */}
      {showSidebar && (
        <Sidebar 
          className="fixed inset-0 z-40 md:hidden" 
          onClose={() => setShowSidebar(false)} 
        />
      )}
      
      {/* Conteúdo principal */}
      <main className="flex-1 overflow-y-auto bg-background">
        <MobileHeader onMenuClick={toggleSidebar} />
        
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Resumo das suas atividades de treino</p>
          </div>

          {/* Banner "Em breve" */}
          <div className="bg-card p-10 rounded-xl border border-dark-600 mb-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-base-dark/20 flex items-center justify-center mb-4">
              <i className="ri-rocket-line text-3xl text-base-base"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Novas funcionalidades em breve!</h3>
            <p className="text-muted-foreground max-w-md">
              Estamos trabalhando em novos recursos para o Dashboard. Em breve você poderá acompanhar seu progresso, visualizar estatísticas detalhadas e muito mais.
            </p>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Estatísticas Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard 
                icon="ri-boxing-line" 
                iconClass="text-base-base" 
                bgClass="bg-base-dark/20" 
                title="Total de Combos" 
                value={combos.length.toString()} 
              />
              
              <StatCard 
                icon="ri-fire-line" 
                iconClass="text-footwork-base" 
                bgClass="bg-footwork-dark/20" 
                title="Sequência mais longa" 
                value={`${combos.reduce((max, combo) => {
                  const totalGolpes = combo.etapas.reduce((sum, etapa) => sum + etapa.golpes.length, 0);
                  return totalGolpes > max ? totalGolpes : max;
                }, 0)} golpes`} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
