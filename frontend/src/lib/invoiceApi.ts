import type { InvoiceRequest } from "@/types/invoice";
import {
  isNetworkError,
  isServiceUnavailableStatus,
  toUserFriendlyApiError,
  USER_MESSAGES,
} from "@/lib/userMessages";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type CalculateInvoiceResult =
  | { ok: true; total: string }
  | { ok: false; message: string };

export async function calculateInvoiceTotal(
  payload: InvoiceRequest,
): Promise<CalculateInvoiceResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/invoice/total`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      body: JSON.stringify(payload),
    });

    const body = await response.text();

    if (!response.ok) {
      if (isServiceUnavailableStatus(response.status)) {
        return { ok: false, message: USER_MESSAGES.serviceUnavailable };
      }

      const rawMessage = body.startsWith("Error: ")
        ? body.slice("Error: ".length)
        : body;
      return {
        ok: false,
        message: toUserFriendlyApiError(
          rawMessage || USER_MESSAGES.calculationFallback,
        ),
      };
    }

    return { ok: true, total: body.trim() };
  } catch (error) {
    if (isNetworkError(error)) {
      return { ok: false, message: USER_MESSAGES.serviceUnavailable };
    }

    return { ok: false, message: USER_MESSAGES.calculationFallback };
  }
}
