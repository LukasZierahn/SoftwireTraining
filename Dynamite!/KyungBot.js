class Bot {
    makeMove(gamestate) {
        return this.randomMove(gamestate);
    }
    countPointInStake(gamestate) {
        let draws = 0;
        for (let i = gamestate.rounds.length - 1; i >= 0; i--) {
            if (gamestate.rounds[i].p1 === gamestate.rounds[i].p2) {
                draws = draws + 1;
            }
            else break;
        }
        return draws;
    }
    countDynamite(gamestate, player) {
        let dynamite = 100
        switch (player) {
            case 1:
                for (let i = gamestate.rounds.length - 1; i >= 0; i--) {
                    if (gamestate.rounds[i].p1 === 'D') {
                        dynamite = dynamite - 1;
                    }
                }
                break
            case 2:
                for (let i = gamestate.rounds.length - 1; i >= 0; i--) {
                    if (gamestate.rounds[i].p2 === 'D') {
                        dynamite = dynamite - 1;
                    }
                }
                break
        }
        return dynamite;
    }
    randomMove(gamestate) {
        let draws = this.countPointInStake(gamestate);
        let oppdynamite = this.countDynamite(gamestate, 2);
        let mydynamite = this.countDynamite(gamestate, 1);
        let defNum = 30;
        let DynNum = 10 * (draws + 1) * mydynamite * Math.max((gamestate.rounds.length - mydynamite),mydynamite) / Math.max(gamestate.rounds.length,1) / 100;
        let WaterNum = 10 * (draws) * Math.max((gamestate.rounds.length - mydynamite),mydynamite) * Math.pow(oppdynamite, 0.5) / 10 / Math.max(gamestate.rounds.length,1);
        let Total = defNum * 3 + DynNum + WaterNum;
        let randomNum = Math.random() * Total;
        if (randomNum < defNum) {
            return 'R'
        } else if (randomNum < defNum * 2) {
            return 'P'
        } else if (randomNum < defNum * 3) {
            return 'S'
        } else if (randomNum < defNum * 3 + DynNum) {
            return 'D'
        }
        else return 'W'
    }
}
exports.Bot = Bot;
module.exports = new Bot();
