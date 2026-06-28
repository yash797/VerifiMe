package com.verifime.client;

import java.util.List;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@RegisterRestClient(configKey = "frankfurter-api")
@Path("/v2")
public interface FrankfurterClient {

    @GET
    @Path("/rates")
    @Produces(MediaType.APPLICATION_JSON)
    List<ExchangeRateQuote> getRates(
            @QueryParam("date") String date,
            @QueryParam("base") String base,
            @QueryParam("quotes") String quotes);

    @GET
    @Path("/currencies")
    @Produces(MediaType.APPLICATION_JSON)
    List<FrankfurterCurrencyResponse> getCurrencies(@QueryParam("scope") String scope);
}
