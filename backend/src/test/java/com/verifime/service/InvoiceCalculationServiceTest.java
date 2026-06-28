package com.verifime.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.verifime.client.ExchangeRateQuote;
import com.verifime.client.FrankfurterClient;
import com.verifime.dto.Invoice;
import com.verifime.dto.InvoiceLine;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;

@QuarkusTest
class InvoiceCalculationServiceTest {

    @Inject
    InvoiceCalculationService invoiceCalculationService;

    @InjectMock
    @RestClient
    FrankfurterClient frankfurterClient;

    @BeforeEach
    void setUp() {
        when(frankfurterClient.getRates(eq("2020-07-07"), eq("USD"), eq("NZD")))
                .thenReturn(List.of(
                        new ExchangeRateQuote("2020-07-07", "USD", "NZD", new BigDecimal("1.5269"))));

        when(frankfurterClient.getRates(eq("2020-07-07"), eq("AUD"), eq("NZD")))
                .thenReturn(List.of(
                        new ExchangeRateQuote("2020-07-07", "AUD", "NZD", new BigDecimal("1.0613"))));
    }

    @Test
    void calculatesMultiLineInvoiceTotalWithTwoDecimalRounding() {
        Invoice invoice = new Invoice(
                "NZD",
                LocalDate.of(2020, 7, 7),
                List.of(
                        new InvoiceLine("Intel Core i9", "USD", new BigDecimal("700")),
                        new InvoiceLine("ASUS ROG Strix", "AUD", new BigDecimal("500"))));

        BigDecimal total = invoiceCalculationService.calculateTotal(invoice);

        assertEquals(new BigDecimal("1599.48"), total);
    }
}
