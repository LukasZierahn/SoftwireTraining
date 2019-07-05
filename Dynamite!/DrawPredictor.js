const { Helper, myMove, opponentMove } = require("./Helper");
const { logger } = require("./logger");

class DrawPredictor {

    constructor(mainBot, totalWeighting) {
        this.mainBot = mainBot;
        this.dynamiteUsed = [];
        this.waterUsed = [];
        this.classicUsed = [];
        this.dynamiteUsedTotal = 0;
        this.waterUsedTotal = 0;
        this.classicUsedTotal = 0;
        this.stakesLastMove = 1;
        this.totalWeighting = totalWeighting;
    }

    makeMove(gamestate, stake) {

        let round = gamestate.rounds[gamestate.rounds.length - 1];
        if (this.stakesLastMove > 1 && round !== undefined) {
            while (this.waterUsed[this.stakesLastMove] === undefined) {
                this.waterUsed.push(0);
                this.dynamiteUsed.push(0);
                this.classicUsed.push(0);
            }

            if (round[opponentMove] == "D") {
                this.dynamiteUsed[this.stakesLastMove]++;
                this.dynamiteUsedTotal++;
            }

            if (round[opponentMove] == "W") {
                this.waterUsed[this.stakesLastMove]++;
                this.waterUsedTotal++;
            }

            if (round[opponentMove] == "R" || round[opponentMove] == "P" || round[opponentMove] == "S") {
                this.classicUsed[this.stakesLastMove]++;
                this.classicUsedTotal++;
            }
        }

        if (stake == 1) {
            return Helper.randomMove(false);
        }


        let dynamitePercent = 0;
        let waterPercent = 0;
        let classicPercent = 0;

        let sumUsed = this.dynamiteUsed[stake] + this.waterUsed[stake] + this.classicUsed[stake];
        if (this.dynamiteUsed[stake] !== undefined && sumUsed != 0) {
            dynamitePercent = this.dynamiteUsed[stake] / sumUsed;
        }

        if (this.waterUsed[stake] !== undefined && sumUsed != 0) {
            waterPercent = this.waterUsed[stake] / sumUsed;
        }

        if (this.classicUsed[stake] !== undefined && sumUsed != 0) {
            classicPercent = this.classicUsed[stake] / sumUsed;
        }


        let dynamitePercentTotal = 0;
        let waterPercentTotal = 0;
        let classicPercentTotal = 0;

        let sumTotal = this.dynamiteUsedTotal + this.waterUsedTotal + this.classicUsedTotal;
        if (this.dynamiteUsedTotal != 0) {
            dynamitePercentTotal = this.dynamiteUsedTotal / sumTotal;
        }

        if (this.waterUsedTotal != 0) {
            waterPercentTotal = this.waterUsedTotal / sumTotal;
        }

        if (this.classicUsedTotal != 0) {
            classicPercentTotal = this.classicUsedTotal / sumTotal;
        }

        let randomNumber = Math.random();
        this.stakesLastMove = stake;

        let lookbackWeighting = 1 - this.totalWeighting;
        logger.info(`DrawPredictor Predictions: dyn: ${Math.min(((lookbackWeighting * classicPercent) + (this.totalWeighting * classicPercentTotal)) * (this.mainBot.dynamitesLeft / 100) * stake, 0.85)}/${dynamitePercent}/${dynamitePercentTotal}, water: ${((lookbackWeighting * dynamitePercent) + (this.totalWeighting * dynamitePercentTotal)) && this.mainBot.opponentsDynamitesLeft != 0}/${waterPercent}/${waterPercentTotal}, classic: ${classicPercent}/${classicPercentTotal}`);

        if (randomNumber < Math.min(((lookbackWeighting * classicPercent) + (this.totalWeighting * classicPercentTotal)) * (this.mainBot.dynamitesLeft / 100) * stake, 0.85)) {
            return "D";
        }

        randomNumber = Math.random();
        if (randomNumber < ((lookbackWeighting * dynamitePercent) + (this.totalWeighting * dynamitePercentTotal)) && this.mainBot.opponentsDynamitesLeft != 0) {
            return "W";
        }

        //We want to use one of the classics now
        return Helper.randomMove(false);
    }
}
exports.DrawPredictor = DrawPredictor;
