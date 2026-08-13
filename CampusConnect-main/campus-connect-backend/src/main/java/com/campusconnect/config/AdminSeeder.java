package com.campusconnect.config;

import com.campusconnect.entity.Admin;
import com.campusconnect.repository.AdminRepository;
import com.campusconnect.entity.User;
import com.campusconnect.enums.UserRole;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.seed.admin.email:admin@campusconnect.com}")
    private String adminEmail;

    @Value("${app.seed.admin.password:Admin@12345}")
    private String adminPassword;

    @Value("${app.seed.admin.full-name:System Administrator}")
    private String adminFullName;

    @Value("${app.seed.admin.code:ADMIN001}")
    private String adminCode;

    @Override
    public void run(String... args) {
        Admin adminByEmail = adminRepository.findByEmail(adminEmail).orElse(null);
        Admin adminByCode = adminRepository.findByAdminCode(adminCode).orElse(null);

        if (adminByEmail != null && adminByCode != null
                && !Objects.equals(adminByEmail.getId(), adminByCode.getId())) {
            throw new IllegalStateException(
                    "Seed admin email and code belong to different admin accounts. email="
                            + adminEmail + ", code=" + adminCode);
        }

        Admin admin = adminByEmail != null ? adminByEmail : adminByCode;
        if (admin != null) {
            User existingUser = userRepository.findByEmail(adminEmail).orElse(null);
            if (existingUser != null && !Objects.equals(existingUser.getId(), admin.getId())) {
                throw new IllegalStateException(
                        "Seed admin email is already used by another account: " + adminEmail);
            }

            admin.setFullName(adminFullName);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setAdminCode(adminCode);
            admin.setActive(true);
            adminRepository.save(admin);
            return;
        }

        User existingUser = userRepository.findByEmail(adminEmail).orElse(null);
        if (existingUser != null && existingUser.getRole() != UserRole.ADMIN) {
            throw new IllegalStateException(
                    "Seed admin email is already used by a " + existingUser.getRole() + " account: " + adminEmail);
        }

        Long existingAdminId = findAdminIdByCode(adminCode);
        if (existingAdminId != null) {
            repairSeedAdmin(existingAdminId);
            return;
        }

        admin = new Admin();
        admin.setFullName(adminFullName);
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setAdminCode(adminCode);

        adminRepository.save(admin);
    }

    private Long findAdminIdByCode(String adminCode) {
        List<Long> ids = jdbcTemplate.queryForList(
                "select id from admins where admin_code = ? limit 1",
                Long.class,
                adminCode);
        return ids.isEmpty() ? null : ids.get(0);
    }

    private void repairSeedAdmin(Long adminId) {
        User existingEmailUser = userRepository.findByEmail(adminEmail).orElse(null);
        if (existingEmailUser != null && !Objects.equals(existingEmailUser.getId(), adminId)) {
            throw new IllegalStateException(
                    "Seed admin code already exists, but seed email is used by another account: " + adminEmail);
        }

        String encodedPassword = passwordEncoder.encode(adminPassword);
        int updatedUsers = jdbcTemplate.update(
                "update users set full_name = ?, email = ?, password = ?, active = true, role = 'ADMIN' where id = ?",
                adminFullName,
                adminEmail,
                encodedPassword,
                adminId);

        if (updatedUsers == 0) {
            jdbcTemplate.update(
                    "insert into users (id, full_name, email, password, active, role) values (?, ?, ?, ?, true, 'ADMIN')",
                    adminId,
                    adminFullName,
                    adminEmail,
                    encodedPassword);
        }
    }
}
