import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [_, setLocation] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown quando clicamos fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setLocation('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="md:hidden bg-card border-b border-dark-600 p-4 flex items-center justify-between">
      <button 
        className="text-white" 
        onClick={onMenuClick}
      >
        <i className="ri-menu-line text-xl"></i>
      </button>
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <i className="ri-boxing-fill text-base-base"></i>
        <span>VibeBoxing</span>
      </h1>
      
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={toggleDropdown} 
          className="flex items-center text-white"
        >
          <div className="w-8 h-8 rounded-full bg-base-dark/50 flex items-center justify-center">
            <i className="ri-user-line"></i>
          </div>
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg overflow-hidden z-50 border border-dark-600">
            <div className="p-3 border-b border-dark-600">
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <ul>
              <li>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    setLocation('/perfil');
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:bg-secondary flex items-center"
                >
                  <i className="ri-user-settings-line mr-2"></i>
                  Perfil
                </button>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-ataques-base hover:bg-secondary flex items-center"
                >
                  <i className="ri-logout-box-line mr-2"></i>
                  Sair
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
