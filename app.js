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

app.listen(
    port
    // , () => console.log(`Server is running in port ${port}`)
    );

