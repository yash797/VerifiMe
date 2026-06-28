"use client";

import {
  Box,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CurrencySelect from "@/components/CurrencySelect";
import type { Currency } from "@/types/currency";
import type { InvoiceLineFormState } from "@/types/invoice";

interface InvoiceLineRowProps {
  line: InvoiceLineFormState;
  index: number;
  canRemove: boolean;
  currencies: Currency[];
  currenciesLoading?: boolean;
  onChange: (id: string, field: keyof InvoiceLineFormState, value: string) => void;
  onRemove: (id: string) => void;
}

export default function InvoiceLineRow({
  line,
  index,
  canRemove,
  currencies,
  currenciesLoading = false,
  onChange,
  onRemove,
}: InvoiceLineRowProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ mb: 2, alignItems: { md: "center" } }}
    >
      <TextField
        label={`Description ${index + 1}`}
        value={line.description}
        onChange={(event) => onChange(line.id, "description", event.target.value)}
        fullWidth
        required
        sx={{ flex: 2 }}
      />
      <TextField
        label="Amount"
        type="number"
        value={line.amount}
        onChange={(event) => onChange(line.id, "amount", event.target.value)}
        required
        slotProps={{
          htmlInput: { min: 0, step: "0.01" },
        }}
        sx={{ flex: 1, minWidth: 140 }}
      />
      <CurrencySelect
        id={`line-currency-label-${index}`}
        label="Currency"
        value={line.currency}
        currencies={currencies}
        loading={currenciesLoading}
        onChange={(value) => onChange(line.id, "currency", value)}
        sx={{ flex: 1, minWidth: 140 }}
      />
      <Box sx={{ textAlign: { xs: "right", md: "center" } }}>
        <IconButton
          aria-label={`Remove line ${index + 1}`}
          onClick={() => onRemove(line.id)}
          disabled={!canRemove}
          color="error"
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
    </Stack>
  );
}
