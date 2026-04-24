package app.cinemax.auth.impl.entity;

import app.cinemax.auth.api.dto.enums.GenderEnum;
import app.cinemax.common.impl.entity.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "t_user_profiles")
public class UserProfileEntity extends BaseAuditEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "phone_number", length = 10)
    private BigDecimal phoneNumber;
}
