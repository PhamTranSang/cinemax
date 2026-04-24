package app.cinemax.auth.api.exceptions;

public class BadCredentialsException extends RuntimeException {

    public BadCredentialsException(final String message) {
        super(message);
    }
}
