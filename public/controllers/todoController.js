/**
 * Created by littleworld on 21/02/16.
 */


angular.module('rpDataController', [])
  .controller('rpDataCtrl', ['$scope', 'rpdata', function ($scope, rpdata) {


    load = function () {
      rpdata.get().success(function (data) {
        $scope.rpdata = data;
      });
    };

    load();

    $scope.save = function () {
      rpdata.create($scope.rpGameData)
        .success(function () {
          load();
        });
    };

    $scope.delete = function (id) {
      rpdata.delete(id)
        .success(function (data) {
          load();
        });
    };
  }]);