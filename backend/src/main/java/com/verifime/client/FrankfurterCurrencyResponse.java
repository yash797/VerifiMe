package com.verifime.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FrankfurterCurrencyResponse(
        @JsonProperty("iso_code") String isoCode,
        @JsonProperty("iso_numeric") String isoNumeric,
        String name,
        String symbol,
        @JsonProperty("start_date") String startDate,
        @JsonProperty("end_date") String endDate) {
}
