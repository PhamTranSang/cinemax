package app.cinemax.auth.impl.service;

import app.cinemax.auth.api.dto.enums.RoleEnum;
import app.cinemax.auth.api.dto.request.SigninRequest;
import app.cinemax.auth.api.dto.request.SignupRequest;
import app.cinemax.auth.api.dto.response.MessageResponse;
import app.cinemax.auth.api.dto.response.SigninTokens;
import app.cinemax.auth.api.dto.response.SignupResponse;
import app.cinemax.auth.api.exceptions.ConflictException;
import app.cinemax.auth.api.exceptions.SystemConfigurationException;
import app.cinemax.auth.api.service.AuthService;
import app.cinemax.auth.impl.mapper.UserMapper;
import app.cinemax.auth.impl.mapper.UserProfileMapper;
import app.cinemax.auth.impl.mapper.UserRoleMapper;
import app.cinemax.auth.impl.repository.RoleRepository;
import app.cinemax.auth.impl.repository.UserProfileRepository;
import app.cinemax.auth.impl.repository.UserRepository;
import app.cinemax.auth.impl.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final UserProfileMapper userProfileMapper;
    private final UserRoleMapper userRoleMapper;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    @Override
    @Transactional
    public SignupResponse signup(final SignupRequest request) {
        userRepository.findByUsername(request.username())
            .ifPresent(u -> {
                throw new ConflictException("Username already existed");
            });

        userRepository.findByEmail(request.email())
            .ifPresent(u -> {
                throw new ConflictException("Email already existed");
            });

        try {
            final var user = userMapper.toEntity(request);
            final var savedUser = userRepository.save(user);

            final var profile = userProfileMapper.toEntity(request, savedUser);
            final var savedUserProfile = userProfileRepository.save(profile);

            final var customerRole = roleRepository.findByRoleName(RoleEnum.CUSTOMER)
                    .orElseThrow(() -> new SystemConfigurationException("Default role CUSTOMER not found"));

            final var userRole = userRoleMapper.toEntity(savedUser, customerRole);
            userRoleRepository.save(userRole);

            return new SignupResponse(savedUserProfile.getFirstName(), savedUserProfile.getLastName(),
                    savedUser.getUsername());
        } catch (final DataIntegrityViolationException ex) {
            throw new ConflictException("Username or email already existed");
        }
    }

    @Override
    public SigninTokens signin(final SigninRequest request) {
        try {
            final var token = new UsernamePasswordAuthenticationToken(request.username(), request.password());
            final var authentication = authenticationManager.authenticate(token);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            final var user = (UserDetails) authentication.getPrincipal();
            final var accessToken = jwtService.generateAccessToken(user);
            final var refreshToken = jwtService.generateRefreshToken(user);

            return new SigninTokens(accessToken, refreshToken);
        } catch(final BadCredentialsException e) {
            throw new BadCredentialsException("Invalid credentials" + e.getMessage());
        }
    }

    @Override
    public MessageResponse logout() {
        // TODO: adding token to blacklist
        SecurityContextHolder.clearContext();

        return new MessageResponse("User logged out successfully");
    }
}
