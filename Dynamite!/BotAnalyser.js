const { Helper, myMove, opponentMove } = require("./Helper");

class BotAnalyser {

    static lookBackDistance = 30;
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

        let accuratePercent = this.lookBack.length == 0 ? 0 : lookBackPoints / this.lookBack.length;

        let dynamitesUsed = Helper.countDynamites(this.suggestedMoves.slice(Math.max(0, this.suggestedMoves.length - 1 - this.lookBack.length), this.suggestedMoves.length - 1));

        return dynamitesUsed == 0 ? accuratePercent : accuratePercent * Math.min(1, (1 - (dynamitesUsed / this.lookBack.length)));
    }
    
    getDebugString() {
        return `${this.botname}: ${this.getPointPercent()} (${this.wins}/${this.draws}/${this.losses}), ${this.currentMove}, ${this.uses}`;
    }

    getCSVHeader() {
        return `${this.botname}: points the last ${BotAnalyser.lookBackDistance} moves,wins,draws,losses,currentMove,uses`;
    }

    getCSVString() {
        return `${this.getPointPercent()},${this.wins},${this.draws},${this.losses},${this.currentMove},${this.uses}`;
    }
}
exports.BotAnalyser = BotAnalyser;