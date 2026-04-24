package app.cinemax.auth.api.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateProfileRequest(LocalDate dateOfBirth, String gender, String avatarUrl, BigDecimal phoneNumber) {

}
