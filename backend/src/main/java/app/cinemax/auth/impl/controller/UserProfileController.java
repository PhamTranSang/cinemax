package app.cinemax.auth.impl.controller;

import app.cinemax.auth.api.dto.request.UpdateProfileRequest;
import app.cinemax.auth.api.dto.response.UpdateProfileResponse;
import app.cinemax.auth.api.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
@Tag(name = "User Profile", description = "User profile management API")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @PutMapping
    @Operation(summary = "Update user profile", description = "Update current authenticated user's profile information")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true, description = "Profile fields to update", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UpdateProfileRequest.class)))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = UpdateProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<UpdateProfileResponse> updateProfile(@Valid @RequestBody final UpdateProfileRequest request) {
        final var response = userProfileService.updateProfile(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
