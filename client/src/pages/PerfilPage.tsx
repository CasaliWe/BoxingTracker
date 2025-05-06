import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import AlterarSenhaModal from '@/components/perfil/AlterarSenhaModal';

const PerfilPage = () => {
  const { isMobile } = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [senhaModalOpen, setSenhaModalOpen] = useState(false);
  const { user, logout } = useAuth();
  
  // Estados para os campos do perfil
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gym, setGym] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleToggleEdit = () => {
    if (isEditing) {
      // Salvar as alterações
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    }
    
    setIsEditing(!isEditing);
  };
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleChangePassword = () => {
    setSenhaModalOpen(true);
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });
      
      // Redirecionar para a página de login
      const [_, setLocation] = useLocation();
      logout();
      setLocation('/login');
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="flex h-screen bg-background text-white">
      {/* Modal de alteração de senha */}
      <AlterarSenhaModal 
        isOpen={senhaModalOpen} 
        onClose={() => setSenhaModalOpen(false)} 
      />
      
      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Sidebar mobile (condicional) */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={handleMobileMenuToggle}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 h-full">
            <Sidebar onClose={handleMobileMenuToggle} className="h-full" />
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
              <h1 className="text-2xl font-bold">Meu Perfil</h1>
              <button 
                onClick={handleToggleEdit}
                className={`px-4 py-2 rounded-md ${isEditing ? 'bg-base-base text-white' : 'bg-muted text-white'}`}
              >
                {isEditing ? 'Salvar' : 'Editar'}
              </button>
            </div>
            
            <div className="bg-card rounded-xl border border-dark-600 overflow-hidden">
              {/* Cabeçalho do perfil */}
              <div className="p-6 border-b border-dark-600 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-base-dark/30 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Foto de perfil" className="w-full h-full object-cover" />
                  ) : (
                    <i className="ri-user-line text-4xl text-white"></i>
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  
                  {isEditing && (
                    <label className="mt-2 text-sm text-base-base hover:underline cursor-pointer">
                      Alterar foto de perfil
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Formulário do perfil */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Nome</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Email</label>
                    <input 
                      type="email" 
                      value={user?.email} 
                      disabled
                      className="w-full px-3 py-2 bg-muted/50 rounded-md border border-dark-600 text-muted-foreground disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Telefone</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      placeholder="(xx) xxxxx-xxxx"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Idade</label>
                    <input 
                      type="number" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ex: 25"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Cidade</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ex: São Paulo"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Estado</label>
                    <input 
                      type="text" 
                      value={state} 
                      onChange={(e) => setState(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ex: SP"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Peso (kg)</label>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ex: 70"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Altura (cm)</label>
                    <input 
                      type="number" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ex: 175"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Academia</label>
                    <input 
                      type="text" 
                      value={gym} 
                      onChange={(e) => setGym(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Nome da academia onde treina"
                      className="w-full px-3 py-2 bg-muted rounded-md border border-dark-600 text-white disabled:opacity-70"
                    />
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Configurações da conta</h3>
                  
                  <div className="space-y-4">
                    <button 
                      className="text-base-base hover:underline"
                      disabled={isEditing}
                      onClick={handleChangePassword}
                    >
                      Alterar senha
                    </button>
                    
                    <div>
                      <button 
                        className="text-ataques-base hover:underline"
                        disabled={isEditing}
                        onClick={handleDeleteAccount}
                      >
                        Excluir minha conta
                      </button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PerfilPage;