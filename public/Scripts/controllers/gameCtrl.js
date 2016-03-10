// JavaScript source code
angular.module('gameCtrl', [])
    .controller('gameCtrlr', function ($scope, $http, activeGameService) {
        $scope.gamedata = {};

        //load game data into textareas
        $scope.load = function () {
            $scope.gamedata = activeGameService.getGameData();
            console.log("loaded game data: " + angular.toJson($scope.gamedata));
        }

        $scope.load();

        //Data opslaan (post request naar URL gameSave --> rp-server luistert)
        $scope.save = function () {
            dat = $scope.gamedata;
            console.log("saving gamedata: " + angular.toJson($scope.gamedata));
            $http.put('/gameUpdate/' + dat._id, angular.toJson(dat))
                .success(function () {
                    console.log("Saved successfully");
                    activeGameService.setGameData(dat);
                })
                .error(function () {
                    console.log("Failed to save game");
                });
        };

        //Inhoud player area aan GM area toevoegen
        $scope.appendText = function (nr) {
            if ($scope.playerID === 'GM') {
                var d = $scope.gamedata;
                d.contentStory = d.contentStory + " " + (d.contentPlayers[nr - 1] || '');
                d.contentPlayers[nr - 1] = "";
            }
        }
    });