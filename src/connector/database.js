const sqlite = require('better-sqlite3');
require("../utils/writetoLog");
const logPath = require('../utils/createlogFile');
const { dbPath } = require('../config/dbConfig');

console.file(logPath.logFile);

try {
    var appDatabase = new sqlite(dbPath, { fileMustExist: true });
    console.log(`App connected to database :: path: ${dbPath}`)
} catch (error) {
    console.log("error connecting to database")
}

module.exports = { appDatabase };

