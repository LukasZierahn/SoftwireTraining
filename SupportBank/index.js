const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger('SupportBank');
const fs = require("fs");
const moment = require('moment');
const readlineSync = require('readline-sync');
const xml2js = require('xml2js');

class Person {
    constructor(name, balance) {
        this.name = name;
        this.balance = balance;
        this.fromSpaces = new SpaceManager();
        this.toSpaces = new SpaceManager();
        this.narrativeSpaces = new SpaceManager();
        this.transactions = [];
    }

    addTransaction(trans) {
        this.fromSpaces.CheckForLongestValue(trans.from);
        this.toSpaces.CheckForLongestValue(trans.to);
        this.narrativeSpaces.CheckForLongestValue(trans.narrative);

        this.transactions.push(trans);
        trans.from.match(this.name) ? this.balance -= trans.balance : this.balance += trans.balance;
    }

    Print() {
        this.balance = Math.round(this.balance*100)/100;

        var spaces = "";

        this.balance < 0 ? spaces = nameSpaces.GetSpaces(this.name, 1) : spaces = nameSpaces.GetSpaces(this.name, 2);

        console.log(this.name + spaces + this.balance);
    }

    PrintTransactions() {
        this.balance = Math.round(this.balance*100)/100;
        console.log(this.name + " " + this.balance);

        this.transactions.forEach((trans, index) => {
            trans.Print(this);
        })
    }

    getTransactionCSVString() {
        output = "";

        this.transactions.forEach((trans, index) => {
            if (trans.from.match(this.name)) {
                output += trans.getCSVString();
            }
        })

        return output;
    }
}

class Transaction {
    constructor(from, to, narrative, balance, date, logPosition){
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.balance = Math.round(balance*100)/100;
        this.date = date;

        if (isNaN(this.balance)) {
            logger.error(`Invalid balance, ${logPosition}`);
            this.balance = 0;
        }

        if (!date.isValid()) {
            logger.error(`Invalid date, ${logPosition}`);
            this.date = moment("2014-01-01");
        }
    }

    Print(person) {
        if (person == null || person == undefined) {
            console.log(`${this.date} ${this.from} ${this.to} ${this.balance} ${this.narrative}`);
        } else {
            var balanceSpace = " ";
            var balanceString = String(this.balance);
            if (balanceString.indexOf(".") == -1) {
                balanceSpace = ".00 ";
            } else if (balanceString.length - balanceString.indexOf(".") == 2) {
                balanceSpace =  "0 ";
            }

            if (this.balance < 10) {
                balanceSpace += "  ";
            } else if (this.balance < 100) {
                balanceSpace += " ";
            }

            console.log(this.date.format('DD MM YYYY ') + " " + this.from + person.fromSpaces.GetSpaces(this.from, 2) +
                this.to + person.toSpaces.GetSpaces(this.to, 2) + 
                this.balance + balanceSpace + 
                this.narrative + person.narrativeSpaces.GetSpaces(this.narrative, 2));
        }
    }

    getCSVString() {
        return `${this.date.format('DD MM YYYY ')},${this.from},${this.to},${this.balance},${this.narrative}\n`
    }
}

class SpaceManager {
    constructor() {
        this.longestValue = 0;
    }

    CheckForLongestValue(input) {
        this.longestValue = Math.max(input.length, this.longestValue);
    }

    GetSpaces(input, extraSpaces) {
        var spaces = ""

        for (var i = input.length; i < this.longestValue + extraSpaces; i++) {
            spaces += " ";
        }

        return spaces;
    }
}

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
        nameSpaces.CheckForLongestValue(from);
    }

    if (!(to in people)) {
        people[to] = new Person(to, 0);
        nameSpaces.CheckForLongestValue(to);
    }

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
    parser.parseString(text, function (err, result) {
        result.TransactionList.SupportTransaction.forEach((value, index) => {
            AddData(moment(value.Date), value.Parties[0].From[0], value.Parties[0].To[0], value.Description, value.Value, "Object Nr: " + (index + 1) + "/" + name);
        });
    });
}


const nameSpaces = new SpaceManager();

people = {};

//text = fs.readFileSync("./Transactions2014.csv", "utf8");

input = ""
while (!input.match("exit")) {
    input = readlineSync.question("Please input an action:\n");

    if (input.toLowerCase().indexOf("list all") != -1) {
        ListAll();
    } else if (input.toLowerCase().indexOf("list everything") != -1) {
        ListAllWithTransactions();
    } else if (input.indexOf("List ") != -1) {
        if (input.replace("List ", "") in people) {
            people[input.replace("List ", "")].PrintTransactions();
        }
    } else if (input.indexOf("Import File ") != -1) {

        name = input.replace("Import File ", "");

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

    } else if (input.indexOf("Export File ") != -1) {
        name = input.replace("Export File ", "");

        output = "Date,From,To,Narrative,Amount\n";

        for (const [key, value] of Object.entries(people)) {
            output += value.getTransactionCSVString();
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