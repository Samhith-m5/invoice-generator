import { useState } from "react";
import { useNavigate } from "react-router";
import { loadInvoices, deleteInvoice, type SavedInvoice } from "@/lib/invoiceStore";

function fmt(n: number) {
  return "₹ " + n.toLocaleString("en-IN");
}

function calcTotal(inv: SavedInvoice) {
  const subtotal = inv.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const discount = Math.round(subtotal * (inv.discountRate || 0) / 100);
  const taxable = subtotal - discount;
  return taxable + Math.round(taxable * inv.taxRate / 100);
}

function InvoiceCard({ inv, onDelete }: { inv: SavedInvoice; onDelete: () => void }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-gray-900 text-sm">{inv.invoiceNumber}</p>
          <p className="text-xs text-gray-400">{inv.invoiceDate}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
          inv.invoiceType === "Tax Invoice"
            ? "bg-blue-50 text-blue-700"
            : "bg-orange-50 text-orange-700"
        }`}>
          {inv.invoiceType}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-gray-800">{inv.billTo.company}</p>
        <p className="text-xs text-gray-400 truncate">{inv.billTo.address}</p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <p className="font-semibold text-gray-900 text-sm">{fmt(calcTotal(inv))}</p>
        <p className="text-xs text-gray-400">{inv.items.length} item{inv.items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => navigate(`/edit/${inv.savedId}`)}
          className="flex-1 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 text-xs font-medium py-2 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
        >
          Edit
        </button>
        {confirming ? (
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => { onDelete(); setConfirming(false); }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="px-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 text-xs font-medium py-2 rounded-lg border border-gray-200 hover:border-red-200 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function Group({ title, invoices, onDelete, accent }: {
  title: string;
  invoices: SavedInvoice[];
  onDelete: (id: string) => void;
  accent: string;
}) {
  if (invoices.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-5 rounded-full ${accent}`} />
        <h2 className="font-semibold text-gray-700 text-sm">{title}</h2>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{invoices.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {invoices.map((inv) => (
          <InvoiceCard key={inv.savedId} inv={inv} onDelete={() => onDelete(inv.savedId)} />
        ))}
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const navigate = useNavigate();
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
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-semibold text-gray-800">My Invoices</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Invoice
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M8 4h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M10 10h8M10 14h8M10 18h5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-600">No invoices saved yet</p>
              <p className="text-sm text-gray-400 mt-1">Create an invoice and click "Save Invoice" to see it here.</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors mt-2"
            >
              Create Invoice
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-10 max-w-6xl mx-auto">
            <Group title="Proforma Invoices" invoices={proforma} onDelete={handleDelete} accent="bg-orange-400" />
            <Group title="Tax Invoices" invoices={tax} onDelete={handleDelete} accent="bg-blue-400" />
            <Group title="Other" invoices={other} onDelete={handleDelete} accent="bg-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
}
