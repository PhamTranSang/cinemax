package app.cinemax.auth.impl.repository;

import app.cinemax.auth.impl.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByUsername(final String username);

    Optional<UserEntity> findByEmail(final String email);
}
