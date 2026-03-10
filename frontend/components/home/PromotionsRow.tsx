'use client';

interface Promo {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  imageUrl: string;
}

const promos: Promo[] = [
  {
    id: '1',
    title: 'Скидка на суши',
    subtitle: 'Суши-бар Токио',
    discount: '-30%',
    imageUrl: 'https://picsum.photos/seed/promo1/400/300',
  },
  {
    id: '2',
    title: 'Свежая выпечка',
    subtitle: 'Пекарня Хлебница',
    discount: '-25%',
    imageUrl: 'https://picsum.photos/seed/promo2/400/300',
  },
  {
    id: '3',
    title: 'Фрукты недели',
    subtitle: 'Фруктовый рай',
    discount: '-20%',
    imageUrl: 'https://picsum.photos/seed/promo3/400/300',
  },
];

interface Props {
  onPromotionClick?: (id: string) => void;
}

export function PromotionsRow({ onPromotionClick }: Props) {
  return (
    <section>
      <h2 className="text-[17px] font-bold text-[#1A1A2E] mb-2">
        Акции
      </h2>
      
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
        {promos.map((promo) => (
          <button
            key={promo.id}
            onClick={() => onPromotionClick?.(promo.id)}
            className="flex-shrink-0 w-[200px] h-[120px] rounded-2xl overflow-hidden relative active:scale-[0.98] transition-transform"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}
          >
            {/* Image */}
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Badge */}
            <div className="absolute top-2 right-2 bg-[#F4A261] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {promo.discount}
            </div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white/70 text-[10px] mb-0.5">{promo.subtitle}</p>
              <h3 className="text-white font-bold text-[13px] leading-tight">{promo.title}</h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
