package com.library.library_management.service;

import com.library.library_management.entity.User;

import java.util.List;

public interface IUserService {
    List<User> getAllUser(String adminId);
}
