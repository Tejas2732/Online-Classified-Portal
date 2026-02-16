package com.example.BuySellApplication.controller;

import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.enums.Role;
import com.example.BuySellApplication.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    // Constructor injection (replaces @RequiredArgsConstructor)
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // for deleting the user
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        log.info("Delete request for user id: {}", userId);

        // Safety Check: Get the person making the request
        UserDTO currentUser = userService.getCurrentUser();

        // Logic: Only allow if the user is deleting themselves OR if the user is an ADMIN
        if (!currentUser.getId().equals(userId) && !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You do not have permission to delete this account");
        }

        userService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Account and all associated data deleted successfully", null));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser() {
        log.info("Fetching current user profile");
        UserDTO user = userService.getCurrentUser();
        return ResponseEntity.ok(
                ApiResponse.success("User profile retrieved", user)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        log.info("Fetching user with id: {}", id);
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(
                ApiResponse.success("User retrieved", user)
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @Valid @RequestBody UpdateUserRequest request) {

        log.info("Updating user profile");
        UserDTO updatedUser = userService.updateProfile(request);

        return ResponseEntity.ok(
                ApiResponse.success("Profile updated successfully", updatedUser)
        );
    }

    // changes
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        log.info("Changing user password");
        userService.changePassword(request);

        return ResponseEntity.ok(
                ApiResponse.success("Password changed successfully", null)
        );
    }


}
