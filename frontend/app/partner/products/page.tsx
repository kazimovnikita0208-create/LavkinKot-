'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  Loader2,
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ImageUpload } from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { usePartnerProducts } from '@/hooks';
import { Product, CreateProductData, uploadApi } from '@/lib/api';

export default function PartnerProductsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { products, isLoading: productsLoading, createProduct, updateProduct, deleteProduct, refetch } = usePartnerProducts({ 
    category: selectedCategory, 
    search: searchQuery || undefined 
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    category: '',
    price: 0,
    weight: '',
    description: '',
  });

  // Получаем уникальные категории из товаров
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))].filter(Boolean);
    return cats;
  }, [products]);

  // Проверка роли
  if (!authLoading && user?.role !== 'partner') {
    router.push('/partner');
    return null;
  }

  const isLoading = authLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
        backgroundColor: '#1A2F3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedBackground />
        <Loader2 style={{ width: 48, height: 48, color: '#F4A261', animation: 'spin 1s linear infinite' }} />
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: categories[0] || '',
      price: 0,
      weight: '',
      description: '',
      image_url: '',
      old_price: undefined,
      in_stock: true,
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      old_price: product.old_price || undefined,
      weight: product.weight || '',
      description: product.description || '',
      image_url: product.image_url || undefined,
      in_stock: product.in_stock,
    });
    setShowEditModal(true);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price) return;
    
    setIsSubmitting(true);
    try {
      await createProduct(formData);
      setShowAddModal(false);
    } catch (err) {
      console.error('Create product error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    
    console.log('handleUpdate called with formData:', JSON.stringify(formData, null, 2));
    
    setIsSubmitting(true);
    try {
      await updateProduct(selectedProduct.id, formData);
      setShowEditModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Update product error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Удалить товар?')) return;
    
    try {
      await deleteProduct(productId);
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="w-full max-w-[375px] min-h-screen mx-auto" style={{ 
      backgroundColor: '#1A2F3A', 
      position: 'relative',
      paddingBottom: 16,
    }}>
      <AnimatedBackground />

      {/* HEADER */}
      <header style={{ 
        padding: '14px 16px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        background: 'linear-gradient(180deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => router.push('/partner')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(45, 79, 94, 0.5)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Товары</h1>

          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ЛавкинКот" style={{ height: 48, width: 'auto' }} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Поиск и фильтры */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск товаров..."
          style={{
            width: '100%',
            background: 'rgba(45, 79, 94, 0.6)',
            border: '1px solid rgba(244, 162, 97, 0.25)',
            borderRadius: 12,
            padding: '12px 14px',
            fontSize: 14,
            color: '#FFFFFF',
            marginBottom: 12,
            outline: 'none',
          }}
        />

        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedCategory(undefined)}
              style={{
                background: !selectedCategory
                  ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                  : 'rgba(45, 79, 94, 0.5)',
                border: !selectedCategory ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
                borderRadius: 10,
                padding: '8px 14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: !selectedCategory ? '#F4A261' : '#94A3B8' }}>
                Все
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat
                    ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                    : 'rgba(45, 79, 94, 0.5)',
                  border: selectedCategory === cat ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
                  borderRadius: 10,
                  padding: '8px 14px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: selectedCategory === cat ? '#F4A261' : '#94A3B8' }}>
                  {cat}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Кнопка добавления */}
        <button
          onClick={handleOpenAddModal}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
            border: '1px solid rgba(244, 162, 97, 0.4)',
            borderRadius: 14,
            padding: '14px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Plus style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          <span style={{ fontSize: 15, fontWeight: 800, color: '#F4A261' }}>Добавить товар</span>
        </button>

        {/* Список товаров */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredProducts.length === 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
              borderRadius: 16,
              padding: '40px 20px',
              textAlign: 'center',
              border: '1px solid rgba(244, 162, 97, 0.2)',
            }}>
              <Package style={{ width: 48, height: 48, color: '#94A3B8', margin: '0 auto 12px' }} strokeWidth={1.5} />
              <p style={{ fontSize: 15, color: '#94A3B8', fontWeight: 600 }}>Нет товаров</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                  border: '1px solid rgba(244, 162, 97, 0.2)',
                  borderRadius: 14,
                  padding: 12,
                }}
              >
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/80'}
                    alt={product.name}
                    style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>
                      {product.category} {product.weight ? `• ${product.weight}` : ''}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#F4A261' }}>
                        {product.price}₽
                      </span>
                      {product.old_price && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textDecoration: 'line-through' }}>
                          {product.old_price}₽
                        </span>
                      )}
                      {!product.in_stock && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginLeft: 8 }}>
                          Нет в наличии
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleOpenEditModal(product)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.15) 100%)',
                      border: '1px solid rgba(33, 150, 243, 0.4)',
                      borderRadius: 10,
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Edit style={{ width: 16, height: 16, color: '#2196F3' }} strokeWidth={2.5} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#2196F3' }}>Редактировать</span>
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: 10,
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 style={{ width: 16, height: 16, color: '#EF4444' }} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Модальное окно добавления товара */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          overflowY: 'auto',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 343,
            background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
            borderRadius: 24,
            padding: 24,
            border: '1px solid rgba(244, 162, 97, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 19, fontWeight: 900, color: '#FFFFFF' }}>Новый товар</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: 18, height: 18, color: '#EF4444' }} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {/* Изображение товара */}
              <ImageUpload
                label="Изображение товара"
                currentImage={formData.image_url}
                height={120}
                placeholder="Загрузите изображение товара"
                onUpload={async (file) => {
                  const response = await uploadApi.uploadProductImage(file);
                  if (response.success && response.data) {
                    const url = response.data.url;
                    setFormData(prev => ({ ...prev, image_url: url }));
                    return url;
                  }
                  throw new Error('Ошибка загрузки');
                }}
                onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
              />

              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Название товара"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />

              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Категория"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="Цена"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'rgba(45, 79, 94, 0.6)',
                    border: '1px solid rgba(244, 162, 97, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <input
                  type="number"
                  value={formData.old_price || ''}
                  onChange={(e) => setFormData({ ...formData, old_price: Number(e.target.value) || undefined })}
                  placeholder="Старая цена"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'rgba(45, 79, 94, 0.6)',
                    border: '1px solid rgba(244, 162, 97, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <input
                type="text"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Вес (например: 300 г)"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />

              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание товара"
                style={{
                  width: '100%',
                  minHeight: 80,
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  background: 'rgba(45, 79, 94, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>Отмена</span>
              </button>

              <button
                onClick={handleAdd}
                disabled={!formData.name || !formData.price || isSubmitting}
                style={{
                  flex: 1,
                  background: (formData.name && formData.price && !isSubmitting)
                    ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                    : 'rgba(45, 79, 94, 0.5)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: (formData.name && formData.price && !isSubmitting) ? 'pointer' : 'not-allowed',
                  opacity: (formData.name && formData.price && !isSubmitting) ? 1 : 0.5,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                  {isSubmitting ? 'Добавление...' : 'Добавить'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования товара */}
      {showEditModal && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          overflowY: 'auto',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 343,
            background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
            borderRadius: 24,
            padding: 24,
            border: '1px solid rgba(244, 162, 97, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 19, fontWeight: 900, color: '#FFFFFF' }}>Редактировать товар</h2>
              <button
                onClick={() => { setShowEditModal(false); setSelectedProduct(null); }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: 18, height: 18, color: '#EF4444' }} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {/* Изображение товара */}
              <ImageUpload
                label="Изображение товара"
                currentImage={formData.image_url}
                height={120}
                placeholder="Загрузите изображение товара"
                onUpload={async (file) => {
                  const response = await uploadApi.uploadProductImage(file);
                  if (response.success && response.data) {
                    const url = response.data.url;
                    setFormData(prev => ({ ...prev, image_url: url }));
                    return url;
                  }
                  throw new Error('Ошибка загрузки');
                }}
                onRemove={() => setFormData(prev => ({ ...prev, image_url: '' }))}
              />

              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Название товара"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />

              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Категория"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="Цена"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'rgba(45, 79, 94, 0.6)',
                    border: '1px solid rgba(244, 162, 97, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <input
                  type="number"
                  value={formData.old_price || ''}
                  onChange={(e) => setFormData({ ...formData, old_price: Number(e.target.value) || undefined })}
                  placeholder="Старая цена"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: 'rgba(45, 79, 94, 0.6)',
                    border: '1px solid rgba(244, 162, 97, 0.25)',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    color: '#FFFFFF',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <input
                type="text"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Вес"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />

              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание товара"
                style={{
                  width: '100%',
                  minHeight: 80,
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.in_stock !== false}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  style={{ width: 18, height: 18 }}
                />
                <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 600 }}>В наличии</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setShowEditModal(false); setSelectedProduct(null); }}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  background: 'rgba(45, 79, 94, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: '#94A3B8' }}>Отмена</span>
              </button>

              <button
                onClick={handleUpdate}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  background: isSubmitting
                    ? 'rgba(45, 79, 94, 0.5)'
                    : 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF' }}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
