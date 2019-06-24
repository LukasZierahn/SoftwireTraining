const rules = {
    "Fizz" : true,
    "Buzz" : true,
    "Bang" : true,
    "Bong" : true,
    "Fezz" : true,
    "Reverse" : true,
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function main(targetNr) {
    for (var i = 1; i <= targetNr; i++) {

        output = "";

        if (i % 3 == 0 && rules.Fizz) {
            output += "Fizz";
        }        
        if (i % 5 == 0 && rules.Buzz) {
            output += "Buzz";
        }

        if (i % 7 == 0 && rules.Bang) {
            output += "Bang";
        }

        if (i % 11 == 0 && rules.Bong) {
            output = "Bong";
        }

        if (i % 13 == 0 && rules.Fezz) {
            split = output.replace("B", ".B").split(".");
            if (split.length == 1) {
                output = split.join("") + "Fezz";
            } else {
                split[1] = "Fezz" + split[1];
                output = split.join("");
            }
        }

        if (i % 17 == 0 && rules.Reverse) {
            buffer = "";
            //Note that output.length is always divisable by four
            for (var j = 0; j < output.length / 4; j++) {
                buffer += output.substring(4 * ((output.length / 4) - j - 1), 4 * (output.length / 4) - j);
            }
            output = buffer;
        }

        output ? console.log(output) : console.log(i);
    }
}

function HandleUserInput() {
    readline.question("Please enter target number or rule to Enable/Disable: ", (input) => {

        targetNr = parseInt(input);

        if (!isNaN(targetNr)) {
            main(targetNr)
            console.log("\n");
        } else {
            if (input in rules) {
                rules[input] = !rules[input];
                output = "";

                rules[input] ? console.log("Enabled " + input) : console.log("Disabled " + input);
            } else if (!input.match("exit")) {
                console.log("Could not interprete your input!");
            }
        }

        if (!input.match("exit")) {
            HandleUserInput();
        } else {
            process.exit()
        }
    })
}

HandleUserInput();