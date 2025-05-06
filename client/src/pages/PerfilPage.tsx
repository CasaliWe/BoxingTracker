import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import { toast } from '@/hooks/use-toast';

const PerfilPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [formData, setFormData] = useState({
    nome: 'Usuário',
    email: 'usuario@exemplo.com',
    telefone: '(11) 98765-4321',
    idade: '28',
    cidade: 'São Paulo',
    peso: '75',
    altura: '178',
    academia: 'Academia Top Boxe'
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria o lugar para salvar os dados no backend
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso!"
    });
    setIsEditing(false);
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
            <h2 className="text-2xl font-bold text-white">Perfil</h2>
            <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
          </div>

          <div className="bg-card rounded-xl border border-dark-600 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Seção da foto de perfil */}
              <div className="p-6 border-b md:border-b-0 md:border-r border-dark-600 md:w-1/3 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-base-dark/20 flex items-center justify-center mb-4">
                  <i className="ri-user-line text-5xl text-base-base"></i>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">{formData.nome}</h3>
                <p className="text-muted-foreground text-center mb-4">{formData.email}</p>
                
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-white bg-base-dark hover:bg-base-base px-4 py-2 rounded-md transition-colors duration-200 text-sm"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    <span>Editar perfil</span>
                  </button>
                )}
              </div>
              
              {/* Formulário de informações */}
              <div className="flex-1 p-6">
                <h4 className="text-lg font-medium text-white mb-4">Informações pessoais</h4>
                
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="nome" className="block text-sm text-muted-foreground">Nome</label>
                      <input 
                        type="text" 
                        id="nome" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm text-muted-foreground">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="telefone" className="block text-sm text-muted-foreground">Telefone</label>
                      <input 
                        type="tel" 
                        id="telefone" 
                        name="telefone" 
                        value={formData.telefone} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="idade" className="block text-sm text-muted-foreground">Idade</label>
                      <input 
                        type="number" 
                        id="idade" 
                        name="idade" 
                        value={formData.idade} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="cidade" className="block text-sm text-muted-foreground">Cidade</label>
                      <input 
                        type="text" 
                        id="cidade" 
                        name="cidade" 
                        value={formData.cidade} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="peso" className="block text-sm text-muted-foreground">Peso (kg)</label>
                      <input 
                        type="number" 
                        id="peso" 
                        name="peso" 
                        value={formData.peso} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="altura" className="block text-sm text-muted-foreground">Altura (cm)</label>
                      <input 
                        type="number" 
                        id="altura" 
                        name="altura" 
                        value={formData.altura} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="academia" className="block text-sm text-muted-foreground">Academia</label>
                      <input 
                        type="text" 
                        id="academia" 
                        name="academia" 
                        value={formData.academia} 
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6 flex space-x-4">
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-base-dark hover:bg-base-base text-white rounded-md transition-colors duration-200"
                      >
                        Salvar alterações
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-muted hover:bg-secondary text-white rounded-md transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerfilPage;