package app.cinemax.auth.impl.entity;

import app.cinemax.auth.api.dto.enums.RoleEnum;
import app.cinemax.common.impl.entity.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "t_roles")
public class RoleEntity extends BaseAuditEntity {

    @Id
    @Column(name = "role_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID roleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", unique = true, nullable = false)
    private RoleEnum roleName;

    private String description;

    @OneToMany(mappedBy = "role")
    private Set<UserRoleEntity> userRoles = new HashSet<>();
}
