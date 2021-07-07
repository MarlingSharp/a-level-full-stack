-- Tell MySQL which database we are using
USE school;

-- We can now insert data
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