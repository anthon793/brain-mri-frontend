import React from 'react';
import { ROLE_LABELS, ROLE_COLORS } from '../../types';
import type { UserRole } from '../../types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md', showDot = true }) => {
  const colors = ROLE_COLORS[role];
  const label = ROLE_LABELS[role];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${colors.bg} ${colors.text} ${sizeClasses[size]}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
      {label}
    </span>
  );
};

export default RoleBadge;
