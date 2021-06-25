import express from "express";
import cors from 'cors';
import winston from 'winston';
import mysql, { ConnectionConfig } from 'mysql';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Student, Subject, WhatTheyStudy, WhoStudies } from 'shared/dist';
import ON_DEATH from 'death'; // this is intentionally ugly

// Load in environment variables
dotenv.config();

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Connect to our database
const dbConfig: ConnectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
logger.info('DB Config ' + JSON.stringify(dbConfig));
const con = mysql.createConnection(dbConfig);

con.connect((err) => {
    if (err) {
        logger.error(err);
        throw err;
    }
    logger.info("Connected to MySQL Database");
});

// Create the express REST application
const DEFAULT_APP_PORT = 5001;
const app = express();
const port = process.env.APP_PORT || DEFAULT_APP_PORT; // default port to listen

// Good old CORS
app.use(cors())
app.options('*', cors());  // enable pre-flight

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// Get the list of students
app.get('/students', (req, res) => {

    // Query the database
    con.query('SELECT name, age, house FROM student', (error, results, fields) => {
        if (error) return res.status(500).send(error);

        // Convert the generic results into our Player class
        const students: Student[] = results.map(({ name, age, house }: any) => ({ name, age, house }))

        res.send(students);
    });
});

// Add a new student
app.post('/students', (req, res) => {

    const sql = `INSERT INTO student (name, age, house) VALUES (?, ?, ?)`;
    con.query(sql, [req.body.name, req.body.age, req.body.house], (error, result) => {
        if (error) return res.status(500).send(error);

        res.send('Student Added');
    });
})

// Get the list of subject
app.get('/subjects', (req, res) => {

    // Query the database
    con.query('SELECT name, teacher FROM subject', (error, results, fields) => {
        if (error) return res.status(500).send(error);

        // Convert the generic results into our Player class
        const subjects: Subject[] = results.map(({ name, teacher }: any) => ({ name, teacher }))

        res.send(subjects);
    });
});

// Get a list of subjects and target grades for a given student
app.get("/studiedBy/:studentId", (req, res) => {

    // Query the database, using JOIN to reach across the thjree tables
    con.query(`SELECT student.id as studentId, student.name as studentName, subject.name as subjectName, studies.target_grade as targetGrade FROM student
    INNER JOIN studies ON
        student.id = studies.student_id
    INNER JOIN subject ON
        studies.subject_id = subject.id
    WHERE student.id = ${req.params.studentId};`, (error, results, fields) => {
        if (error) return res.status(500).send(error);
        if (results.length === 0) return res.sendStatus(404).send('This student is not recorded as studying any subjects');

        // Convert the generic results into our specific interface
        const whatTheyStudy: WhatTheyStudy = {
            studentId: results[0].studentId,
            studentName: results[0].studentName,
            subjects: results.map(({ subjectName, targetGrade }: any) => ({ subjectName, targetGrade }))
        }

        res.send(whatTheyStudy);
    });
});

// Get a list of students and target grades for a given subject
app.get("/whoStudies/:subjectId", (req, res) => {
    con.query(`SELECT subject.name as subjectName, student.name as studentName, studies.target_grade as targetGrade FROM subject
    INNER JOIN studies ON
        subject.id = studies.subject_id
    INNER JOIN student ON
        studies.student_id = student.id
    WHERE subject.id = ${req.params.subjectId};`, (error, results, fields) => {
        if (error) return res.status(500).send(error);
        if (results.length === 0) return res.sendStatus(404).send('Nobody studies this subject');

        // Convert the generic results into our specific interface
        const whoStudies: WhoStudies = {
            subjectId: results[0].subjectId,
            subjectName: results[0].subjectName,
            students: results.map(({ studentName, targetGrade }: any) => ({ studentName, targetGrade }))
        }

        res.send(whoStudies);
    })
})

// start the Express server
const server = app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});

// Handle graceful shutdown
ON_DEATH(() => {
    logger.info('Close Program Signal Received.');
    logger.info('Closing http server.');
    server.close(() => {
        logger.info('Http server closed.');

        logger.info('Closing Database Connection');
        con.end(() => {
            logger.info('Database Closed');
        });
    });
});
