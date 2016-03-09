// JavaScript source code


var app = angular.module('myApp', ['ngRoute'/*'rpDataController', 'rpDataService'*/]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/Home', {
          templateUrl: 'partials/welcomeTemplate.html',     
          controller: 'homeCtrl'
        })
        .when('/Game', {
            templateUrl: 'partials/gameTemplate.html',
            controller: 'gameCtrl'
        })
        .otherwise({
            templateUrl: 'partials/welcomeTemplate.html',
            controller: 'homeCtrl'
        })

}]);



app.service('activeGameService', function() {
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


//Controller voor Game scherm
app.controller('gameCtrl', function ($scope, $http, activeGameService) { 
    $scope.gamedata = {}   
    
    $scope.load = function () {
        $scope.gamedata = activeGameService.getGameData();
        console.log("loaded game data: " + angular.toJson($scope.gamedata));
    }

    $scope.load()

    //Data opslaan (post request naar URL gameSave --> rp-server luistert)
    $scope.save = function () {

        $scope.gamedata.players = [$scope.p1, $scope.p2, $scope.p3, $scope.p4, $scope.p5, $scope.p6];
        dat = $scope.gamedata;
        $http.put('/gameUpdate/' + dat._id, angular.toJson(dat))
            .success(function () {
                console.log("Saved successfully");
                activeGameService.setGameData(dat);
            })
            .error(function(){
                console.log("Failed to save game");
            });
    };

    //Inhoud player area aan GM area toevoegen
    $scope.appendText = function (nr) {
        if ($scope.playerID === 'GM') {
            switch (nr) {
                case 1:
                    $scope.gamedata.story = $scope.gamedata.story + " " + ($scope.p1||'');
                    $scope.p1 = "";
                    break;
                case 2:
                    $scope.gamedata.story = $scope.gamedata.story + " " + ($scope.p2||'');
                    $scope.p2 = "";
                    break;
                case 3:
                    $scope.gamedata.story = $scope.gamedata.story + " " + ($scope.p3||'');
                    $scope.p3 = "";
                    break;
                case 4:
                    $scope.gamedata.story = $scope.gamedata.story + " " + ($scope.p4||'');
                    $scope.p4 = "";
                    break;
                case 5:
                    $scope.gamedata.story = $scope.gamedata.story + " " + ($scope.p5||'');
                    $scope.p5 = "";
                    break;
                case 6:
                    $scope.gamedata.story = $scope.gamedata.story + " " + ($scope.p6 || '');
                    $scope.p6 = "";
                    break;
            }
        }
    }
});



//Controller voor welkomstscherm. Mogelijk goede plek voor Login?
app.controller('homeCtrl', function ($scope, $http, $location, activeGameService) {
    $scope.gamedata = {}
    

    //Create new game. Title entered in prompt.
    $scope.createNewGame = function () {
        var newTitle = prompt("Title of the new game: ");
        var newGame = {
            title: newTitle,
            story: "",
            players: []
        }
        $http.post('/gameSave', angular.toJson(newGame)).success(function () {
            $scope.load();
        });
    }

    //Load ids and titles of all games
    $scope.load = function () {

        console.log("load function");
        $http.get('/gamesLoad').
          success(function (data, status, headers, config) {   
              $scope.gamedata = data;
          }).
          error(function (data, status, headers, config) {
              console.log(status);
          });
    }
    //Run load when opening page
    $scope.load();

    //Load game with id in link
    $scope.gameLoad = function (gameid) {
        console.log("id: "+gameid);
        $http.get('/gameLoad/' + gameid).
            success(function (data, status, headers, config) {
                console.log("loading game data: "+data);
                activeGameService.setGameData(data);
                $location.path("Game");
            }).
            error(function (data, status, headers, config) {
                console.log(status);
            });
    }
});

//jQuery voor toggle sidebar op kleine schermen
$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});