const path = require('path');
const fs = require('fs');
const fastcsv = require('fast-csv');
const moment = require('moment');
const model = require('../models/appModels');
const cron = require('node-cron');
const logFilePath = require('../utils/createlogFile')
require('../utils/writetoLog')

console.file(logFilePath.logFile);

// Tesing if the filesI/O is working
// const filePath = path.resolve(__dirname, 'files');

// Below path is for Development directory!
const filePath = path.resolve(__dirname, '../../../', 'python', 'tt-chart', 'data');

const dataPrev = cron.schedule('* * * * *', () => {
    let prevMON = moment.utc().subtract(1,'months').format('MMMYYYY');
    const fetchData = model.fetchData(prevMON);

    const fileName = filePath + '\\' + 'data.csv';
    const ws = fs.createWriteStream(fileName);

    fastcsv.write(fetchData, {headers: true}).pipe(ws);

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: File for ${prevMON} is prepared and sent to destination`);

});

const dataCur = cron.schedule('* * * * *', () => {
    let curMon = moment.utc().format('MMMYYYY');
    const fetchData = model.fetchData(curMon);

    const fileName = filePath + '\\' + 'data_cur.csv';
    const ws = fs.createWriteStream(fileName);

    fastcsv.write(fetchData, {headers: true}).pipe(ws);

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: File for ${curMon} is prepared and sent to destination`);

});

module.exports = { 
    dataPrev,
    dataCur
};
