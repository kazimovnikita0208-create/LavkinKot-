'use client';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

const categories: Category[] = [
  { 
    id: 'fruits', 
    name: 'Фрукты', 
    imageUrl: 'https://picsum.photos/seed/fruits/200/280'
  },
  { 
    id: 'bakery', 
    name: 'Выпечка', 
    imageUrl: 'https://picsum.photos/seed/bakery/200/280'
  },
  { 
    id: 'frozen', 
    name: 'Полуфабрикаты', 
    imageUrl: 'https://picsum.photos/seed/frozen/200/280'
  },
  { 
    id: 'sushi', 
    name: 'Суши и роллы', 
    imageUrl: 'https://picsum.photos/seed/sushi/200/280'
  },
];

interface Props {
  onCategoryClick?: (id: string) => void;
}

export function ProductCategoriesRow({ onCategoryClick }: Props) {
  return (
    <section>
      <h3 className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
        Категории товаров
      </h3>
      
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick?.(cat.id)}
            className="flex-shrink-0 w-[70px] h-[90px] rounded-xl overflow-hidden relative active:scale-[0.96] transition-transform"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {/* Image */}
            <img
              src={cat.imageUrl}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Text */}
            <span className="absolute bottom-2 left-2 right-1 text-white text-[10px] font-semibold leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
