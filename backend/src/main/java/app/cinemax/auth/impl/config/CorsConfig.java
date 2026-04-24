package app.cinemax.auth.impl.config;

import app.cinemax.common.impl.properties.CorsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class CorsConfig {

    private final CorsProperties corsProperties;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final var cors = new CorsConfiguration();

        cors.setAllowedOrigins(corsProperties.getAllowedOrigins());
        cors.setAllowedMethods(corsProperties.getAllowedMethods());
        cors.setAllowedHeaders(corsProperties.getAllowedHeaders());
        cors.setAllowCredentials(corsProperties.isAllowCredentials());

        final var source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}
