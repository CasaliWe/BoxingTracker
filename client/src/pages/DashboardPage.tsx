import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import ComboCard from '@/components/dashboard/ComboCard';
import EmptyCard from '@/components/dashboard/EmptyCard';
import StatCard from '@/components/dashboard/StatCard';
import ComboCreationModal from '@/components/combo/ComboCreationModal';
import { useComboContext } from '@/context/ComboContext';

const DashboardPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showComboModal, setShowComboModal] = useState(false);
  const { combos } = useComboContext();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const openComboModal = () => {
    setShowComboModal(true);
  };

  const closeComboModal = () => {
    setShowComboModal(false);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <p className="text-muted-foreground mt-1">Crie e gerencie seus combos de boxe</p>
            </div>
            <button 
              onClick={openComboModal}
              className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-base-dark hover:bg-base-base text-white rounded-lg transition-colors duration-200"
            >
              <i className="ri-add-line mr-2"></i>
              <span>Adicionar novo combo</span>
            </button>
          </div>

          {/* Cards de Combo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {combos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} />
            ))}
            
            {/* Card vazio para adicionar novo combo */}
            <EmptyCard onCreateClick={openComboModal} />
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Estatísticas Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                icon="ri-boxing-line" 
                iconClass="text-base-base" 
                bgClass="bg-base-dark/20" 
                title="Total de Combos" 
                value={combos.length.toString()} 
              />
              
              <StatCard 
                icon="ri-timer-line" 
                iconClass="text-ataques-base" 
                bgClass="bg-ataques-dark/20" 
                title="Tempo de treino" 
                value="3h 45m" 
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

      {/* Modal de criação de combos */}
      {showComboModal && <ComboCreationModal onClose={closeComboModal} />}
    </div>
  );
};

export default DashboardPage;
