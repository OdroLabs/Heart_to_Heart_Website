import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const SI_MONTHS = [
  "ජනවාරි",
  "පෙබරවාරි",
  "මාර්තු",
  "අප්‍රේල්",
  "මැයි",
  "ජූනි",
  "ජූලි",
  "අගෝස්තු",
  "සැප්තැම්බර්",
  "ඔක්තෝබර්",
  "නොවැම්බර්",
  "දෙසැම්බර්",
];

export function formatDate(
  date: Date | string | null | undefined,
  locale = "en",
) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;

  if (locale === "si") {
    return `${d.getDate()} ${SI_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  const map: Record<string, string> = { en: "en-GB", ta: "ta-LK" };
  return d.toLocaleDateString(map[locale] ?? "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMoney(amount: number | string, currency = "LKR") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${currency} ${n.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

/** Formats a Sri Lankan phone number as "07x xxx xxxx". Leaves other formats untouched. */
export function formatPhone(phone: string | null | undefined) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("94")
    ? `0${digits.slice(2)}`
    : digits.length === 9
      ? `0${digits}`
      : digits;
  if (local.length === 10 && local.startsWith("0")) {
    return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }
  return phone;
}
