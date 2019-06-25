const { logger } = require("./logger");

const { Person } = require("./Person");

const { Transaction } = require("./Transaction");

const fs = require("fs");
const moment = require('moment');
const readlineSync = require('readline-sync');
const xml2js = require('xml2js');

function ListAll() {
    for (const [key, value] of Object.entries(people)) {
        value.Print();
    }
}

function ListAllWithTransactions() {
    for (const [key, value] of Object.entries(people)) {
        value.PrintTransactions();
    }
}

function AddData(date, from, to, narrative, balance, logPosition) {
    if (!(from in people)) {
        people[from] = new Person(from, 0);
        Person.nameSpaces.CheckForLongestValue(from);
    }

    if (!(to in people)) {
        people[to] = new Person(to, 0);
        Person.nameSpaces.CheckForLongestValue(to);
    }

    logger.info("imported: " + `${date.format('DD MM YYYY')} ${from} ${to} ${balance} ${narrative}`);

    //moment(input[0], "DD-MM-YYYY")
    newTrans = new Transaction(from, to, narrative, balance, date, logPosition);
    people[from].addTransaction(newTrans);
    people[to].addTransaction(newTrans);
}

function ParseCSV(inp) {
    inp.split("\n").forEach((line, index) => {
        if (index == 0) {
            return;
        }
    
        CSVinput = line.split(",");

        AddData(moment(CSVinput[0], "DD-MM-YYYY"), CSVinput[1], CSVinput[2], CSVinput[3], parseFloat(CSVinput[4]), "in line" + (index + 1) + "/" + name);
    })
}

function ParseJSON(inp) {
    JSON.parse(inp).forEach((value, index) => {
        AddData(moment(value.Date), value.FromAccount, value.ToAccount, value.Narrative, value.Amount, "Object Nr: " + (index + 1) + "/" + name); 
    });
}

function ParseXML(inp) {
    var parser = new xml2js.Parser();
    parser.parseString(inp, function (err, result) {
        result.TransactionList.SupportTransaction.forEach((value, index) => {
            AddData(moment("1900-01-01").add(value["$"].Date, 'days'), value.Parties[0].From[0], value.Parties[0].To[0], value.Description, value.Value, "Object Nr: " + (index + 1) + "/" + name);
        });
    });
}

people = {};

input = ""
while (!input.match("exit")) {
    input = readlineSync.question("Please input an action:\n").toLowerCase();

    if (input.indexOf("list all") != -1) {
        ListAll();
    } else if (input.indexOf("list everything") != -1) {
        ListAllWithTransactions();
    } else if (input.indexOf("list ") != -1) {
        if (input.replace("list ", "") in people) {
            people[input.replace("list ", "")].PrintTransactions();
        }
    } else if (input.indexOf("import file ") != -1) {

        name = input.replace("import file ", "");

        if (!fs.existsSync("./" + name)) {
            console.log("Could not open file: " + name);
            return;
        }
    
        text = fs.readFileSync("./" + name, "utf8");    

        if (input.indexOf(".csv") != -1) {
            ParseCSV(text);
        } else if (input.indexOf(".json") != -1) {
            ParseJSON(text);
        } else if (input.indexOf(".xml") != -1) {
            ParseXML(text);        
        }
        else {
            console.log("File type not supported");
        }

        console.log("Successfully imported: " + name);

    } else if (input.indexOf("export file ") != -1) {
        name = input.replace("export file ", "");

        output = ""

        if (name.indexOf(".csv") != -1) {
            output = "Date,From,To,Narrative,Amount\n";

            for (const [key, value] of Object.entries(people)) {
                output += value.getTransactionOutputString("csv");
            }    
        } else if (name.indexOf(".json") != -1) {
            for (const [key, value] of Object.entries(people)) {
                output += value.getTransactionOutputString("json");
            }    
        } else if (name.indexOf(".xml") != -1) {
            output = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<TransactionList>";

            for (const [key, value] of Object.entries(people)) {
                output += value.getTransactionOutputString("xml");
            }    

            output += "</TransactionList>\n";

        }
        else {
            console.log("File type not supported");
        }
        
        fs.writeFileSync(name, output, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("Successfully Written to File: " + name);   
        }); 

    } else if (!input.match("exit")) {
        console.log("Could not Interprete your Input");
    }
}