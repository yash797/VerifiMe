"use client";

import { Alert, Typography } from "@mui/material";
import { totalRoundsToZero, USER_MESSAGES } from "@/lib/userMessages";

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

  const roundedToZero = totalRoundsToZero(total);

  return (
    <Alert severity={roundedToZero ? "warning" : "success"} sx={{ mt: 3 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Calculated invoice total
      </Typography>
      <Typography variant="h4" component="p">
        {total} {currency}
      </Typography>
      {roundedToZero ? (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {USER_MESSAGES.totalRoundsToZero(currency)}
        </Typography>
      ) : null}
    </Alert>
  );
}
