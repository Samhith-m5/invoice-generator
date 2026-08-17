import { useState, useRef, useLayoutEffect } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import InvoiceView, { type InvoiceData, type LineItem } from "@/components/InvoiceView";
import { saveInvoice, loadInvoices, deleteInvoice, getInvoice, type SavedInvoice } from "@/lib/invoiceStore";

type Page =
  | { name: "editor"; editId?: string }
  | { name: "invoices" };

const DEFAULT_DATA: InvoiceData = {
  invoiceType: "Proforma Invoice",
  invoiceDate: "",
  dueDate: "",
  from: {
    company: "Mayaans Choco Tech",
    address1: "IDA PHASE 2, Cherlapally,",
    address2: "Hyderabad, TG, India",
    city: "",
    gstin: "36AALCM5866A1ZC",
    pan: "AALCM5866A",
  },
  billTo: { company: "", address: "", gstin: "", contact: "" },
  items: [],
  taxRate: 18,
  discountRate: 0,
  payment: {
    bank: "HDFC Bank",
    branch: "Moulali Main Road",
    holder: "Mayaans Choco Tech Private Limited",
    account: "50200029497400",
    ifsc: "HDFC0004095",
  },
  terms: [
    "Payment of 30% against the PI.",
    "Remaining balance is 40% in August month, 20% before despatch and 10% after inspection.",
    "Packing & forwarding at 2% at our scope.",
    "Delivery in 12-16 weeks.",
    "Transport charges at actuals.",
  ],
  invoiceNumber: "MCT-10-2026-27",
  authorizedBy: "G Chandra Shekar Reddy",
  tagline: "Engineered with care. Delivered with purpose.",
};

// ─── Primitives ───────────────────────────────────────────────────────────────

function Field({ label, value, onChange, textarea, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea
          className="border border-gray-200 rounded-xl px-3.5 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-white"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="border border-gray-200 rounded-xl px-3.5 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-bold text-gray-800 border-b-2 border-red-100 pb-2">{title}</h3>
      {children}
    </div>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────

function MobileNav({ tab, setTab, onGoInvoices }: {
  tab: "form" | "preview";
  setTab: (t: "form" | "preview") => void;
  onGoInvoices: () => void;
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center shadow-lg">
      <button
        onClick={onGoInvoices}
        className="flex flex-col items-center justify-center gap-1 flex-1 py-3 text-gray-500 hover:text-red-600 transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h5" />
        </svg>
        <span className="text-[10px] font-semibold">My Invoices</span>
      </button>
      <button
        onClick={() => setTab("form")}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-colors ${tab === "form" ? "text-red-600" : "text-gray-400 hover:text-gray-700"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <span className="text-[10px] font-semibold">Edit</span>
      </button>
      <button
        onClick={() => setTab("preview")}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-colors ${tab === "preview" ? "text-red-600" : "text-gray-400 hover:text-gray-700"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-[10px] font-semibold">Preview</span>
      </button>
    </nav>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

function EditorPage({ editId, onGoInvoices }: { editId?: string; onGoInvoices: () => void }) {
  const existing = editId ? getInvoice(editId) : undefined;

  const [data, setData] = useState<InvoiceData>(() => {
    if (existing) {
      const { savedId: _s, savedAt: _a, ...rest } = existing;
      return rest;
    }
    return DEFAULT_DATA;
  });

  const [savedId] = useState<string | undefined>(existing?.savedId);
  const [previewScale, setPreviewScale] = useState(0.55);
  const [autoPreviewScale, setAutoPreviewScale] = useState(0.55);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [invoiceHeight, setInvoiceHeight] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(!existing);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useLayoutEffect(() => {
    const el = invoiceRef.current;
    if (!el) return;
    const update = () => setInvoiceHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  useLayoutEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 24;
      setAutoPreviewScale(Math.max(0.15, Math.min(available / 1350, 1)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobileTab]);

  const effectiveScale = isMobile ? autoPreviewScale : previewScale;

  function set<K extends keyof InvoiceData>(key: K, val: InvoiceData[K]) {
    setData((d) => ({ ...d, [key]: val }));
    setIsDirty(true);
  }

  function setNested<K extends keyof InvoiceData>(key: K, field: string, val: string) {
    setData((d) => ({ ...d, [key]: { ...(d[key] as object), [field]: val } }));
    setIsDirty(true);
  }

  function addItem() {
    const item: LineItem = { id: Date.now().toString(), description: "", model: "", hsn: "84382000", quantity: 1, price: 0 };
    setData((d) => ({ ...d, items: [...d.items, item] }));
    setIsDirty(true);
  }

  function updateItem(id: string, field: keyof LineItem, val: string | number) {
    setData((d) => ({ ...d, items: d.items.map((item) => item.id === id ? { ...item, [field]: val } : item) }));
    setIsDirty(true);
  }

  function removeItem(id: string) {
    setData((d) => ({ ...d, items: d.items.filter((item) => item.id !== id) }));
    setIsDirty(true);
  }

  function handleSave() {
    try {
      saveInvoice(data, savedId);
      setIsDirty(false);
      setSaveError(null);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
      setTimeout(() => setSaveError(null), 4000);
    }
  }

  async function handleSavePdf() {
    const printArea = document.getElementById("invoice-print");
    if (!printArea || isSaving) return;
    setIsSaving(true);

    const holder = document.createElement("div");
    holder.style.position = "fixed";
    holder.style.left = "-10000px";
    holder.style.top = "0";
    holder.style.width = "1350px";
    holder.style.background = "#ffffff";
    const clone = printArea.cloneNode(true) as HTMLElement;
    clone.style.transform = "none";
    clone.style.width = "1350px";
    holder.appendChild(clone);
    document.body.appendChild(holder);

    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        width: 1350,
        windowWidth: 1350,
      });
      const orientation = canvas.width >= canvas.height ? "landscape" : "portrait";
      const pdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, canvas.width, canvas.height);
      const safeName = (data.invoiceNumber || "invoice").replace(/[^a-zA-Z0-9\-_]+/g, "-");
      pdf.save(`${safeName}.pdf`);
    } finally {
      document.body.removeChild(holder);
      setIsSaving(false);
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">

      {/* ── Top navbar ── */}
      <header className="no-print sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-bold text-gray-900 text-base">Invoice Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`text-sm font-semibold px-4 py-2 rounded-xl border transition-colors ${
                justSaved
                  ? "bg-green-50 border-green-300 text-green-700"
                  : isDirty
                  ? "bg-white border-gray-300 text-gray-700 active:bg-gray-50"
                  : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              {justSaved ? "Saved!" : "Save"}
            </button>
            <button
              onClick={handleSavePdf}
              disabled={isSaving}
              className="bg-red-600 active:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {isSaving ? "…" : "PDF"}
            </button>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-semibold text-gray-800">Invoice Generator</span>
            </div>
            <button onClick={onGoInvoices} className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors">
              My Invoices
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Zoom</span>
              <input
                type="range" min={30} max={100} step={5}
                value={Math.round(previewScale * 100)}
                onChange={(e) => setPreviewScale(Number(e.target.value) / 100)}
                className="w-24 accent-red-500"
              />
              <span className="w-10">{Math.round(previewScale * 100)}%</span>
            </div>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                justSaved
                  ? "bg-green-50 border-green-300 text-green-700"
                  : isDirty
                  ? "bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600"
                  : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              {justSaved ? "Saved!" : "Save Invoice"}
            </button>
            <button
              onClick={handleSavePdf}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {isSaving ? "Saving…" : "Save PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Duplicate invoice number error ── */}
      {saveError && (
        <div className="no-print bg-red-50 border-b border-red-200 px-4 md:px-6 py-2.5 flex items-center gap-2 text-sm text-red-700 font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {saveError}
        </div>
      )}

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar / Form */}
        <aside className={`no-print bg-white border-r border-gray-100 overflow-y-auto flex-col gap-6 p-4 md:p-5
          pb-24 md:pb-5
          ${mobileTab === "form" ? "flex" : "hidden"} md:flex
          w-full md:w-80 md:min-w-80`}
        >
          <Section title="Invoice Info">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice Type</label>
              <select
                className="border border-gray-200 rounded-xl px-3.5 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                value={data.invoiceType}
                onChange={(e) => set("invoiceType", e.target.value)}
              >
                <option>Proforma Invoice</option>
                <option>Tax Invoice</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice Number</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-400">
                <span className="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-r border-gray-200 select-none whitespace-nowrap">MCT-</span>
                <input
                  className="flex-1 min-w-0 px-3 py-3 text-base text-gray-800 focus:outline-none text-center bg-white"
                  placeholder="10"
                  value={data.invoiceNumber.split("-")[1] ?? ""}
                  onChange={(e) => {
                    const seq = e.target.value.replace(/[^0-9]/g, "");
                    set("invoiceNumber", `MCT-${seq}-2026-27`);
                  }}
                />
                <span className="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-l border-gray-200 select-none whitespace-nowrap">-2026-27</span>
              </div>
            </div>

            <Field label="Date" value={data.invoiceDate ?? ""} type="date" onChange={(v) => {
              set("invoiceDate", v);
              if (v) {
                const next = new Date(v);
                next.setDate(next.getDate() + 1);
                set("dueDate", next.toISOString().slice(0, 10));
              }
            }} />
            <Field label="Due Date" value={data.dueDate ?? ""} type="date" onChange={(v) => set("dueDate", v)} />
          </Section>

          <Section title="Bill To">
            <Field label="Company" value={data.billTo.company ?? ""} onChange={(v) => setNested("billTo", "company", v)} />
            <Field label="Address" value={data.billTo.address ?? ""} onChange={(v) => setNested("billTo", "address", v)} />
            <Field label="GSTIN" value={data.billTo.gstin ?? ""} onChange={(v) => setNested("billTo", "gstin", v)} />
            <Field label="Contact" value={data.billTo.contact ?? ""} onChange={(v) => setNested("billTo", "contact", v)} />
          </Section>

          <Section title="Order Details">
            {data.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</span>
                    <input
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                      placeholder="Item name"
                      value={item.description ?? ""}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-6 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >✕</button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Model</span>
                  <input
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                    placeholder="Model no."
                    value={item.model ?? ""}
                    onChange={(e) => updateItem(item.id, "model", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">HSN</span>
                    <input
                      className="border border-gray-200 rounded-xl px-2 py-2.5 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                      placeholder="HSN"
                      value={item.hsn ?? ""}
                      onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Qty</span>
                    <input
                      type="number" min={1}
                      className="border border-gray-200 rounded-xl px-2 py-2.5 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                      value={item.quantity ?? 1}
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price ₹</span>
                    <input
                      className="border border-gray-200 rounded-xl px-2 py-2.5 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      inputMode="numeric"
                      placeholder="0"
                      value={item.price === 0 ? "" : String(item.price)}
                      onChange={(e) => updateItem(item.id, "price", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addItem}
              className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-4 text-base font-semibold text-gray-400 hover:text-red-500 hover:border-red-300 active:bg-red-50 transition-colors"
            >
              <span className="text-xl leading-none">+</span> Add Item
            </button>
          </Section>

          <Section title="Tax & Discount">
            <Field label="Tax Rate (%)" value={String(data.taxRate ?? 0)} onChange={(v) => set("taxRate", Number(v) || 0)} />
            <Field label="Discount (%) — optional" value={String(data.discountRate ?? 0)} onChange={(v) => set("discountRate", Number(v) || 0)} />
          </Section>

          <Section title="Terms">
            {data.terms.map((term, i) => (
              <div key={i} className="flex gap-2 items-start">
                <textarea
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none bg-white"
                  rows={2}
                  value={term}
                  onChange={(e) => {
                    const terms = [...data.terms];
                    terms[i] = e.target.value;
                    set("terms", terms);
                  }}
                />
                <button
                  onClick={() => set("terms", data.terms.filter((_, j) => j !== i))}
                  className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => set("terms", [...data.terms, ""])}
              className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-4 text-base font-semibold text-gray-400 hover:text-red-500 hover:border-red-300 active:bg-red-50 transition-colors"
            >
              <span className="text-xl leading-none">+</span> Add Term
            </button>
          </Section>
        </aside>

        {/* Preview */}
        <main
          ref={previewWrapRef}
          className={`flex-1 overflow-auto bg-gray-100 flex justify-center py-6 md:py-8
            pb-24 md:pb-8
            ${mobileTab === "preview" ? "flex" : "hidden"} md:flex`}
        >
          <div style={{ width: 1350 * effectiveScale, height: invoiceHeight * effectiveScale }}>
            <div
              ref={invoiceRef}
              className="shadow-xl"
              style={{ transform: `scale(${effectiveScale})`, transformOrigin: "top left", width: 1350 }}
            >
              <InvoiceView data={data} />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav tab={mobileTab} setTab={setMobileTab} onGoInvoices={onGoInvoices} />
    </div>
  );
}

// ─── Invoice card ─────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "₹ " + n.toLocaleString("en-IN");
}

function calcTotal(inv: SavedInvoice) {
  const subtotal = inv.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const discount = Math.round(subtotal * (inv.discountRate || 0) / 100);
  const taxable = subtotal - discount;
  return taxable + Math.round(taxable * inv.taxRate / 100);
}

function InvoiceCard({ inv, onEdit, onDelete }: { inv: SavedInvoice; onEdit: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm active:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-gray-900">{inv.invoiceNumber}</p>
          <p className="text-sm text-gray-400">{inv.invoiceDate}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
          inv.invoiceType === "Tax Invoice" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
        }`}>
          {inv.invoiceType}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-gray-800">{inv.billTo.company || "No client"}</p>
        <p className="text-sm text-gray-400 truncate">{inv.billTo.address}</p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="font-bold text-gray-900 text-lg">{fmt(calcTotal(inv))}</p>
        <p className="text-sm text-gray-400">{inv.items.length} item{inv.items.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={onEdit}
          className="flex-1 bg-gray-50 active:bg-red-50 text-gray-700 active:text-red-600 text-sm font-semibold py-3 rounded-xl border border-gray-200 transition-colors"
        >
          Edit
        </button>
        {confirming ? (
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => { onDelete(); setConfirming(false); }}
              className="flex-1 bg-red-600 active:bg-red-700 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 bg-gray-100 text-gray-600 text-sm font-semibold py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="px-4 bg-gray-50 active:bg-red-50 text-gray-400 active:text-red-500 text-sm font-semibold py-3 rounded-xl border border-gray-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function InvoicesGroup({ title, invoices, accent, onEdit, onDelete }: {
  title: string; invoices: SavedInvoice[]; accent: string;
  onEdit: (id: string) => void; onDelete: (id: string) => void;
}) {
  if (invoices.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-5 rounded-full ${accent}`} />
        <h2 className="font-bold text-gray-700">{title}</h2>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{invoices.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {invoices.map((inv) => (
          <InvoiceCard
            key={inv.savedId}
            inv={inv}
            onEdit={() => onEdit(inv.savedId)}
            onDelete={() => onDelete(inv.savedId)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Invoices page ────────────────────────────────────────────────────────────

function InvoicesPage({ onNewInvoice, onEditInvoice }: {
  onNewInvoice: () => void;
  onEditInvoice: (id: string) => void;
}) {
  const [invoices, setInvoices] = useState<SavedInvoice[]>(() => loadInvoices());

  function handleDelete(savedId: string) {
    deleteInvoice(savedId);
    setInvoices(loadInvoices());
  }

  const proforma = invoices.filter((i) => i.invoiceType === "Proforma Invoice");
  const tax = invoices.filter((i) => i.invoiceType === "Tax Invoice");
  const other = invoices.filter((i) => i.invoiceType !== "Proforma Invoice" && i.invoiceType !== "Tax Invoice");

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNewInvoice}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-500 active:bg-gray-200 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 14L7 9l4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="font-bold text-gray-900 text-lg">My Invoices</span>
            </div>
          </div>
          <button
            onClick={onNewInvoice}
            className="bg-red-600 active:bg-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            + New
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-8">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
                <path d="M8 4h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M10 10h8M10 14h8M10 18h5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-lg">No invoices yet</p>
              <p className="text-gray-400 mt-1">Create an invoice and tap Save to see it here.</p>
            </div>
            <button
              onClick={onNewInvoice}
              className="bg-red-600 active:bg-red-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-colors text-base mt-2"
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-10 max-w-6xl mx-auto">
            <InvoicesGroup title="Proforma Invoices" invoices={proforma} accent="bg-orange-400" onEdit={onEditInvoice} onDelete={handleDelete} />
            <InvoicesGroup title="Tax Invoices" invoices={tax} accent="bg-blue-400" onEdit={onEditInvoice} onDelete={handleDelete} />
            <InvoicesGroup title="Other" invoices={other} accent="bg-gray-400" onEdit={onEditInvoice} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>({ name: "editor" });

  if (page.name === "invoices") {
    return (
      <InvoicesPage
        onNewInvoice={() => setPage({ name: "editor" })}
        onEditInvoice={(id) => setPage({ name: "editor", editId: id })}
      />
    );
  }

  return (
    <EditorPage
      key={page.editId ?? "new"}
      editId={page.editId}
      onGoInvoices={() => setPage({ name: "invoices" })}
    />
  );
}
