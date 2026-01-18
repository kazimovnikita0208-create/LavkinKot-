'use client';

import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  totalPrice: number;
  onClick?: () => void;
}

export function FloatingCartButton({
  itemCount,
  totalPrice,
  onClick,
}: FloatingCartButtonProps) {
  if (itemCount === 0) return null;

  const formatted = new Intl.NumberFormat('ru-RU').format(totalPrice);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none pb-5">
      <div className="w-full max-w-[375px] px-4 pointer-events-auto">
        <button
          onClick={onClick}
          className="w-full bg-[#F4A261] text-white py-3.5 px-5 rounded-full flex items-center justify-between active:scale-[0.98] transition-transform"
          style={{ boxShadow: '0 6px 20px rgba(244,162,97,0.45)' }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" strokeWidth={2} />
            <span className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-[12px] font-bold">
              {itemCount}
            </span>
          </div>
          <span className="font-semibold text-[14px]">Корзина</span>
          <span className="font-semibold text-[14px]">{formatted}₽</span>
        </button>
      </div>
    </div>
  );
}
