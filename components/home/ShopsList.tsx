'use client';

import { ShopCard, type Shop } from './ShopCard';

const shops: Shop[] = [
  {
    id: '1',
    name: 'Пекарня "Хлебница"',
    category: 'Выпечка · Хлеб',
    rating: 4.9,
    deliveryTime: '20-30 мин',
    imageUrl: 'https://picsum.photos/seed/shop1/400/200',
  },
  {
    id: '2',
    name: 'Фруктовый рай',
    category: 'Фрукты · Овощи',
    rating: 4.7,
    deliveryTime: '25-35 мин',
    imageUrl: 'https://picsum.photos/seed/shop2/400/200',
  },
  {
    id: '3',
    name: 'Суши-бар Токио',
    category: 'Суши · Роллы',
    rating: 4.8,
    deliveryTime: '35-45 мин',
    imageUrl: 'https://picsum.photos/seed/shop3/400/200',
  },
];

interface Props {
  onShopClick?: (id: string) => void;
}

export function ShopsList({ onShopClick }: Props) {
  return (
    <section>
      <h2 className="text-[17px] font-bold text-[#1A1A2E] mb-2">
        Топ магазины
      </h2>
      <div className="flex flex-col gap-3">
        {shops.map((shop) => (
          <ShopCard 
            key={shop.id} 
            shop={shop} 
            onClick={() => onShopClick?.(shop.id)} 
          />
        ))}
      </div>
    </section>
  );
}
