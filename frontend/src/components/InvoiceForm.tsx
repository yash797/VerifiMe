"use client";

import { useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import CalculationResult from "@/components/CalculationResult";
import InvoiceHeaderFields from "@/components/InvoiceHeaderFields";
import InvoiceLineList from "@/components/InvoiceLineList";
import { useCurrencies } from "@/hooks/useCurrencies";
import { calculateInvoiceTotal } from "@/lib/invoiceApi";
import { USER_MESSAGES } from "@/lib/userMessages";
import type { InvoiceLineFormState, InvoiceRequest } from "@/types/invoice";

function createEmptyLine(id: string): InvoiceLineFormState {
  return {
    id,
    description: "",
    currency: "INR",
    amount: "",
  };
}

function todayIsoDate(): string {
  return dayjs().format("YYYY-MM-DD");
}

function validateForm(
  currency: string,
  date: string,
  lines: InvoiceLineFormState[],
): string | null {
  if (!date) {
    return USER_MESSAGES.invoiceDateRequired;
  }

  if (dayjs(date).isAfter(dayjs(), "day")) {
    return USER_MESSAGES.invoiceDateFuture;
  }

  if (!currency) {
    return USER_MESSAGES.baseCurrencyRequired;
  }

  if (lines.length === 0) {
    return USER_MESSAGES.lineRequired;
  }

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;

    if (!line.description.trim()) {
      return USER_MESSAGES.lineDescriptionRequired(lineNumber);
    }

    if (!line.currency) {
      return USER_MESSAGES.lineCurrencyRequired(lineNumber);
    }

    const amount = Number(line.amount);
    if (!line.amount || Number.isNaN(amount) || amount <= 0) {
      return USER_MESSAGES.lineAmountRequired(lineNumber);
    }
  }

  return null;
}

export default function InvoiceForm() {
  const nextLineIdRef = useRef(2);
  const { currencies, loading: currenciesLoading, error: currenciesError } =
    useCurrencies();
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(todayIsoDate);
  const [lines, setLines] = useState<InvoiceLineFormState[]>(() => [
    createEmptyLine("line-1"),
  ]);
  const [total, setTotal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const payload = useMemo<InvoiceRequest>(
    () => ({
      invoice: {
        currency,
        date,
        lines: lines.map((line) => ({
          description: line.description.trim(),
          currency: line.currency,
          amount: Number(line.amount),
        })),
      },
    }),
    [currency, date, lines],
  );

  const resetResult = () => {
    setTotal(null);
    setError(null);
  };

  const handleLineChange = (
    id: string,
    field: keyof InvoiceLineFormState,
    value: string,
  ) => {
    resetResult();
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    );
  };

  const handleAddLine = () => {
    resetResult();
    const id = `line-${nextLineIdRef.current++}`;
    setLines((current) => [...current, createEmptyLine(id)]);
  };

  const handleRemoveLine = (id: string) => {
    resetResult();
    setLines((current) => current.filter((line) => line.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetResult();

    const validationError = validateForm(currency, date, lines);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await calculateInvoiceTotal(payload);
    if (result.ok) {
      setTotal(result.total);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Invoice Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter invoice details and calculate a multi-currency total in your
            chosen base currency.
          </Typography>
        </Box>

        {currenciesError ? (
          <Alert severity="warning">{currenciesError}</Alert>
        ) : null}

        <InvoiceHeaderFields
          currency={currency}
          date={date}
          currencies={currencies}
          currenciesLoading={currenciesLoading}
          onCurrencyChange={(value) => {
            resetResult();
            setCurrency(value);
          }}
          onDateChange={(value) => {
            resetResult();
            setDate(value);
          }}
        />

        <InvoiceLineList
          lines={lines}
          currencies={currencies}
          currenciesLoading={currenciesLoading}
          onAddLine={handleAddLine}
          onRemoveLine={handleRemoveLine}
          onLineChange={handleLineChange}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || currenciesLoading || currencies.length === 0}
          sx={{ alignSelf: "flex-start" }}
        >
          {loading ? "Calculating..." : "Calculate Total"}
        </Button>

        <CalculationResult total={total} error={error} currency={currency} />
      </Stack>
    </Paper>
  );
}
