import * as path from 'path';
import * as fs from 'fs';
import { LoggerModes } from '@overnightjs/logger';

// Set env variables
const logFilePath = path.join(__dirname, '../sampleProject.log');
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
process.env.OVERNIGHT_LOGGER_MODE = LoggerModes.Console;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'false';


// Remove current log file
(function removeFile() {
    try {
        fs.unlinkSync(logFilePath);
    } catch (e) { return; }
})();

// Import and start Server. Remember, server must
// be imported after configuring env variables
import NormalRouterServer from './NormalRouterServer';
import { container } from 'tsyringe';
import MainDatabaseContext from './data/MainDatabaseContext';
import DatabaseSeeder from './data/seeder';

let server = new NormalRouterServer();

let dbContext = container.resolve(MainDatabaseContext);
import "./configureAuth";

dbContext.initDb().then(successDb=>{

    if (!successDb)
    {
        console.log("Can't connect to the database failed to start");
        process.exit(1);
    }
    //seed
    DatabaseSeeder.seed(dbContext);
    
    server.start(3000);
});