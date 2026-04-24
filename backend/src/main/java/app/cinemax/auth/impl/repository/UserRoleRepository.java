package app.cinemax.auth.impl.repository;

import app.cinemax.auth.impl.entity.UserRoleEntity;
import app.cinemax.auth.impl.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleId> {

}
