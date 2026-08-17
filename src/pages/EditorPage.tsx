import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router";
import InvoiceView, { type InvoiceData, type LineItem } from "@/components/InvoiceView";
import { saveInvoice, getInvoice } from "@/lib/invoiceStore";

const DEFAULT_DATA: InvoiceData = {
  invoiceType: "Proforma Invoice",
  invoiceDate: "July 24, 2026",
  dueDate: "July 25, 2026",
  from: {
    company: "Mayaans Choco Tech",
    address1: "IDA PHASE 2, Cherlapally,",
    address2: "Hyderabad, TG, India",
    city: "",
    gstin: "36AALCM5866A1ZC",
    pan: "AALCM5866A",
  },
  billTo: {
    company: "",
    address: "",
    gstin: "",
    contact: "",
  },
  items: [
    { id: "1", description: "Almond Sprinkler System", model: "MCT-SP", hsn: "84382000", quantity: 1, price: 1150000 },
  ],
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
  invoiceNumber: "MCT-10-2026-28",
  authorizedBy: "G Chandra Shekar Reddy",
  tagline: "Engineered with care. Delivered with purpose.",
};

function Field({ label, value, onChange, textarea }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      {textarea ? (
        <textarea
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">{title}</h3>
      {children}
    </div>
  );
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const existing = id ? getInvoice(id) : undefined;
  const [data, setData] = useState<InvoiceData>(() => {
    if (existing) {
      const { savedId: _s, savedAt: _a, ...rest } = existing;
      return rest;
    }
    return DEFAULT_DATA;
  });

  const [savedId] = useState<string | undefined>(existing?.savedId);
  const [previewScale, setPreviewScale] = useState(0.55);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceHeight, setInvoiceHeight] = useState(0);
  const [justSaved, setJustSaved] = useState(false);

  useLayoutEffect(() => {
    const el = invoiceRef.current;
    if (!el) return;
    const update = () => setInvoiceHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [data]);

  function set<K extends keyof InvoiceData>(key: K, val: InvoiceData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  function setNested<K extends keyof InvoiceData>(key: K, field: string, val: string) {
    setData((d) => ({ ...d, [key]: { ...(d[key] as object), [field]: val } }));
  }

  function addItem() {
    const item: LineItem = { id: Date.now().toString(), description: "", model: "", hsn: "", quantity: 1, price: 0 };
    setData((d) => ({ ...d, items: [...d.items, item] }));
  }

  function updateItem(id: string, field: keyof LineItem, val: string | number) {
    setData((d) => ({ ...d, items: d.items.map((item) => item.id === id ? { ...item, [field]: val } : item) }));
  }

  function removeItem(id: string) {
    setData((d) => ({ ...d, items: d.items.filter((item) => item.id !== id) }));
  }

  function handleSave() {
    saveInvoice(data, savedId);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function handlePrint() {
    const printArea = document.getElementById("invoice-print");
    if (!printArea) return;
    const rect = printArea.getBoundingClientRect();
    const pageWidth = Math.ceil(Math.max(printArea.scrollWidth, rect.width));
    const pageHeight = Math.ceil(Math.max(printArea.scrollHeight, rect.height));
    const pageWidthMm = (pageWidth / 96) * 25.4;
    const pageHeightMm = (pageHeight / 96) * 25.4;
    const w = window.open("", "_blank");
    if (!w) return;
    const styles = Array.from(document.styleSheets)
      .map((s) => { try { return Array.from(s.cssRules).map((r) => r.cssText).join("\n"); } catch { return ""; } })
      .join("\n");
    w.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${data.invoiceType} - ${data.invoiceNumber}</title>
      <style>${styles}</style>
      <style>
        @page { size: ${pageWidthMm}mm ${pageHeightMm}mm; margin: 0; }
        html, body { margin: 0; padding: 0; width: ${pageWidth}px; height: ${pageHeight}px; background: #fff; overflow: visible; }
        #invoice-print { width: ${pageWidth}px; height: ${pageHeight}px; break-inside: avoid; page-break-inside: avoid; page-break-after: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      </style>
      </head><body>${printArea.outerHTML}
      <script>(function(){function go(){window.focus();window.print();}var imgs=Array.prototype.slice.call(document.images);var pending=imgs.filter(function(i){return!i.complete;}).length;if(pending===0){setTimeout(go,200);return;}imgs.forEach(function(i){if(i.complete)return;i.addEventListener("load",done);i.addEventListener("error",done);});function done(){if(--pending<=0)setTimeout(go,200);}})();<\/script>
      </body></html>`);
    w.document.close();
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="no-print sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-semibold text-gray-800">Invoice Generator</span>
          </div>
          <button
            onClick={() => navigate("/invoices")}
            className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
          >
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
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              justSaved
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600"
            }`}
          >
            {justSaved ? "Saved!" : "Save Invoice"}
          </button>
          <button
            onClick={handlePrint}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Form panel */}
        <aside className="no-print w-80 min-w-80 bg-white border-r border-gray-200 overflow-y-auto flex flex-col gap-6 p-5">

          <Section title="Invoice Info">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Invoice Type</label>
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                value={data.invoiceType}
                onChange={(e) => set("invoiceType", e.target.value)}
              >
                <option>Proforma Invoice</option>
                <option>Tax Invoice</option>
              </select>
            </div>
            <Field label="Invoice Number" value={data.invoiceNumber ?? ""} onChange={(v) => set("invoiceNumber", v)} />
            <Field label="Date" value={data.invoiceDate ?? ""} onChange={(v) => set("invoiceDate", v)} />
            <Field label="Due Date" value={data.dueDate ?? ""} onChange={(v) => set("dueDate", v)} />
          </Section>

          <Section title="Bill To">
            <Field label="Company" value={data.billTo.company ?? ""} onChange={(v) => setNested("billTo", "company", v)} />
            <Field label="Address" value={data.billTo.address ?? ""} onChange={(v) => setNested("billTo", "address", v)} />
            <Field label="GSTIN" value={data.billTo.gstin ?? ""} onChange={(v) => setNested("billTo", "gstin", v)} />
            <Field label="Contact" value={data.billTo.contact ?? ""} onChange={(v) => setNested("billTo", "contact", v)} />
          </Section>

          <Section title="Order Details">
            <div className="grid grid-cols-[1fr_72px_56px_80px_20px] gap-2 px-1">
              {["Description", "HSN", "Qty", "Price (₹)", ""].map((h) => (
                <span key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{h}</span>
              ))}
            </div>
            {data.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_72px_56px_80px_20px] gap-2 items-center">
                <input
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                  placeholder="Description"
                  value={item.description ?? ""}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                />
                <input
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                  placeholder="HSN"
                  value={item.hsn ?? ""}
                  onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                />
                <input
                  type="number" min={1}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
                  value={item.quantity ?? 1}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 1)}
                />
                <input
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  inputMode="numeric"
                  placeholder="0"
                  value={item.price === 0 ? "" : String(item.price)}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                />
                {data.items.length > 1 ? (
                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 text-base leading-none transition-colors">✕</button>
                ) : (
                  <span />
                )}
              </div>
            ))}
            <button
              onClick={addItem}
              className="border-2 border-dashed border-gray-200 rounded-lg py-2 text-sm text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
            >
              + Add Item
            </button>
          </Section>

          <Section title="Amount">
            <Field label="Tax Rate (%)" value={String(data.taxRate ?? 0)} onChange={(v) => set("taxRate", Number(v) || 0)} />
            <Field label="Discount (%) — optional" value={String(data.discountRate ?? 0)} onChange={(v) => set("discountRate", Number(v) || 0)} />
          </Section>

          <Section title="Terms">
            {data.terms.map((term, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
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
                  className="text-red-400 hover:text-red-600 self-start pt-2 text-lg leading-none"
                >×</button>
              </div>
            ))}
            <button
              onClick={() => set("terms", [...data.terms, ""])}
              className="border-2 border-dashed border-gray-200 rounded-lg py-2 text-sm text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
            >
              + Add Term
            </button>
          </Section>
        </aside>

        {/* Preview panel */}
        <main className="flex-1 overflow-auto bg-gray-100 flex justify-center py-8">
          <div style={{ width: 1350 * previewScale, height: invoiceHeight * previewScale }}>
            <div
              ref={invoiceRef}
              className="shadow-xl"
              style={{ transform: `scale(${previewScale})`, transformOrigin: "top left", width: 1350 }}
            >
              <InvoiceView data={data} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
