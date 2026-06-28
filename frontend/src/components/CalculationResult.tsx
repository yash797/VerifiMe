"use client";

import { Alert, Typography } from "@mui/material";

interface CalculationResultProps {
  total: string | null;
  error: string | null;
  currency: string;
}

export default function CalculationResult({
  total,
  error,
  currency,
}: CalculationResultProps) {
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!total) {
    return null;
  }

  return (
    <Alert severity="success" sx={{ mt: 3 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Calculated invoice total
      </Typography>
      <Typography variant="h4" component="p">
        {total} {currency}
      </Typography>
    </Alert>
  );
}
