const db = require('../database/database');

const getData = () => {
    const sql = "SELECT * FROM TICKETS_V2";

    return db.appDatabase.prepare(sql).all();
};

const getDataByMonth = (month) => {
    const sql = "SELECT * FROM TICKETS_V2 WHERE MONTH = ? ORDER BY TICKET_COUNT DESC";

    return db.appDatabase.prepare(sql).all(month);
};

const getMonths = () => {
    const sql = "SELECT DISTINCT MONTH FROM TICKETS_V2";

    return db.appDatabase.prepare(sql).all();
};

module.exports = {
    getData,
    getDataByMonth,
    getMonths
}
