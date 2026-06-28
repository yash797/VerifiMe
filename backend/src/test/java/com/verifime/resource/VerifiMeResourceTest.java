package com.verifime.resource;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.verifime.client.ExchangeRateQuote;
import com.verifime.client.FrankfurterClient;
import com.verifime.client.FrankfurterCurrencyResponse;

import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@QuarkusTest
class VerifiMeResourceTest {

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

        when(frankfurterClient.getCurrencies("all")).thenReturn(List.of(
                new FrankfurterCurrencyResponse(
                        "NZD", "554", "New Zealand Dollar", "$", "1990-05-02", "2026-06-28"),
                new FrankfurterCurrencyResponse(
                        "USD", "840", "United States Dollar", "$", "1948-06-21", "2026-06-28")));
    }

    @Test
    void returnsSortedCurrenciesAsJson() {
        given()
                .when()
                .get("/currencies")
                .then()
                .statusCode(200)
                .contentType("application/json")
                .body("$", hasSize(2))
                .body("[0].iso_code", equalTo("NZD"))
                .body("[0].name", equalTo("New Zealand Dollar"))
                .body("[1].iso_code", equalTo("USD"));
    }

    @Test
    void returnsPlainTextTotalOnSuccess() {
        given()
                .contentType(ContentType.JSON)
                .body("""
                        {
                          "invoice": {
                            "currency": "NZD",
                            "date": "2020-07-07",
                            "lines": [
                              { "description": "Intel Core i9", "currency": "USD", "amount": 700 },
                              { "description": "ASUS ROG Strix", "currency": "AUD", "amount": 500 }
                            ]
                          }
                        }
                        """)
                .when()
                .post("/invoice/total")
                .then()
                .statusCode(200)
                .contentType("text/plain")
                .body(equalTo("1599.48"));
    }

    @Test
    void returnsBadRequestForMissingInvoice() {
        given()
                .contentType(ContentType.JSON)
                .body("{}")
                .when()
                .post("/invoice/total")
                .then()
                .statusCode(400)
                .contentType("text/plain")
                .body(startsWith("Error:"));
    }

    @Test
    void returnsNotFoundWhenExchangeRateUnavailable() {
        when(frankfurterClient.getRates(eq("1990-01-01"), eq("USD"), eq("NZD")))
                .thenThrow(new WebApplicationException(Response.status(404).build()));

        given()
                .contentType(ContentType.JSON)
                .body("""
                        {
                          "invoice": {
                            "currency": "NZD",
                            "date": "1990-01-01",
                            "lines": [
                              { "description": "Item", "currency": "USD", "amount": 100 }
                            ]
                          }
                        }
                        """)
                .when()
                .post("/invoice/total")
                .then()
                .statusCode(404)
                .contentType("text/plain")
                .body(equalTo("Error: Exchange rate data not found for the given date or currencies"));
    }

    @Test
    void returnsBadRequestForInvalidJson() {
        given()
                .contentType(ContentType.JSON)
                .body("{ invalid json")
                .when()
                .post("/invoice/total")
                .then()
                .statusCode(400)
                .contentType("text/plain")
                .body(equalTo("Error: Invalid request"));
    }
}
