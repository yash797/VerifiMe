import type { Currency } from "@/types/currency";
import {
  isNetworkError,
  isServiceUnavailableStatus,
  USER_MESSAGES,
} from "@/lib/userMessages";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function fetchCurrencies(): Promise<Currency[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/currencies`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (isServiceUnavailableStatus(response.status)) {
        throw new Error(USER_MESSAGES.serviceUnavailable);
      }

      throw new Error(USER_MESSAGES.currenciesUnavailable);
    }

    return response.json();
  } catch (error) {
    if (isNetworkError(error)) {
      throw new Error(USER_MESSAGES.serviceUnavailable);
    }

    throw error;
  }
}
