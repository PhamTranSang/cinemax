package app.cinemax.common.impl.properties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Validated
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    @NotBlank
    @Size(min = 32)
    private final String secretKey;

    @Positive
    private final long accessTokenExpirationMs;

    @Positive
    private final long refreshTokenExpirationMs;
}
