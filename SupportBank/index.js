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

    print() {
        this.balance = Math.round(this.balance*100)/100;

        var spaces = "";

        this.balance < 0 ? spaces = nameSpaces.GetSpaces(this.name, 1) : spaces = nameSpaces.GetSpaces(this.name, 2);

        console.log(this.name + spaces + this.balance);
    }

    printTransactions() {
        console.log(this.name + " " + this.balance);

        this.transactions.forEach((trans, index) => {
            trans.print(this);
        })
    }
}

class Transaction {
    constructor(from, to, narrative, balance, date){
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.balance = Math.round(balance*100)/100;
        this.date = date;
    }

    print(person) {
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
        value.print();
      }
}

const fs = require("fs");
const moment = require('moment');
const readlineSync = require('readline-sync');

const nameSpaces = new SpaceManager();

people = {};

text = fs.readFileSync("./Transactions2014.csv", "utf8");
text.split("\n").forEach((line, index) => {
    if (index == 0) {
        return;
    }

    input = line.split(",");
    found = false;

    if (!(input[1] in people)) {
        people[input[1]] = new Person(input[1], 0);
        nameSpaces.CheckForLongestValue(input[1]);
    }

    if (!(input[2] in people)) {
        people[input[2]] = new Person(input[2], 0);
        nameSpaces.CheckForLongestValue(input[2]);
    }

    newTrans = new Transaction(input[1], input[2], input[3], parseFloat(input[4]), moment(input[0], "DD-MM-YYYY"));
    people[input[1]].addTransaction(newTrans);
    people[input[2]].addTransaction(newTrans);
})

input = ""
while (!input.match("exit")) {
    input = readlineSync.question("Please input an action:\n");

    if (input.toLowerCase().match("list all")) {
        ListAll();
    }

    if (input.indexOf("List ") != -1) {
        if (input.replace("List ", "") in people) {
            people[input.replace("List ", "")].printTransactions();
        }
    }
}