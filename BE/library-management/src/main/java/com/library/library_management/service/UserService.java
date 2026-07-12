package com.library.library_management.service;


import com.library.library_management.dto.request.UserLoginRequest;
import com.library.library_management.dto.request.UserRegisterRequest;
import com.library.library_management.entity.Role;
import com.library.library_management.entity.User;
import com.library.library_management.entity.Borrow;
import com.library.library_management.repository.BorrowRepository;
import com.library.library_management.repository.RoleRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService implements IUserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BorrowRepository borrowRepository;

    @Override
    public List<User> getAllUser(String adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        String roleName = admin.getRole().getName();
        if (!roleName.equalsIgnoreCase("ADMIN") && !roleName.equalsIgnoreCase("LIBRARIAN")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admin or librarian can view users"
            );
        }

        return userRepository.findAll();
    }

    public User register(UserRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setRole(role);

        return userRepository.save(user);
    }

    public User login(UserLoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Username not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }

    @Transactional
    public void deleteUser(String userId, String adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getRole().getName().equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền xóa tài khoản");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // The borrow table references user_id. Remove those records first so
        // the database foreign-key constraint does not block account deletion.
        List<Borrow> borrows = borrowRepository.findByUserId(userId);
        borrows.stream()
                .filter(borrow -> !Boolean.TRUE.equals(borrow.getStatus()))
                .forEach(borrow -> borrow.getBook().setStatus(true));
        borrowRepository.deleteAll(borrows);
        userRepository.delete(user);
    }

    /** Only administrators may promote a regular user to librarian or revoke it. */
    public User updateRole(String userId, String adminId, String roleName) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));
        if (!"ADMIN".equalsIgnoreCase(admin.getRole().getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin can change roles");
        }

        User target = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if ("ADMIN".equalsIgnoreCase(target.getRole().getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot change an administrator role");
        }

        String requestedRole = roleName == null ? "" : roleName.trim().toUpperCase();
        if (!requestedRole.equals("USER") && !requestedRole.equals("LIBRARIAN")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be USER or LIBRARIAN");
        }

        Role role = roleRepository.findByName(requestedRole)
                // Keeps installations seeded with the previous "Librarian" value working.
                .or(() -> requestedRole.equals("LIBRARIAN") ? roleRepository.findByName("Librarian") : java.util.Optional.empty())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found"));
        target.setRole(role);
        return userRepository.save(target);
    }

    public User getUser(String id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> searchUser(String username){
        return userRepository.findByUsernameContainingIgnoreCase(username);
    }
}
