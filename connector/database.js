const sqlite = require('better-sqlite3');
const path = require('path');
require("../utils/writetoLog");
const logPath = require('../utils/createlogFile');

console.file(logPath.logFile);

const dbPath = path.resolve(__dirname, '../../', 'TicketApp/database', 'data.sqlite3')

var appDatabase;

try {
    appDatabase = new sqlite(dbPath, { fileMustExist: true })
    console.log(`Database is connected to path "${model.dbPath}"`);
} catch (error) {
    console.log(error.message);
}

module.exports = { appDatabase };

