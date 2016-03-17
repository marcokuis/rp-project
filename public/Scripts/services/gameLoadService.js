
// Save the data for the 'active' game

angular.module('gameLoadService',['ngStorage'])
    .service('activeGameService', function($sessionStorage) {
        var gameData = {};

        // Set active game data in memory
        var setGameData = function(curGame) {
            gameData = curGame;
            $sessionStorage.gameData = gameData;
        };

        // Return active game data 
        var getGameData = function () {
            if ($sessionStorage.hasOwnProperty("gameData")) {
                gameData = $sessionStorage.gameData;
            }
            return gameData;
        };

        return {
            setGameData: setGameData,
            getGameData: getGameData
        };

    });