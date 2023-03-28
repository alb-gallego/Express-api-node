CREATE DATABASE databasenode;
\c databasenode;

CREATE TABLE IF NOT EXISTS rental (
  id  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  owner VARCHAR(255),
  city VARCHAR(255),
  category VARCHAR(255),
  bedrooms INT,
  image VARCHAR(255),
  description VARCHAR(255)
);

