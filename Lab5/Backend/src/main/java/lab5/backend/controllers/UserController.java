package lab5.backend.controllers;

import lab5.backend.entity.Provider;
import lab5.backend.entity.Role;
import lab5.backend.entity.User;
import lab5.backend.exception.AlreadyExistsException;
import lab5.backend.security.jwt.JwtUtils;
import lab5.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
public class UserController {

    private final PasswordEncoder encoder;

    private final UserService userService;

    private final JwtUtils jwtUtils;

    @Autowired
    public UserController(UserService userService, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.encoder = encoder;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            throw new AlreadyExistsException("Email already exists");
        }

        User createdUser = new User(user.getName(),
                user.getPhone(),
                user.getFaculty(),
                user.getBirthDate(),
                user.getAddress(),
                user.getEmail(),
                encoder.encode(user.getPassword()),
                Provider.LOCAL,
                Role.USER);
        userService.createUser(createdUser);
        return ResponseEntity.ok(createdUser);
    }

    @GetMapping("/{userID}")
    public ResponseEntity<User> getUserById(@PathVariable String userID) {
        return ResponseEntity.ok(userService.getUserById(UUID.fromString(userID)));
    }

    @PatchMapping("/{userID}")
    public ResponseEntity<User> editUserById(@PathVariable String userID,
                                             @RequestBody User user,
                                             @CookieValue("jwtToken") String jwt) {
        Role role = jwtUtils.getUserRoleFromJwtToken(jwt);
        if  (!Objects.equals(userID, jwtUtils.getUserIDFromJwtToken(jwt)) && role != Role.ADMIN) {
           return ResponseEntity.badRequest().build();
        }
        if (!user.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(user.getPassword()));
        }
        userService.editUserById(UUID.fromString(userID), user, role);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userID}")
    public ResponseEntity<User> deleteUserById(@PathVariable String userID,
                                               @CookieValue("jwtToken") String jwt) {
        if (Objects.equals(userID, jwtUtils.getUserIDFromJwtToken(jwt)) ||
                jwtUtils.getUserRoleFromJwtToken(jwt) == Role.ADMIN) {
            userService.deleteUserById(UUID.fromString(userID));
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers(@CookieValue("jwtToken") String jwt) {
        Role role = jwtUtils.getUserRoleFromJwtToken(jwt);
        if  (role != Role.ADMIN) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
