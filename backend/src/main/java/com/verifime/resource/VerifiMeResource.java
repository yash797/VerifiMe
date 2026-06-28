package com.verifime.resource;

import java.math.BigDecimal;
import java.util.List;

import com.verifime.dto.Currency;
import com.verifime.dto.InvoiceRequest;
import com.verifime.service.CurrencyService;
import com.verifime.service.InvoiceCalculationService;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/")
public class VerifiMeResource {

    private final InvoiceCalculationService invoiceCalculationService;
    private final CurrencyService currencyService;

    @Inject
    public VerifiMeResource(
            InvoiceCalculationService invoiceCalculationService,
            CurrencyService currencyService) {
        this.invoiceCalculationService = invoiceCalculationService;
        this.currencyService = currencyService;
    }

    @GET
    @Path("/currencies")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Currency> getCurrencies() {
        return currencyService.getAllCurrencies();
    }

    @POST
    @Path("/invoice/total")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response calculateTotal(@Valid InvoiceRequest request) {
        BigDecimal total = invoiceCalculationService.calculateTotal(request.invoice());
        return Response.ok(total.toPlainString()).build();
    }
}
