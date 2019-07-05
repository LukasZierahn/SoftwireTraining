class Bot {
    makeMove(gamestate) {
        
        if (gamestate.rounds.length < 100) {
            // If we're in the first 100 rounds, play Dynamite
            return 'D';
            
        } else {
            // Otherwise, play a random move
            return this.randomMove();
            
        }
    }
    
    randomMove() {
        let possibleMoves = ['R', 'P', 'S'];
        let randomNum = Math.floor(Math.random() * 3);
        return possibleMoves[randomNum];
    }
}

module.exports = new Bot();