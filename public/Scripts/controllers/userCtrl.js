
// Controller for Game view

angular.module('userCtrl', [])
    .controller('userCtrlr', function ($scope, $http, userSessionService) {
        $scope.loggedIn = false;

        //Create new game. Title entered in prompt.
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
                         }).
                         error(function (data, status, headers, config) {
                             console.log(status);
                         });
                 });
       }

    });