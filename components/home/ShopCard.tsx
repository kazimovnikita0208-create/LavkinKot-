'use client';

import { Star, Clock } from 'lucide-react';

export interface Shop {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string;
}

interface Props {
  shop: Shop;
  onClick?: () => void;
}

export function ShopCard({ shop, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      {/* Image */}
      <div className="h-[100px] w-full overflow-hidden">
        <img
          src={shop.imageUrl}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-[14px] text-[#1A1A2E] mb-0.5 leading-tight">
          {shop.name}
        </h3>
        <p className="text-[12px] text-[#6B7280] mb-2">
          {shop.category}
        </p>
        <div className="flex items-center gap-3 text-[12px]">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#F4A261] fill-[#F4A261]" />
            <span className="font-semibold text-[#1A1A2E]">{shop.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[#6B7280]">
            <Clock className="w-3.5 h-3.5" />
            <span>{shop.deliveryTime}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
