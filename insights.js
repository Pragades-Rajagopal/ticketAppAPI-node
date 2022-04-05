module.exports = {
    insights : [
        {"app version" : "1.0"},
        {"description" : "Ticket tool RESTFUL API application is designed using Node.js, Express"},
        {"details" : [{"server" : "Hosted in Dev application server by running it as a service 'tt_tool_api'"}, {"port" : "Port in&out 9192 is opened to serve to the end user"}]},
        {"debugging steps" : [
            {"database operation issue": {
                "1" : "Check if the database connection is established by debugging 'database/database.js' file by enabling logs",
                "2" : "Another issue might be due table lock created by multiple user operations from the Ticket tool",
                "3" : "Move data.sqlite3 file to other directory and place it back (this will remove session locks created by some main stream operations)",
                "4" : "Restart the service finally!"
            }},
        ]},
        {"housekeeping activities" : "Log files will be generated in './logs' directory and can be deleted periodically"}
    ],
}