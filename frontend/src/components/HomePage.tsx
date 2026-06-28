"use client";

import { Container, Typography } from "@mui/material";
import InvoiceForm from "@/components/InvoiceForm";

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        VerifiMe
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Calculate invoice totals across multiple currencies using historical
        exchange rates.
      </Typography>
      <InvoiceForm />
    </Container>
  );
}
