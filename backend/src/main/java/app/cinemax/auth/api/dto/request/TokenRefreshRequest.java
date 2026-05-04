package app.cinemax.auth.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TokenRefreshRequest(@NotBlank(message = "Refresh Token must not be empty") String refreshToken) {

}
