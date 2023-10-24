package lab5.backend.security.jwt;

import lab5.backend.entity.CustomOAuth2User;
import lab5.backend.entity.Role;
import lab5.backend.security.services.UserDetailsImpl;
import lab5.backend.services.UserService;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${todo.jwtSecret}")
    private String jwtSecret;

    @Value("${todo.jwtExpirationMs}")
    private int jwtExpirationMs;

    private final UserService userService;

    @Autowired
    public JwtUtils(UserService userService) {
        this.userService = userService;
    }

    public String generateJwtToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetailsImpl userPrincipal) {
            return Jwts.builder().setSubject(userPrincipal.getEmail())
                    .setId(userPrincipal.getId().toString())
                    .claim("role", userPrincipal.getRole())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        } else if (principal instanceof CustomOAuth2User user) {
            String id = null;
            String role = null;
            if (userService.getUserByEmail(user.getEmail()).isPresent()){
                id = userService.getUserByEmail(user.getEmail()).get().getId().toString();
                role = userService.getUserByEmail(user.getEmail()).get().getRole().toString();
            }
            return Jwts.builder().setSubject(user.getName())
                    .setId(id)
                    .claim("role", role)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        } else {
            throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass().getName());
        }

    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    public String getUserIDFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getId();
    }

    public Role getUserRoleFromJwtToken(String token) {
        return Role.valueOf(Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().get("role").toString());
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public UUID jwtToUUID(String jwt) {
        String userId = getUserIDFromJwtToken(jwt);
        return UUID.fromString(userId);
    }
}