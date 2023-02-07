const path = require('path');
const moment = require('moment')

const time = moment.utc().format('YYYYMMDDhhmm');
const filename = 'log_' + time + '.txt';

module.exports = {
    logPath: path.resolve(__dirname, '../../logs', filename)
}

