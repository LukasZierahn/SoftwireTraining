const { SpaceManager } = require("./SpaceManager");
const { nameSpaces } = require("./index");


class Person {
    static nameSpaces = new SpaceManager();

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
        this.balance = Math.round(this.balance * 100) / 100;
        var spaces = "";
        this.balance < 0 ? spaces = Person.nameSpaces.GetSpaces(this.name, 1) : spaces = Person.nameSpaces.GetSpaces(this.name, 2);
        console.log(this.name + spaces + this.balance);
    }
    PrintTransactions() {
        this.balance = Math.round(this.balance * 100) / 100;
        console.log(this.name + " " + this.balance);
        this.transactions.forEach((trans, index) => {
            trans.Print(this);
        });
    }
    getTransactionCSVString() {
        output = "";
        this.transactions.forEach((trans, index) => {
            if (trans.from.match(this.name)) {
                output += trans.getCSVString();
            }
        });
        return output;
    }
}
exports.Person = Person;
