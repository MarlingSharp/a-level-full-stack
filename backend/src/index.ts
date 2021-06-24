import express from "express";
import cors from 'cors';
import winston from 'winston';
import mysql, { ConnectionConfig } from 'mysql';
import dotenv from 'dotenv';
import Student from 'shared/dist/Student';
import Subject from 'shared/dist/Subject';

// Load in environment variables
dotenv.config();

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
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

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// Get the list of students
app.get('/students', (req, res) => {

    // Query the database
    con.query('SELECT name, age, house FROM student', (error, results, fields) => {
        if (error) throw error;

        // Convert the generic results into our Player class
        const students: Student[] = results.map(({ name, age, house }: any) => ({ name, age, house }))

        res.send(students);
    });
});

// Get the list of subject
app.get('/subjects', (req, res) => {

    // Query the database
    con.query('SELECT name, teacher FROM subject', (error, results, fields) => {
        if (error) throw error;

        // Convert the generic results into our Player class
        const subjects: Subject[] = results.map(({ name, teacher }: any) => ({ name, teacher }))

        res.send(subjects);
    });
});

// Get a list of subjects and target grades for a given student
app.get("/studiedBy/:studentId", (req, res) => {

    // Query the database, using JOIN to reach across the thjree tables
    con.query(`SELECT student.name as student_name, subject.name as subject_name, studies.target_grade as target_grade FROM student
    INNER JOIN studies ON
        student.id = studies.student_id
    INNER JOIN subject ON
        studies.subject_id = subject.id
    WHERE student.id = ${req.params.studentId};`, (error, results, fields) => {
        if (error) throw error;

        // Convert the generic results into our Player class
        const studies: object[] = results.map(({ student_name, subject_name, target_grade }: any) => ({ student_name, subject_name, target_grade }))

        res.send(studies);
    });
});

// start the Express server
const server = app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});

const gracefulShutdown = () => {
    console.log('Da fuq')
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server.');
    server.close(() => {
        logger.info('Http server closed.');

        logger.info('Closing Database Connection');
        con.end(() => {
            logger.info('Databaes Closed');
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
// process.on('SIGKILL', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);