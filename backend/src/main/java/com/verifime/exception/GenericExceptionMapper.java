package com.verifime.exception;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GenericExceptionMapper implements ExceptionMapper<Throwable> {

    @Override
    public Response toResponse(Throwable exception) {
        if (exception instanceof ExchangeRateNotFoundException) {
            return new ExchangeRateNotFoundExceptionMapper().toResponse((ExchangeRateNotFoundException) exception);
        }

        if (exception instanceof jakarta.validation.ConstraintViolationException) {
            return new ConstraintViolationExceptionMapper()
                    .toResponse((jakarta.validation.ConstraintViolationException) exception);
        }

        if (isInvalidRequest(exception)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .type(MediaType.TEXT_PLAIN)
                    .entity("Error: Invalid request")
                    .build();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .type(MediaType.TEXT_PLAIN)
                .entity("Error: An unexpected error occurred")
                .build();
    }

    private boolean isInvalidRequest(Throwable exception) {
        Throwable current = exception;
        while (current != null) {
            if (current instanceof BadRequestException
                    || current instanceof JsonParseException
                    || current instanceof JsonMappingException) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}
