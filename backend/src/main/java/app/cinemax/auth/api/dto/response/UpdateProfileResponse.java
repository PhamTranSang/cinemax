package app.cinemax.auth.api.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record UpdateProfileResponse(String firstName, String lastName, LocalDate dateOfBirth, String avatarUrl,
        BigDecimal phoneNumber, Instant updatedAt) {

}
