import express from "express";
import winston from 'winston';
import mysql, { ConnectionConfig } from 'mysql';
import dotenv from 'dotenv';

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
const DEFAULT_APP_PORT = 8080;
const app = express();
const port = process.env.APP_PORT || DEFAULT_APP_PORT; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});