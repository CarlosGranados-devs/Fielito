export type Role = "merchant" | "customer";

export type BusinessCategory = "cafe" | "comida" | "servicios";

export type Plan = "free" | "pro";

export type BrandColor =
  | "amber"
  | "indigo"
  | "rose"
  | "sky"
  | "violet"
  | "emerald";

export interface Profile {
  id: string;
  role: Role;
  fullName: string;
  email: string;
  phone?: string;
  avatarEmoji?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: BusinessCategory;
  latitude: number;
  longitude: number;
  requiredStamps: number;
  rewardDescription: string;
  address: string;
  phone?: string;
  logoEmoji: string;
  brandColor: BrandColor;
  plan: Plan;
  createdAt: string;
}

export interface LoyaltyCard {
  id: string;
  customerId: string;
  businessId: string;
  currentStamps: number;
  isCompleted: boolean;
  rewardsRedeemed: number;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "stamp_added" | "reward_claimed";

export interface Transaction {
  id: string;
  cardId: string;
  businessId: string;
  customerId: string;
  scanDate: string;
  type: TransactionType;
}

export interface Session {
  profileId: string;
  role: Role;
}

export interface AppState {
  version: number;
  profiles: Profile[];
  businesses: Business[];
  cards: LoyaltyCard[];
  transactions: Transaction[];
  session: Session | null;
}

export interface ScanResult {
  card: LoyaltyCard;
  business: Business;
  completed: boolean;
  stampsAfter: number;
}

export interface MerchantOnboardingInput {
  businessName: string;
  category: BusinessCategory;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  requiredStamps: number;
  rewardDescription: string;
  logoEmoji: string;
  brandColor: BrandColor;
}

export const CATEGORY_META: Record<
  BusinessCategory,
  { label: string; emoji: string; hint: string }
> = {
  cafe: { label: "Café", emoji: "☕", hint: "Cafeterías, panaderías y postres" },
  comida: { label: "Comida", emoji: "🫓", hint: "Pupuserías, restaurantes y food trucks" },
  servicios: { label: "Servicios", emoji: "✨", hint: "Car wash, barberías y spas" },
};

export const BRAND_COLORS: BrandColor[] = [
  "amber",
  "indigo",
  "rose",
  "sky",
  "violet",
  "emerald",
];

export const BRAND_GRADIENTS: Record<BrandColor, string> = {
  amber: "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
  indigo: "from-[#4F46E5] via-[#6366F1] to-[#A5B4FC]",
  rose: "from-[#E11D48] via-[#FB7185] to-[#FECDD3]",
  sky: "from-[#0284C7] via-[#38BDF8] to-[#BAE6FD]",
  violet: "from-[#7C3AED] via-[#A78BFA] to-[#DDD6FE]",
  emerald: "from-[#059669] via-[#34D399] to-[#A7F3D0]",
};

export const BRAND_SOLIDS: Record<BrandColor, string> = {
  amber: "#F59E0B",
  indigo: "#4F46E5",
  rose: "#E11D48",
  sky: "#0284C7",
  violet: "#7C3AED",
  emerald: "#059669",
};
