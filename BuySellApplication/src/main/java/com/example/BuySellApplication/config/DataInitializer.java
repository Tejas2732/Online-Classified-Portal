package com.example.BuySellApplication.config;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.repository.*;
import com.example.BuySellApplication.enums.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Constructor Injection (replaces @RequiredArgsConstructor)
    public DataInitializer(UserRepository userRepository,
                           WalletRepository walletRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initData() {
        return args -> {

            if (userRepository.count() > 0) {
                log.info("Database already initialized. Skipping data initialization.");
                return;
            }

            log.info("Initializing database with sample data...");

            // ================= Admin User =================
            User admin = new User();
            admin.setEmail("admin@buysell.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setPhoneNumber("9999999999");
            admin.setAddress("Admin Office, Main Street");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);

            admin = userRepository.save(admin);
            log.info("Admin user created: {}", admin.getEmail());

            Wallet adminWallet = new Wallet();
            adminWallet.setUser(admin);
            adminWallet.setBalance(new BigDecimal("10000.00"));
            walletRepository.save(adminWallet);

            // ================= Sample Users =================
            User user1 = new User();
            user1.setEmail("john.doe@example.com");
            user1.setPassword(passwordEncoder.encode("password123"));
            user1.setFullName("John Doe");
            user1.setPhoneNumber("9876543210");
            user1.setAddress("123 Main St, City");
            user1.setRole(Role.USER);
            user1.setActive(true);

            User user2 = new User();
            user2.setEmail("jane.smith@example.com");
            user2.setPassword(passwordEncoder.encode("password123"));
            user2.setFullName("Jane Smith");
            user2.setPhoneNumber("9876543211");
            user2.setAddress("456 Oak Ave, Town");
            user2.setRole(Role.USER);
            user2.setActive(true);

            User user3 = new User();
            user3.setEmail("bob.wilson@example.com");
            user3.setPassword(passwordEncoder.encode("password123"));
            user3.setFullName("Bob Wilson");
            user3.setPhoneNumber("9876543212");
            user3.setAddress("789 Pine Rd, Village");
            user3.setRole(Role.USER);
            user3.setActive(true);

            List<User> users = userRepository.saveAll(Arrays.asList(user1, user2, user3));
            log.info("Sample users created: {}", users.size());

            // ================= Wallets =================
            for (User user : users) {
                Wallet wallet = new Wallet();
                wallet.setUser(user);
                wallet.setBalance(new BigDecimal("5000.00"));
                walletRepository.save(wallet);
            }

            // ================= Categories =================
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic devices and gadgets");

            Category furniture = new Category();
            furniture.setName("Furniture");
            furniture.setDescription("Home and office furniture");

            Category books = new Category();
            books.setName("Books");
            books.setDescription("Books and publications");

            Category clothing = new Category();
            clothing.setName("Clothing");
            clothing.setDescription("Apparel and accessories");

            List<Category> categories =
                    categoryRepository.saveAll(Arrays.asList(
                            electronics, furniture, books, clothing
                    ));

            // ================= Products =================
            Product p1 = new Product();
            p1.setName("iPhone 13 Pro");
            p1.setDescription("Apple iPhone 13 Pro, 256GB");
            p1.setPrice(new BigDecimal("999.99"));
            p1.setCategory(categories.get(0));
            p1.setSeller(users.get(0));
            p1.setStatus(ProductStatus.AVAILABLE);
            p1.setQuantity(1);
            p1.setImageUrl("https://via.placeholder.com/300");

            Product p2 = new Product();
            p2.setName("Office Desk");
            p2.setDescription("Ergonomic office desk");
            p2.setPrice(new BigDecimal("299.99"));
            p2.setCategory(categories.get(1));
            p2.setSeller(users.get(1));
            p2.setStatus(ProductStatus.AVAILABLE);
            p2.setQuantity(3);
            p2.setImageUrl("https://via.placeholder.com/300");

            productRepository.saveAll(Arrays.asList(p1, p2));

            log.info("Database initialization completed successfully!");
        };
    }
}
