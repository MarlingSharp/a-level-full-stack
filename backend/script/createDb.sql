-- Delete any existing database with the same name
-- DROP DATABASE school;

-- Create a fresh database
CREATE DATABASE school;

-- Make sure that user can make changes to our application database
GRANT ALL PRIVILEGES ON school.* TO 'marling'@'localhost' WITH GRANT OPTION;

-- We need to be 'using' the specific database to make changes
USE school;

-- Create our first table
CREATE TABLE student (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name text NOT NULL,
  house text NOT NULL,
  age integer NOT NULL
);


CREATE TABLE subject (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name text NOT NULL,
  teacher text NOT NULL
);

CREATE TABLE studies (
    student_id integer,
    subject_id integer,
    target_grade text NOT NULL,
    PRIMARY KEY (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (subject_id) REFERENCES subject(id) 
);
