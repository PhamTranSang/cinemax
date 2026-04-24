package app.cinemax.auth.api.service;

import app.cinemax.auth.api.dto.request.UpdateProfileRequest;
import app.cinemax.auth.api.dto.response.UpdateProfileResponse;

public interface UserProfileService {

    UpdateProfileResponse updateProfile(final UpdateProfileRequest request);
}
