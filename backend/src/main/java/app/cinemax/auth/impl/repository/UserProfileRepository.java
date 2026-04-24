package app.cinemax.auth.impl.repository;

import app.cinemax.auth.impl.entity.UserProfileEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfileEntity, UUID> {

}
