package com.verifime.client;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ExchangeRateQuote(
        String date,
        String base,
        String quote,
        BigDecimal rate) {
}
