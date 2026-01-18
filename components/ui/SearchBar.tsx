'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ placeholder = 'Поиск', onSearch }: SearchBarProps) {
  return (
    <div className="flex-1">
      <div 
        className="flex items-center bg-[#F3F4F6] rounded-xl px-3 py-2.5"
      >
        <Search className="w-4 h-4 text-[#9CA3AF] mr-2 flex-shrink-0" strokeWidth={2} />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[14px] text-[#1A1A2E] placeholder:text-[#9CA3AF]"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  );
}
