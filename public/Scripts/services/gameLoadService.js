
// Save the data for the 'active' game

angular.module('gameLoadService',[])
    .service('activeGameService', function() {
        var gameData = {};

        // Set active game data in memory
        var setGameData = function(curGame) {
            gameData = curGame;
        };

        // Return active game data 
        var getGameData = function(){
            return gameData;
        };

        return {
            setGameData: setGameData,
            getGameData: getGameData
        };

    });