
// Controller for Home view

angular.module('homeCtrl', [])
    .controller('homeCtrlr', function ($scope, $rootScope, $http, $location,userSessionService, activeGameService) {
        $scope.gamedata = {}
        $scope.loggedIn = false;

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
            $http.get('/gameLoad/' + gameid).
                success(function (data, status, headers, config) {
                    activeGameService.setGameData(data);
                    $location.path("Game");
                }).
                error(function (data, status, headers, config) {
                    console.log(status);
                });
        }

        $scope.userLoad = function () {
            $scope.loggedIn = false;
            var player = userSessionService.getUserData();
            if (Object.keys(player).length > 0) {
                $scope.loggedIn = true;
            }
        }
        $scope.userLoad();

        $rootScope.$on("logChange", function () {
            $scope.userLoad();
        });
    });