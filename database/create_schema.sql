-- CREATE DATABASE `nankuruchat`;
USE `nankuruchat`;

-- aldea titi distrito bubu

CREATE TABLE `nankuruchat`.`user` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `username`    VARCHAR(50)  NOT NULL,
    `pfp`         VARCHAR(500) NOT NULL,   -- base 64
    `email`       VARCHAR(50)  NOT NULL,
    `password`    VARCHAR(50)  NOT NULL,   -- hashed
    `description` VARCHAR(500) NOT NULL
    PRIMARY KEY(id)
);

CREATE TABLE `nankuruchat`.`friends` (
    `id_user`   INT NOT NULL,
    `id_friend` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`enemies`  (
    `id_user`  INT NOT NULL,
    `id_enemy` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`blocked`  (
    `id_user`    INT NOT NULL,
    `id_blocked` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`server` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(50) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `picture`     VARCHAR(500) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE `nankuruchat`.`linker_users_server` (
    `id_user`   INT NOT NULL,
    `id_server` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`linker_channel_server` (
    `id_server`  INT NOT NULL,
    `id_channel` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`channel` (
    `id`   INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE `nankuruchat`.`linker_channel_messages` (
    `id_channel` INT NOT NULL,
    `id_message` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`message` (
    `id`           INT NOT NULL AUTO_INCREMENT,
    `id_sender`    INT NOT NULL,
    `content`      VARCHAR(5000) NOT NULL,
    `content_type` VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);