const path = require('path');
const fs = require('fs');
const fastcsv = require('fast-csv');
const moment = require('moment');
const model = require('../models/appModels');
const logFilePath = require('../utils/createlogFile')
require('../utils/writetoLog')

console.file(logFilePath.logFile);

let prevMON = moment.utc().subtract(2,'months').format('MMMYYYY');
const fetchData = model.fetchData(prevMON);

var data = setInterval(() => {
    const filePath = path.resolve(__dirname, 'files');
    const fileName = filePath + '\\' + 'data.csv';
    const ws = fs.createWriteStream(fileName);

    fastcsv.write(fetchData, {headers: true}).pipe(ws);

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: File for ${prevMON} is prepared and sent to destination`);

}, 10000);

module.exports = { data };
