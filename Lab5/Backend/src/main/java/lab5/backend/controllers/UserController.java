package lab5.backend.controllers;

import lab5.backend.entity.Provider;
import lab5.backend.entity.Role;
import lab5.backend.entity.User;
import lab5.backend.exception.AlreadyExistsException;
import lab5.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final PasswordEncoder encoder;

    private final UserService userService;
    @Autowired
    public UserController(UserService userService, PasswordEncoder encoder) {
        this.encoder = encoder;
        this.userService = userService;
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
}
