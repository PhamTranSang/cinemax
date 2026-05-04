package app.cinemax.auth.impl.repository;

import app.cinemax.auth.impl.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByUsername(final String username);

    Optional<UserEntity> findByEmail(final String email);

    @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.userRoles ur JOIN FETCH ur.role WHERE u.username = :username")
    Optional<UserEntity> findByUsernameWithRoles(@Param("username") String username);
}
