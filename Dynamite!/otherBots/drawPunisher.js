class Bot {
    makeMove(gamestate) {
        
        // On the first round, play a random move
        if (gamestate.rounds.length === 0) {
            return this.randomMove();
        }
        
        // How many Dynamites have we already played?
        // We mustn't play more than 100 in a game!
        let dynamitesUsed = this.countOurDynamites(gamestate);
        
        if (dynamitesUsed === 100) {
            // If we've run out of Dynamite, play a random move
            return this.randomMove();
            
        } else {
            // Was the last round a draw?
            let lastRound = gamestate.rounds[gamestate.rounds.length - 1];
            if (lastRound.p1 === lastRound.p2) {
                // The last round was a draw. Play a Dynamite!
                return 'D';
                
            } else {
                // Last round was NOT a draw. Play a random move.
                return this.randomMove();
                
            }
            
        }
    }
    
    countOurDynamites(gamestate) {
        let dynamitesUsed = 0;
        for (let i = 0; i < gamestate.rounds.length; i++) {
            if (gamestate.rounds[i].p1 === 'D') {
                dynamitesUsed++;
            }
        }
        return dynamitesUsed;
    }
    
    randomMove() {
        let possibleMoves = ['R', 'P', 'S'];
        let randomNum = Math.floor(Math.random() * 3);
        return possibleMoves[randomNum];
    }
}

module.exports = new Bot();