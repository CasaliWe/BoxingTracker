import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import { useMobile } from '@/hooks/use-mobile';

const BibliotecaPage = () => {
  const { isMobile } = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="flex h-screen bg-background text-white">
      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Sidebar mobile (condicional) */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={handleMobileMenuToggle}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64">
            <Sidebar onClose={handleMobileMenuToggle} />
          </div>
        </div>
      )}
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header móvel */}
        {isMobile && <MobileHeader onMenuClick={handleMobileMenuToggle} />}
        
        {/* Conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Biblioteca de Combos</h1>
            </div>
            
            {/* Conteúdo em construção */}
            <div className="flex flex-col items-center justify-center bg-card rounded-xl border border-dark-600 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-base-dark/20 flex items-center justify-center mb-4">
                <i className="ri-tools-fill text-3xl text-base-base"></i>
              </div>
              <h2 className="text-xl font-bold mb-2">Em Construção</h2>
              <p className="text-muted-foreground max-w-md">
                A biblioteca de combos está sendo desenvolvida e estará disponível em breve. 
                Aqui você poderá encontrar sequências criadas pela comunidade e profissionais.
              </p>
              
              <div className="mt-8 p-4 rounded-lg bg-base-dark/10 border border-base-dark/20 max-w-md">
                <h3 className="font-medium mb-2">O que esperar:</h3>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-base-base mr-2 mt-0.5"></i>
                    <span>Combos organizados por categoria, dificuldade e estilo</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-base-base mr-2 mt-0.5"></i>
                    <span>Sequências criadas por treinadores profissionais</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-base-base mr-2 mt-0.5"></i>
                    <span>Possibilidade de favoritar e adaptar combos para seu treinamento</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-base-base mr-2 mt-0.5"></i>
                    <span>Compartilhamento de suas próprias criações com a comunidade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BibliotecaPage;