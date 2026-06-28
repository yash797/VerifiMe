"use client";

import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import CurrencySelect from "@/components/CurrencySelect";
import type { Currency } from "@/types/currency";

const today = dayjs().startOf("day");

interface InvoiceHeaderFieldsProps {
  currency: string;
  date: string;
  currencies: Currency[];
  currenciesLoading?: boolean;
  onCurrencyChange: (currency: string) => void;
  onDateChange: (date: string) => void;
}

export default function InvoiceHeaderFields({
  currency,
  date,
  currencies,
  currenciesLoading = false,
  onCurrencyChange,
  onDateChange,
}: InvoiceHeaderFieldsProps) {
  const selectedDate = date ? dayjs(date) : null;

  const handleDateChange = (value: Dayjs | null) => {
    onDateChange(value ? value.format("YYYY-MM-DD") : "");
  };

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
      <DatePicker
        label="Invoice Date"
        value={selectedDate}
        onChange={handleDateChange}
        disableFuture
        maxDate={today}
        slotProps={{
          textField: {
            fullWidth: true,
            required: true,
            helperText: "Select today or a past date",
          },
        }}
        sx={{ flex: 1 }}
      />
      <CurrencySelect
        id="invoice-currency-label"
        label="Base Currency"
        value={currency}
        currencies={currencies}
        loading={currenciesLoading}
        onChange={onCurrencyChange}
        sx={{ flex: 1 }}
      />
    </Stack>
  );
}
