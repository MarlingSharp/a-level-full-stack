import { Application } from "express";
import { Connection } from 'mysql';

import { Student, DbStudent } from '../model';

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

            res.sendStatus(200);
        })
    });
}

export default api;