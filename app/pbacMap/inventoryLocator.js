(function(angular){
  "use strict";

  angular.module("pbacInventoryLocator", [])
    .controller("pbacInventoryLocatorController", function($scope, $routeParams, $timeout, $location, $window, queryConfig){
      var self = this;

      //$scope.helpInfo.helpAvailable = true;
      //$scope.helpInfo.showHelp = false;
      
      if($routeParams.district){
        $scope.inventoryConfig.district.id = $routeParams.district;
      }
      if($routeParams.worker){
        $scope.inventoryConfig.worker.id = $routeParams.worker;
      }
      if(!$scope.inventoryConfig.worker.id || !$scope.inventoryConfig.district.id){
        $window.location = "#/landing";
      }
      $scope.navbarConfig.appMenuTitle = "Worker: " + $scope.inventoryConfig.worker.id + "   -   District: " + $scope.inventoryConfig.district.id;

      $scope.pageConfigProperties = {
        selectedUnitId: $routeParams.id,
        configLoaded: false,
        mapLoaded: false
      };

      //get config for data url and schema and then query to get data
      queryConfig().then(function(configdata){
        configdata = configdata || {};
        console.log("got config: ", configdata.locatorMapConfig);
        
        console.log("$scope.inventoryConfig: ", $scope.inventoryConfig);
        $scope.locatorMapConfig = configdata.locatorMapConfig;
        if($scope.locatorMapConfig){
          $scope.pageConfigProperties.configLoaded = true;
        }
      });

      $scope.$watch("pageConfigProperties.selectedUnitId", function(newVal, oldVal){
        self.setSelectedUnit(newVal);
      });

      this.setSelectedUnit = function(id){
        //console.log("Setting unit: ", id);
        $location.replace();
        $location.search("id", id);
        //$scope.pageConfigProperties.selectedUnitId = id;
        //if id supplied, get summary from biosService
        if(id){
         //console.log("selected id: ", id);
        }
        else{
          //console.log("no selected id: ");
        }
      };
    });
})(angular);
