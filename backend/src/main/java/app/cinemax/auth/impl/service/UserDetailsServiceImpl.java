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
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        final var entity = userRepository.findByUsernameWithRoles(username)
            .orElseThrow(() -> new UsernameNotFoundException("Can not find user name: " + username));

        final var roles = entity.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getRoleName().name())
                .toArray(String[]::new);
        return User.withUsername(entity.getUsername())
                .password(entity.getPassword())
                .roles(roles)
                .build();
    }
}
