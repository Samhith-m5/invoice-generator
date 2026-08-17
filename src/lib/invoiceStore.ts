import type { InvoiceData } from "@/components/InvoiceView";

export interface SavedInvoice extends InvoiceData {
  savedId: string;
  savedAt: string;
}

const KEY = "mct_invoices";

export function loadInvoices(): SavedInvoice[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveInvoice(data: InvoiceData, existingId?: string): SavedInvoice {
  const invoices = loadInvoices();
  const savedId = existingId ?? crypto.randomUUID();

  const duplicate = invoices.find(
    (i) => i.invoiceNumber === data.invoiceNumber && i.savedId !== savedId
  );
  if (duplicate) {
    throw new Error(`Invoice number "${data.invoiceNumber}" already exists.`);
  }

  const entry: SavedInvoice = { ...data, savedId, savedAt: new Date().toISOString() };
  const idx = invoices.findIndex((i) => i.savedId === savedId);
  if (idx >= 0) invoices[idx] = entry;
  else invoices.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(invoices));
  return entry;
}

export function deleteInvoice(savedId: string) {
  const invoices = loadInvoices().filter((i) => i.savedId !== savedId);
  localStorage.setItem(KEY, JSON.stringify(invoices));
}

export function getInvoice(savedId: string): SavedInvoice | undefined {
  return loadInvoices().find((i) => i.savedId === savedId);
}
