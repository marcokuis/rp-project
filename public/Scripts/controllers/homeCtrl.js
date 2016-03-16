
// Controller for Home view

angular.module('homeCtrl', [])
    .controller('homeCtrlr', function ($scope, $rootScope, $http, $location, activeGameService) {
        $scope.gamedata = {}
    

        //Create new game. Title entered in prompt.
        $scope.createNewGame = function () {
            var newTitle = prompt("Title of the new game: ");
            var newGame = {
                title: newTitle
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
                    activeGameService.setGameData(data);
                    $location.path("Game");
                }).
                error(function (data, status, headers, config) {
                    console.log(status);
                });
        }
    });