/**
 * Created by littleworld on 21/02/16.
 */


angular.module('rpDataService', [])

  .factory('rpdata', ['$http', function ($http) {
    return {
      get: function () {
        return $http.get('/rpdata');
      },
      create: function (rpGameData) {
        return $http.post('/rpData', rpGameData);
      }
    }
  }]);