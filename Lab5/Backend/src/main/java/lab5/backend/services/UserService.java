package lab5.backend.services;

import lab5.backend.entity.Provider;
import lab5.backend.entity.Role;
import lab5.backend.entity.User;
import lab5.backend.exception.NotFoundException;
import lab5.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
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

    public User getUserById(UUID id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new NotFoundException("User not found for id: " + id);
        }
        return user.get();
    }

    public void editUserById(UUID id, User requestUser, Role role) {
       User user = getUserById(id);
       user.setName(requestUser.getName());
       user.setEmail(requestUser.getEmail());
       user.setAddress(requestUser.getAddress());
       user.setFaculty(requestUser.getFaculty());
       user.setPhone(requestUser.getPhone());
       user.setBirthDate(requestUser.getBirthDate());
       if (!requestUser.getPassword().isEmpty()) {
           user.setPassword(requestUser.getPassword());
       }
       if (Objects.equals(role, Role.ADMIN) &&
               requestUser.getRole() != null) {
           user.setRole(requestUser.getRole());
       }
        userRepository.save(user);
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
