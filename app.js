const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const model = require('./models/appModels');
require("./utils/writetoLog");
const moment = require('moment');
const logPath = require('./utils/createlogFile')

console.file(logPath.logFile);

const port = 9192;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.get('/ticketapp/api/details', (req, res) => {
    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get all details`);

    const data = model.getData()
    res.status(200).json(data);
});

app.get('/ticketapp/api/details/:month', (req, res) => {
    const month = req.params.month;

    if (month.toUpperCase() === 'MONTHS') {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get months`);
        
        const values = model.getMonths();
        res.status(200).send(values);
        return;
    }

    const data = model.getDataByMonth(month);

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get details for invalid month: ${month}`);

        res.status(404).json({"no data":"specified month is not available"});
        return;
    }

    console.log(`[${time}]: api request to get details for month: ${month}`);
    res.status(200).json(data);
});

app.get('/ticketapp/api/resolution/:value', (req, res) => {
    var resolution_ = req.params.value;
    resolution_ = resolution_.split('+').join(' ');
    resolution_ = resolution_.split('=').join('/');

    const data = model.getResolution(resolution_);

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get resolution details for invalid resolution: "${resolution_}"`);

        res.status(404).json({"no data":"no output for provided resolution"});
        return;
    }

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get resolution details for resolution: "${resolution_}"`);
    return res.status(200).json(data);
});

app.get('/ticketapp/api/all/resolutions', (req, res) => {
    const data = model.getAllResolutions();
    var length = data.length;

    var result = [];
    for (let i = 0; i < length; i++) {
        
        let value = []
        value[i] = data[i]["RESOLUTION"];
        value[i] = value[i].split(' ').join('+');
        value[i] = value[i].split('/').join('=');

        result.push({"RESOLUTION": data[i]["RESOLUTION"], "PARAM_RESULT": value[i]});
    }
    
    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get all resolution details`);

    res.status(200).json(result);
});

app.get('/ticketapp/api/ticket/:id', (req, res) => {
    const ticket = req.params.id;
    const data = model.getTicket(ticket)

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get ticket detail for invalid ticket: ${ticket}`);

        res.status(404).json({"no data":"ticket detail not available for ticket: "+ ticket});
        return;
    }

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get ticket detail for ticket: ${ticket}`);

    res.status(200).json(data);
});

app.put('/ticketapp/api/ticket', (req, res) => {

    try {
        var errors = [];
        if (!req.body.APP_NM) {
            errors.push("APP_NM is mandatory")
        }
        if (!req.body.TICKET) {
            errors.push("TICKET is mandatory")
        }
        if (!req.body.RESOLUTION) {
            errors.push("RESOLUTION is mandatory")
        }
        if (!req.body.TICKET_TYPE) {
            errors.push("TICKET_TYPE is mandatory")
        }
        if (!req.body.COMMENT) {
            errors.push("COMMENT is mandatory")
        }
        if (!req.body.CREATED_ON) {
            errors.push("CREATED_ON is mandatory")
        }
        if (!req.body.MON) {
            errors.push("MON is mandatory")
        }
        if (!req.body.RESOLVED_BY) {
            errors.push("RESOLVED_BY is mandatory")
        }

        if (errors.length) {
            res.status(400).json({"errors": errors});
            return;
        }

        const ticket = req.body.TICKET;
        const APP_NM = req.body.APP_NM;
        const CREATED_ON = req.body.CREATED_ON;
        const MON = req.body.MON;
        const RESOLVED_BY = req.body.RESOLVED_BY;

        const data = model.updateTicket(ticket, APP_NM, CREATED_ON, MON, RESOLVED_BY);

        if (data["changes"] !== 1) {
            let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
            console.log(`[${time}]: api request to update ticket detail for invalid ticket: ${ticket}`);

            res.status(400).json({"message": "no update performed on invalid ticket " + ticket});
            return;
        }

        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to update ticket detail for ticket: ${ticket} || data: [${APP_NM}, ${CREATED_ON}, ${MON}, ${RESOLVED_BY}]`);

        res.status(200).json({"success": "details updated"});

    }
    catch (err){
        res.status(400).json({"error": err.message});
    }

});

let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
app.listen(
    port
    , () => console.log(`[${time}]: Application is running in port ${port} \n[${time}]: Database is connected to path "${model.dbPath}"`)
    );

