
// Controller for Game view

angular.module('gameCtrl', ['ngStorage'])
    .controller('gameCtrlr', function ($scope, $rootScope, $http, $localStorage, activeGameService, userSessionService) {
        $scope.gamedata = {};
        $scope.userdata = null;
        $scope.user_id = '';
        $scope.recruiting = false;
        
        

        //load game data into textareas
        $scope.load = function () {
            $scope.gamedata = activeGameService.getGameData();
        }
                                                             //load game data from game service upon page opening

        //load data of currently logged in user
        $scope.userLoad = function () {
            console.log("loading userdata");
            $scope.recruiting = true;                                      //default: not recruiting
            var player = userSessionService.getUserData();
            $scope.user_id = player._id;
            if (Object.keys(player).length > 0) {                           //check if player object not empty          
                if (player.games.length > 0) {                              //check whether player in any games
                    angular.forEach(player.games, function (value) {        //loop through games
                        if (value.id == $scope.gamedata._id) {              //check whether any of them are current game
                            $scope.userdata = value;
                            $scope.recruiting = false;
                        }
                    });
                }
                else {
                    $scope.recruiting = true;                               //if player not in any game: recruiting
                }
            }
            else {
                $scope.userdata = null;
                $scope.user_id = '';
                $scope.recruiting = false;
            }
        }

       

        //Save data to rpdb database
        $scope.save = function () {
            var dat = $scope.gamedata;
            var udat = $scope.userdata;
            $http.put('/gameUpdate/' + dat._id, angular.toJson(dat))
                .success(function () {
                    console.log("Saved successfully");
                    activeGameService.setGameData(dat);
                })
                .error(function () {
                    console.log("Failed to save game");
                });
            $http.put('/notesEquipmentUpdate/' + $scope.user_id, angular.toJson(udat))
                .success(function () {
                    console.log("Saved successfully");
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
            var role = $scope.selectRole;
            if (role) {
                angular.forEach($scope.gamedata.positions, function (item, index) {
                    if (item === role) {
                        $scope.gamedata.positions.splice(index, 1);
                    }
                });
                var dat = $scope.userdata;
                var gameInfo = { "id": $scope.gamedata._id, "role": role, "equipment": [{ name: "Underwear", V: false }], "notes": "" };
                $http.put('/userJoin/' + $scope.user_id, angular.toJson(gameInfo))
                    .success(function () {
                        $http.get('/userLogin/' + $scope.user_id)
                            .success(function (data, status, headers, config) {
                                userSessionService.setUserData(data);
                                $scope.userLoad();
                                $scope.save();
                            }).
                             error(function (data, status, headers, config) {
                                 console.log(status);
                             });

                    })
                    .error(function () {
                        console.log("Failed to join game");
                    });
            }
            else{console.log("no role selected")}
        }

        $scope.addItemToInventory = function () {
            var newItem = prompt("Name of the new item:");
            var itemEntry = { name: newItem, V: false };
            $scope.userdata.equipment.push(itemEntry);
        }

        $scope.deleteItemFromInventory = function () {
            angular.forEach($scope.userdata.equipment, function (item, index) {
                if (item.V === true) {
                    $scope.userdata.equipment.splice(index, 1);
                }
            });
        }

        $scope.editItem = function () {
            angular.forEach($scope.userdata.equipment, function (item, index) {
                if (item.V === true) {
                    var newName = prompt("Change " + item.name + " to:")
                    item.name = newName;
                }
            });
        }

        //detect login change
        $rootScope.$on("logChange", function () {
            console.log("login change");
            $scope.userLoad();
        });

        $scope.load();
        $scope.userLoad();                                                  //load user data upon page opening

        
    });