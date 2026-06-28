const BACKEND_ERROR_MAP: Record<string, string> = {
  "Exchange rate data not found for the given date or currencies":
    "We couldn't find exchange rates for that date or currency combination. Try another date or check your currency selections.",
  "Invalid request":
    "Some of the invoice details look invalid. Please review the form and try again.",
  "An unexpected error occurred":
    "Something went wrong while calculating your total. Please try again in a moment.",
};

export const USER_MESSAGES = {
  invoiceDateRequired: "Please select an invoice date.",
  invoiceDateFuture:
    "Invoice dates must be today or in the past. Future dates aren't supported.",
  baseCurrencyRequired: "Please select a base currency for the invoice total.",
  lineRequired: "Please add at least one invoice line.",
  lineDescriptionRequired: (lineNumber: number) =>
    `Please enter a description for line ${lineNumber}.`,
  lineCurrencyRequired: (lineNumber: number) =>
    `Please select a currency for line ${lineNumber}.`,
  lineAmountRequired: (lineNumber: number) =>
    `Please enter a valid amount greater than zero for line ${lineNumber}.`,
  serviceUnavailable: "Service unavailable. Please try again.",
  calculationUnavailable:
    "Service unavailable. Please try again.",
  currenciesUnavailable:
    "Service unavailable. Please try again.",
  totalRoundsToZero: (currency: string) =>
    `The total is less than 0.01 ${currency} after conversion and rounding.`,
  calculationFallback:
    "We couldn't complete the calculation. Please try again.",
} as const;

export function toUserFriendlyApiError(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return USER_MESSAGES.calculationFallback;
  }

  if (BACKEND_ERROR_MAP[trimmed]) {
    return BACKEND_ERROR_MAP[trimmed];
  }

  if (trimmed.toLowerCase().includes("invoice is required")) {
    return "Please complete all required invoice fields before calculating.";
  }

  if (trimmed.toLowerCase().includes("must be positive")) {
    return "Each line amount must be greater than zero.";
  }

  if (trimmed.toLowerCase().includes("required")) {
    return "Please fill in all required fields before calculating.";
  }

  return trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

export function isServiceUnavailableStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

export function totalRoundsToZero(total: string): boolean {
  const value = Number.parseFloat(total);
  return !Number.isNaN(value) && value === 0;
}
