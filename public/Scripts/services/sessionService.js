
// Save the data for the 'active' game

angular.module('sessionService',['ngStorage'])
    .service('userSessionService', function($localStorage) {
        var userData = {};

        // Set active game data in memory and localStorage
        var setUserData = function(curUser) {
            userData = curUser;
            $localStorage.userdata = userData;
            console.log("userSessionService set " + userData);
        };

        // Return active game data. If in localStorage, return from there
        var getUserData = function () {
            if ($localStorage.hasOwnProperty("userdata")) {
                userData = $localStorage.userdata;
            }
            console.log("userSessionService return " + userData);
            return userData;
        };

        var clearUserData = function () {
            userData = {};
            delete $localStorage.userdata;
            console.log("clearUserData" + angular.toJson(userData));
        }

        return {
            setUserData: setUserData,
            getUserData: getUserData,
            clearUserData: clearUserData
        };

    });