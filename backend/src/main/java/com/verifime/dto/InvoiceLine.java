package com.verifime.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record InvoiceLine(
        @NotBlank(message = "Line description is required") String description,
        @NotBlank(message = "Line currency is required") String currency,
        @NotNull(message = "Line amount is required") @Positive(message = "Line amount must be positive") BigDecimal amount) {
}
