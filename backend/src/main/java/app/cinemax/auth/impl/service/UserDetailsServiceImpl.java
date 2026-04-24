package app.cinemax.auth.impl.service;

import app.cinemax.auth.impl.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    // Keep one read-only transaction for the whole method so LAZY relations
    // (userRoles -> role) can be initialized while building authorities.
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        final var entity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Can not find user name: " + username));
        // userRoles is LAZY in UserEntity; without an active transaction this may fail
        // to initialize when Security reads roles for Authentication.
        final var roles = entity.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getRoleName().name())
                .toArray(String[]::new);
        return User.withUsername(entity.getUsername())
                .password(entity.getPassword())
                .roles(roles)
                .build();
    }
}
