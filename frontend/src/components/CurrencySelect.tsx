"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import type { Currency } from "@/types/currency";

interface CurrencySelectProps {
  id: string;
  label: string;
  value: string;
  currencies: Currency[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  sx?: object;
}

export default function CurrencySelect({
  id,
  label,
  value,
  currencies,
  loading = false,
  disabled = false,
  onChange,
  fullWidth = true,
  sx,
}: CurrencySelectProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} required sx={sx} disabled={disabled || loading}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        label={label}
        value={value}
        onChange={handleChange}
      >
        {currencies.map((currency) => (
          <MenuItem key={currency.iso_code} value={currency.iso_code}>
            {currency.iso_code} — {currency.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
