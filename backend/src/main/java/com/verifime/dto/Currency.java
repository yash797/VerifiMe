package com.verifime.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.verifime.client.FrankfurterCurrencyResponse;

public record Currency(
        @JsonProperty("iso_code") String isoCode,
        @JsonProperty("iso_numeric") String isoNumeric,
        String name,
        String symbol,
        @JsonProperty("start_date") String startDate,
        @JsonProperty("end_date") String endDate) {

    public static Currency from(FrankfurterCurrencyResponse response) {
        return new Currency(
                response.isoCode(),
                response.isoNumeric(),
                response.name(),
                response.symbol(),
                response.startDate(),
                response.endDate());
    }
}
