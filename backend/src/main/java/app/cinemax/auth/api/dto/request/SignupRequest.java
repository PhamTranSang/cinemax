package app.cinemax.auth.api.dto.request;

public record SignupRequest(String firstName, String lastName, String username, String password, String email) {

}
