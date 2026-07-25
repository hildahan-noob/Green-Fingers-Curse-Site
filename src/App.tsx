import React, { useState } from 'react';
import {
  INITIAL_COLLECTIONS,
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_VOUCHERS,
  INITIAL_CARE_LOGS,
  EXPERT_TIPS,
} from './data/plants';
import { PlantProduct, CartItem, ActiveTab, Voucher, CareLogEntry } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StoreView } from './components/StoreView';
import { JournalView } from './components/JournalView';
import { VouchersView } from './components/VouchersView';
import { ExpertChatView } from './components/ExpertChatView';
import { TasksView } from './components/TasksView';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('store');
  const [products, setProducts] = useState<PlantProduct[]>(INITIAL_PRODUCTS);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [careLogs, setCareLogs] = useState<CareLogEntry[]>(INITIAL_CARE_LOGS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedStoreSubTab, setSelectedStoreSubTab] = useState('Store');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('monstera-deliciosa');

  // Currently viewed plant in Care Journal
  const currentPlant = products.find((p) => p.id === selectedPlantId) || products[0];

  // Cart operations
  const handleAddToCart = (product: PlantProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Voucher operations
  const handleCollectVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isCollected: !v.isCollected } : v))
    );
  };

  const handleCollectAllVouchers = () => {
    setVouchers((prev) => prev.map((v) => ({ ...v, isCollected: true })));
  };

  // Plant Care actions
  const handleWaterPlant = (plantId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === plantId && p.careDetails) {
          return {
            ...p,
            careDetails: {
              ...p.careDetails,
              daysUntilWatering: p.careDetails.wateringIntervalDays,
              soilMoisturePercent: 85,
              status: 'Thriving',
            },
          };
        }
        return p;
      })
    );

    // Add automatic care log
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const newLog: CareLogEntry = {
      id: `log-${Date.now()}`,
      plantId,
      dateDay: String(now.getDate()).padStart(2, '0'),
      dateMonth: months[now.getMonth()],
      fullDate: now.toISOString().split('T')[0],
      title: 'Watering & Moisture',
      tagType: 'Action',
      content: `Watered ${currentPlant.name} thoroughly until excess drained. Soil moisture restored to 85%.`,
    };
    setCareLogs((prev) => [newLog, ...prev]);
  };

  const handleFertilizePlant = (plantId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === plantId && p.careDetails) {
          return {
            ...p,
            careDetails: {
              ...p.careDetails,
              daysUntilFertilize: p.careDetails.fertilizeIntervalDays,
            },
          };
        }
        return p;
      })
    );

    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const newLog: CareLogEntry = {
      id: `log-${Date.now()}`,
      plantId,
      dateDay: String(now.getDate()).padStart(2, '0'),
      dateMonth: months[now.getMonth()],
      fullDate: now.toISOString().split('T')[0],
      title: 'Nutrient Feeding',
      tagType: 'Nutrition',
      content: `Applied diluted organic botanical fertilizer feed to nourish foliage development.`,
    };
    setCareLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdatePlantStatus = (
    plantId: string,
    status: 'Thriving' | 'Needs Water' | 'Dormant' | 'Repotted'
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === plantId && p.careDetails) {
          return {
            ...p,
            careDetails: {
              ...p.careDetails,
              status,
            },
          };
        }
        return p;
      })
    );
  };

  const handleAddCareLog = (newLog: CareLogEntry) => {
    setCareLogs((prev) => [newLog, ...prev]);
  };

  const handleSelectPlantForJournal = (product: PlantProduct) => {
    setSelectedPlantId(product.id);
    setActiveTab('journal');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased selection:bg-[#e91e63] selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFollowing={isFollowing}
        onToggleFollow={() => setIsFollowing(!isFollowing)}
        selectedStoreCategory={selectedStoreSubTab}
        onSelectStoreCategory={setSelectedStoreSubTab}
        onBackToStore={() => setActiveTab('store')}
      />

      {/* Main Content Body */}
      {activeTab === 'store' && (
        <StoreView
          collections={INITIAL_COLLECTIONS}
          categories={CATEGORIES}
          products={products}
          vouchers={vouchers}
          searchQuery={searchQuery}
          onCollectVoucher={handleCollectVoucher}
          onCollectAllVouchers={handleCollectAllVouchers}
          onAddToCart={handleAddToCart}
          onSelectPlant={handleSelectPlantForJournal}
        />
      )}

      {activeTab === 'journal' && (
        <JournalView
          plant={currentPlant}
          careLogs={careLogs}
          expertTips={EXPERT_TIPS}
          onAddCareLog={handleAddCareLog}
          onWaterPlant={handleWaterPlant}
          onFertilizePlant={handleFertilizePlant}
          onUpdatePlantStatus={handleUpdatePlantStatus}
          onBackToStore={() => setActiveTab('store')}
        />
      )}

      {activeTab === 'savings' && (
        <VouchersView
          vouchers={vouchers}
          onCollectVoucher={handleCollectVoucher}
          onCollectAll={handleCollectAllVouchers}
        />
      )}

      {activeTab === 'chat' && <ExpertChatView />}

      {activeTab === 'tasks' && (
        <TasksView
          products={products}
          onWaterPlant={handleWaterPlant}
          onFertilizePlant={handleFertilizePlant}
        />
      )}

      {/* Bottom Navigation Shell */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} unreadTasksCount={1} />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        vouchers={vouchers}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
