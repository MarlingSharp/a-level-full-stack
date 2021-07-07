PRAGMA foreign_keys=ON;
CREATE TABLE student (
  id integer PRIMARY KEY,
  name text NOT NULL,
  house text NOT NULL,
  age integer NOT NULL
);

CREATE TABLE subject (
  id integer PRIMARY KEY,
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

INSERT INTO student (id, name, age, house) VALUES 
(1, "Harry Potter", 15, 'Gryffindor'),
(2, "Ronald Weasley", 16, 'Gryffindor'),
(3, "Fred Weasley", 18, 'Gryffindor'),
(4, "George Weasley", 18, 'Gryffindor'),
(5, "Hermione Granger", 15, 'Gryffindor'),
(6, "Draco Malfoy", 16, 'Slytherin'),
(7, "Marcus Flint", 15, 'Slytherin'),
(8, "Pansy Parkinson", 15, 'Slytherin');

INSERT INTO subject (id, name, teacher) VALUES
(1, 'Transfiguration', 'Miverva McGonagall'),
(2, 'Potions', 'Severus Snape'),
(3, 'Charms', 'Filius Flitwick'),
(4, 'Care of Magical Creatures', 'Rubeus Hagrid');

INSERT INTO studies (student_id, subject_id, target_grade) VALUES
(1, 1, 'E'),
(1, 2, 'O'),
(1, 3, 'P'),
(2, 1, 'E'),
(2, 2, 'E'),
(2, 3, 'O'),
(3, 1, 'O'),
(3, 2, 'O'),
(3, 3, 'O');

SELECT id, name FROM student;

SELECT student.name, subject.name, studies.target_grade FROM student
  INNER JOIN studies ON
      student.id = studies.student_id
  INNER JOIN subject ON
      studies.subject_id = subject.id
  WHERE student.id = 1;

SELECT name FROM student WHERE house='Slytherin' AND age=15;

SELECT name FROM student WHERE name LIKE '%Weasley';

SELECT * FROM studies;
DELETE FROM student WHERE name='Harry Potter';
SELECT * FROM studies;

SELECT name FROM student;
