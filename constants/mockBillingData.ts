/*
  We don't have access to the real KUB API, so this file acts as a stand-in.
  It holds fake but realistic data that mimics what the real API would return.
*/

import { parseISO } from "date-fns";
 
/*
  We define two separate types because invoices and payments have different fields.
*/

export type InvoiceItem = {
  type: "invoice";      // Can only ever be the string "invoice"
  id: string;           // Unique identifier, e.g. "INV-009"
  invoiceDate: string;  // The date the invoice was generated, shown in the UI
  amountDue: number;    // How much the customer owes
  dueDate: string;      // Deadline for payment
  pdfUrl: string;       // Sample pdf url to open a pdf in bills and payments
}
 
export type PaymentItem = {
  type: "payment";       // Can only ever be the string "payment"
  id: string;            // Unique identifier, e.g. "PE-482910573641"
  paymentDate: string;   // The date the payment was made
  paymentAmount: number; // How much was paid
  paymentType: string;   // How it was paid, e.g. "Electronic Payment"
  paymentStatus: string; // Whether it went through, e.g. "Completed"
  invoiceId: string;     // Links this payment back to the invoice it was paying
}

/*
  BillingItem can be either an InvoiceItem OR a PaymentItem. This is the type we use for the combined
  list that our FlatList consumes, since that list contains both types of items.
*/
export type BillingItem = InvoiceItem | PaymentItem;


/*
  MOCK DATA
  These are the fake invoices and payments. In production these would come
  from an API call using the logged in customer's account number.
*/
export const mockInvoices: InvoiceItem[] = [
{
    type: "invoice",
    id: "INV-001",
    invoiceDate: "2025-06-12",
    amountDue: 198.90,
    dueDate: "2025-07-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-002",
    invoiceDate: "2025-07-12",
    amountDue: 260.15,
    dueDate: "2025-08-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-003",
    invoiceDate: "2025-08-13",
    amountDue: 245.00,
    dueDate: "2025-09-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-004",
    invoiceDate: "2025-09-12",
    amountDue: 220.40,
    dueDate: "2025-10-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-005",
    invoiceDate: "2025-10-13",
    amountDue: 178.20,
    dueDate: "2025-11-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-006",
    invoiceDate: "2025-11-12",
    amountDue: 195.75,
    dueDate: "2025-12-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-007",
    invoiceDate: "2025-12-12",
    amountDue: 210.00,
    dueDate: "2026-01-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-008",
    invoiceDate: "2026-01-13",
    amountDue: 187.50,
    dueDate: "2026-02-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-009",
    invoiceDate: "2026-02-12",
    amountDue: 200.00,
    dueDate: "2026-03-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
  {
    type: "invoice",
    id: "INV-010",
    invoiceDate: "2026-03-12",
    amountDue: 225.00,
    dueDate: "2026-04-02",
    pdfUrl: "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  },
];

export const mockPayments: PaymentItem[] = [
{
    type: "payment",
    id: "PE-102938471620",
    paymentDate: "2025-06-29",
    paymentAmount: 198.90,
    paymentType: "Electronic Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-001",
  },
  {
    type: "payment",
    id: "PE-374619028374",
    paymentDate: "2025-07-30",
    paymentAmount: 260.15,
    paymentType: "Paymentus Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-002",
  },
  {
    type: "payment",
    id: "PE-910283746519",
    paymentDate: "2025-08-29",
    paymentAmount: 245.00,
    paymentType: "Electronic Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-003",
  },
  {
    type: "payment",
    id: "PE-564738291047",
    paymentDate: "2025-09-29",
    paymentAmount: 220.40,
    paymentType: "Electronic Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-004",
  },
  {
    type: "payment",
    id: "PE-827364910283",
    paymentDate: "2025-10-30",
    paymentAmount: 178.20,
    paymentType: "Paymentus Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-005",
  },
  {
    type: "payment",
    id: "PE-193847261058",
    paymentDate: "2025-11-28",
    paymentAmount: 195.75,
    paymentType: "Electronic Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-006",
  },
  {
    type: "payment",
    id: "PE-371829046512",
    paymentDate: "2025-12-29",
    paymentAmount: 210.00,
    paymentType: "Paymentus Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-007",
  },
  {
    type: "payment",
    id: "PE-482910573641",
    paymentDate: "2026-01-30",
    paymentAmount: 187.50,
    paymentType: "Electronic Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-008",
  },
  {
    type: "payment",
    id: "PE-482911245642",
    paymentDate: "2026-02-27",
    paymentAmount: 200.00,
    paymentType: "Electronic Payment",
    paymentStatus: "Completed",
    invoiceId: "INV-009",
  },
];

/*
  FlatList needs a single flat array to work with. This takes both arrays,
  spreads them into one, and sorts everything by date newest first.
*/
export const billingData: BillingItem[] = [
  ...mockInvoices,
  ...mockPayments,
].sort((a, b) => {
  const dateA = parseISO(a.type === "payment" ? a.paymentDate : a.invoiceDate);
  const dateB = parseISO(b.type === "payment" ? b.paymentDate : b.invoiceDate);
  return dateB.getTime() - dateA.getTime();
});