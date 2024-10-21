CREATE TABLE `Transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `shipping_dock_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `notes` TEXT,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `Orders` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
    FOREIGN KEY (`shipping_dock_id`) REFERENCES `ShippingDocks` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;