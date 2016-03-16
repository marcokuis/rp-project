
// Controller for User login

angular.module('userCtrl', ['ngStorage'])
    .controller('userCtrlr', function ($scope, $rootScope,  $http, $location, userSessionService) {
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

        //Log in existing user
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
                             userSessionService.setUserData(data);
                             $scope.loadUserData();
                             $rootScope.$broadcast("logChange");
                         }).
                         error(function (data, status, headers, config) {
                             console.log(status);
                         });
                 });
        }

        //Retrieve user data from session service
        $scope.loadUserData = function () {            
            $scope.activeUser = userSessionService.getUserData();
            if (Object.keys($scope.activeUser).length > 0) {
                $scope.loggedIn = true;
            }
        }

        $scope.loadUserData();

        $scope.logoutUser = function () {
            userSessionService.clearUserData();
            $scope.loggedIn = false;
            $rootScope.$broadcast("logChange");
        }
    });