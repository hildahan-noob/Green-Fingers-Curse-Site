export interface PlantProduct {
  id: string;
  name: string;
  botanicalName?: string;
  family?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string; // e.g. 'Pet Safe', 'Large Plants', 'Succulents', 'Air Purifying', 'Low Light'
  isNew?: boolean;
  isBeginnerFriendly?: boolean;
  isAirPurifying?: boolean;
  isLowLight?: boolean;
  careDetails?: {
    wateringIntervalDays: number;
    daysUntilWatering: number;
    fertilizeIntervalDays: number;
    daysUntilFertilize: number;
    lightLevel: string;
    humidity: string;
    temperature: string;
    soilMoisturePercent: number;
    status: 'Thriving' | 'Needs Water' | 'Dormant' | 'Repotted';
  };
}

export interface CuratedCollection {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  imageUrl: string;
  filterType: 'beginner' | 'air-purifying' | 'low-light';
}

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
}

export interface Voucher {
  id: string;
  discount: number;
  minSpend: number;
  type: string; // e.g. 'Storewide'
  isCollected: boolean;
  code: string;
}

export interface CareLogEntry {
  id: string;
  plantId: string;
  dateDay: string; // e.g. '24'
  dateMonth: string; // e.g. 'OCT'
  fullDate: string; // e.g. '2026-10-24'
  title: string;
  tagType: 'Note' | 'Action' | 'Nutrition' | 'Pruning';
  content: string;
  imageUrl?: string;
}

export interface CartItem {
  product: PlantProduct;
  quantity: number;
}

export type ActiveTab = 'store' | 'journal' | 'savings' | 'chat' | 'tasks';
