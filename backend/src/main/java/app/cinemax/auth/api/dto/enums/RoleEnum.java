package app.cinemax.auth.api.dto.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoleEnum {
    SUPER_ADMIN("Super Admin"),
    CINEMA_MANAGER("Cinema Manager"),
    STAFF("Staff"),
    CUSTOMER("Customer");

    private final String value;
}
