package app.cinemax.auth.impl.mapper;

import app.cinemax.auth.api.dto.request.SignupRequest;
import app.cinemax.auth.impl.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public UserEntity toEntity(final SignupRequest request) {
        final var user = new UserEntity();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setIsActived(true);
        return user;
    }
}
