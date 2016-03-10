
// Controller for Game view

angular.module('gameCtrl', [])
    .controller('gameCtrlr', function ($scope, $http, activeGameService) {
        $scope.gamedata = {};

        //load game data into textareas
        $scope.load = function () {
            $scope.gamedata = activeGameService.getGameData();
        }
        $scope.load();

        //Save data to rpdb database
        $scope.save = function () {
            dat = $scope.gamedata;
            $http.put('/gameUpdate/' + dat._id, angular.toJson(dat))
                .success(function () {
                    console.log("Saved successfully");
                    activeGameService.setGameData(dat);
                })
                .error(function () {
                    console.log("Failed to save game");
                });
        };

        //When GM clicks player text, append that text to the main story
        $scope.appendText = function (nr) {
            if ($scope.playerID === 'GM') {
                var d = $scope.gamedata;
                d.contentStory = d.contentStory + " " + (d.contentPlayers[nr - 1] || '');
                d.contentPlayers[nr - 1] = "";
            }
        }
    });