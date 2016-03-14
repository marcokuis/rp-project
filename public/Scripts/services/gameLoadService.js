
// Save the data for the 'active' game

angular.module('gameLoadService',[])
    .service('activeGameService', function() {
        var gameData = {};

        // Set active game data in memory
        var setGameData = function(curGame) {
            gameData = curGame;
            console.log("activeGameService set " + gameData);
        };

        // Return active game data 
        var getGameData = function(){
            return gameData;
            console.log("activeGameService return " + gameData);
        };

        return {
            setGameData: setGameData,
            getGameData: getGameData
        };

    });