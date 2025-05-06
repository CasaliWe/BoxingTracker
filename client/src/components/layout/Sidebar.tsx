import React from 'react';
import { Link, useLocation } from 'wouter';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onClose }) => {
  const [location] = useLocation();

  return (
    <aside className={`flex flex-col w-64 bg-card border-r border-dark-600 ${className || ''}`}>
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
      <div className="p-4 border-t border-dark-600">
        <Link 
          to="/configuracoes" 
          className="flex items-center text-muted-foreground hover:text-white"
        >
          <i className="ri-settings-3-line mr-3"></i>
          <span>Configurações</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
