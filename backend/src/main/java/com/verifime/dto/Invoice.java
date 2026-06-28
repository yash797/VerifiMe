package com.verifime.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record Invoice(
        @NotBlank(message = "Invoice currency is required") String currency,
        @NotNull(message = "Invoice date is required") LocalDate date,
        @NotEmpty(message = "Invoice must contain at least one line") @Valid List<InvoiceLine> lines) {
}
