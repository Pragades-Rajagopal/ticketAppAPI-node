const fs = require('fs');
const path = require('path');
const moment = require('moment');

const time = moment.utc().format('YYYYMMDDhhmm');
const filename = 'log_' + time + '.txt';

const logFile = path.resolve(__dirname, '../logs', filename)

fs.writeFileSync(logFile, time);

module.exports = { logFile };
