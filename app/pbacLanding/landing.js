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
        $window.location = "#/map?district=" + $scope.inventoryConfig.district.id + "&worker=" + $scope.inventoryConfig.worker.id;
      };
    });
})(angular);
