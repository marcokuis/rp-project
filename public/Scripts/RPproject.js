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




//Controller voor Game scherm
app.controller('gameCtrl', function ($scope, $http) { 
    $scope.gamedata = {}   
    

    //Data opslaan (post request naar URL gameSave --> rp-server luistert)
    $scope.save = function () {

        $scope.gamedata.players = [$scope.p1, $scope.p2, $scope.p3, $scope.p4, $scope.p5, $scope.p6];
        dat = $scope.gamedata;
        console.log(dat);
        $http.post('/gameUpdate', angular.toJson(dat)).success(function () {
            console.log("sending from save: " + dat);
            $scope.load();
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
app.controller('homeCtrl', function ($scope, $http) {
    $scope.gamedata = {}
    $scope.load();

    //Create new game. Title entered in prompt.
    $scope.createNewGame = function () {
        var newTitle = prompt("Title of the new game: ");
        var newGame = {
            title: newTitle,
            story: "",
            players: []
        }
        $http.post('/gameSave', angular.toJson(newGame)).success(function () {
            console.log("sending from save: " + angular.toJson(newGame));
            $scope.load();
        });
    }

    //Load data of all games (not ideal for performance; should be 2 
    //datasets in db, 1 with just title and id, other with full data)
    $scope.load = function () {

        console.log("load function");
        $http.get('/gamesLoad').
          success(function (data, status, headers, config) {
              for (i in data) {
                  console.log(angular.toJson(i));
              }
              $scope.gamedata = data;
          }).
          error(function (data, status, headers, config) {
              console.log(status);
          });
    }

    $scope.gameLoad = function (id) {
        $http.get('/gameLoad').
            success(function (data, status, headers, config) {
                $rootscope.activeGame = data;
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