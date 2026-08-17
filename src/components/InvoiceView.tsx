import svgPaths from "@/imports/Frame2610/svg-xdc658nyje";
import signatureImg from "@/imports/Frame861/ab3599c73a8ab20c8a1dbf57c7d49e34852c6480.png";
import stampImg from "@/imports/Frame861/b41764a0165aa1cc9c868af67635319de3a2ee4c.png";

export interface LineItem {
  id: string;
  description: string;
  model: string;
  hsn: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  invoiceType: string;
  invoiceDate: string;
  dueDate: string;
  from: {
    company: string;
    address1: string;
    address2: string;
    city: string;
    gstin: string;
    pan: string;
  };
  billTo: {
    company: string;
    address: string;
    gstin: string;
    contact: string;
  };
  items: LineItem[];
  taxRate: number;
  discountRate: number;
  payment: {
    bank: string;
    branch: string;
    holder: string;
    account: string;
    ifsc: string;
  };
  terms: string[];
  invoiceNumber: string;
  authorizedBy: string;
  tagline: string;
}

function numberToWords(n: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function helper(num: number): string {
    if (num === 0) return "";
    if (num < 20) return ones[num] + " ";
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "") + " ";
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred " + helper(num % 100);
    if (num < 100000) return helper(Math.floor(num / 1000)) + "Thousand " + helper(num % 1000);
    if (num < 10000000) return helper(Math.floor(num / 100000)) + "Lakh " + helper(num % 100000);
    return helper(Math.floor(num / 10000000)) + "Crore " + helper(num % 10000000);
  }

  const rupees = Math.floor(Math.round(n * 100) / 100);
  const paise = Math.round(n * 100) % 100;

  let words = rupees === 0 ? "Zero" : helper(rupees).trim();
  words = "Rupees " + words;
  if (paise > 0) words += " And " + helper(paise).trim() + "Paise";
  words += " Only";

  return words.replace(/\s+/g, " ").toUpperCase();
}

function fmt(n: number) {
  return "₹ " + n.toLocaleString("en-IN");
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[m - 1]} ${d}, ${y}`;
}

const sf = { fontVariationSettings: '"wdth" 100' } as React.CSSProperties;

function Divider() {
  return <div className="bg-[rgba(142,142,142,0.54)] h-[1.25px] rounded-full w-full shrink-0" />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-[510] text-[30px] text-black tracking-[-0.3px]" style={sf}>
      {children}
    </p>
  );
}

function Logo() {
  return (
    <div className="h-[72px] relative shrink-0 w-[166px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="72" preserveAspectRatio="none" viewBox="0 0 166.39 72" width="166.39">
        <g id="Group 168">
          <g id="Vector">
            <path d={svgPaths.p714c070} fill="#E60000" />
            <path d={svgPaths.p3b807400} fill="#E60000" />
          </g>
          <g id="MAYAANâS">
            <path d={svgPaths.p2f1a5080} fill="#E60000" id="Vector_2" />
            <path d={svgPaths.pd5a0f00} fill="#E60000" id="Vector_3" />
            <path d={svgPaths.p25f7f800} fill="#E60000" id="Vector_4" />
            <path d={svgPaths.p1961ae00} fill="#E60000" id="Vector_5" />
            <path d={svgPaths.p33628ec0} fill="#E60000" id="Vector_6" />
            <path d={svgPaths.p1ddab280} fill="#E60000" id="Vector_7" />
            <path d={svgPaths.p21045600} fill="#E60000" id="Vector_8" />
            <path d={svgPaths.p41f5e00} fill="#E60000" id="Vector_9" />
          </g>
          <path d="M37.2674 43.6094H39.9864" id="Vector 118" stroke="#E60000" strokeWidth="0.292683" />
          <path d={svgPaths.p117df300} fill="#E60000" id="Vector 119" stroke="#E60000" strokeWidth="0.292683" />
          <g id="CHOCO">
            <g clipPath="url(#clip0_0_5)" id="Frame 2266">
              <path d={svgPaths.p26519670} fill="#E60000" id="Vector_10" />
              <g id="Frame 2262"><rect fill="white" height="1.46341" transform="translate(149.855 33.657)" width="0.292683" /></g>
              <g id="Frame 2264"><rect fill="white" height="1.46341" transform="translate(149.855 28.0711)" width="0.292683" /></g>
            </g>
            <path d={svgPaths.p300c5600} fill="#E60000" id="Vector_11" />
            <g clipPath="url(#clip1_0_5)" id="Frame 2267">
              <path d={svgPaths.p81b8900} fill="#E60000" id="Vector_12" />
              <g id="Frame 2261"><rect fill="white" height="1.46341" transform="translate(137.561 28.0711)" width="0.292683" /></g>
              <g id="Frame 2262_2"><rect fill="white" height="1.46341" transform="translate(137.561 33.632)" width="0.292683" /></g>
            </g>
          </g>
          <g clipPath="url(#clip2_0_5)" id="Frame 2269">
            <path d={svgPaths.pa88000} fill="#E60000" id="Vector_13" />
            <g id="Frame 2262_3"><rect fill="white" height="1.46341" transform="translate(162.064 33.6574)" width="0.292683" /></g>
            <g id="Frame 2264_2"><rect fill="white" height="1.46341" transform="translate(162.064 28.0715)" width="0.292683" /></g>
          </g>
          <g clipPath="url(#clip3_0_5)" id="Frame 2270">
            <path d={svgPaths.p35659700} fill="#E60000" id="Vector_14" />
            <g id="Frame 2261_2"><rect fill="white" height="1.46341" transform="translate(156.138 28.0715)" width="0.292683" /></g>
            <g id="Frame 2262_4"><rect fill="white" height="1.46341" transform="translate(156.138 33.6324)" width="0.292683" /></g>
          </g>
          <g id="Frame 2271"><rect fill="white" height="1.46341" transform="translate(142.28 30.7328)" width="0.292683" /></g>
          <g id="Frame 2272"><rect fill="white" height="0.585366" transform="translate(36.9728 48.5859)" width="0.29561" /></g>
          <g id="TECH">
            <path d={svgPaths.p23e6e880} fill="#E60000" id="Vector_15" />
            <path d={svgPaths.p3c294e80} fill="#E60000" id="Vector_16" />
            <path d={svgPaths.pcdebac0} fill="#E60000" id="Vector_17" />
            <g id="Frame 2273"><rect fill="white" height="1.46341" transform="translate(145.38 38.0777)" width="0.292683" /></g>
            <g id="Frame 2274"><rect fill="white" height="1.46341" transform="translate(145.38 41.0027)" width="0.292683" /></g>
            <g id="Frame 2275"><rect fill="white" height="1.46341" transform="translate(145.38 43.6371)" width="0.292683" /></g>
            <g clipPath="url(#clip4_0_5)" id="Frame 2273_2">
              <path d={svgPaths.p17e88100} fill="#E60000" id="Vector_18" />
              <g id="Frame 2261_3"><rect fill="white" height="1.46341" transform="translate(152.782 38.0477)" width="0.292683" /></g>
              <g id="Frame 2262_5"><rect fill="white" height="1.46341" transform="translate(152.782 43.6086)" width="0.292683" /></g>
            </g>
            <g id="Frame 2273_3"><rect fill="white" height="1.46341" transform="translate(157.752 40.709)" width="0.292683" /></g>
            <g id="Frame 2261_4"><rect fill="white" height="1.7561" transform="matrix(0 1 -1 0 141.366 39.3277)" width="0.292683" /></g>
          </g>
          <path d={svgPaths.p387fe00} fill="#E60000" id="Vector_19" />
        </g>
        <defs>
          <clipPath id="clip0_0_5"><rect fill="white" height="8.36319" transform="translate(147.22 28.0715)" width="5.63643" /></clipPath>
          <clipPath id="clip1_0_5"><rect fill="white" height="6.89977" transform="translate(134.928 28.0715)" width="5.33032" /></clipPath>
          <clipPath id="clip2_0_5"><rect fill="white" height="8.36319" transform="translate(159.43 28.0719)" width="5.63643" /></clipPath>
          <clipPath id="clip3_0_5"><rect fill="white" height="6.89977" transform="translate(153.504 28.0719)" width="5.33032" /></clipPath>
          <clipPath id="clip4_0_5"><rect fill="white" height="6.89977" transform="translate(150.148 38.048)" width="5.33032" /></clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function InvoiceView({ data }: { data: InvoiceData }) {
  const subtotal = data.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const discountRate = data.discountRate || 0;
  const discount = Math.round(subtotal * discountRate / 100);
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * data.taxRate / 100);
  const total = taxableAmount + tax;

  return (
    <div
      id="invoice-print"
      className="bg-[#fdfdfd] flex flex-col"
      style={{ width: 1350, fontFamily: "'SF Pro', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
    >
      {/* Header */}
      <div className="flex h-[72px] items-end justify-between px-[50px] pt-[75px] box-content">
        <Logo />
        <p
          className="font-[300] leading-none text-[#848485] text-[60px] tracking-[-1.2px]"
          style={{ fontFamily: "'SF Pro Display', 'SF Pro', -apple-system, sans-serif" }}
        >
          {data.invoiceType}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[50px] px-[50px] pt-[80px] text-[#1d1d1f]">
        {/* Order Date */}
        <div className="flex flex-col gap-[20px] items-start text-[24px]">
          <p className="font-[510] tracking-[-0.24px]" style={sf}>Order Date:</p>
          <p className="font-normal tracking-[-0.72px]" style={sf}>{formatDate(data.invoiceDate)}</p>
        </div>

        {/* From / Bill To / Ship To */}
        <div className="flex gap-[100px] items-start w-full">
          <div className="flex flex-col gap-[20px] items-start w-[303px]">
            <p className="font-[510] text-[24px] tracking-[-0.24px]" style={sf}>From:</p>
            <div className="font-normal text-[24px]" style={sf}>
              <p className="font-[510] leading-[37.5px]" style={sf}>{data.from.company}</p>
              <p className="leading-[37.5px]">{data.from.address1}</p>
              <p className="leading-[37.5px]">{data.from.address2}</p>
              {data.from.city && <p className="leading-[37.5px]">{data.from.city}</p>}
              <p className="leading-[37.5px]">GSTIN: {data.from.gstin}</p>
              <p className="leading-[37.5px]">PAN: {data.from.pan}</p>
            </div>
          </div>

          <div className="flex flex-col gap-[20px] items-start w-[414px]">
            <p className="font-[510] text-[24px] tracking-[-0.24px]" style={sf}>Bill To:</p>
            {data.billTo.company ? (
              <div className="text-[24px]" style={sf}>
                <p className="font-[510] leading-[36px] tracking-[0.24px]">{data.billTo.company}</p>
                <p className="font-normal leading-[36px] tracking-[0.24px]">{data.billTo.address}</p>
                <p className="font-normal leading-[36px]">GSTIN: {data.billTo.gstin}</p>
                {data.billTo.contact && <p className="font-normal leading-[36px]">Contact: {data.billTo.contact}</p>}
              </div>
            ) : (
              <p className="font-normal italic text-[#b0b0b0] text-[24px] leading-[36px]" style={sf}>Client Details</p>
            )}
          </div>

          <div className="flex flex-col gap-[20px] items-start flex-1">
            <p className="font-[510] text-[24px] tracking-[-0.24px]" style={sf}>Ship To:</p>
            {data.billTo.company ? (
              <div className="text-[24px]" style={sf}>
                <p className="font-[510] leading-[36px] tracking-[0.24px]">{data.billTo.company}</p>
                <p className="font-normal leading-[36px] tracking-[0.24px]">{data.billTo.address}</p>
                <p className="font-normal leading-[36px]">GSTIN: {data.billTo.gstin}</p>
                {data.billTo.contact && <p className="font-normal leading-[36px]">Contact: {data.billTo.contact}</p>}
              </div>
            ) : (
              <p className="font-normal italic text-[#b0b0b0] text-[24px] leading-[36px]" style={sf}>Shipping…</p>
            )}
          </div>
        </div>

        <Divider />

        {/* Order Details */}
        <div className="flex flex-col gap-[40px] items-start">
          <SectionTitle>Order Details</SectionTitle>

          <div className="flex flex-col gap-[25px] w-full">
            {/* Table header */}
            <div className="grid grid-cols-[360px_220px_200px_230px_240px] items-start w-full font-[510] text-[#1d1d1f] text-[24px] tracking-[-0.24px]">
              <p style={sf}>Description</p>
              <p style={sf}>HSN</p>
              <p style={sf}>Quantity</p>
              <p style={sf}>Price</p>
              <p className="text-right" style={sf}>Amount</p>
            </div>

            <Divider />

            {/* Line items */}
            {data.items.length === 0 ? (
              <div className="grid grid-cols-[360px_220px_200px_230px_240px] items-center w-full text-[24px]">
                <p className="font-normal italic text-[#b0b0b0]" style={sf}>Add line items</p>
                <p className="font-normal text-[#b0b0b0]" style={sf}>—</p>
                <p className="font-normal text-[#b0b0b0]" style={sf}>—</p>
                <p className="font-normal text-[#b0b0b0]" style={sf}>—</p>
                <p className="font-normal text-[#b0b0b0] text-right" style={sf}>—</p>
              </div>
            ) : data.items.map((item) => {
              const amount = item.quantity * item.price;
              return (
                <div key={item.id} className="grid grid-cols-[360px_220px_200px_230px_240px] items-center w-full font-normal text-[#1d1d1f] text-[24px] tracking-[-0.24px]">
                  <div className="flex flex-col gap-[8px]">
                    <p className="font-[510] text-[22px] tracking-[-0.22px]" style={sf}>{item.description}</p>
                    {item.model && <p className="font-normal text-[16px]" style={sf}>Model: {item.model}</p>}
                  </div>
                  <p style={sf}>{item.hsn}</p>
                  <p style={sf}>{item.quantity}</p>
                  <p style={sf}>{fmt(item.price)}</p>
                  <p className="text-right" style={sf}>{fmt(amount)}</p>
                </div>
              );
            })}

            <Divider />

            {/* Tax Summary — right-aligned block, heading left-aligned with labels */}
            <div className="pt-[15px] w-full">
              <div className="ml-auto flex flex-col gap-[16px] w-[610px]">
                <p className="font-[510] text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>Tax Summary</p>

                <div className="flex flex-col gap-[12px]">
                  <div className="flex items-center justify-between">
                    <p className="font-normal text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>Subtotal</p>
                    <p className="font-normal text-[#1d1d1f] text-[24px] text-right tracking-[-0.24px]" style={sf}>{fmt(subtotal)}</p>
                  </div>

                  {discountRate > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="font-normal text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>Discount ({discountRate}%)</p>
                        <p className="font-normal text-[#1d1d1f] text-[24px] text-right tracking-[-0.24px]" style={sf}>- {fmt(discount)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-normal text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>Subtotal after Discount</p>
                        <p className="font-normal text-[#1d1d1f] text-[24px] text-right tracking-[-0.24px]" style={sf}>{fmt(taxableAmount)}</p>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pb-[18px] border-b border-[#c1c1c1]">
                    <p className="font-normal text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>IGST ({data.taxRate}%)</p>
                    <p className="font-normal text-[#1d1d1f] text-[24px] text-right tracking-[-0.24px]" style={sf}>{fmt(tax)}</p>
                  </div>

                  <div className="flex items-center justify-between pt-[6px]">
                    <p className="font-[510] text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>Total Payable (Incl. GST)</p>
                    <p className="font-[510] text-[#1d1d1f] text-[24px] text-right tracking-[-0.24px]" style={sf}>{fmt(total)}</p>
                  </div>
                </div>
              </div>

              {/* Amount in words — centered across the table */}
              <div className="pt-[24px]">
                <p className={`font-[510] text-[24px] text-center tracking-[0.5px] ${total === 0 ? "italic text-[#b0b0b0]" : "text-[#1d1d1f]"}`} style={sf}>
                  {total === 0 ? "*AMOUNT IN WORDS*" : `*${numberToWords(total)}*`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Payment Information */}
        <div className="flex flex-col gap-[40px] w-full">
          <SectionTitle>Payment Information</SectionTitle>

          <div className="flex items-start w-full">
            <div className="flex flex-col gap-[12px] w-[720px]">
              {[
                ["Bank Name", data.payment.bank],
                ["Bank Branch", data.payment.branch],
                ["A/C Holder", data.payment.holder],
                ["A/C Number", data.payment.account],
                ["IFSC Code", data.payment.ifsc],
              ].map(([label, value]) => (
                <p key={label} className="font-[510] text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>
                  {label}: <span className="font-normal">{value}</span>
                </p>
              ))}
            </div>

            <div className="flex-1">
              <div className="font-[510] text-[#1d1d1f] text-[24px] tracking-[-0.24px]" style={sf}>
                <p className="leading-[40px]">Terms</p>
                <ul className="list-disc pl-6">
                  {data.terms.map((term, i) => (
                    <li key={i} className="leading-[40px]">
                      <span className="font-normal" style={sf}>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Invoice Details */}
        <div className="flex flex-col gap-[40px] w-full">
          <SectionTitle>Invoice Details</SectionTitle>

          <div className="flex flex-col gap-[20px] w-full">
            <div className="flex gap-[150px] items-start font-[510] text-[#1d1d1f] text-[24px] tracking-[-0.24px] w-full">
              <p className="w-[192px]" style={sf}>Invoice Number</p>
              <p className="w-[190px]" style={sf}>Invoice Date</p>
              <p className="w-[190px]" style={sf}>Due Date</p>
            </div>

            <div className="flex gap-[150px] items-start font-normal text-[#1d1d1f] text-[24px] tracking-[-0.72px] w-full mb-[24px]">
              <p className="w-[192px]" style={sf}>{data.invoiceNumber}</p>
              <p className="w-[190px]" style={sf}>{formatDate(data.invoiceDate)}</p>
              <p className="w-[190px]" style={sf}>{formatDate(data.dueDate)}</p>
            </div>

            {/* Divider after Invoice Details, before Authorised By */}
            <Divider />
          </div>

          {/* Authorised By — signature + company stamp */}
          <div className="flex flex-col gap-[12px] items-end w-full">
            <p className="font-[510] text-[#1d1d1f] text-[22px] tracking-[-0.22px] w-[250px]" style={sf}>Authorised By</p>
            <p className="font-normal text-[#1d1d1f] text-[22px] tracking-[-0.22px] w-[250px]" style={sf}>{data.authorizedBy}</p>
            <div className="h-[190px] overflow-clip relative w-[321px]">
              {/* Company stamp */}
              <div className="absolute left-0 size-[250px] top-[-30.25px]">
                <img alt="Company stamp" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full ml-[60px]" src={stampImg} />
              </div>
              {/* Signature */}
              <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[265.423px] items-center justify-center left-[calc(50%-57.38px)] top-[calc(50%+12.33px)] w-[244.931px]">
                <div className="flex-none rotate-[14.12deg]">
                  <div className="h-[224.351px] relative w-[196.115px] mb-[60px] ml-[40px]">
                    <img alt="Authorised signature" className="absolute block inset-0 max-w-none size-full mb-[10px] ml-[50px]" height="224.351" src={signatureImg} width="196.115" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="flex justify-center pb-[70px] pt-[120px]">
        <p className="font-normal italic text-[#e60000] text-[28px] text-center tracking-[0.28px]" style={sf}>
          {data.tagline}
        </p>
      </div>
    </div>
  );
}
