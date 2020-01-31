"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Set env variables
const logFilePath = path.join(__dirname, '../sampleProject.log');
process.env.OVERNIGHT_LOGGER_FILEPATH = logFilePath;
process.env.OVERNIGHT_LOGGER_MODE = "CONSOLE" /* Console */;
process.env.OVERNIGHT_LOGGER_RM_TIMESTAMP = 'false';
// Remove current log file
(function removeFile() {
    try {
        fs.unlinkSync(logFilePath);
    }
    catch (e) {
        return;
    }
})();
// Import and start Server. Remember, server must
// be imported after configuring env variables
const NormalRouterServer_1 = __importDefault(require("./NormalRouterServer"));
const tsyringe_1 = require("tsyringe");
const MainDatabaseContext_1 = __importDefault(require("./data/MainDatabaseContext"));
let server = new NormalRouterServer_1.default();
let dbContext = tsyringe_1.container.resolve(MainDatabaseContext_1.default);
dbContext.initDb().then(successDb => {
    if (!successDb) {
        console.log("Can't connect to the database failed to start");
        process.exit(1);
    }
    server.start(3000);
});
//# sourceMappingURL=server.js.map