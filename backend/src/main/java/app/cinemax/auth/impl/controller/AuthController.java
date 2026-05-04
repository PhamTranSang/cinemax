package app.cinemax.auth.impl.controller;

import app.cinemax.auth.api.dto.request.SigninRequest;
import app.cinemax.auth.api.dto.request.SignupRequest;
import app.cinemax.auth.api.dto.request.TokenRefreshRequest;
import app.cinemax.auth.api.dto.response.MessageResponse;
import app.cinemax.auth.api.dto.response.SigninResponse;
import app.cinemax.auth.api.dto.response.SignupResponse;
import app.cinemax.auth.api.dto.response.TokenRefreshResponse;
import app.cinemax.auth.api.exceptions.ConflictException;
import app.cinemax.auth.api.exceptions.TokenRefreshException;
import app.cinemax.auth.api.service.AuthService;
import app.cinemax.auth.impl.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "User Authentication", description = "User authentication management API")
public class AuthController {

    private static final int MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/signup")
    @Operation(summary = "Sign up a new user", description = "Create a new user account and assign default CUSTOMER role")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = "Signup information", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = SignupRequest.class)))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User signed up successfully", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = SignupResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "409", description = "Username or email already exists", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ConflictException.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody final SignupRequest request) {
        final var response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signin")
    @Operation(summary = "Sign in user", description = "Authenticate user and return access token with refresh token cookie")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = "Signin credentials", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = SigninRequest.class)))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User signed in successfully", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = SigninResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Invalid username or password", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UsernameNotFoundException.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<SigninResponse> signin(@Valid @RequestBody final SigninRequest request) {
        final var tokens = authService.signin(request);
        final var refreshCookie = createRefreshTokenCookie(tokens.refreshToken());
        final var response = new SigninResponse(tokens.accessToken());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    private ResponseCookie createRefreshTokenCookie(final String refreshToken) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true) // can not be accessed via JavaScript.
                .secure(true) // Only send over HTTPS
                .path("/auth/token")
                .sameSite("Lax") // prevents CSRF in most cases
                .maxAge(MAX_AGE_SECONDS)
                .build();
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out user", description = "Clear security context and expire refresh token cookie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User logged out successfully", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = MessageResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<MessageResponse> logout() {
        final var response = authService.logout();
        final var deleteCookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE)
                .httpOnly(true)
                .secure(true)
                .path("/auth/token")
                .sameSite("Lax")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh Token", description = "Refresh token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = TokenRefreshException.class))),
            @ApiResponse(responseCode = "500", description = "", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<TokenRefreshResponse> refresh(@Valid @RequestBody final TokenRefreshRequest request) {
        final var refreshToken = request.refreshToken();

        try {
            final var userName = jwtService.extractUsername(refreshToken);
            final var userDetails = userDetailsService.loadUserByUsername(userName);
            final var newAccessToken = jwtService.generateAccessToken(userDetails);
            return ResponseEntity.ok(new TokenRefreshResponse(newAccessToken, refreshToken));
        } catch (final ExpiredJwtException e) {
            throw new TokenRefreshException("Refresh token is expired, please log in agains");
        } catch (final JwtException e) {
            throw new TokenRefreshException("Refresh token is invalid");
        }
    }

    @GetMapping("/csrf")
    public CsrfToken getCsrfToken(final CsrfToken token) {
        return token;
    }
}
