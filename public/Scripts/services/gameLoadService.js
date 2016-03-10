// JavaScript source code

angular.module('gameLoadService',[])
    .service('activeGameService', function() {
        var gameData = {};

        var setGameData = function(curGame) {
            gameData = curGame;
            console.log("game data set: " + angular.toJson(gameData));
        };

        var getGameData = function(){
            return gameData;
        };

        return {
            setGameData: setGameData,
            getGameData: getGameData
        };

    });