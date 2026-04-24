package app.cinemax.auth.impl.entity;

import app.cinemax.common.impl.entity.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "t_users")
public class UserEntity extends BaseAuditEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "is_actived", nullable = false)
    private Boolean isActived;

    @OneToOne(mappedBy = "user")
    private UserProfileEntity profile;

    @OneToMany(mappedBy = "user")
    private Set<UserRoleEntity> userRoles = new HashSet<>();

    @OneToMany(mappedBy = "grantedByUser")
    private Set<UserRoleEntity> grantedRoles = new HashSet<>();
}
