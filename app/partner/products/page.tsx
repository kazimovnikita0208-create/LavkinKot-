'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  Grid,
  Image as ImageIcon,
  DollarSign,
  Upload
} from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';

interface Category {
  id: string;
  name: string;
  productsCount: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  weight: string;
  image: string;
  description: string;
  inStock: boolean;
}

export default function PartnerProductsPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Хлеб', productsCount: 12 },
    { id: '2', name: 'Выпечка', productsCount: 18 },
    { id: '3', name: 'Торты', productsCount: 8 },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Багет французский',
      category: 'Хлеб',
      price: 120,
      oldPrice: 150,
      weight: '300 г',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      description: 'Свежий французский багет',
      inStock: true,
    },
    {
      id: '2',
      name: 'Круассан с шоколадом',
      category: 'Выпечка',
      price: 85,
      weight: '80 г',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300',
      description: 'Воздушный круассан с шоколадной начинкой',
      inStock: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: categories[0]?.name || '',
    price: '',
    oldPrice: '',
    weight: '',
    description: '',
    image: '',
  });

  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const category: Category = {
        id: String(categories.length + 1),
        name: newCategoryName.trim(),
        productsCount: 0,
      };
      setCategories([...categories, category]);
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleAddProduct = () => {
    if (newProduct.name.trim() && newProduct.price && newProduct.weight) {
      const product: Product = {
        id: String(products.length + 1),
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        weight: newProduct.weight,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
        description: newProduct.description,
        inStock: true,
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', category: categories[0]?.name || '', price: '', oldPrice: '', weight: '', description: '', image: '' });
      setShowAddProductModal(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(prod => prod.id !== id));
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditImagePreview(product.image);
    setShowEditProductModal(true);
  };

  const handleSaveEditProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
      setShowEditProductModal(false);
      setSelectedProduct(null);
      setEditImagePreview('');
    }
  };

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
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(244, 162, 97, 0.15)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
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
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 162, 97, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 79, 94, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(45, 79, 94, 0.5)';
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
          </button>

          <h1 style={{
            fontSize: 20,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}>
            Товары
          </h1>

          <button
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.filter = 'drop-shadow(0 2px 8px rgba(244, 162, 97, 0.4))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(244, 162, 97, 0.2))';
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="ЛавкинКот" 
              style={{ 
                height: 48,
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 10, padding: '0 16px 16px' }}>
        
        {/* Табы */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              flex: 1,
              background: activeTab === 'products'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: activeTab === 'products' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Package style={{ width: 18, height: 18, color: activeTab === 'products' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: activeTab === 'products' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Товары ({products.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              flex: 1,
              background: activeTab === 'categories'
                ? 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)'
                : 'rgba(45, 79, 94, 0.5)',
              border: activeTab === 'categories' ? '1px solid rgba(244, 162, 97, 0.4)' : '1px solid rgba(244, 162, 97, 0.1)',
              borderRadius: 12,
              padding: '12px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Grid style={{ width: 18, height: 18, color: activeTab === 'categories' ? '#F4A261' : '#94A3B8' }} strokeWidth={2.5} />
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: activeTab === 'categories' ? '#F4A261' : '#94A3B8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}>
              Категории ({categories.length})
            </span>
          </button>
        </div>

        {/* Содержимое вкладки "Товары" */}
        {activeTab === 'products' && (
          <>
            <button
              onClick={() => setShowAddProductModal(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.4)',
                borderRadius: 14,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.15)';
              }}
            >
              <Plus style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
              <span style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#F4A261',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Добавить товар
              </span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 14,
                    padding: 12,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        marginBottom: 4,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {product.name}
                      </h3>
                      <p style={{
                        fontSize: 11,
                        color: '#94A3B8',
                        fontWeight: 600,
                        marginBottom: 4,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        {product.category} • {product.weight}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: '#F4A261',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        }}>
                          {product.price}₽
                        </span>
                        {product.oldPrice && (
                          <span style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#94A3B8',
                            textDecoration: 'line-through',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                          }}>
                            {product.oldPrice}₽
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.15) 100%)',
                        border: '1px solid rgba(33, 150, 243, 0.4)',
                        borderRadius: 10,
                        padding: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Edit style={{ width: 16, height: 16, color: '#2196F3' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#2196F3',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        Редактировать
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.15) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: 10,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Trash2 style={{ width: 16, height: 16, color: '#EF4444' }} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Содержимое вкладки "Категории" */}
        {activeTab === 'categories' && (
          <>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(244, 162, 97, 0.3) 0%, rgba(232, 149, 81, 0.2) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.4)',
                borderRadius: 14,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(244, 162, 97, 0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(244, 162, 97, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(244, 162, 97, 0.15)';
              }}
            >
              <Plus style={{ width: 20, height: 20, color: '#F4A261' }} strokeWidth={2.5} />
              <span style={{
                fontSize: 15,
                fontWeight: 800,
                color: '#F4A261',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Добавить категорию
              </span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.8) 0%, rgba(38, 73, 92, 0.7) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(244, 162, 97, 0.2)',
                    borderRadius: 14,
                    padding: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: 2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {category.name}
                    </h3>
                    <p style={{
                      fontSize: 12,
                      color: '#94A3B8',
                      fontWeight: 600,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      {category.productsCount} товаров
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: 10,
                      padding: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Trash2 style={{ width: 18, height: 18, color: '#EF4444' }} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Модальное окно добавления категории */}
      {showAddCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 343,
            background: 'linear-gradient(135deg, rgba(26, 47, 58, 0.98) 0%, rgba(26, 47, 58, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(244, 162, 97, 0.3)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{
                fontSize: 19,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Новая категория
              </h2>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName('');
                }}
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

            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Название категории"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, rgba(45, 79, 94, 0.6) 0%, rgba(38, 73, 92, 0.5) 100%)',
                border: '1px solid rgba(244, 162, 97, 0.25)',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 14,
                color: '#FFFFFF',
                fontWeight: 500,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                outline: 'none',
                marginBottom: 18,
              }}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName('');
                }}
                style={{
                  flex: 1,
                  background: 'rgba(45, 79, 94, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#94A3B8',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Отмена
                </span>
              </button>

              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                style={{
                  flex: 1,
                  background: newCategoryName.trim()
                    ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                    : 'rgba(45, 79, 94, 0.5)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: newCategoryName.trim() ? 'pointer' : 'not-allowed',
                  opacity: newCategoryName.trim() ? 1 : 0.5,
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Добавить
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления товара */}
      {showAddProductModal && (
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
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            margin: '20px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{
                fontSize: 19,
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Новый товар
              </h2>
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setNewProduct({ name: '', category: categories[0]?.name || '', price: '', oldPrice: '', weight: '', description: '', image: '' });
                  setProductImagePreview('');
                }}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {/* Загрузка изображения */}
              <div style={{
                background: 'rgba(45, 79, 94, 0.6)',
                border: '1px solid rgba(244, 162, 97, 0.25)',
                borderRadius: 12,
                padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <ImageIcon style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Изображение товара
                  </span>
                </div>

                {productImagePreview ? (
                  <div style={{ position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: 180,
                        borderRadius: 10,
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      onClick={() => {
                        setProductImagePreview('');
                        setNewProduct({ ...newProduct, image: '' });
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(239, 68, 68, 0.9)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <X style={{ width: 16, height: 16, color: '#FFFFFF' }} strokeWidth={2.5} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      // В реальном приложении здесь будет открытие file picker
                      const mockImageUrl = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300';
                      setProductImagePreview(mockImageUrl);
                      setNewProduct({ ...newProduct, image: mockImageUrl });
                    }}
                    style={{
                      width: '100%',
                      height: 120,
                      background: 'rgba(26, 47, 58, 0.7)',
                      border: '2px dashed rgba(244, 162, 97, 0.4)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(26, 47, 58, 0.9)';
                      e.currentTarget.style.borderColor = 'rgba(244, 162, 97, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(26, 47, 58, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(244, 162, 97, 0.4)';
                    }}
                  >
                    <Upload style={{ width: 32, height: 32, color: '#F4A261' }} strokeWidth={2} />
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#94A3B8',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Нажмите для загрузки
                    </span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Название товара"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <input
                  type="number"
                  value={newProduct.oldPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
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
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <input
                type="text"
                value={newProduct.weight}
                onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                placeholder="Вес (например: 300 г)"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowAddProductModal(false);
                  setNewProduct({ name: '', category: categories[0]?.name || '', price: '', oldPrice: '', weight: '', description: '', image: '' });
                  setProductImagePreview('');
                }}
                style={{
                  flex: 1,
                  background: 'rgba(45, 79, 94, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#94A3B8',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Отмена
                </span>
              </button>

              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name.trim() || !newProduct.price || !newProduct.weight}
                style={{
                  flex: 1,
                  background: (newProduct.name.trim() && newProduct.price && newProduct.weight)
                    ? 'linear-gradient(135deg, #F4A261 0%, #E89551 100%)'
                    : 'rgba(45, 79, 94, 0.5)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: (newProduct.name.trim() && newProduct.price && newProduct.weight) ? 'pointer' : 'not-allowed',
                  opacity: (newProduct.name.trim() && newProduct.price && newProduct.weight) ? 1 : 0.5,
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Добавить
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования товара */}
      {showEditProductModal && selectedProduct && (
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
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 24,
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(244, 162, 97, 0.2)',
            margin: '20px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{
                fontSize: 19,
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}>
                Редактировать товар
              </h2>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                  setEditImagePreview('');
                }}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {/* Загрузка изображения */}
              <div style={{
                background: 'rgba(45, 79, 94, 0.6)',
                border: '1px solid rgba(244, 162, 97, 0.25)',
                borderRadius: 12,
                padding: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <ImageIcon style={{ width: 18, height: 18, color: '#F4A261' }} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}>
                    Изображение товара
                  </span>
                </div>

                {editImagePreview ? (
                  <div style={{ position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: 180,
                        borderRadius: 10,
                        objectFit: 'cover',
                      }}
                    />
                    <button
                      onClick={() => {
                        const mockImageUrl = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300';
                        setEditImagePreview(mockImageUrl);
                        setSelectedProduct({ ...selectedProduct, image: mockImageUrl });
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '6px 12px',
                        borderRadius: 8,
                        background: 'rgba(244, 162, 97, 0.9)',
                        border: '1px solid rgba(244, 162, 97, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Upload style={{ width: 14, height: 14, color: '#FFFFFF' }} strokeWidth={2.5} />
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      }}>
                        Изменить
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const mockImageUrl = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300';
                      setEditImagePreview(mockImageUrl);
                      setSelectedProduct({ ...selectedProduct, image: mockImageUrl });
                    }}
                    style={{
                      width: '100%',
                      height: 120,
                      background: 'rgba(26, 47, 58, 0.7)',
                      border: '2px dashed rgba(244, 162, 97, 0.4)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Upload style={{ width: 32, height: 32, color: '#F4A261' }} strokeWidth={2} />
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#94A3B8',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    }}>
                      Нажмите для загрузки
                    </span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                placeholder="Название товара"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <select
                value={selectedProduct.category}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
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
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <input
                  type="number"
                  value={selectedProduct.oldPrice || ''}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
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
                    fontWeight: 500,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <input
                type="text"
                value={selectedProduct.weight}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, weight: e.target.value })}
                placeholder="Вес"
                style={{
                  width: '100%',
                  background: 'rgba(45, 79, 94, 0.6)',
                  border: '1px solid rgba(244, 162, 97, 0.25)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#FFFFFF',
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />

              <textarea
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
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
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                  setEditImagePreview('');
                }}
                style={{
                  flex: 1,
                  background: 'rgba(45, 79, 94, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#94A3B8',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Отмена
                </span>
              </button>

              <button
                onClick={handleSaveEditProduct}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                  border: 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}>
                  Сохранить
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
