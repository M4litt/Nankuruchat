-- CREATE DATABASE `nankuruchat`;
USE `nankuruchat`;

-- aldea titi distrito bubu

CREATE TABLE `nankuruchat`.`user` (
    `id`          INT NOT NULL AUTO_INCREMENT,
    `username`    VARCHAR(16)  NOT NULL,
    `pfp`         VARCHAR(128) NOT NULL,   -- route folder/folder/file.png
    `email`       VARCHAR(128) NOT NULL,
    `password`    VARCHAR(64)  NOT NULL,   -- hashed
    `description` VARCHAR(256) NOT NULL
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
    `name`        VARCHAR(50)  NOT NULL,
    `description` VARCHAR(256) NOT NULL,
    `picture`     VARCHAR(128) NOT NULL, -- route folder/folder/file.jpg
    PRIMARY KEY(id)
);

CREATE TABLE `nankuruchat`.`linker_users_server` (
    `id_user`   INT NOT NULL,
    `id_server` INT NOT NULL,
    `admin`     INT NOT NULL DEFAULT 0,
    CHECK(admin BETWEEN 0 AND 2)
);

CREATE TABLE `nankuruchat`.`linker_channel_server` (
    `id_server`  INT NOT NULL,
    `id_channel` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`channel` (
    `id`   INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE `nankuruchat`.`linker_channel_messages` (
    `id_channel` INT NOT NULL,
    `id_message` INT NOT NULL
);

CREATE TABLE `nankuruchat`.`message` (
    `id`           INT NOT NULL AUTO_INCREMENT,
    `id_sender`    INT NOT NULL,
    `content`      VARCHAR(512) NOT NULL,
    `content_type` VARCHAR(32) NOT NULL,
    `timestamp`    DATETIME DEFAULT NOW(),
    PRIMARY KEY(id)
);

CREATE TABLE `nankuruchat`.`admin` (
    `id_user`   INT NOT NULL,
    `id_server` INT NOT NULL
);
