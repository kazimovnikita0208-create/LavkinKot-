'use client';

import { User } from 'lucide-react';

interface ProfileButtonProps {
  onClick?: () => void;
}

export function ProfileButton({ onClick }: ProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center flex-shrink-0"
      aria-label="Профиль"
    >
      <User className="w-6 h-6 text-[#26495C]" strokeWidth={1.5} />
    </button>
  );
}
