package app.cinemax.auth.api.dto.response;

public record TokenRefreshResponse(String accessToken, String tokenType) {

    public TokenRefreshResponse(final String accessToken) {
        this(accessToken, "Bearer");
    }
}
