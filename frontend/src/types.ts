export type Product = {
  id: string;
  name: string;
  presentation: string;
  category: string;
  example_price: number;
  currency: string;
  is_demo: boolean;
  source: string;
  observed_at: string | null;
};

export type PlanItem = {
  product_id: string;
  name: string;
  presentation: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  source: string;
  observed_at: string | null;
  is_demo: boolean;
};

export type ShoppingPlan = {
  budget: number;
  budget_per_person: number;
  estimated_total: number;
  remaining: number;
  household_size: number;
  items: PlanItem[];
  note: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  modality: string;
  skills: string[];
  source_url: string;
  source_name: string;
  is_demo: boolean;
  active_status: string;
  match_score?: number;
  matching_skills?: string[];
};

export type NavPage = "home" | "shopping" | "jobs" | "profile";
