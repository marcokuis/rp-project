
// Controller for Game view

angular.module('gameCtrl', [])
    .controller('gameCtrlr', function ($scope, $http, activeGameService, userSessionService) {
        $scope.gamedata = {};
        $scope.userdata = null;

        $scope.userLoad = function(){
            var player = userSessionService.getUserData();
            if (Object.keys(player).length>0) {
                $scope.userdata = userSessionService.getUserData()
                console.log("opened game with " + angular.toJson($scope.userdata));
            }
        }
        $scope.userLoad();

        //load game data into textareas
        $scope.load = function () {
            $scope.gamedata = activeGameService.getGameData();
        }
        $scope.load();

        //Save data to rpdb database
        $scope.save = function () {
            var dat = $scope.gamedata;
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

        $scope.joinGame = function () {
            var role = prompt("GM or player number");
            var dat = $scope.userdata;
            var gameInfo = { "id": $scope.gamedata._id, "role": role, "equipment": "", "notes": "" };

            console.log("join game data: " +  angular.toJson(gameInfo));
            $http.put('/userJoin/' + dat._id, angular.toJson(gameInfo))
                .success(function () {
                    console.log("Saved successfully");
                    //activeGameService.setGameData(dat);
                })
                .error(function () {
                    console.log("Failed to save game");
                });
        }
    });