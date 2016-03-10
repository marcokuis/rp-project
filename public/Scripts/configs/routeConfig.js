
// Handle redirects to the ng-view

angular.module('routeConfig', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/Home', {
              templateUrl: 'partials/welcomeTemplate.html',     
              controller: 'homeCtrlr'
            })
            .when('/Game', {
                templateUrl: 'partials/gameTemplate.html',
                controller: 'gameCtrlr'
            })
            .otherwise({
                templateUrl: 'partials/welcomeTemplate.html',
                controller: 'homeCtrlr'
            })

    }]);