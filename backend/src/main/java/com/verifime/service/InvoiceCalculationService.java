package com.verifime.service;

import java.math.BigDecimal;

import com.verifime.dto.Invoice;
import com.verifime.dto.InvoiceLine;
import com.verifime.util.MoneyUtils;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class InvoiceCalculationService {

    private final ExchangeRateService exchangeRateService;

    @Inject
    public InvoiceCalculationService(ExchangeRateService exchangeRateService) {
        this.exchangeRateService = exchangeRateService;
    }

    public BigDecimal calculateTotal(Invoice invoice) {
        BigDecimal total = BigDecimal.ZERO;

        for (InvoiceLine line : invoice.lines()) {
            BigDecimal rate = exchangeRateService.getRate(
                    line.currency(),
                    invoice.currency(),
                    invoice.date());
            BigDecimal lineTotal = MoneyUtils.roundMoney(line.amount().multiply(rate));
            total = total.add(lineTotal);
        }

        return MoneyUtils.roundMoney(total);
    }
}
