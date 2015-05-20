(function(angular){
  "use strict";

  angular.module("pbacLanding", [])
    .controller("pbacLandingController", function($scope, $window){
      var self = this;

			$scope.cannotStart = true;
      $scope.$watch("inventoryConfig.worker", function(newVal, oldVal){
				//console.log(newVal);
        $scope.cannotStart = !$scope.inventoryConfig.worker || !$scope.inventoryConfig.district;
        //console.log("cannotStart: ", $scope.cannotStart);
      });

      $scope.$watch("inventoryConfig.district", function(newVal, oldVal){
				//console.log(newVal);
        $scope.cannotStart = !$scope.inventoryConfig.worker || !$scope.inventoryConfig.worker.id || !$scope.inventoryConfig.district || !$scope.inventoryConfig.district.id;
        //console.log("cannotStart: ", $scope.cannotStart);
      });

      $scope.startInventory = function(id){
        console.log("Starting: ", $scope.inventoryConfig);
        $scope.inventoryConfig.district = $scope.inventoryConfig.district || {};
        $scope.inventoryConfig.worker = $scope.inventoryConfig.worker || {};
        var params = [],
          path = "#/map";
        if($scope.inventoryConfig.district && $scope.inventoryConfig.district.id){
          params.push("district=" + $scope.inventoryConfig.district.id);
        }
        if($scope.inventoryConfig.worker && $scope.inventoryConfig.worker.id){
          params.push("worker=" + $scope.inventoryConfig.worker.id);
        }
        if(params.length){
          path += "?" + params.join("&")
        }
        $window.location = path;
      };
    });
})(angular);
