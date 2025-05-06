import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onClose }) => {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  // Verifique se estamos na página de perfil ou biblioteca para ajustar a altura
  const isProfileOrLibrary = location === '/perfil' || location === '/biblioteca';

  return (
    <aside className={`flex flex-col w-64 bg-card border-r border-dark-600 ${isProfileOrLibrary ? 'h-full min-h-screen' : ''} ${className || ''}`}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between h-16 border-b border-dark-600 px-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <i className="ri-boxing-fill text-base-base"></i>
          <span>VibeBoxing</span>
        </h1>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-white">
            <i className="ri-close-line text-xl"></i>
          </button>
        )}
      </div>
      
      {/* Informações do usuário */}
      <div className="p-4 border-b border-dark-600 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-base-dark/50 flex items-center justify-center flex-shrink-0">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Perfil" className="w-full h-full object-cover rounded-full" />
          ) : (
            <i className="ri-user-line text-lg text-white"></i>
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
      
      {/* Menu de navegação */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          <li>
            <Link 
              to="/" 
              className={`flex items-center px-6 py-3 ${location === '/' ? 'text-white border-l-4 border-base-base' : 'text-muted-foreground hover:text-white border-l-4 border-transparent'} hover:bg-muted`}
            >
              <i className="ri-dashboard-line mr-3"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/combos" 
              className={`flex items-center px-6 py-3 ${location === '/combos' ? 'text-white border-l-4 border-base-base' : 'text-muted-foreground hover:text-white border-l-4 border-transparent'} hover:bg-muted`}
            >
              <i className="ri-boxing-line mr-3"></i>
              <span>Meus Combos</span>
            </Link>
          </li>

          <li>
            <Link 
              to="/biblioteca" 
              className={`flex items-center px-6 py-3 ${location === '/biblioteca' ? 'text-white border-l-4 border-base-base' : 'text-muted-foreground hover:text-white border-l-4 border-transparent'} hover:bg-muted`}
            >
              <i className="ri-book-open-line mr-3"></i>
              <span>Biblioteca</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/perfil" 
              className={`flex items-center px-6 py-3 ${location === '/perfil' ? 'text-white border-l-4 border-base-base' : 'text-muted-foreground hover:text-white border-l-4 border-transparent'} hover:bg-muted`}
            >
              <i className="ri-user-line mr-3"></i>
              <span>Perfil</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Rodapé do sidebar */}
      <div className="p-4 border-t border-dark-600 space-y-4">
        <button 
          onClick={() => {
            logout();
            setLocation('/login');
            if (onClose) onClose();
          }}
          className="flex items-center text-ataques-base hover:text-ataques-dark"
        >
          <i className="ri-logout-box-line mr-3"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
