package app.cinemax.auth.impl.service;

import app.cinemax.common.impl.properties.JwtProperties;
import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(final UserDetails user) {
        return createToken(new HashMap<>(), user.getUsername());
    }

    public String generateRefreshToken(final UserDetails user) {
        return createToken(new HashMap<>(), user.getUsername());
    }

    private String createToken(final Map<String, String> claims, final String subject) {
        if (claims.isEmpty()) {
            claims.put("role", "CUSTOMER");
        }
        return Jwts.builder()
            .claims(claims) //
            .subject(subject) // The entity (user/system) the token represents.
            .issuedAt(new Date()) // When the token was generated.
            .expiration(new Date(System.currentTimeMillis() + jwtProperties.getAccessTokenExpirationMs()))
            .signWith(key())
            .compact();
    }

    public String extractUsername(final String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(final String token, final UserDetails user) {
        final var username = extractUsername(token);
        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(final String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(final String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(final String token, final Function<Claims, T> claimResolver) {
        final var claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(final String token) {
        return Jwts.parser()
            .verifyWith((SecretKey) key())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
