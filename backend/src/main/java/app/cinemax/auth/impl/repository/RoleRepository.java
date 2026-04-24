package app.cinemax.auth.impl.repository;

import app.cinemax.auth.api.dto.enums.RoleEnum;
import app.cinemax.auth.impl.entity.RoleEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {

    Optional<RoleEntity> findByRoleName(final RoleEnum roleName);
}
