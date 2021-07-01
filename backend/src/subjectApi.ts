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
}

export default api;