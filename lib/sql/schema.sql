DROP SCHEMA IF EXISTS `office_db`;
CREATE SCHEMA `office_db`;

USE `office_db`;

CREATE TABLE `department` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(30) NOT NULL,
        PRIMARY KEY (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = armscii8;


CREATE TABLE `role` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(30) NOT NULL,
        `salary` DECIMAL NOT NULL,
        `department_id` INT NOT NULL,
        PRIMARY KEY (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = armscii8;

CREATE TABLE `employee` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `first_name` VARCHAR(30) NOT NULL,
        `last_name` VARCHAR(30) NOT NULL,
        `role_id` INT NOT NULL,
        `manager_id` INT DEFAULT NULL,
        PRIMARY KEY (`id`))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = armscii8;
