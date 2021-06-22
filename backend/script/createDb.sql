DROP DATABASE marlinggame;

CREATE DATABASE marlinggame;
USE marlinggame;

CREATE TABLE player (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    favouriteGame VARCHAR(255)
);