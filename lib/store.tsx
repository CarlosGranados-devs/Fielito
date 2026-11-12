"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createSeedState, DEMO_CUSTOMER_EMAIL, DEMO_MERCHANT_EMAIL } from "@/lib/seed";
import type {
  AppState,
  Business,
  BusinessCategory,
  LoyaltyCard,
  MerchantOnboardingInput,
  Profile,
  Role,
  ScanResult,
  Session,
} from "@/lib/types";
import { uid } from "@/lib/utils";

const STORAGE_KEY = "fielito:state:v1";

type SignInInput = { email: string; role: Role; fullName?: string };
type RegisterInput = { fullName: string; email: string; role: Role; phone?: string };

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  session: Session | null;
  profile: Profile | null;
  business: Business | null;
  signIn: (input: SignInInput) => { ok: boolean; profile?: Profile; hasBusiness?: boolean };
  signInDemo: (role: Role) => void;
  register: (input: RegisterInput) => Profile;
  signOut: () => void;
  completeOnboarding: (input: MerchantOnboardingInput) => Business;
  addStamp: (businessId: string, customerId: string) => ScanResult | null;
  claimReward: (cardId: string) => LoyaltyCard | null;
  joinBusiness: (businessId: string) => LoyaltyCard | null;
  updateBusiness: (businessId: string, patch: Partial<Business>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  upgradeToPro: () => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function safeLoad(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.profiles)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => createSeedState());
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);

  const commit = useCallback((updater: (current: AppState) => AppState) => {
    const next = updater(stateRef.current);
    stateRef.current = next;
    setState(next);
    return next;
  }, []);

  useEffect(() => {
    const stored = safeLoad();
    if (stored) {
      stateRef.current = stored;
      setState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // El navegador puede bloquear localStorage en modo privado.
    }
  }, [state, hydrated]);

  const session = state.session;
  const profile = session
    ? state.profiles.find((item) => item.id === session.profileId) ?? null
    : null;

  const business = useMemo(() => {
    if (!profile || profile.role !== "merchant") return null;
    return state.businesses.find((item) => item.ownerId === profile.id) ?? null;
  }, [profile, state.businesses]);

  const signIn = useCallback(
    ({ email, role, fullName }: SignInInput) => {
      const normalized = email.trim().toLowerCase();
      const existing = stateRef.current.profiles.find(
        (item) => item.email.toLowerCase() === normalized && item.role === role,
      );

      if (existing) {
        commit((current) => ({
          ...current,
          session: { profileId: existing.id, role },
        }));
        const hasBusiness = stateRef.current.businesses.some(
          (item) => item.ownerId === existing.id,
        );
        return { ok: true, profile: existing, hasBusiness };
      }

      const fallbackName =
        fullName?.trim() ||
        normalized
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
      const newProfile: Profile = {
        id: uid("p"),
        role,
        fullName: fallbackName,
        email: normalized,
        createdAt: new Date().toISOString(),
      };
      commit((current) => ({
        ...current,
        profiles: [...current.profiles, newProfile],
        session: { profileId: newProfile.id, role },
      }));
      return { ok: true, profile: newProfile, hasBusiness: false };
    },
    [commit],
  );

  const signInDemo = useCallback(
    (role: Role) => {
      const email = role === "merchant" ? DEMO_MERCHANT_EMAIL : DEMO_CUSTOMER_EMAIL;
      const demo = stateRef.current.profiles.find(
        (item) => item.email === email && item.role === role,
      );
      if (demo) {
        commit((current) => ({ ...current, session: { profileId: demo.id, role } }));
      }
    },
    [commit],
  );

  const register = useCallback(
    ({ fullName, email, role, phone }: RegisterInput) => {
      const normalized = email.trim().toLowerCase();
      const existing = stateRef.current.profiles.find(
        (item) => item.email.toLowerCase() === normalized && item.role === role,
      );
      if (existing) {
        commit((current) => ({
          ...current,
          profiles: current.profiles.map((item) =>
            item.id === existing.id ? { ...item, fullName, phone } : item,
          ),
          session: { profileId: existing.id, role },
        }));
        return { ...existing, fullName, phone };
      }
      const newProfile: Profile = {
        id: uid("p"),
        role,
        fullName,
        email: normalized,
        phone,
        avatarEmoji: role === "customer" ? "🙂" : "🏪",
        createdAt: new Date().toISOString(),
      };
      commit((current) => ({
        ...current,
        profiles: [...current.profiles, newProfile],
        session: { profileId: newProfile.id, role },
      }));
      return newProfile;
    },
    [commit],
  );

  const signOut = useCallback(() => {
    commit((current) => ({ ...current, session: null }));
  }, [commit]);

  const completeOnboarding = useCallback(
    (input: MerchantOnboardingInput) => {
      const currentProfile = stateRef.current.session
        ? stateRef.current.profiles.find(
            (item) => item.id === stateRef.current.session?.profileId,
          )
        : null;
      if (!currentProfile) throw new Error("No hay sesión activa");

      const existing = stateRef.current.businesses.find(
        (item) => item.ownerId === currentProfile.id,
      );

      const newBusiness: Business = {
        id: existing?.id ?? uid("b"),
        ownerId: currentProfile.id,
        name: input.businessName,
        category: input.category as BusinessCategory,
        latitude: input.latitude,
        longitude: input.longitude,
        requiredStamps: input.requiredStamps,
        rewardDescription: input.rewardDescription,
        address: input.address,
        phone: input.phone,
        logoEmoji: input.logoEmoji,
        brandColor: input.brandColor,
        plan: existing?.plan ?? "free",
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };

      commit((current) => ({
        ...current,
        businesses: existing
          ? current.businesses.map((item) => (item.id === existing.id ? newBusiness : item))
          : [...current.businesses, newBusiness],
      }));

      return newBusiness;
    },
    [commit],
  );

  const addStamp = useCallback(
    (businessId: string, customerId: string): ScanResult | null => {
      const current = stateRef.current;
      const targetBusiness = current.businesses.find((item) => item.id === businessId);
      if (!targetBusiness) return null;

      let card = current.cards.find(
        (item) => item.customerId === customerId && item.businessId === businessId,
      );

      if (!card) {
        card = {
          id: uid("card"),
          customerId,
          businessId,
          currentStamps: 0,
          isCompleted: false,
          rewardsRedeemed: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      if (card.isCompleted) {
        return {
          card,
          business: targetBusiness,
          completed: true,
          stampsAfter: card.currentStamps,
        };
      }

      const nextStamps = Math.min(card.currentStamps + 1, targetBusiness.requiredStamps);
      const updatedCard: LoyaltyCard = {
        ...card,
        currentStamps: nextStamps,
        isCompleted: nextStamps >= targetBusiness.requiredStamps,
        updatedAt: new Date().toISOString(),
      };

      const transaction = {
        id: uid("tx"),
        cardId: updatedCard.id,
        businessId,
        customerId,
        scanDate: new Date().toISOString(),
        type: "stamp_added" as const,
      };

      commit((stateNow) => ({
        ...stateNow,
        cards: stateNow.cards.some((item) => item.id === updatedCard.id)
          ? stateNow.cards.map((item) => (item.id === updatedCard.id ? updatedCard : item))
          : [...stateNow.cards, updatedCard],
        transactions: [...stateNow.transactions, transaction],
      }));

      return {
        card: updatedCard,
        business: targetBusiness,
        completed: updatedCard.isCompleted,
        stampsAfter: updatedCard.currentStamps,
      };
    },
    [commit],
  );

  const claimReward = useCallback(
    (cardId: string): LoyaltyCard | null => {
      const current = stateRef.current;
      const card = current.cards.find((item) => item.id === cardId);
      if (!card || !card.isCompleted) return null;

      const updatedCard: LoyaltyCard = {
        ...card,
        currentStamps: 0,
        isCompleted: false,
        rewardsRedeemed: card.rewardsRedeemed + 1,
        updatedAt: new Date().toISOString(),
      };

      const transaction = {
        id: uid("tx"),
        cardId,
        businessId: card.businessId,
        customerId: card.customerId,
        scanDate: new Date().toISOString(),
        type: "reward_claimed" as const,
      };

      commit((stateNow) => ({
        ...stateNow,
        cards: stateNow.cards.map((item) => (item.id === cardId ? updatedCard : item)),
        transactions: [...stateNow.transactions, transaction],
      }));

      return updatedCard;
    },
    [commit],
  );

  const joinBusiness = useCallback(
    (businessId: string): LoyaltyCard | null => {
      const current = stateRef.current;
      const currentProfile = current.session
        ? current.profiles.find((item) => item.id === current.session?.profileId)
        : null;
      if (!currentProfile) return null;

      const existing = current.cards.find(
        (item) =>
          item.customerId === currentProfile.id && item.businessId === businessId,
      );
      if (existing) return existing;

      const card: LoyaltyCard = {
        id: uid("card"),
        customerId: currentProfile.id,
        businessId,
        currentStamps: 0,
        isCompleted: false,
        rewardsRedeemed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      commit((stateNow) => ({ ...stateNow, cards: [...stateNow.cards, card] }));
      return card;
    },
    [commit],
  );

  const updateBusiness = useCallback(
    (businessId: string, patch: Partial<Business>) => {
      commit((current) => ({
        ...current,
        businesses: current.businesses.map((item) =>
          item.id === businessId ? { ...item, ...patch } : item,
        ),
      }));
    },
    [commit],
  );

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      commit((current) => {
        if (!current.session) return current;
        return {
          ...current,
          profiles: current.profiles.map((item) =>
            item.id === current.session?.profileId ? { ...item, ...patch } : item,
          ),
        };
      });
    },
    [commit],
  );

  const upgradeToPro = useCallback(() => {
    commit((current) => {
      if (!current.session) return current;
      return {
        ...current,
        businesses: current.businesses.map((item) =>
          item.ownerId === current.session?.profileId ? { ...item, plan: "pro" } : item,
        ),
      };
    });
  }, [commit]);

  const resetDemo = useCallback(() => {
    const fresh = createSeedState();
    stateRef.current = fresh;
    setState(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value: AppContextValue = {
    state,
    hydrated,
    session,
    profile,
    business,
    signIn,
    signInDemo,
    register,
    signOut,
    completeOnboarding,
    addStamp,
    claimReward,
    joinBusiness,
    updateBusiness,
    updateProfile,
    upgradeToPro,
    resetDemo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe usarse dentro de <AppStoreProvider>");
  return context;
}
