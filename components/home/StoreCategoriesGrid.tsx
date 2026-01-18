'use client';

import { Store, Croissant, Apple, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  { id: 'stores', name: 'Магазины', icon: Store, color: '#26495C', bgColor: '#EBF4F8' },
  { id: 'bakeries', name: 'Пекарни', icon: Croissant, color: '#F4A261', bgColor: '#FEF3EB' },
  { id: 'fruits', name: 'Фруктовые\nлавки', icon: Apple, color: '#26495C', bgColor: '#EBF4F8' },
  { id: 'restaurants', name: 'Рестораны', icon: UtensilsCrossed, color: '#F4A261', bgColor: '#FEF3EB' },
];

interface Props {
  onCategoryClick?: (id: string) => void;
}

export function StoreCategoriesGrid({ onCategoryClick }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryClick?.(cat.id)}
            className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 active:scale-[0.97] transition-transform"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: cat.bgColor }}
            >
              <Icon className="w-6 h-6" style={{ color: cat.color }} strokeWidth={1.5} />
            </div>
            <span className="text-[12px] font-semibold text-[#1A1A2E] text-center whitespace-pre-line leading-tight">
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
