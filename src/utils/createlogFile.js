const fs = require('fs');
const moment = require('moment');
const { logPath } = require('../config/utilityConfig')

const logFile = logPath;
const time = moment.utc().format('YYYYMMDDhhmm');

fs.writeFileSync(logFile, time);

module.exports = { logFile };
