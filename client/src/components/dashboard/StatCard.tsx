import React from 'react';

interface StatCardProps {
  icon: string;
  iconClass: string;
  bgClass: string;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconClass, bgClass, title, value }) => {
  return (
    <div className="bg-card p-4 rounded-lg border border-dark-600">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bgClass} mr-4`}>
          <i className={`${icon} text-xl ${iconClass}`}></i>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
