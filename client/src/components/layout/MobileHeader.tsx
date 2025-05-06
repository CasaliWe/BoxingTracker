import React from 'react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuClick }) => {
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
      <button className="text-white">
        <i className="ri-user-line text-xl"></i>
      </button>
    </header>
  );
};

export default MobileHeader;
