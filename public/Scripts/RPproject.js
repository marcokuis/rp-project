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


/*CURRENT STATUS: App is working but nothing is written to the server. Node receives data undefined. 
Additionally the data is added to a list rather than updating the existing data. Program automatically adds
its own unique ID, which I might need to overtake/overwrite instead, if possible*/


app.controller('gameCtrl', function ($scope, $http) {
    $scope.playerID = "";    
    //$scope.gamedata = { id: 1, story: "", players: [] };
   
   
    //Data laden uit mongo (get request naar URL gameLoad --> rp-server luistert)
    $scope.load = function () {
        console.log("load function");
        $http.get('/gameLoad').
          success(function (data, status, headers, config) {
              console.log("loaded: " + data);
              //Hierna vertaalslag van data naar GMarea en Player areas!
              $scope.gamedata = data;
          }).
          error(function (data, status, headers, config) {
              console.log(status);
          });
    };

    //Bij openen website eenmalig laden
    //$scope.load();

    //Data opslaan (post request naar URL gameSave --> rp-server luistert)
    $scope.save = function () {

        $scope.gamedata.players = [$scope.p1, $scope.p2, $scope.p3, $scope.p4, $scope.p5, $scope.p6];
        dat = $scope.gamedata;
        console.log(dat);
        $http.post('/gameSave', angular.toJson(dat)).success(function () {
            console.log("sending from save: " + dat);
            $scope.load();
        });
    };

    //Inhoud player area aan GM area toevoegen
    $scope.appendText = function (nr) {
        if ($scope.playerID === 'GM') {
            switch (nr) {
                case 1:
                    $scope.gamedata.story = $scope.gamedata.story + " " + $scope.p1;
                    $scope.p1 = "";
                    break;
                case 2:
                    $scope.gamedata.story = $scope.gamedata.story + " " + $scope.p2;
                    $scope.p2 = "";
                    break;
                case 3:
                    $scope.gamedata.story = $scope.gamedata.story + " " + $scope.p3;
                    $scope.p3 = "";
                    break;
                case 4:
                    $scope.gamedata.story = $scope.gamedata.story + " " + $scope.p4;
                    $scope.p4 = "";
                    break;
                case 5:
                    $scope.gamedata.story = $scope.gamedata.story + " " + $scope.p5;
                    $scope.p5 = "";
                    break;
                case 6:
                    $scope.gamedata.story = $scope.gamedata.story + " " + $scope.p6;
                    $scope.p6 = "";
                    break;
                }
            }
        }
    });

//Controller voor welkomstscherm. Mogelijk goede plek voor Login?
app.controller('homeCtrl', function ($scope) {

});

//jQuery voor toggle sidebar op kleine schermen
$(document).ready(function () {
    $('[data-toggle=offcanvas]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });
});