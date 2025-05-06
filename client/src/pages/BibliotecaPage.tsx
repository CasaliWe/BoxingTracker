import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';

const BibliotecaPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

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
            <h2 className="text-2xl font-bold text-white">Biblioteca</h2>
            <p className="text-muted-foreground mt-1">Aprenda mais sobre técnicas de boxe</p>
          </div>

          {/* Banner "Em breve" */}
          <div className="bg-card p-10 rounded-xl border border-dark-600 mb-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-base-dark/20 flex items-center justify-center mb-4">
              <i className="ri-book-open-line text-3xl text-base-base"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Biblioteca em construção!</h3>
            <p className="text-muted-foreground max-w-md">
              Estamos desenvolvendo um catálogo de técnicas, tutoriais e artigos sobre boxe para ajudar no seu treinamento. Em breve você terá acesso a todo este conteúdo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BibliotecaPage;