export interface Machine {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  location: string;
  category: string;
  description: string;
  hoursUsed?: number;
  controller?: string;
  pumpSystem?: string;
  thumbnail: string;
  gallery: string[];
  isRecommended?: boolean;
  isVerified?: boolean;
  isOfficial?: boolean;
  specs: { [key: string]: string };
}

export interface TradingItem extends Machine {
  tradingStatus:
  | "available"
  | "reserved"
  | "sold"
  | "預約看機"
  | "上架中"
  | string;
  inspectionScore: number;
}

