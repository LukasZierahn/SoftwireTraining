const rules = [];

rules.push({
    name : "Fizz",
    enabled : true,
    condition : function(i) {
        return i % 3 == 0;
    },
    apply : function(input) {
        return input + "Fizz";
    }
})

rules.push({
    name : "Buzz",
    enabled : true,
    condition : function(i) {
        return i % 5 == 0;
    },
    apply : function(input) {
        return input += "Buzz";
    }
})

rules.push({
    name : "Bang",
    enabled : true,
    condition : function(i) {
        return i % 7 == 0;
    },
    apply : function(input) {
        return input + "Bang";
    }
})

rules.push({
    name : "Bong",
    enabled : true,
    condition : function(i) {
        return i % 11 == 0;
    },
    apply : function(input) {
        return "Bong";
    }
})

rules.push({
    name : "Fezz",
    enabled : true,
    condition : function(i) {
        return i % 13 == 0;
    },
    apply : function(input) {
        split = input.replace("B", ".B").split(".");
        if (split.length == 1) {
            return split.join("") + "Fezz";
        } else {
            split[1] = "Fezz" + split[1];
            return split.join("");
        }
    }
})

rules.push({
    name : "Fezz",
    enabled : true,
    condition : function(i) {
        return i % 17 == 0;
    },
    apply : function(input) {
        buffer = "";
        //Note that output.length is always divisable by four
        for (var j = 0; j < input.length / 4; j++) {
            buffer += input.substring(4 * ((input.length / 4) - j - 1), 4 * (input.length / 4) - j);
        }
        return buffer;

    }
})

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function main(targetNr) {
    for (var i = 1; i <= targetNr; i++) {

        output = "";

        rules.forEach(function(rule, index) {
            if (rule.enabled && rule.condition(i)) {
                output = rule.apply(output);
            }
        })

        output ? console.log(output) : console.log(i);
    }
}

function addRule(resolve) {
    newRule = [];
    readline.question("Enter Rule Parameters: ", (ruleInput) => {
        ruleInput = ruleInput.split("#");
        newRule.name = ruleInput[0];
        //console.log("function(i) { return " + ruleInput[1] + ";}");
        //console.log("function(input) {" + ruleInput[2] + "}");
        eval("newRule.condition = function(i) { return " + ruleInput[1] + ";}");
        eval("newRule.apply = function(input) {" + ruleInput[2] + "}");
        newRule.enabled = true;
        rules.push(newRule);
        resolve();
    })
}

async function HandleUserInput() {

    readline.question("Please enter target number or rule to Enable/Disable: ", async(input) => {
        targetNr = parseInt(input);

        if (!isNaN(targetNr)) {
            main(targetNr)
            console.log("\n");
        } else if (input.match("add")) {
            promise = new Promise((resolve, reject) => { 
                addRule(resolve);
            });
            await promise;
        } else {
            rules.forEach(function(rule, index) {
                if (rule.name.match(input)) {
                    rule.enabled = !rule.enabled;
                    rule.enabled ? console.log("Enabled " + input) : console.log("Disabled " + input);
                }
            })
        }

        if (input.match("exit") || input.match("q")) {
            process.exit()
        } else {
            HandleUserInput();
        }
    })
}

HandleUserInput();