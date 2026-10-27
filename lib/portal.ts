/**
 * Typed client for the Linkdrive Auto Hub dealer portal public API.
 * Server components use the `get*` helpers (cached via ISR); browser components use `portalFetch`.
 */

// NEXT_PUBLIC_* is inlined into browser bundles; the server may use a private (e.g. internal network) URL instead.
export const PORTAL_URL = (process.env.NEXT_PUBLIC_IDI_PORTAL_URL || process.env.NEXT_IDI_PORTAL_URL || "http://localhost:3001").replace(/\/$/, "");
const SERVER_PORTAL_URL = (process.env.NEXT_IDI_PORTAL_URL || PORTAL_URL).replace(/\/$/, "");

export type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body: string;
  color: string;
  status: "Available" | "Reserved" | "Sold";
  description: string;
  badge: string;
  images: string[];
  image: string;
  featured: boolean;
};

export type SiteSettings = {
  dealership: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  currency: string;
  rates: Record<string, number>;
};

export type VehicleList = { vehicles: Vehicle[]; total: number; page: number; pages: number; makes: string[] };

export type ThreadMessage = { id: string; sender: "customer" | "staff"; authorName: string; body: string; createdAt: string };
export type Thread = {
  conversation: { subject: string; status: "open" | "closed"; customerName: string; dealership: string; vehicle: Vehicle | null };
  messages: ThreadMessage[];
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  dealership: "Linkdrive Auto Hub",
  email: "",
  phone: "+260 779 691 111",
  whatsapp: "+260 779 691 111",
  address: "Lusaka, Zambia",
  currency: "ZMW",
  rates: {},
};

export class PortalError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function portalGet<T>(path: string, revalidate: number): Promise<T> {
  const response = await fetch(`${SERVER_PORTAL_URL}${path}`, { next: { revalidate } });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new PortalError(payload?.error ?? `Portal request failed (${response.status})`, response.status);
  return payload as T;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = { ...DEFAULT_SITE_SETTINGS, ...(await portalGet<Partial<SiteSettings>>("/api/public/settings", 300)) };
    return { ...settings, dealership: /^idi\s+motors$/i.test(settings.dealership.trim()) ? DEFAULT_SITE_SETTINGS.dealership : settings.dealership };
  } catch (error) {
    console.error("[portal] settings unavailable:", error instanceof Error ? error.message : error);
    return DEFAULT_SITE_SETTINGS;
  }
}

/** Returns `null` when the portal cannot be reached so pages can show an "unavailable" state instead of an empty collection. */
export async function getVehicles(params: Record<string, string | number | undefined> = {}): Promise<VehicleList | null> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== "") query.set(key, String(value));
  try {
    return await portalGet<VehicleList>(`/api/public/vehicles?${query}`, 60);
  } catch (error) {
    console.error("[portal] vehicles unavailable:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Resolves to `undefined` when the vehicle does not exist and throws when the portal is unreachable. */
export async function getVehicle(slug: string): Promise<{ vehicle: Vehicle; related: Vehicle[] } | undefined> {
  try {
    return await portalGet(`/api/public/vehicles/${encodeURIComponent(slug)}`, 60);
  } catch (error) {
    if (error instanceof PortalError && error.status === 404) return undefined;
    throw error;
  }
}

export async function portalFetch<T>(path: string, init?: { method?: "GET" | "POST"; body?: unknown; form?: FormData }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${PORTAL_URL}${path}`, {
      method: init?.form ? "POST" : init?.method ?? "GET",
      headers: init?.body && !init.form ? { "Content-Type": "application/json" } : undefined,
      body: init?.form ?? (init?.body ? JSON.stringify(init.body) : undefined),
      cache: "no-store",
    });
  } catch {
    throw new PortalError("We couldn't reach our team just now. Please check your connection and try again.", 0);
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new PortalError(payload?.error ?? "Something went wrong. Please try again.", response.status);
  return payload as T;
}

export const MAX_TRADE_IN_PHOTOS = 12;
export const TRADE_IN_CONDITIONS = ["Excellent", "Good", "Fair", "Needs work"] as const;
export type TradeInType = "Sell" | "Swap";
export type TradeInRequest = {
  type: TradeInType;
  name: string; email: string; phone: string;
  make: string; model: string; year: number; mileage: number;
  fuel: string; transmission: string; body: string; color: string;
  condition: (typeof TRADE_IN_CONDITIONS)[number];
  askingPrice: number; targetVehicleSlug: string; notes: string; images: string[];
  website: string;
};
export type TradeInResponse = { ok: true; id: string; token: string; threadUrl: string };

/** Uploads one customer photo to the portal (Cloudinary) and returns its URL. */
export async function uploadTradeInPhoto(file: File) {
  const form = new FormData();
  form.append("file", file);
  return (await portalFetch<{ url: string }>("/api/public/uploads", { form })).url;
}

export const submitTradeIn = (request: TradeInRequest) => portalFetch<TradeInResponse>("/api/public/trade-ins", { method: "POST", body: request });

export const vehicleName = (vehicle: Pick<Vehicle, "year" | "make" | "model">) => `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
export const cssUrl = (src: string) => `url("${src.replace(/["\\\n\r]/g, (char) => encodeURIComponent(char))}")`;
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const whatsappHref = (phone: string, text?: string) => `https://wa.me/${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Converts a base-currency amount using portal rates ("1 base = rate target"), falling back to the base currency. */
export function formatPrice(amount: number, settings: Pick<SiteSettings, "currency" | "rates">, display?: string, compact = false) {
  const rate = display && display !== settings.currency ? settings.rates[display] : undefined;
  const currency = rate ? display! : settings.currency;
  const value = rate ? amount * rate : amount;
  try {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency, maximumFractionDigits: 0, notation: compact ? "compact" : "standard" }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString("en-ZM")}`;
  }
}
