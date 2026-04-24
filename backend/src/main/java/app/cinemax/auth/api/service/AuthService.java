package app.cinemax.auth.api.service;

import app.cinemax.auth.api.dto.request.SigninRequest;
import app.cinemax.auth.api.dto.request.SignupRequest;
import app.cinemax.auth.api.dto.response.MessageResponse;
import app.cinemax.auth.api.dto.response.SigninTokens;
import app.cinemax.auth.api.dto.response.SignupResponse;

public interface AuthService {

    SignupResponse signup(final SignupRequest request);

    SigninTokens signin(final SigninRequest request);

    MessageResponse logout();
}
