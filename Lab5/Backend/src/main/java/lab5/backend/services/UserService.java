package lab5.backend.services;

import lab5.backend.entity.Provider;
import lab5.backend.entity.Role;
import lab5.backend.entity.User;
import lab5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByName(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findAllByEmail(email);
    }

    public  Optional<User> getUserByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }

    public void deleteUserById(UUID id) {
        userRepository.deleteById(id);
    }

    public void processOAuthPostLogin(String username, String email) {
        Optional<User> existUser = userRepository.findByName(username);
        User user;
        if (existUser.isEmpty()) {
            user = new User(username, email, Provider.GOOGLE, Role.USER);
            userRepository.save(user);
        }
    }
}
