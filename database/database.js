const sqlite = require('better-sqlite3');
const path = require('path')

const dbPath = path.resolve(__dirname, '../../', 'TicketApp/database', 'data.sqlite3')

const appDatabase = new sqlite(dbPath, {fileMustExist: true});

module.exports = { appDatabase, dbPath };

