const fs = require('fs');

class CSVOutputter {
    static path = "./logs/stats.csv";
    print = false;

    outputString = "";

    constructor() {
        if (this.print) {
            fs.writeFileSync(CSVOutputter.path, '', function () { });
        }
    }

    write(line) {
        if (this.print) {
            fs.appendFileSync(CSVOutputter.path, `${line},`);
        }
    }

    newLine() {
        if (this.print) {
            fs.appendFileSync(CSVOutputter.path, `\n`);
        }
    }
}
exports.CSVOutputter = CSVOutputter;