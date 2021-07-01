import express from "express";
import cors from 'cors';
import winston from 'winston';
import mysql, { ConnectionConfig } from 'mysql';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import ON_DEATH from 'death'; // this is intentionally ugly

import studentApi from './studentApi';
import subjectApi from './subjectApi';
import studyApi from './studyApi';

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

// Setup the two REST APIs
studentApi(con, app);
subjectApi(con, app);
studyApi(con, app);

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
