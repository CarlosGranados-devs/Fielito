import type {
  AppState,
  Business,
  LoyaltyCard,
  Profile,
  Transaction,
} from "@/lib/types";

/**
 * Estado de demostración.
 *
 * Permite probar toda la aplicación sin credenciales de Supabase.
 * Al conectar el backend real (ver /supabase/schema.sql) este store
 * se reemplaza por las consultas de `lib/supabase`.
 */

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260411);

function dateAt(daysAgo: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

const profiles: Profile[] = [
  {
    id: "p_merchant",
    role: "merchant",
    fullName: "Carlos Granados",
    email: "carlos@cafelaesquina.sv",
    phone: "+503 7123 4567",
    avatarEmoji: "👨🏽‍💼",
    createdAt: dateAt(120, 9),
  },
  {
    id: "p_customer",
    role: "customer",
    fullName: "María López",
    email: "maria@fielito.sv",
    phone: "+503 7890 1234",
    avatarEmoji: "👩🏽",
    createdAt: dateAt(90, 18),
  },
  {
    id: "p_c2",
    role: "customer",
    fullName: "José Rivera",
    email: "jose.rivera@example.com",
    avatarEmoji: "🧑🏽",
    createdAt: dateAt(75, 11),
  },
  {
    id: "p_c3",
    role: "customer",
    fullName: "Ana Martínez",
    email: "ana.martinez@example.com",
    avatarEmoji: "👩🏽‍🦱",
    createdAt: dateAt(60, 16),
  },
  {
    id: "p_c4",
    role: "customer",
    fullName: "Luis Hernández",
    email: "luis.h@example.com",
    avatarEmoji: "👨🏽‍🦱",
    createdAt: dateAt(45, 10),
  },
  {
    id: "p_c5",
    role: "customer",
    fullName: "Gabriela Santos",
    email: "gaby.santos@example.com",
    avatarEmoji: "👩🏻",
    createdAt: dateAt(32, 12),
  },
  {
    id: "p_c6",
    role: "customer",
    fullName: "Diego Flores",
    email: "diego.flores@example.com",
    avatarEmoji: "🧔🏽",
    createdAt: dateAt(25, 19),
  },
  {
    id: "p_c7",
    role: "customer",
    fullName: "Sofía Ramírez",
    email: "sofia.ramirez@example.com",
    avatarEmoji: "👩🏽‍🦰",
    createdAt: dateAt(12, 8),
  },
  {
    id: "p_c8",
    role: "customer",
    fullName: "Roberto Aguilar",
    email: "roberto.aguilar@example.com",
    avatarEmoji: "👨🏻‍🦳",
    createdAt: dateAt(6, 17),
  },
];

const businesses: Business[] = [
  {
    id: "b_cafe",
    ownerId: "p_merchant",
    name: "Café La Esquina",
    category: "cafe",
    latitude: 13.7035,
    longitude: -89.2245,
    requiredStamps: 5,
    rewardDescription: "Un café americano gratis",
    address: "Calle La Reforma #225, San Salvador",
    phone: "+503 7123 4567",
    logoEmoji: "☕",
    brandColor: "amber",
    plan: "free",
    createdAt: dateAt(120, 9),
  },
  {
    id: "b_pupuseria",
    ownerId: "p_owner_pupuseria",
    name: "Pupusería El Buen Gusto",
    category: "comida",
    latitude: 13.6912,
    longitude: -89.2183,
    requiredStamps: 10,
    rewardDescription: "Una pupusa revuelta gratis",
    address: "Calle Arce #410, San Salvador",
    phone: "+503 7456 1122",
    logoEmoji: "🫓",
    brandColor: "rose",
    plan: "pro",
    createdAt: dateAt(200, 8),
  },
  {
    id: "b_carwash",
    ownerId: "p_owner_carwash",
    name: "Car Wash El Brillo",
    category: "servicios",
    latitude: 13.7099,
    longitude: -89.2444,
    requiredStamps: 8,
    rewardDescription: "Lavado básico gratis",
    address: "Blvd. Los Héroes #12, San Salvador",
    phone: "+503 7788 9900",
    logoEmoji: "🚙",
    brandColor: "sky",
    plan: "pro",
    createdAt: dateAt(150, 7),
  },
  {
    id: "b_panaderia",
    ownerId: "p_owner_panaderia",
    name: "Panadería Doña Tere",
    category: "cafe",
    latitude: 13.6789,
    longitude: -89.239,
    requiredStamps: 6,
    rewardDescription: "Pan dulce de cortesía",
    address: "Colonia Escalón, San Salvador",
    phone: "+503 7654 3322",
    logoEmoji: "🥐",
    brandColor: "violet",
    plan: "free",
    createdAt: dateAt(95, 6),
  },
  {
    id: "b_sushi",
    ownerId: "p_owner_sushi",
    name: "Sushi Go SV",
    category: "comida",
    latitude: 13.716,
    longitude: -89.2101,
    requiredStamps: 12,
    rewardDescription: "Roll California gratis",
    address: "Zona Rosa, San Salvador",
    phone: "+503 7001 2233",
    logoEmoji: "🍣",
    brandColor: "emerald",
    plan: "pro",
    createdAt: dateAt(80, 12),
  },
  {
    id: "b_barber",
    ownerId: "p_owner_barber",
    name: "Barbería Don Julio",
    category: "servicios",
    latitude: 13.684,
    longitude: -89.227,
    requiredStamps: 6,
    rewardDescription: "Perfilado de barba gratis",
    address: "Calle Berlín #8, San Salvador",
    phone: "+503 7222 4455",
    logoEmoji: "💈",
    brandColor: "indigo",
    plan: "free",
    createdAt: dateAt(60, 10),
  },
];

function makeCard(
  id: string,
  customerId: string,
  businessId: string,
  currentStamps: number,
  rewardsRedeemed = 0,
  daysAgo = 20,
): LoyaltyCard {
  const business = businesses.find((b) => b.id === businessId)!;
  const created = dateAt(daysAgo, 10);
  return {
    id,
    customerId,
    businessId,
    currentStamps,
    isCompleted: currentStamps >= business.requiredStamps,
    rewardsRedeemed,
    createdAt: created,
    updatedAt: dateAt(Math.max(daysAgo - 4, 0), 15),
  };
}

const cards: LoyaltyCard[] = [
  makeCard("card_cafe_maria", "p_customer", "b_cafe", 3, 1, 40),
  makeCard("card_cafe_jose", "p_c2", "b_cafe", 5, 2, 70),
  makeCard("card_cafe_ana", "p_c3", "b_cafe", 2, 0, 30),
  makeCard("card_cafe_luis", "p_c4", "b_cafe", 4, 1, 40),
  makeCard("card_cafe_gaby", "p_c5", "b_cafe", 1, 0, 18),
  makeCard("card_cafe_diego", "p_c6", "b_cafe", 5, 3, 24),
  makeCard("card_cafe_sofia", "p_c7", "b_cafe", 3, 0, 10),
  makeCard("card_cafe_roberto", "p_c8", "b_cafe", 2, 0, 5),
  makeCard("card_pupusa_maria", "p_customer", "b_pupuseria", 7, 0, 55),
  makeCard("card_carwash_maria", "p_customer", "b_carwash", 8, 2, 65),
  makeCard("card_panaderia_maria", "p_customer", "b_panaderia", 5, 0, 22),
];

const cafeCustomerIds = ["p_customer", "p_c2", "p_c3", "p_c4", "p_c5", "p_c6", "p_c7", "p_c8"];

const transactions: Transaction[] = [];

function addTransaction(
  cardId: string,
  businessId: string,
  customerId: string,
  scanDate: string,
  type: Transaction["type"] = "stamp_added",
) {
  transactions.push({
    id: `tx_${transactions.length + 1}`,
    cardId,
    businessId,
    customerId,
    scanDate,
    type,
  });
}

// Actividad de los últimos 14 días en Café La Esquina.
for (let day = 13; day >= 0; day -= 1) {
  const isToday = day === 0;
  const count = isToday ? 7 : 4 + Math.floor(rand() * 7);
  for (let i = 0; i < count; i += 1) {
    const customerId = cafeCustomerIds[Math.floor(rand() * cafeCustomerIds.length)];
    const card = cards.find((c) => c.customerId === customerId && c.businessId === "b_cafe")!;
    const hour = 8 + Math.floor(rand() * 11);
    const minute = Math.floor(rand() * 60);
    addTransaction(card.id, "b_cafe", customerId, dateAt(day, hour, minute));
  }
}

// Canjes históricos.
addTransaction("card_cafe_jose", "b_cafe", "p_c2", dateAt(9, 17, 12), "reward_claimed");
addTransaction("card_cafe_diego", "b_cafe", "p_c6", dateAt(6, 18, 30), "reward_claimed");
addTransaction("card_cafe_maria", "b_cafe", "p_customer", dateAt(16, 11, 5), "reward_claimed");
addTransaction("card_cafe_luis", "b_cafe", "p_c4", dateAt(3, 16, 45), "reward_claimed");

// Actividad de las otras tarjetas de María.
for (let i = 0; i < 7; i += 1) {
  addTransaction(
    "card_pupusa_maria",
    "b_pupuseria",
    "p_customer",
    dateAt(20 - i * 2, 12 + (i % 5), 15),
  );
}
for (let i = 0; i < 8; i += 1) {
  addTransaction("card_carwash_maria", "b_carwash", "p_customer", dateAt(28 - i * 3, 9, 30));
}
for (let i = 0; i < 5; i += 1) {
  addTransaction(
    "card_panaderia_maria",
    "b_panaderia",
    "p_customer",
    dateAt(12 - i * 2, 7, 45),
  );
}
addTransaction("card_carwash_maria", "b_carwash", "p_customer", dateAt(10, 10, 0), "reward_claimed");
addTransaction("card_carwash_maria", "b_carwash", "p_customer", dateAt(20, 10, 0), "reward_claimed");

transactions.sort((a, b) => +new Date(a.scanDate) - +new Date(b.scanDate));

// Los dueños de los otros comercios existen pero no se usan para iniciar sesión en la demo.
const otherOwners: Profile[] = [
  "p_owner_pupuseria",
  "p_owner_carwash",
  "p_owner_panaderia",
  "p_owner_sushi",
  "p_owner_barber",
].map((id, index) => ({
  id,
  role: "merchant" as const,
  fullName: ["Rosa Mejía", "Óscar Pineda", "Teresa Cruz", "Kenji Nakamura", "Julio César"][index],
  email: `${id}@fielito.sv`,
  createdAt: dateAt(200 - index * 20, 9),
}));

export function createSeedState(): AppState {
  return {
    version: 1,
    profiles: [...profiles, ...otherOwners],
    businesses: businesses.map((business) => ({ ...business })),
    cards: cards.map((card) => ({ ...card })),
    transactions: transactions.map((transaction) => ({ ...transaction })),
    session: null,
  };
}

export const DEMO_MERCHANT_EMAIL = "carlos@cafelaesquina.sv";
export const DEMO_CUSTOMER_EMAIL = "maria@fielito.sv";
export const DEMO_BUSINESS_ID = "b_cafe";
