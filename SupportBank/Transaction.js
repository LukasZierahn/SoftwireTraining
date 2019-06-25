const moment = require('moment');
const { logger } = require("./logger");

class Transaction {
    constructor(from, to, narrative, balance, date, logPosition) {
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.balance = Math.round(balance * 100) / 100;
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
        }
        else {
            var balanceSpace = " ";
            var balanceString = String(this.balance);
            if (balanceString.indexOf(".") == -1) {
                balanceSpace = ".00 ";
            }
            else if (balanceString.length - balanceString.indexOf(".") == 2) {
                balanceSpace = "0 ";
            }
            if (this.balance < 10) {
                balanceSpace += "  ";
            }
            else if (this.balance < 100) {
                balanceSpace += " ";
            }
            console.log(this.date.format('DD MM YYYY ') + " " + this.from + person.fromSpaces.GetSpaces(this.from, 2) +
                this.to + person.toSpaces.GetSpaces(this.to, 2) +
                this.balance + balanceSpace +
                this.narrative + person.narrativeSpaces.GetSpaces(this.narrative, 2));
        }
    }
    getCSVString() {
        return `${this.date.format('DD MM YYYY')},${this.from},${this.to},${this.balance},${this.narrative}\n`;
    }

    getJSONString() {
        output = `{\n`;
        output += `\t\"Date\":${this.date.format('DD MM YYYY')},\n`;
        output += `\t\"FromAccount\": ${this.from},\n`;
        output += `\t\"ToAccount\": ${this.to},\n`;
        output += `\t\"Narrative\": ${this.narrative},\n`;
        output += `\t\"Amount\": ${this.balance}\n`;
        output += `},\n`;
        return output;
    }

    getXMLString() {
        var days = this.date.diff(moment('1900-01-01'), 'days');

        output =  `\t<SupportTransaction Date="${days}">\n`;
        output += `\t\t<Description>${this.narrative}</Description>\n`;
        output += `\t\t<Value>${this.balance}</Value>\n`;
        output += `\t\t<Parties>\n`;
        output += `\t\t\t<From>${this.from}</From>\n`;
        output += `\t\t\t<To>${this.to}</To>\n`;
        output += `\t\t</Parties>\n`;
        output += `\t</SupportTransaction>\n`;

      return output;
    }
}
exports.Transaction = Transaction;
