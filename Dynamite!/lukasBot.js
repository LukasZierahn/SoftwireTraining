const { BotAnalyser } = require("./BotAnalyser");
const { DrawPredictor } = require("./DrawPredictor");
const { Helper, myMove, opponentMove } = require("./Helper");

const { logger } = require("./logger");
const outputter = require("./CSVOutputter").CSVOutputter;
const CSVOutputter = new outputter();



class Bot {
    constructor() {
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;

        this.gameCount = 0

        this.myPoints = 0;
        this.opponentsPoints = 0;
        this.pointStake = 1;

        this.dynamitesLeft = 100;
        this.opponentsDynamitesLeft = 100;
        this.dynamitePoints = 0;

        this.waterbombPoints = 0;
        this.waterbombUses = 0;

        this.classicPoints = 0;
        this.classicUses = 0;

        this.bots = [];

        for (let lookbackFactor of [0, 0.25, 0.5, 0.75, 1]) {
            for (let dynamiteRetention of [0.25, 0.5, 1]) {
                for (let waterbombFactor of [0.025, 0.05, 0.1, 0.5, 1]) {
                    this.bots.push(new BotAnalyser(new DrawPredictor(this, lookbackFactor, dynamiteRetention, waterbombFactor), `Draw-Predictor-Bot ${lookbackFactor} ${dynamiteRetention} ${waterbombFactor}`));
                }
            }
        }

        CSVOutputter.write("wins,points,draws,pointstake,losses,opponentPoints,dynamitesLeft,opponentDynamites,dynamiteValue,WaterbombUses,WaterbombValue,classicUses,classicValue");
        let outputArr = [];
        for (let supBot of this.bots) {
            outputArr.push(supBot.getCSVHeader().split(","));
        }

        for (let i = 0; i < outputArr[0].length; i++) {
            for (let j = 0; j < outputArr.length; j++) {
                CSVOutputter.write(outputArr[j][i]);
            }
        }

        CSVOutputter.newLine();
    }

    assesGamestate(gamestate) {
        if (this.gameCount == 1) {
            return;
        }

        let round = gamestate.rounds[gamestate.rounds.length - 1];

        if (round == undefined) {
            return;
        }

        //Counting dynamites
        if (round[myMove] == "D") {
            this.dynamitesLeft--;
        } else if (round[myMove] == "W") {
            this.waterbombUses++;
        } else {
            this.classicUses++;
        }

        if (round[opponentMove] == "D") {
            this.opponentsDynamitesLeft--;
        }

        let lastResult = Helper.simulateGame(round[myMove], round[opponentMove]);
        logger.info(`Last Round: ${lastResult}`);

        if (lastResult == "w") {
            this.wins++;
            this.myPoints += this.pointStake;

            if (round[myMove] == "W") {
                this.waterbombPoints += this.pointStake;
            } else if (round[myMove] == "D") {
                this.dynamitePoints += this.pointStake;
            } else {
                this.classicPoints += this.pointStake;
            }

            this.pointStake = 1;
        } else if (lastResult == "l") {
            this.losses++;
            this.opponentsPoints += this.pointStake;

            if (round[myMove] == "W") {
                this.waterbombPoints -= this.pointStake;
            } else if (round[myMove] == "D") {
                this.dynamitePoints -= this.pointStake;
            } else {
                this.classicPoints += this.pointStake;
            }

            this.pointStake = 1;
        } else if (lastResult == "d") {
            this.draws++;
            this.pointStake++;
        } else {
            logger.error(`Invalid last round result: ${lastResult}`)
        }
    }

    makeMove(gamestate) {

        this.gameCount++;

        //this.pointStake gets update in assesGamestate thus this is equivalent to checking if the last round was a draw
        if (this.pointStake != 1) {

            for (let supBot of this.bots) {
                supBot.assesGamestate(gamestate, this.pointStake);
            }
        }

        logger.info(`Game Number: ${this.gameCount}`);
        this.assesGamestate(gamestate);

        if (gamestate.rounds.length != 0) {
            let round = gamestate.rounds[gamestate.rounds.length - 1];
            logger.info(round[myMove], round[opponentMove]);
            logger.info(`\n`);
        }

        logger.info(`wins: ${this.wins}/${this.myPoints}`);
        CSVOutputter.write(this.wins);
        CSVOutputter.write(this.myPoints);
        logger.info(`draws: ${this.draws}/${this.pointStake}`);
        CSVOutputter.write(this.draws);
        CSVOutputter.write(this.pointStake);
        logger.info(`losses: ${this.losses}/${this.opponentsPoints}`);
        CSVOutputter.write(this.losses);
        CSVOutputter.write(this.opponentsPoints);
        logger.info("dynamitesLeft: " + this.dynamitesLeft);
        logger.info("opponentsDynamitesLeft: " + this.opponentsDynamitesLeft);
        CSVOutputter.write(this.dynamitesLeft);
        CSVOutputter.write(this.opponentsDynamitesLeft);

        CSVOutputter.write(this.dynamitePoints / Math.max(1, (100 - this.dynamitesLeft)));

        CSVOutputter.write(this.waterbombUses);
        CSVOutputter.write(this.waterbombPoints / Math.max(1.0, 1.0 * this.waterbombUses));

        CSVOutputter.write(this.classicUses);
        CSVOutputter.write(this.classicPoints / Math.max(1, this.classicUses));

        let outputArr = [];
        for (let supBot of this.bots) {
            outputArr.push(supBot.getCSVString().split(","));
        }

        for (let i = 0; i < outputArr[0].length; i++) {
            for (let j = 0; j < outputArr.length; j++) {
                CSVOutputter.write(outputArr[j][i]);
            }
        }

        CSVOutputter.newLine();
        logger.info(`\n`);

        if (this.gameCount == 1 || this.pointStake == 1 || this.bots[0].getBotMove() == "") {
            logger.info(`\n`);
            return Helper.randomMove(false);
        }

        let highestWinP = -1000;
        let winningBot = null;
        for (let supBot of this.bots) {
            if (supBot.getPointPercent() > highestWinP) {
                winningBot = supBot;
                highestWinP = supBot.getPointPercent();
            }
        }

        for (let supBot of this.bots) {
            logger.info(supBot.getDebugString());
        }

        logger.info(`Used ${winningBot.botname} / ${winningBot.currentMove}`);
        logger.info(`\n`);
        logger.info(`\n`);

        winningBot.uses++;

        if (winningBot.getBotMove() == "D" && this.dynamitesLeft <= 0) {
            return Bot.randomMove(false);
        }

        return winningBot.getBotMove();
    }
}

exports.Bot = Bot;

module.exports = new Bot();