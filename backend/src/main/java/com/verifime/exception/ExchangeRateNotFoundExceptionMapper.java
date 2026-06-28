package com.verifime.exception;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ExchangeRateNotFoundExceptionMapper implements ExceptionMapper<ExchangeRateNotFoundException> {

    @Override
    public Response toResponse(ExchangeRateNotFoundException exception) {
        return Response.status(Response.Status.NOT_FOUND)
                .type(MediaType.TEXT_PLAIN)
                .entity("Error: Exchange rate data not found for the given date or currencies")
                .build();
    }
}
