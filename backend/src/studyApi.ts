import { Application } from "express";
import { Connection } from 'mysql';

import { WhatTheyStudy, WhoStudies } from 'shared/dist';

const api = (con: Connection, app: Application) => {

    // Get a list of subjects and target grades for a given student
    app.get("/studies/whatTheyStudy/:studentId", (req, res) => {

        // Query the database, using JOIN to reach across the thjree tables
        con.query(`SELECT student.id as studentId, subject.id as subjectId, student.name as studentName, subject.name as subjectName, studies.target_grade as targetGrade FROM student
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
                subjects: results.map(({ subjectId, subjectName, targetGrade }: any) => ({ subjectId, subjectName, targetGrade }))
            }

            res.send(whatTheyStudy);
        });
    });

    // Get a list of students and target grades for a given subject
    app.get("/studies/whoStudies/:subjectId", (req, res) => {
        con.query(`SELECT student.id as studentId, subject.id as subjectId, subject.name as subjectName, student.name as studentName, studies.target_grade as targetGrade FROM subject
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
                students: results.map(({ studentId, studentName, targetGrade }: any) => ({ studentId, studentName, targetGrade }))
            }

            res.send(whoStudies);
        })
    })


    // Create a target grade/study record
    app.post('/studies/manage', (req, res) => {
        const sql = 'INSERT INTO studies (student_id, subject_id, target_grade) VALUES (?, ?, ?)';
        con.query(sql, [req.body.studentId, req.body.subjectId, req.body.targetGrade], (error, results) => {
            if (error) return res.status(500).send(error);

            res.send({
                studentId: req.body.studentId,
                subjectId: req.body.subjectId,
                targetGrade: req.body.targetGrade
            });
        })
    });

    // Delete a target grade/study record
    app.delete('/studies/manage/:studentId/:subjectId', (req, res) => {
        const sql = 'DELETE FROM studies WHERE student_id=? AND subject_id=?';
        con.query(sql, [req.params.studentId, req.params.subjectId], (error, results) => {
            if (error) return res.status(500).send(error);

            res.sendStatus(200);
        })
    });
}

export default api;