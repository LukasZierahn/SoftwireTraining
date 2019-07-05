class Bot {
    makeMove(gamestate) {
        
        // On the first round, play a random move
        if (gamestate.rounds.length === 0) {
            return this.randomMove();
        }
        
        // Has the opponent always played the same move
        let theirFirstMove = gamestate.rounds[0].p2;
        let alwaysSameMove = true;
        for (let i = 0; i < gamestate.rounds.length; i++) {
            if (gamestate.rounds[i].p2 !== theirFirstMove) {
                alwaysSameMove = false;
            }
        }
        
        if (alwaysSameMove) {
            // They are always playing the same move.
            // It must be one of Rock-Bot, Paper-Bot, or Scissors-Bot
            // Let's work out which one...

            return this.calculateWinAgainst(theirFirstMove);
            
        } else {
            // It's some other bot
            // Let's just play a random move
            return this.randomMove();
            
        }
        
    }
    
    calculateWinAgainst(theirMove) {
        if (theirMove === 'R') return 'P';
        if (theirMove === 'P') return 'S';
        if (theirMove === 'S') return 'R';
        if (theirMove === 'D') return 'W';
        if (theirMove === 'W') return 'P';
    }
    
    randomMove() {
        let possibleMoves = ['R', 'P', 'S'];
        let randomNum = Math.floor(Math.random() * 3);
        return possibleMoves[randomNum];
    }
}

module.exports = new Bot();