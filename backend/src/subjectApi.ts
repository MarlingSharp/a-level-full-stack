import { Application } from "express";
import { Connection } from 'mysql';

import { Subject, DbSubject, WhoStudies } from 'shared/dist';

const api = (con: Connection, app: Application) => {
    // Get the list of subject
    app.get('/subjects', (req, res) => {

        // Query the database
        con.query('SELECT id, name, teacher FROM subject', (error, results, fields) => {
            if (error) return res.status(500).send(error);

            // Convert the generic results into our Player class
            const subjects: DbSubject[] = results.map(({ id, name, teacher }: any) => ({ id, name, teacher }))

            res.send(subjects);
        });
    });

    // Add a new student
    app.post('/subjects', (req, res) => {

        const sql = 'INSERT INTO subject (name, teacher) VALUES (?, ?)';
        con.query(sql, [req.body.name, req.body.teacher], (error, result) => {
            if (error) return res.status(500).send(error);

            const subject: Subject = {
                name: req.body.name,
                teacher: req.body.teacher,
            }

            res.send({
                id: result.insertId,
                ...subject
            });
        });
    });

    // Delete a student
    app.delete('/subjects/:id', (req, res) => {
        const sql = 'DELETE FROM subject WHERE id=?';
        con.query(sql, [req.params.id], (error, results) => {
            if (error) return res.status(500).send(error);

            res.send(200);
        })
    });

    // Get a list of students and target grades for a given subject
    app.get("/subjects/whoStudies/:subjectId", (req, res) => {
        con.query(`SELECT subject.name as subjectName, student.name as studentName, studies.target_grade as targetGrade FROM subject
                    INNER JOIN studies ON
                        subject.id = studies.subject_id
                    INNER JOIN student ON
                        studies.student_id = student.id
                    WHERE subject.id = ${req.params.subjectId};`, (error, results, fields) => {
            if (error) return res.status(500).send(error);
            if (results.length === 0) return res.status(404).send('Nobody studies this subject');

            // Convert the generic results into our specific interface
            const whoStudies: WhoStudies = {
                subjectId: results[0].subjectId,
                subjectName: results[0].subjectName,
                students: results.map(({ studentName, targetGrade }: any) => ({ studentName, targetGrade }))
            }

            res.send(whoStudies);
        })
    })
}

export default api;