package app.cinemax.auth.impl.service;

import app.cinemax.auth.api.dto.request.UpdateProfileRequest;
import app.cinemax.auth.api.dto.response.UpdateProfileResponse;
import app.cinemax.auth.api.service.UserProfileService;
import app.cinemax.auth.impl.entity.UserProfileEntity;
import app.cinemax.auth.impl.repository.UserProfileRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Override
    public UpdateProfileResponse updateProfile(final UpdateProfileRequest request) {
        final var entity = new UserProfileEntity();
        entity.setDateOfBirth(request.dateOfBirth());
        entity.setAvatarUrl(request.avatarUrl());
        entity.setPhoneNumber(request.phoneNumber());
        entity.setUpdatedAt(Instant.now());
        final var updateUserProfile = userProfileRepository.save(entity);
        return new UpdateProfileResponse(updateUserProfile.getFirstName(), updateUserProfile.getLastName(),
                updateUserProfile.getDateOfBirth(), updateUserProfile.getAvatarUrl(),
                updateUserProfile.getPhoneNumber(), updateUserProfile.getUpdatedAt());
    }
}
