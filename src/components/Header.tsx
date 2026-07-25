import React from 'react';
import { ChevronLeft, ShoppingCart, MoreHorizontal, ChevronRight, ArrowLeft, User, Search, Store } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  selectedStoreCategory: string;
  onSelectStoreCategory: (cat: string) => void;
  onBackToStore?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  isFollowing,
  onToggleFollow,
  selectedStoreCategory,
  onSelectStoreCategory,
  onBackToStore,
}) => {
  if (activeTab === 'journal') {
    return (
      <header className="bg-white dark:bg-[#1f2121] w-full sticky top-0 z-50 border-b border-[#e4bdc2]/40 shadow-xs flex justify-between items-center px-4 h-16 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform text-[#5f5e5e] cursor-pointer"
            title="Back to Store"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b80049] text-xl">potted_plant</span>
            <h1 className="font-bold text-lg text-[#b80049] tracking-tight">Care Journal</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenCart}
            className="relative p-2 rounded-full hover:bg-black/5 transition-colors text-[#1a1c1c] cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 text-[#b80049]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#b80049] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          <div className="p-1 rounded-full text-[#b80049] hover:bg-black/5 cursor-pointer">
            <User className="w-6 h-6" />
          </div>
        </div>
      </header>
    );
  }

  // Store View Header matching exact Magenta theme and Noi Gardens design
  const storeSubTabs = ['Store', 'PAYDAY', 'New', 'LazFlash', 'Impress'];

  return (
    <header className="sticky top-0 z-50 bg-[#e91e63] text-white flex flex-col pt-2 shadow-md">
      {/* Search & Top Action Bar */}
      <div className="flex items-center justify-between px-4 h-12 gap-2">
        <div className="flex items-center gap-2 flex-1">
          <button 
            onClick={onBackToStore} 
            className="p-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search in shop | caudex"
              className="w-full h-8 rounded-xs bg-white pl-8 pr-3 text-xs text-[#1a1c1c] placeholder:text-gray-400 outline-none shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-2">
          <button 
            onClick={onOpenCart}
            className="relative p-1 text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-white text-[#e91e63] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-[#e91e63]">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
          <button className="p-1 text-white hover:bg-white/10 rounded-full cursor-pointer">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Brand & Store Information Banner */}
      <div className="flex items-center px-4 py-3 gap-3">
        <div className="w-12 h-12 bg-white rounded-xs flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1">
          <div className="text-[10px] text-[#e91e63] text-center font-extrabold leading-tight tracking-tight uppercase">
            Noi<br />Gardens
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-base tracking-tight">Noi Gardens</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
          <div className="text-white/90 text-[11px] font-medium">95% Seller Ratings • Premium Botanical Boutique</div>
        </div>
        <button
          onClick={onToggleFollow}
          className={`border border-white px-3.5 py-1 rounded-xs text-xs font-bold transition-all cursor-pointer ${
            isFollowing ? 'bg-white text-[#e91e63]' : 'bg-transparent text-white hover:bg-white/10'
          }`}
        >
          {isFollowing ? 'Following ✓' : 'Following'}
        </button>
      </div>

      {/* Store Sub-Navigation Tabs */}
      <div className="flex justify-around py-2 text-white/90 text-xs font-medium border-t border-white/15 bg-black/5">
        {storeSubTabs.map((tab) => {
          const isActive = selectedStoreCategory === tab;
          return (
            <button
              key={tab}
              onClick={() => onSelectStoreCategory(tab)}
              className={`pb-1 cursor-pointer transition-all ${
                isActive ? 'font-bold text-white border-b-2 border-white' : 'hover:text-white text-white/80'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </header>
  );
};
