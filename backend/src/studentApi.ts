import { Application } from "express";
import { Connection } from 'mysql';

import { Student, DbStudent, WhatTheyStudy } from 'shared/dist';

const api = (con: Connection, app: Application) => {
    // Get the list of students
    app.get('/students', (req, res) => {

        // Query the database
        con.query('SELECT id, name, age, house FROM student', (error, results, fields) => {
            if (error) return res.status(500).send(error);

            // Convert the generic results into our Player class
            const students: DbStudent[] = results.map(({ id, name, age, house }: any) => ({ id, name, age, house }))

            res.send(students);
        });
    });

    // Add a new student
    app.post('/students', (req, res) => {

        const sql = 'INSERT INTO student (name, age, house) VALUES (?, ?, ?)';
        con.query(sql, [req.body.name, req.body.age, req.body.house], (error, result) => {
            if (error) return res.status(500).send(error);

            const student: Student = {
                name: req.body.name,
                age: req.body.age,
                house: req.body.house,
            }

            res.send({
                id: result.insertId,
                ...student
            });
        });
    });

    // Delete a student
    app.delete('/students/:id', (req, res) => {
        const sql = 'DELETE FROM student WHERE id=?';
        con.query(sql, [req.params.id], (error, results) => {
            if (error) return res.status(500).send(error);

            res.send(200);
        })
    });

    // Get a list of subjects and target grades for a given student
    app.get("/students/whatTheyStudy/:studentId", (req, res) => {

        // Query the database, using JOIN to reach across the thjree tables
        con.query(`SELECT student.id as studentId, student.name as studentName, subject.name as subjectName, studies.target_grade as targetGrade FROM student
                    INNER JOIN studies ON
                        student.id = studies.student_id
                    INNER JOIN subject ON
                        studies.subject_id = subject.id
                    WHERE student.id = ?;`, [req.params.studentId], (error, results, fields) => {
            if (error) return res.status(500).send(error);
            if (results.length === 0) return res.status(404).send('This student is not recorded as studying any subjects');

            // Convert the generic results into our specific interface
            const whatTheyStudy: WhatTheyStudy = {
                studentId: results[0].studentId,
                studentName: results[0].studentName,
                subjects: results.map(({ subjectName, targetGrade }: any) => ({ subjectName, targetGrade }))
            }

            res.send(whatTheyStudy);
        });
    });
}

export default api;