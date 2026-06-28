package com.verifime.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.verifime.client.ExchangeRateQuote;
import com.verifime.client.FrankfurterClient;
import com.verifime.util.MoneyUtils;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
class ExchangeRateServiceTest {

    @Inject
    ExchangeRateService exchangeRateService;

    @InjectMock
    @RestClient
    FrankfurterClient frankfurterClient;

    @BeforeEach
    void setUp() {
        when(frankfurterClient.getRates(anyString(), anyString(), anyString()))
                .thenReturn(List.of(
                        new ExchangeRateQuote("2020-07-07", "USD", "NZD", new BigDecimal("1.52691"))));
    }

    @Test
    void sameCurrencyReturnsUnitRate() {
        BigDecimal rate = exchangeRateService.getRate("NZD", "NZD", LocalDate.of(2020, 7, 7));
        assertEquals(new BigDecimal("1.0000"), rate);
    }

    @Test
    void fetchedRateIsRoundedToFourDecimalPlaces() {
        BigDecimal rate = exchangeRateService.getRate("USD", "NZD", LocalDate.of(2020, 7, 7));
        assertEquals(MoneyUtils.roundRate(new BigDecimal("1.52691")), rate);
        assertEquals(new BigDecimal("1.5269"), rate);
    }
}
