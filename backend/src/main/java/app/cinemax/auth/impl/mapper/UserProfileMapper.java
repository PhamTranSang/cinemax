package app.cinemax.auth.impl.mapper;

import app.cinemax.auth.api.dto.request.SignupRequest;
import app.cinemax.auth.impl.entity.UserEntity;
import app.cinemax.auth.impl.entity.UserProfileEntity;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

    public UserProfileEntity toEntity(final SignupRequest request, final UserEntity savedUser) {
        final var profile = new UserProfileEntity();
        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setUser(savedUser);
        return profile;
    }
}
