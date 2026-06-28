export interface InvoiceLine {
  description: string;
  currency: string;
  amount: number;
}

export interface Invoice {
  currency: string;
  date: string;
  lines: InvoiceLine[];
}

export interface InvoiceRequest {
  invoice: Invoice;
}

export interface InvoiceLineFormState {
  id: string;
  description: string;
  currency: string;
  amount: string;
}

export interface InvoiceFormState {
  currency: string;
  date: string;
  lines: InvoiceLineFormState[];
}
