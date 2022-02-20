const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const model = require('./models/appModels');

const port = 9192;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.get('/ticketapp-api', (req, res) => {
    const data = model.getData()
    res.status(200).json(data);
});

app.get('/ticketapp-api/:month', (req, res) => {
    const month = req.params.month;

    if (month.toUpperCase() === 'MONTHS') {
        const values = model.getMonths();
        res.status(200).send(values);
        return;
    }

    const data = model.getDataByMonth(month);

    if (data.length === 0) {
        res.status(404).json({"no data":"specified month is not available"});
        return;
    }

    res.status(200).json(data);
});

app.get('/ticketapp-api/resolution/:value', (req, res) => {
    var resolution_ = req.params.value;
    resolution_ = resolution_.split('+').join(' ');

    const data = model.getResolution(resolution_);

    if (data.length === 0) {
        res.status(404).json({"no data":"no output for provided resolution"});
        return;
    }

    return res.status(200).json(data);
});

app.get('/ticketapp-api/all/resolutions', (req, res) => {
    const data = model.getAllResolutions();
    var length = data.length;

    var param_resol = [];
    for (let i = 0; i < length; i++) {
        let value = []
        value[i] = data[i]["RESOLUTION"];
        value[i] = value[i].split(' ').join('+');
        param_resol.push(value[i]);
    }    

    var resol_ = [];
    for (let i = 0; i < length; i++) {
        resol_.push(data[i]["RESOLUTION"]);
    }

    var result = [];
    for (let i = 0; i < length; i++) {
        result.push({"RESOLUTION":resol_[i], "PARAM_RESULT":param_resol[i]});
    }
    
    res.status(200).json(result);
});

app.listen(
    port
    // , () => console.log(`Server is running in port ${port}`)
    );

