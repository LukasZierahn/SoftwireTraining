const myMove = "myMove";
// const myMove = "p1";
exports.myMove = myMove;

const opponentMove = "opponentMove";
// const opponentMove = "p2";
exports.opponentMove = opponentMove;



class Helper {
    static countDynamites(array) {
        let dynamiteCount = 0;

        for (let move of array) {
            if (move == 'D') {
                dynamiteCount++;
            }
        }

        return dynamiteCount;
    }

    static simulateGame(myMove, opponentMove) {
        if (myMove == opponentMove) {
            return "d";
        }
        if (myMove == "R") {
            if (opponentMove == "P" || opponentMove == "D") {
                return "l";
            }
            else if (opponentMove == "S" || opponentMove == "W") {
                return "w";
            }
        }
        if (myMove == "P") {
            if (opponentMove == "S" || opponentMove == "D") {
                return "l";
            }
            else if (opponentMove == "R" || opponentMove == "W") {
                return "w";
            }
        }
        if (myMove == "S") {
            if (opponentMove == "R" || opponentMove == "D") {
                return "l";
            }
            else if (opponentMove == "P" || opponentMove == "W") {
                return "w";
            }
        }
        if (myMove == "D") {
            if (opponentMove == "W") {
                return "l";
            }
            else {
                return "w";
            }
        }
        if (myMove == "W") {
            if (opponentMove != "D") {
                return "l";
            }
            else {
                return "w";
            }
        }
    }
    static randomMove(dynamite) {
        let possibleMoves = ['R', 'P', 'S'];
        if (this.dynamitesLeft > 0 && dynamite) {
            possibleMoves.push('D');
        }
        let randomNum = Math.floor(Math.random() * possibleMoves.length);
        return possibleMoves[randomNum];
    }
}

exports.Helper = Helper;