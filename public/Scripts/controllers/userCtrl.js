
// Controller for User login

angular.module('userCtrl', [])
    .controller('userCtrlr', function ($scope, $http, userSessionService) {
        $scope.loggedIn = false;
        $scope.activeUser = {};

        //Create new user. 
        $scope.createNewUser = function () {
            var newUser = {
                name: $scope.user.name,
                pw: $scope.user.pw
            };

            $scope.user = { name: "", pw: "" };
            
            $http.post('/newUser', angular.toJson(newUser)).success(function () {
                alert("Welcome! Please log in!");
            });
        }

        $scope.loginUser = function () {
            var existingUser = {
                name: $scope.user.name,
                pw: $scope.user.pw
            }

            $scope.user = { name: "", pw: "" };

            $http.post('/loginUser', existingUser).
                 success(function (){
                     $http.get('/userLogin/' + existingUser.name).
                         success(function (data, status, headers, config) {
                             console.log("user logged in: "+angular.toJson(data));
                             userSessionService.setUserData(data);
                             $scope.loggedIn = true;
                             $scope.loadUserData();
                         }).
                         error(function (data, status, headers, config) {
                             console.log(status);
                         });
                 });
        }

        $scope.loadUserData = function () {
            $scope.activeUser = userSessionService.getUserData();
            console.log("active user " + $scope.activeUser.username);
        }

        $scope.logoutUser = function () {
            var e = {}
            userSessionService.setUserData(e);
            $scope.loggedIn = false;
        }
    });