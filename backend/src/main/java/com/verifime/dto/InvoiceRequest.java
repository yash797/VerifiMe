package com.verifime.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record InvoiceRequest(@NotNull(message = "Invoice is required") @Valid Invoice invoice) {
}
