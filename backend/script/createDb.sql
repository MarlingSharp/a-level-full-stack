DROP DATABASE marlinggame;

CREATE DATABASE marlinggame;

CREATE USER 'marling'@'localhost' IDENTIFIED BY 'marling-pw';
GRANT ALL PRIVILEGES ON marlinggame.* TO 'marling'@'localhost' WITH GRANT OPTION;