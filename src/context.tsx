import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_OTP,
  JOB_SITES as DEFAULT_SITES,
  PAST_ORDERS,
  cartTotal,
} from "./data";
import { createOpsSeedOrders } from "./data/opsSeed";
import { createDefaultJobs, createJob } from "./lib/jobs";
import {
  getChecklistGaps,
  markChecklistOrdered,
  type ChecklistGap,
} from "./lib/checklist";
import { computeWeeklyMetrics, type ContractorWeeklyMetrics } from "./lib/contractorMetrics";
import { etaMinutesForWindow } from "./lib/delivery";
import { sortOrdersBySlaUrgency } from "./lib/opsSla";
import type {
  CartItem,
  ChecklistItem,
  DeliveryWindow,
  Job,
  JobSite,
  JobType,
  Locale,
  Order,
  OrderStatus,
  PastOrder,
  Screen,
} from "./types";

const LOCALE_KEY = "siterun-locale";

interface AppState {
  screen: Screen;
  setScreen: (s: Screen) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => boolean;
  logout: () => void;
  jobSites: JobSite[];
  addJobSite: (labelEn: string, labelHi: string) => string;
  jobs: Job[];
  activeJobId: string | null;
  activeJob: Job | null;
  activeJobs: Job[];
  setActiveJobId: (id: string) => void;
  createNewJob: (siteId: string, type: JobType) => void;
  completeJob: (jobId: string) => void;
  updateJobChecklist: (jobId: string, checklist: ChecklistItem[]) => void;
  toggleChecklistItem: (itemId: string) => void;
  addChecklistToCart: () => void;
  addChecklistGapsToCart: () => void;
  checklistGaps: ChecklistGap[];
  deliveryWindow: DeliveryWindow;
  setDeliveryWindow: (w: DeliveryWindow) => void;
  weeklyMetrics: ContractorWeeklyMetrics;
  requireActiveJob: () => boolean;
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  setCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  addKitToCart: (kit: { productId: string; qty: number }[]) => void;
  activeOrder: Order | null;
  liveOrders: Order[];
  trackOrder: (orderId: string) => void;
  pastOrders: PastOrder[];
  placeOrder: () => void;
  advanceOrderStatus: (orderId?: string) => void;
  reorderPast: (order: PastOrder) => void;
  catalogCategory: string | null;
  setCatalogCategory: (c: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (v: boolean) => void;
  syncOfflineQueue: () => void;
  offlineQueueCount: number;
  offlineQueue: Order[];
  opsLiveOrders: Order[];
  cartCount: number;
  cartTotalAmount: number;
  demoMode: "contractor" | "ops";
  setDemoMode: (m: "contractor" | "ops") => void;
}

const AppContext = createContext<AppState | null>(null);

function loadLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored === "en" || stored === "hi") return stored;
  return "hi";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("login");
  const [locale, setLocaleState] = useState<Locale>(loadLocale);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobSites, setJobSites] = useState<JobSite[]>(DEFAULT_SITES);
  const [jobs, setJobs] = useState<Job[]>(createDefaultJobs);
  const [activeJobId, setActiveJobId] = useState<string | null>("job-1");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfillmentOrders, setFulfillmentOrders] = useState<Order[]>([]);
  const [opsSeedOrders, setOpsSeedOrders] = useState<Order[]>(createOpsSeedOrders);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(PAST_ORDERS);
  const [offlineQueue, setOfflineQueue] = useState<Order[]>([]);
  const [catalogCategory, setCatalogCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [demoMode, setDemoMode] = useState<"contractor" | "ops">("contractor");
  const [deliveryWindow, setDeliveryWindow] = useState<DeliveryWindow>("asap");

  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeJobId && j.status === "active") ?? null,
    [jobs, activeJobId]
  );

  const activeJobs = useMemo(
    () => jobs.filter((j) => j.status === "active"),
    [jobs]
  );

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && demoMode === "contractor") {
      setScreen("login");
    }
  }, [isAuthenticated, demoMode]);

  const addJobSite = useCallback((labelEn: string, labelHi: string) => {
    const id = `site-${Date.now().toString().slice(-6)}`;
    setJobSites((s) => [...s, { id, labelEn, labelHi }]);
    return id;
  }, []);

  const createNewJob = useCallback((siteId: string, type: JobType) => {
    const job = createJob(siteId, type);
    setJobs((prev) => [...prev, job]);
    setActiveJobId(job.id);
    setScreen("home");
  }, []);

  const completeJob = useCallback((jobId: string) => {
    setJobs((prev) => {
      const updated = prev.map((j) =>
        j.id === jobId ? { ...j, status: "completed" as const } : j
      );
      setActiveJobId((current) => {
        if (current !== jobId) return current;
        const remaining = updated.filter((j) => j.status === "active");
        return remaining[0]?.id ?? null;
      });
      return updated;
    });
  }, []);

  const updateJobChecklist = useCallback((jobId: string, checklist: ChecklistItem[]) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, checklist } : j))
    );
  }, []);

  const toggleChecklistItem = useCallback(
    (itemId: string) => {
      if (!activeJob) return;
      const next = activeJob.checklist.map((c) =>
        c.id === itemId ? { ...c, done: !c.done } : c
      );
      updateJobChecklist(activeJob.id, next);
    },
    [activeJob, updateJobChecklist]
  );

  const requireActiveJob = useCallback(() => {
    if (activeJob) return true;
    setScreen("addJob");
    return false;
  }, [activeJob]);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId, qty }];
    });
  }, []);

  const setCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const addKitToCart = useCallback((kit: { productId: string; qty: number }[]) => {
    setCart((prev) => {
      const next = [...prev];
      for (const item of kit) {
        const idx = next.findIndex((i) => i.productId === item.productId);
        if (idx >= 0) {
          next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        } else {
          next.push({ ...item });
        }
      }
      return next;
    });
  }, []);

  const addChecklistToCart = useCallback(() => {
    if (!activeJob) return;
    activeJob.checklist
      .filter((c) => !c.done)
      .forEach((c) => addToCart(c.productId, c.qty));
  }, [activeJob, addToCart]);

  const checklistGaps = useMemo(() => {
    if (!activeJob) return [];
    return getChecklistGaps(activeJob, cart);
  }, [activeJob, cart]);

  const addChecklistGapsToCart = useCallback(() => {
    checklistGaps.forEach((g) => addToCart(g.productId, g.qty));
  }, [checklistGaps, addToCart]);

  const placeOrder = useCallback(() => {
    if (!activeJob) {
      setScreen("addJob");
      return;
    }
    const eta = etaMinutesForWindow(deliveryWindow);
    const total = cartTotal(cart);
    const orderedIds = new Set(cart.map((c) => c.productId));
    const order: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      jobId: activeJob.id,
      items: [...cart],
      total,
      etaMinutes: eta,
      deliveryWindow,
      status: "confirmed",
      placedAt: new Date(),
      jobNameEn: activeJob.titleEn,
      jobNameHi: activeJob.titleHi,
      siteId: activeJob.siteId,
      queuedOffline: isOfflineMode,
    };

    updateJobChecklist(
      activeJob.id,
      markChecklistOrdered(activeJob.checklist, orderedIds)
    );
    clearCart();

    if (isOfflineMode) {
      setOfflineQueue((q) => [...q, order]);
      setScreen("home");
      return;
    }

    setFulfillmentOrders((prev) => [...prev, order]);
    setTrackingOrderId(order.id);
    setScreen("tracking");
  }, [
    cart,
    clearCart,
    deliveryWindow,
    isOfflineMode,
    activeJob,
    updateJobChecklist,
  ]);

  const syncOfflineQueue = useCallback(() => {
    setOfflineQueue((q) => {
      if (q.length === 0) return q;
      const [first, ...rest] = q;
      const synced = { ...first, queuedOffline: false };
      setFulfillmentOrders((prev) => [...prev, synced]);
      setTrackingOrderId((tid) => tid ?? synced.id);
      setScreen("tracking");
      return rest;
    });
  }, []);

  const completeOrder = useCallback((order: Order) => {
    const completed: PastOrder = {
      id: order.id,
      dateEn: new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      dateHi: "आज",
      jobId: order.jobId,
      jobType: jobs.find((j) => j.id === order.jobId)?.type,
      jobNameEn: order.jobNameEn,
      jobNameHi: order.jobNameHi,
      items: order.items,
      total: order.total,
      status: "delivered",
    };
    setPastOrders((p) => [completed, ...p]);
  }, [jobs]);

  const advanceOrderInList = useCallback(
    (orders: Order[], orderId: string): Order[] => {
      const flow: OrderStatus[] = [
        "confirmed",
        "picking",
        "out_for_delivery",
        "delivered",
      ];
      return orders.flatMap((o) => {
        if (o.id !== orderId) return [o];
        const idx = flow.indexOf(o.status);
        if (idx < 0 || idx >= flow.length - 1) {
          completeOrder(o);
          return [];
        }
        return [{ ...o, status: flow[idx + 1] }];
      });
    },
    [completeOrder]
  );

  const advanceOrderStatus = useCallback(
    (orderId?: string) => {
      const id =
        orderId ??
        trackingOrderId ??
        fulfillmentOrders[fulfillmentOrders.length - 1]?.id;
      if (!id) return;

      if (opsSeedOrders.some((o) => o.id === id)) {
        setOpsSeedOrders((prev) => advanceOrderInList(prev, id));
        return;
      }

      setFulfillmentOrders((prev) => {
        const next = advanceOrderInList(prev, id);
        setTrackingOrderId((tid) => {
          if (tid !== id) return tid;
          const stillLive = next.filter((o) => o.status !== "delivered");
          return stillLive[stillLive.length - 1]?.id ?? null;
        });
        return next;
      });
    },
    [advanceOrderInList, fulfillmentOrders, opsSeedOrders, trackingOrderId]
  );

  const trackOrder = useCallback((orderId: string) => {
    setTrackingOrderId(orderId);
    setScreen("tracking");
  }, []);

  const liveOrders = useMemo(
    () =>
      fulfillmentOrders.filter(
        (o) => o.status !== "delivered"
      ),
    [fulfillmentOrders]
  );

  const activeOrder = useMemo(() => {
    if (trackingOrderId) {
      const tracked = fulfillmentOrders.find((o) => o.id === trackingOrderId);
      if (tracked && tracked.status !== "delivered") return tracked;
    }
    return liveOrders[liveOrders.length - 1] ?? null;
  }, [fulfillmentOrders, liveOrders, trackingOrderId]);

  const weeklyMetrics = useMemo(
    () => computeWeeklyMetrics(pastOrders, liveOrders),
    [pastOrders, liveOrders]
  );

  const reorderPast = useCallback(
    (order: PastOrder) => {
      if (!requireActiveJob()) return;
      addKitToCart(order.items);
      setScreen("cart");
    },
    [addKitToCart, requireActiveJob]
  );

  const login = useCallback((phone: string, otp: string) => {
    const ok = phone.replace(/\D/g, "").length >= 10 && otp === DEMO_OTP;
    if (ok) {
      setIsAuthenticated(true);
      setScreen("home");
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setScreen("login");
    setDemoMode("contractor");
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.qty, 0),
    [cart]
  );
  const cartTotalAmount = useMemo(() => cartTotal(cart), [cart]);

  const opsLiveOrders = useMemo(() => {
    const inFlight = [...opsSeedOrders, ...fulfillmentOrders].filter(
      (o) => o.status !== "delivered"
    );
    return sortOrdersBySlaUrgency(inFlight);
  }, [opsSeedOrders, fulfillmentOrders]);

  const value: AppState = {
    screen,
    setScreen,
    locale,
    setLocale,
    isAuthenticated,
    login,
    logout,
    jobSites,
    addJobSite,
    jobs,
    activeJobId,
    activeJob,
    activeJobs,
    setActiveJobId,
    createNewJob,
    completeJob,
    updateJobChecklist,
    toggleChecklistItem,
    addChecklistToCart,
    addChecklistGapsToCart,
    checklistGaps,
    deliveryWindow,
    setDeliveryWindow,
    weeklyMetrics,
    requireActiveJob,
    cart,
    addToCart,
    setCartQty,
    clearCart,
    addKitToCart,
    activeOrder,
    liveOrders,
    trackOrder,
    pastOrders,
    placeOrder,
    advanceOrderStatus,
    reorderPast,
    catalogCategory,
    setCatalogCategory,
    searchQuery,
    setSearchQuery,
    isOfflineMode,
    setIsOfflineMode,
    syncOfflineQueue,
    offlineQueueCount: offlineQueue.length,
    offlineQueue,
    opsLiveOrders,
    cartCount,
    cartTotalAmount,
    demoMode,
    setDemoMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
