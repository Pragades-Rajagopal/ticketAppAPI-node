const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const model = require('./models/appModels');
require("./utils/writetoLog");
const moment = require('moment');
const logPath = require('./utils/createlogFile');
const info = require('./insight.json');

/**
 * Below code is for chart application - Dev purpose
 */
// const prepareCSV = require('./prepareCSV/spooler');
// prepareCSV.dataPrev;
// prepareCSV.dataCur;

console.file(logPath.logFile);

const port = 9192;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());


app.get('/ticketapp/api/details', (req, res) => {
    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get all details`);

    const data = model.getData()
    res.status(200).json(data);
});

app.get('/ticketapp/api/details/months', (req, res) => {
    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get months`);

    const values = model.getMonths();
    res.status(200).send(values);
    return;
});

app.get('/ticketapp/api/details/month', (req, res) => {
    const month = req.body.month;

    const data = model.getDataByMonth(month);

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get details for invalid month: ${month}`);

        res.status(404).json({ "message": "no data available for specified month" });
        return;
    }

    console.log(`[${time}]: api request to get details for month: ${month}`);
    res.status(200).json(data);
});

app.get('/ticketapp/api/details/ticket-count', (req, res) => {
    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get ticket count details`);

    const data = model.ticketCount();
    res.status(200).json(data);
});

app.get('/ticketapp/api/details/ticket-count/:month', (req, res) => {
    const month = req.params.month;

    const data = model.ticketCountMonth(month);

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get ticket count detail for invalid month: ${month}`);

        res.status(404).json({ "message": "no data available for specified month" });
        return;
    }

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get ticket count detail for month: ${month}`);

    res.status(200).json(data);
});

app.get('/ticketapp/api/details/resolution/', (req, res) => {
    var resolution = req.body.RESOLUTION;

    if (!resolution) {
        return res.status(400).json({ message: "RESOLUTION is mandatory" })
    }

    const data = model.getResolution(resolution);

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get resolution details for invalid resolution: "${resolution}"`);

        res.status(404).json({ "message": "no output for provided resolution" });
        return;
    }

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get resolution details for resolution: "${resolution}"`);
    return res.status(200).json(data);
});

app.get('/ticketapp/api/details/resolution/all', (req, res) => {
    const data = model.getAllResolutions();

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get all resolution details`);

    res.status(200).json(data);
});

app.get('/ticketapp/api/details/ticket', (req, res) => {
    const ticket = req.body.TICKET;
    if (!ticket) {
        return res.status(400).json({ message: "TICKET is mandatory" })
    }

    const data = model.getTicket(ticket)

    if (data.length === 0) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to get ticket detail for invalid ticket: ${ticket}`);

        res.status(404).json({ "message": "ticket detail not available for ticket: " + ticket });
        return;
    }

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to get ticket detail for ticket: ${ticket}`);

    res.status(200).json(data[0]);
});

app.put('/ticketapp/api/details/ticket', (req, res) => {

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
            res.status(400).json({ "errors": errors });
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

            res.status(400).json({ "message": "no update performed on invalid ticket " + ticket });
            return;
        }

        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to update ticket detail for ticket: ${ticket} || data: [${APP_NM}, ${CREATED_ON}, ${MON}, ${RESOLVED_BY}]`);

        res.status(200).json({ "success": "details updated" });

    }
    catch (err) {
        res.status(400).json({ "error": err.message });
    }

});

app.delete('/ticketapp/api/details/ticket', (req, res) => {
    const ticket = req.body.TICKET;

    if (!ticket) {
        return res.status(400).json({ "message": "TICKET is mandatory" })
    }

    const data = model.deleteTicket(ticket);

    if (data["changes"] !== 1) {
        let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
        console.log(`[${time}]: api request to delete ticket detail for invalid ticket: ${ticket}`);

        res.status(400).json({ "message": "no delete performed on invalid ticket: " + ticket });
        return;
    }

    let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');
    console.log(`[${time}]: api request to delete ticket detail for ticket: ${ticket}`);

    res.status(200).json({ "message": `ticket ${ticket} deleted` });
});

app.get('/ticketapp/details/api-insight', (req, res) => {
    res.status(200).json(info);
});

let time = moment.utc().format('YYYY/MM/DD hh:mm:ss');

app.listen(
    port
    , () => console.log(`[${time}]: Application is running in port ${port}`)
);


