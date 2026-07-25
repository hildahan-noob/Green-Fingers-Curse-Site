import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Star, Plus, Check } from 'lucide-react';
import { PlantProduct, CuratedCollection, CategoryItem, Voucher } from '../types';

interface StoreViewProps {
  collections: CuratedCollection[];
  categories: CategoryItem[];
  products: PlantProduct[];
  vouchers: Voucher[];
  searchQuery: string;
  onCollectVoucher: (voucherId: string) => void;
  onCollectAllVouchers: () => void;
  onAddToCart: (product: PlantProduct) => void;
  onSelectPlant: (product: PlantProduct) => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  collections,
  categories,
  products,
  vouchers,
  searchQuery,
  onCollectVoucher,
  onCollectAllVouchers,
  onAddToCart,
  onSelectPlant,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | null>(null);
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});

  // Filter products based on search, collection filter, or category filter
  const filteredProducts = products.filter((p) => {
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.botanicalName && p.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesCategory = selectedCategoryFilter
      ? p.category.toLowerCase() === selectedCategoryFilter.toLowerCase()
      : true;

    let matchesCollection = true;
    if (selectedCollectionFilter === 'beginner') matchesCollection = !!p.isBeginnerFriendly;
    if (selectedCollectionFilter === 'air-purifying') matchesCollection = !!p.isAirPurifying;
    if (selectedCollectionFilter === 'low-light') matchesCollection = !!p.isLowLight;

    return matchesSearch && matchesCategory && matchesCollection;
  });

  const handleAddClick = (e: React.MouseEvent, product: PlantProduct) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedProductIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-28">
      {/* Active Filter Bar if filtered */}
      {(selectedCategoryFilter || selectedCollectionFilter) && (
        <div className="mb-4 flex items-center justify-between bg-pink-50 p-3 rounded-xl border border-pink-200">
          <div className="text-xs text-[#e91e63] font-bold">
            Filtering by:{' '}
            <span className="capitalize">
              {selectedCategoryFilter || selectedCollectionFilter?.replace('-', ' ')}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setSelectedCollectionFilter(null);
            }}
            className="text-xs text-[#e91e63] underline font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Featured Collections (Bento Grid) */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-bold text-xl text-[#1a1c1c]">Curated Collections</h2>
            <p className="text-xs text-gray-500">Tailored for your specific environment</p>
          </div>
          <button
            onClick={() => {
              setSelectedCollectionFilter(null);
              setSelectedCategoryFilter(null);
            }}
            className="text-xs font-bold text-[#b80049] flex items-center hover:underline cursor-pointer"
          >
            View all <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Beginner Friendly Card */}
          {collections[0] && (
            <div
              onClick={() =>
                setSelectedCollectionFilter(
                  selectedCollectionFilter === 'beginner' ? null : 'beginner'
                )
              }
              className={`col-span-2 group cursor-pointer rounded-xl overflow-hidden relative h-48 bg-gray-100 border transition-all ${
                selectedCollectionFilter === 'beginner'
                  ? 'ring-2 ring-[#e91e63] shadow-lg'
                  : 'border-[#e4bdc2]/60 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img
                src={collections[0].imageUrl}
                alt={collections[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <span className="inline-block px-2.5 py-1 bg-[#b80049] text-white font-semibold text-[11px] rounded-md mb-2 shadow-sm">
                  {collections[0].tag || 'Beginner Friendly'}
                </span>
                <h3 className="font-bold text-lg text-white">{collections[0].title}</h3>
                <p className="text-xs text-white/80">{collections[0].subtitle}</p>
              </div>
            </div>
          )}

          {/* Air Purifying Card */}
          {collections[1] && (
            <div
              onClick={() =>
                setSelectedCollectionFilter(
                  selectedCollectionFilter === 'air-purifying' ? null : 'air-purifying'
                )
              }
              className={`col-span-1 group cursor-pointer rounded-xl overflow-hidden relative h-48 bg-gray-100 border transition-all ${
                selectedCollectionFilter === 'air-purifying'
                  ? 'ring-2 ring-[#e91e63] shadow-lg'
                  : 'border-[#e4bdc2]/60 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img
                src={collections[1].imageUrl}
                alt={collections[1].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="font-bold text-base text-white">{collections[1].title}</h3>
                <p className="text-xs text-white/80">{collections[1].subtitle}</p>
              </div>
            </div>
          )}

          {/* Low Light Card */}
          {collections[2] && (
            <div
              onClick={() =>
                setSelectedCollectionFilter(
                  selectedCollectionFilter === 'low-light' ? null : 'low-light'
                )
              }
              className={`col-span-1 group cursor-pointer rounded-xl overflow-hidden relative h-48 bg-gray-100 border transition-all ${
                selectedCollectionFilter === 'low-light'
                  ? 'ring-2 ring-[#e91e63] shadow-lg'
                  : 'border-[#e4bdc2]/60 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <img
                src={collections[2].imageUrl}
                alt={collections[2].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="font-bold text-base text-white">{collections[2].title}</h3>
                <p className="text-xs text-white/80">{collections[2].subtitle}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mb-8">
        <h2 className="font-bold text-xl text-[#1a1c1c] mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(isSelected ? null : cat.name)}
                className={`bg-white border rounded-xl p-4 flex flex-col items-center text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#e91e63] bg-pink-50/50 shadow-md ring-2 ring-[#e91e63]/20'
                    : 'border-[#e2e2e2] hover:shadow-md'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#e2dfde] flex items-center justify-center mb-2.5 group-hover:bg-[#e2165f]/15 transition-colors">
                  <span className="material-symbols-outlined text-[#b80049] text-2xl">{cat.icon}</span>
                </div>
                <span className="font-bold text-xs text-[#1a1c1c] mb-0.5">{cat.name}</span>
                <span className="text-[11px] text-[#5b3f43] italic">{cat.subtitle}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vouchers Section */}
      <section className="mb-8 bg-white p-4.5 rounded-xl border border-[#e2e2e2] shadow-xs">
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e91e63]">confirmation_number</span>
            <h2 className="font-bold text-lg text-[#1a1c1c]">Vouchers</h2>
          </div>
          <button
            onClick={onCollectAllVouchers}
            className="text-[#e91e63] font-bold text-xs hover:underline cursor-pointer"
          >
            Collect All
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="flex-shrink-0 w-64 border border-pink-100 rounded-lg flex overflow-hidden bg-white shadow-2xs"
            >
              <div className="bg-pink-50/90 p-3.5 flex flex-col justify-center items-center border-r border-dashed border-pink-200 min-w-[90px]">
                <span className="text-[#e91e63] font-extrabold text-2xl">${voucher.discount}</span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  Min. spend ${voucher.minSpend}
                </span>
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="text-xs font-bold text-[#1a1c1c]">{voucher.type}</div>
                <button
                  onClick={() => onCollectVoucher(voucher.id)}
                  className={`text-[10px] py-1 rounded-xs font-bold transition-all cursor-pointer ${
                    voucher.isCollected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#e91e63] hover:bg-[#b80049] text-white'
                  }`}
                >
                  {voucher.isCollected ? 'COLLECTED ✓' : 'COLLECT'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals Showcase */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-[#1a1c1c]">New Arrivals</h2>
          <button
            onClick={() => {
              setSelectedCategoryFilter(null);
              setSelectedCollectionFilter(null);
            }}
            className="text-xs font-bold text-[#b80049] flex items-center hover:underline cursor-pointer"
          >
            Discover More <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">No plants match your selected filter.</p>
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSelectedCollectionFilter(null);
              }}
              className="text-xs font-bold text-[#e91e63] underline"
            >
              Show all plants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedProductIds[product.id];
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectPlant(product)}
                  className="bg-white rounded-xl overflow-hidden border border-[#e2e2e2] group cursor-pointer hover:border-[#e91e63]/40 hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-[#b80049] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                        New
                      </span>
                    )}
                    {product.isBeginnerFriendly && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                        Easy Care
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1a1c1c] line-clamp-1">{product.name}</h4>
                      <p className="text-[11px] text-gray-400 italic mb-1">{product.botanicalName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 fill-[#b80049] text-[#b80049]" />
                        <span className="text-xs text-[#5b3f43] font-medium">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                      <span className="text-lg font-extrabold text-[#b80049]">${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => handleAddClick(e, product)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 border-emerald-600 text-white scale-110'
                            : 'border-[#b80049] text-[#b80049] hover:bg-[#b80049] hover:text-white'
                        }`}
                        title="Add to Cart"
                      >
                        {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
