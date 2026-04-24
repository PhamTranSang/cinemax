package app.cinemax.auth.api.exceptions;

public class UsernameNotFoundException extends RuntimeException {

    public UsernameNotFoundException(final String message) {
        super(message);
    }
}
