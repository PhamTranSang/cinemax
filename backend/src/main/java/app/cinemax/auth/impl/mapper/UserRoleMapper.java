package app.cinemax.auth.impl.mapper;

import app.cinemax.auth.impl.entity.RoleEntity;
import app.cinemax.auth.impl.entity.UserEntity;
import app.cinemax.auth.impl.entity.UserRoleEntity;
import app.cinemax.auth.impl.entity.UserRoleId;
import org.springframework.stereotype.Component;

@Component
public class UserRoleMapper {

    public UserRoleEntity toEntity(final UserEntity savedUser, final RoleEntity customerRole) {
        final var userRole = new UserRoleEntity();
        userRole.setId(new UserRoleId(savedUser.getUserId(), customerRole.getRoleId()));
        userRole.setUser(savedUser);
        userRole.setRole(customerRole);
        return userRole;
    }
}
