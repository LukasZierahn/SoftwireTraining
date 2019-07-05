const { BotAnalyser } = require("./BotAnalyser");
const { DrawPredictor } = require("./DrawPredictor");
const { Helper, myMove, opponentMove } = require("./Helper");

const { logger } = require("./logger");

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

        this.bots = [];
        // this.bots.push(new BotAnalyser( new SingleBot("R"), "Rock-Bot" ));
        // this.bots.push(new BotAnalyser( new SingleBot("P"), "Paper-Bot"  ));
        // this.bots.push(new BotAnalyser( new SingleBot("S"), "Scissors-Bot"  ));
        // this.bots.push(new BotAnalyser( new SingleBot("W"), "Water-Bot"  ));

        console.log(BotAnalyser);

        this.bots.push(new BotAnalyser(new DrawPredictor(this, 1), "Draw-Predictor-Bot 1"));
        this.bots.push(new BotAnalyser(new DrawPredictor(this, 0.75), "Draw-Predictor-Bot 0.75"));
        this.bots.push(new BotAnalyser(new DrawPredictor(this, 0.5), "Draw-Predictor-Bot 0.5"));
        this.bots.push(new BotAnalyser(new DrawPredictor(this, 0.25), "Draw-Predictor-Bot 0.25"));
        this.bots.push(new BotAnalyser(new DrawPredictor(this, 0), "Draw-Predictor-Bot 0"));
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
        }

        if (round[opponentMove] == "D") {
            this.opponentsDynamitesLeft--;
        }

        let lastResult = Helper.simulateGame(round[myMove], round[opponentMove]);
        logger.info(lastResult);

        if (lastResult == "w") {
            this.wins++;
            this.myPoints += this.pointStake;
            this.pointStake = 1;
        } else if (lastResult == "l") {
            this.losses++;
            this.opponentsPoints += this.pointStake;
            this.pointStake = 1;
        } else if (lastResult == "d") {
            this.draws++;
            this.pointStake++;
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
        logger.info(`draws: ${this.draws}/${this.pointStake}`);
        logger.info(`losses: ${this.losses}/${this.opponentsPoints}`);
        logger.info("dynamitesLeft: " + this.dynamitesLeft);
        logger.info("opponentsDynamitesLeft: " + this.opponentsDynamitesLeft);
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