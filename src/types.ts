export type Category = "plumbing" | "electrical" | "hardware" | "paint";

export interface Product {
  id: string;
  nameEn: string;
  nameHi: string;
  category: Category;
  price: number;
  unit: string;
  emoji: string;
}

export interface ChecklistItem {
  id: string;
  productId: string;
  qty: number;
  done: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type JobType =
  | "bathroom"
  | "kitchen"
  | "toilet_wc"
  | "pvc_repair"
  | "new_connection"
  | "water_tank"
  | "geyser"
  | "leakage_repair"
  | "drain_blockage"
  | "pipeline_upgrade"
  | "other";

export type JobStatus = "active" | "completed";

export interface Job {
  id: string;
  siteId: string;
  type: JobType;
  titleEn: string;
  titleHi: string;
  status: JobStatus;
  checklist: ChecklistItem[];
  createdAt: Date;
}

export interface JobSite {
  id: string;
  labelEn: string;
  labelHi: string;
}

export type Screen =
  | "login"
  | "home"
  | "job"
  | "addJob"
  | "jobs"
  | "catalog"
  | "cart"
  | "tracking"
  | "orders"
  | "copilot"
  | "profile"
  | "ops";

export type Locale = "en" | "hi";

export interface PastOrder {
  id: string;
  dateEn: string;
  dateHi: string;
  jobId: string;
  jobType?: JobType;
  jobNameEn: string;
  jobNameHi: string;
  items: CartItem[];
  total: number;
  status: "delivered";
}

export type OrderStatus = "confirmed" | "picking" | "out_for_delivery" | "delivered";

export type DeliveryWindow = "asap" | "flex";

export interface Order {
  id: string;
  jobId: string;
  items: CartItem[];
  total: number;
  etaMinutes: number;
  deliveryWindow?: DeliveryWindow;
  status: OrderStatus;
  placedAt: Date;
  jobNameEn: string;
  jobNameHi: string;
  siteId: string;
  queuedOffline?: boolean;
}
