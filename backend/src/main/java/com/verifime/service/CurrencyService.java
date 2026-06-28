package com.verifime.service;

import java.util.Comparator;
import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.verifime.client.FrankfurterClient;
import com.verifime.dto.Currency;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class CurrencyService {

    private final FrankfurterClient frankfurterClient;

    @Inject
    public CurrencyService(@RestClient FrankfurterClient frankfurterClient) {
        this.frankfurterClient = frankfurterClient;
    }

    public List<Currency> getAllCurrencies() {
        return frankfurterClient.getCurrencies("all").stream()
                .map(Currency::from)
                .sorted(Comparator.comparing(Currency::isoCode))
                .toList();
    }
}
