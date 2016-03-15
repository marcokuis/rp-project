
// Controller for Game view

angular.module('gameCtrl', [])
    .controller('gameCtrlr', function ($scope, $http, activeGameService, userSessionService) {
        $scope.gamedata = {};
        $scope.userdata = null;
        $scope.playerID = '';

        $scope.userLoad = function(){
            var player = userSessionService.getUserData();
            if (Object.keys(player).length>0) {
                $scope.userdata = userSessionService.getUserData()
                console.log("opened game with " + angular.toJson($scope.userdata));
            }
            angular.forEach($scope.userdata.games, function(value){
                if(value.id == gamedata._id){
                    playerID = value.role;
                }
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
            $http.put('/userJoin/' + dat._id, angular.toJson(gameInfo))
                .success(function () {
                    console.log("Player joined game");
                    $http.get('/userLogin/' + dat.username)
                        .success(function (data, status, headers, config) {
                             userSessionService.setUserData(data);
                             }).
                         error(function (data, status, headers, config) {
                             console.log(status);
                         });
                    $scope.userLoad();
                })
                .error(function () {
                    console.log("Failed to join game");
                });
        }
    });