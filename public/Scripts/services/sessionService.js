
// Save the data for the 'active' game

angular.module('sessionService',[])
    .service('userSessionService', function() {
        var userData = {};

        // Set active game data in memory
        var setUserData = function(curUser) {
            userData = curUser;
            console.log("userSessionService set " + userData);
        };

        // Return active game data 
        var getUserData = function(){
            return userData;
            console.log("userSessionService return " + userData);
        };

        return {
            setUserData: setUserData,
            getUserData: getUserData
        };

    });