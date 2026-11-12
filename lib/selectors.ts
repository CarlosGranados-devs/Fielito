import type { AppState, Business, LoyaltyCard, Transaction } from "@/lib/types";
import { sameDay, toLocalISODate } from "@/lib/utils";

export interface CardWithBusiness {
  card: LoyaltyCard;
  business: Business;
}

export function getCustomerCards(state: AppState, customerId: string): CardWithBusiness[] {
  return state.cards
    .filter((card) => card.customerId === customerId)
    .map((card) => {
      const business = state.businesses.find((item) => item.id === card.businessId);
      return business ? { card, business } : null;
    })
    .filter((item): item is CardWithBusiness => Boolean(item))
    .sort((a, b) => {
      if (a.card.isCompleted !== b.card.isCompleted) return a.card.isCompleted ? -1 : 1;
      return +new Date(b.card.updatedAt) - +new Date(a.card.updatedAt);
    });
}

export function getBusinessCards(state: AppState, businessId: string) {
  return state.cards.filter((card) => card.businessId === businessId);
}

export function getBusinessTransactions(state: AppState, businessId: string) {
  return state.transactions.filter((transaction) => transaction.businessId === businessId);
}

export function getCustomerTransactions(state: AppState, customerId: string) {
  return state.transactions
    .filter((transaction) => transaction.customerId === customerId)
    .sort((a, b) => +new Date(b.scanDate) - +new Date(a.scanDate));
}

export interface MerchantStats {
  totalCustomers: number;
  stampsToday: number;
  rewardsClaimed: number;
  stampsTotal: number;
  stampsLast7: number;
  rewardsPending: number;
  avgStampsPerCustomer: number;
  daily: Array<{ date: string; label: string; stamps: number; rewards: number }>;
  recent: Array<{ transaction: Transaction; card: LoyaltyCard | undefined; customerName: string }>;
  topCustomers: Array<{ card: LoyaltyCard; fullName: string; email: string; lastVisit: string }>;
}

export function getMerchantStats(state: AppState, business: Business): MerchantStats {
  const cards = getBusinessCards(state, business.id);
  const transactions = getBusinessTransactions(state, business.id);
  const stampTransactions = transactions.filter((item) => item.type === "stamp_added");
  const rewardTransactions = transactions.filter((item) => item.type === "reward_claimed");

  const daily: MerchantStats["daily"] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = toLocalISODate(date);
    const dayTransactions = transactions.filter(
      (transaction) => toLocalISODate(new Date(transaction.scanDate)) === key,
    );
    daily.push({
      date: key,
      label: new Intl.DateTimeFormat("es-SV", { weekday: "short" }).format(date).replace(".", ""),
      stamps: dayTransactions.filter((item) => item.type === "stamp_added").length,
      rewards: dayTransactions.filter((item) => item.type === "reward_claimed").length,
    });
  }

  const last7Start = new Date();
  last7Start.setDate(last7Start.getDate() - 6);
  last7Start.setHours(0, 0, 0, 0);

  const customerIds = new Set(cards.map((card) => card.customerId));

  const topCustomers = cards
    .map((card) => {
      const profile = state.profiles.find((item) => item.id === card.customerId);
      const customerTransactions = transactions.filter(
        (transaction) => transaction.customerId === card.customerId,
      );
      const lastVisit = customerTransactions.length
        ? customerTransactions[customerTransactions.length - 1].scanDate
        : card.updatedAt;
      return {
        card,
        fullName: profile?.fullName ?? "Cliente",
        email: profile?.email ?? "",
        lastVisit,
      };
    })
    .sort((a, b) => b.card.currentStamps - a.card.currentStamps || +new Date(b.lastVisit) - +new Date(a.lastVisit))
    .slice(0, 6);

  const recent = [...transactions]
    .sort((a, b) => +new Date(b.scanDate) - +new Date(a.scanDate))
    .slice(0, 8)
    .map((transaction) => {
      const card = cards.find((item) => item.id === transaction.cardId);
      const profile = state.profiles.find((item) => item.id === transaction.customerId);
      return {
        transaction,
        card,
        customerName: profile?.fullName ?? "Cliente",
      };
    });

  return {
    totalCustomers: customerIds.size,
    stampsToday: stampTransactions.filter((item) => sameDay(item.scanDate, new Date())).length,
    rewardsClaimed: rewardTransactions.length,
    stampsTotal: stampTransactions.length,
    stampsLast7: stampTransactions.filter(
      (item) => new Date(item.scanDate).getTime() >= last7Start.getTime(),
    ).length,
    rewardsPending: cards.filter((card) => card.isCompleted).length,
    avgStampsPerCustomer: cards.length
      ? Math.round((cards.reduce((sum, card) => sum + card.currentStamps, 0) / cards.length) * 10) / 10
      : 0,
    daily,
    recent,
    topCustomers,
  };
}

export function getBusinessCategoryCount(state: AppState) {
  const counts: Record<string, number> = {};
  state.businesses.forEach((business) => {
    counts[business.category] = (counts[business.category] ?? 0) + 1;
  });
  return counts;
}
