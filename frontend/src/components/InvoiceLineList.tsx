"use client";

import { Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InvoiceLineRow from "@/components/InvoiceLineRow";
import type { Currency } from "@/types/currency";
import type { InvoiceLineFormState } from "@/types/invoice";

interface InvoiceLineListProps {
  lines: InvoiceLineFormState[];
  currencies: Currency[];
  currenciesLoading?: boolean;
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  onLineChange: (
    id: string,
    field: keyof InvoiceLineFormState,
    value: string,
  ) => void;
}

export default function InvoiceLineList({
  lines,
  currencies,
  currenciesLoading = false,
  onAddLine,
  onRemoveLine,
  onLineChange,
}: InvoiceLineListProps) {
  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        sx={{
          mb: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Invoice Lines</Typography>
        <Button startIcon={<AddIcon />} onClick={onAddLine} variant="outlined">
          Add Line
        </Button>
      </Stack>

      {lines.map((line, index) => (
        <InvoiceLineRow
          key={line.id}
          line={line}
          index={index}
          canRemove={lines.length > 1}
          currencies={currencies}
          currenciesLoading={currenciesLoading}
          onChange={onLineChange}
          onRemove={onRemoveLine}
        />
      ))}
    </Stack>
  );
}
