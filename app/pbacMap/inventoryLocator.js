(function(angular){
  "use strict";

  angular.module("pbacInventoryLocator", [])
    .controller("pbacInventoryLocatorController", function($scope, $routeParams, $timeout, $location, $window, queryConfig, queryInventorySites){
      var self = this;

      //$scope.helpInfo.helpAvailable = true;
      //$scope.helpInfo.showHelp = false;
      
      if($routeParams.district){
        $scope.inventoryConfig.district.id = $routeParams.district;
      }
      if($routeParams.worker){
        $scope.inventoryConfig.worker.id = $routeParams.worker;
      }
//      if(!$scope.inventoryConfig.worker.id || !$scope.inventoryConfig.district.id){
//        $window.location = "#/landing";
//      }
      if($scope.inventoryConfig.worker.id){
        $scope.navbarConfig.appMenuTitle = "Worker: " + $scope.inventoryConfig.worker.id;
      }
      if($scope.inventoryConfig.district.id){
        $scope.navbarConfig.appMenuTitle += "   -   District: " + $scope.inventoryConfig.district.id;
      }
      //$scope.navbarConfig.appMenuTitle = "Worker: " + $scope.inventoryConfig.worker.id + "   -   District: " + $scope.inventoryConfig.district.id;

      $scope.pageConfigProperties = {
        selectedUnitId: null,
        configLoaded: false,
        mapLoaded: false
      };
      
      $scope.selectedMemorial = {};
      
      if($routeParams.id){
        $scope.pageConfigProperties.selectedUnitId = $routeParams.id;
      }

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
//        console.log(newVal);
//        console.log(oldVal);
        self.setSelectedUnit(newVal);
        
//        if(newVal){
//          if(newVal !== oldVal){
//            queryInventorySites({url: $scope.locatorMapConfig.inventoryUrl, id: $scope.pageConfigProperties.selectedUnitId}).then(function(data){
//              $scope.selectedMemorial = data;
//            });
//          }
//        }
//        else{
//          $scope.selectedMemorial = {};
//        }
//        console.log($scope.selectedMemorial);
      });
      
      $scope.startEdit = function(){
        console.log("Starting edit: " + "#/edit?id=" + $scope.selectedMemorial.attributes.district_id);
        $window.location = "#/edit?id=" + $scope.selectedMemorial.attributes.district_id;
      };

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
