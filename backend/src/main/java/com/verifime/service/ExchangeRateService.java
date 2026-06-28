package com.verifime.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.verifime.client.ExchangeRateQuote;
import com.verifime.client.FrankfurterClient;
import com.verifime.exception.ExchangeRateNotFoundException;
import com.verifime.util.MoneyUtils;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;

@RequestScoped
public class ExchangeRateService {

    private final FrankfurterClient frankfurterClient;
    private final Map<String, BigDecimal> rateCache = new HashMap<>();

    @Inject
    public ExchangeRateService(@RestClient FrankfurterClient frankfurterClient) {
        this.frankfurterClient = frankfurterClient;
    }

    public BigDecimal getRate(String fromCurrency, String toCurrency, LocalDate date) {
        String from = normalizeCurrency(fromCurrency);
        String to = normalizeCurrency(toCurrency);

        if (from.equals(to)) {
            return MoneyUtils.unitRate();
        }

        String cacheKey = date + "|" + from + "|" + to;
        return rateCache.computeIfAbsent(cacheKey, key -> fetchRate(from, to, date));
    }

    private BigDecimal fetchRate(String fromCurrency, String toCurrency, LocalDate date) {
        try {
            List<ExchangeRateQuote> quotes = frankfurterClient.getRates(
                    date.toString(),
                    fromCurrency,
                    toCurrency);

            if (quotes == null || quotes.isEmpty()) {
                throw new ExchangeRateNotFoundException(
                        "Exchange rate data not found for the given date or currencies");
            }

            ExchangeRateQuote quote = quotes.getFirst();
            if (quote.rate() == null) {
                throw new ExchangeRateNotFoundException(
                        "Exchange rate data not found for the given date or currencies");
            }

            return MoneyUtils.roundRate(quote.rate());
        } catch (WebApplicationException exception) {
            if (exception.getResponse() != null && exception.getResponse().getStatus() == 404) {
                throw new ExchangeRateNotFoundException(
                        "Exchange rate data not found for the given date or currencies");
            }
            throw exception;
        }
    }

    private String normalizeCurrency(String currency) {
        return currency.trim().toUpperCase();
    }
}
