const { Helper, myMove, opponentMove } = require("./Helper");
const { logger } = require("./logger");

class BotAnalyser {

    static lookBackDistance = 20;
    constructor(bot, botname) {
        this.bot = bot;
        this.botname = botname;
        this.suggestedMoves = [];
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.uses = 0;
        this.myPoints = 0;
        this.opponentsPoints = 0;
        this.dynamitesUses = 0;
        this.lookBack = [];
        this.currentMove = "";
    }

    assesGamestate(gamestate, stake) {

        let round = gamestate.rounds[gamestate.rounds.length - 1];

        //Analysing last round
        if (round != undefined) {
            let lastResult = Helper.simulateGame(this.suggestedMoves[this.suggestedMoves.length - 1], round[opponentMove]);
            if (lastResult == "w") {
                this.wins++;
                this.myPoints += stake;
                this.lookBack.push(stake);
            } else if (lastResult == "l") {
                this.losses++;
                this.opponentsPoints += stake;
                this.lookBack.push(-stake);
            } else if (lastResult == "d") {
                this.draws++;
                this.lookBack.push(0);
            }

            if (this.lookBack.length >= BotAnalyser.lookBackDistance) {
                this.lookBack.shift();
            }
        }

        //making decisions for current round
        this.currentMove = this.bot.makeMove(gamestate, stake);
        this.suggestedMoves.push(this.currentMove);

        //Counting dynamites
        if (this.currentMove == "D") {
            this.dynamitesUses++;
        }
    }

    getBotMove() {
        return this.currentMove;
    }

    getPointPercent() {
        let lookBackPoints = 0;
        for (let value of this.lookBack) {
            lookBackPoints += value;
        }

        return this.lookBack.length == 0 ? 0 : lookBackPoints / this.lookBack.length;
    }
    
    getDebugString() {
        return `${this.botname}: ${this.getPointPercent()} (${this.wins}/${this.draws}/${this.losses}), ${this.currentMove}, ${this.uses}`;
    }
}
exports.BotAnalyser = BotAnalyser;