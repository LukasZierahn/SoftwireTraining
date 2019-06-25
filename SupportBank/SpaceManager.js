class SpaceManager {
    constructor() {
        this.longestValue = 0;
    }
    
    CheckForLongestValue(input) {
        this.longestValue = Math.max(input.length, this.longestValue);
    }

    GetSpaces(input, extraSpaces) {
        var spaces = "";
        for (var i = input.length; i < this.longestValue + extraSpaces; i++) {
            spaces += " ";
        }
        return spaces;
    }
}
exports.SpaceManager = SpaceManager;
