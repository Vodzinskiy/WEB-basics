package lab5.backend.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String faculty;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDate birthDate;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String email;

    @Column
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    public User() {
    }

    public User(String name, String phone, String faculty, LocalDate birthDate, String address, String email, String password, Provider provider, Role role) {
        this.name = name;
        this.phone = phone;
        this.faculty = faculty;
        this.birthDate = birthDate;
        this.address = address;
        this.email = email;
        this.password = password;
        this.provider = provider;
        this.role = role;
    }


    public User(String name, String phone, String faculty, LocalDate birthDate, String address, String email, Provider provider, Role role) {
        this.name = name;
        this.phone = phone;
        this.faculty = faculty;
        this.birthDate = birthDate;
        this.address = address;
        this.email = email;
        this.provider = provider;
        this.role = role;
    }

    public User(String username, String email, String password, Provider provider) {
        this.name = username;
        this.email = email;
        this.password = password;
        this.provider = provider;
    }

    public User(String username, String email, Provider provider, Role role) {
        this.name = username;
        this.email = email;
        this.provider = provider;
        this.role = role;
    }
}

