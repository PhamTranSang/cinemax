package app.cinemax.auth.api.exceptions;

public class ConflictException extends RuntimeException {

    public ConflictException(final String message) {
        super(message);
    }
}
