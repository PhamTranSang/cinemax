package app.cinemax.auth.api.exceptions;

public class TokenRefreshException extends RuntimeException {

    public TokenRefreshException(final String message) {
        super(message);
    }
}
