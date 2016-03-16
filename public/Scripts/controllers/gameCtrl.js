
// Controller for Game view

angular.module('gameCtrl', ['ngStorage'])
    .controller('gameCtrlr', function ($scope, $rootScope, $http, $localStorage, activeGameService, userSessionService) {
        $scope.gamedata = {};
        $scope.userdata = null;
        $scope.playerID = '';
        $scope.recruiting = false;
        
        //load game data into textareas
        $scope.load = function () {
            $scope.gamedata = activeGameService.getGameData();
        }
        $scope.load();                                                      //load game data from game service upon page opening

        //load data of currently logged in user
        $scope.userLoad = function () {
            $scope.recruiting = false;                                      //default: not recruiting
            var player = userSessionService.getUserData();
            console.log("player: " + angular.toJson(player));
            if (Object.keys(player).length > 0) {                           //check if player object not empty
                $scope.userdata = userSessionService.getUserData()          
                if ($scope.userdata.games.length > 0) {                     //check whether player in any games
                    angular.forEach($scope.userdata.games, function (value) {   //loop through games
                        if (value.id == $scope.gamedata._id) {              //check whether any of them are current game
                            $scope.playerID = value.role;                   //set player role (GM or 1-6)
                        }
                        else {
                            $scope.recruiting = true;                       //if player not in current game: recruiting
                        }
                    });
                }
                else {
                    $scope.recruiting = true;                               //if player not in any game: recruiting
                }
            }
            else {
                console.log("userload");
                $scope.userdata = null;
                $scope.playerID = '';
                $scope.recruiting = false;
            }
        }

        $scope.userLoad();                                                  //load user data upon page opening


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
        
        //player wants to join game
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
                            $scope.userLoad();
                             }).
                         error(function (data, status, headers, config) {
                             console.log(status);
                         });
                    
                })
                .error(function () {
                    console.log("Failed to join game");
                });
        }

        $rootScope.$on("logChange", function () {
            console.log("receiving broadcast");
            $scope.userLoad();
        });
    });