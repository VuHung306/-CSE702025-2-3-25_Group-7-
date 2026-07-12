package com.library.library_management.controller;

import com.library.library_management.dto.request.UserDeleteRequest;
import com.library.library_management.dto.request.UserLoginRequest;
import com.library.library_management.dto.request.UserRegisterRequest;
import com.library.library_management.dto.request.UserRoleUpdateRequest;
import com.library.library_management.entity.User;
import com.library.library_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping("/users")
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    User getUser(@PathVariable("userId") String userId){
        return userService.getUser(userId);
    }

    @GetMapping({"", "/"})
    public List<User> getALlUser(@RequestParam String adminId){
        return userService.getAllUser(adminId);
    }

    @GetMapping("/search")
    public List<User> searchUser(@RequestParam String username){
        return userService.searchUser(username);
    }

    @PostMapping("/register")
    public User register(@RequestBody UserRegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("/login")
    public User login(@RequestBody UserLoginRequest request) {
        return userService.login(request);
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable String userId,
                             @RequestBody UserDeleteRequest request) {
        userService.deleteUser(userId, request.getAdminId());
        return "User deleted";
    }

    @PatchMapping("/{userId}/role")
    public User updateRole(@PathVariable String userId,
                           @RequestBody UserRoleUpdateRequest request) {
        return userService.updateRole(userId, request.getAdminId(), request.getRoleName());
    }
}
