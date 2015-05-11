(function(angular){
  "use strict";

  angular.module("pbacEditor", [])
    .directive("pbacEditorForm", function(scope){
      return {
        //template for directive
      templateUrl: "pbacEditor/editForm/pbacEditForm.html"
      };
    })
    .controller("pbacEditorController", function($scope, $routeParams, $window, queryConfig, queryInventorySites){
      
      var self = this,
        id = $routeParams.id;
        
      if(!id){
        $window.alert("An id must be in the query params");
        $window.location = "#/landing";
        return;
      }
      
      $scope.editComplete = false;
      $scope.editFeature = null;
      $scope.pageConfigProperties = {
        id: id
      };
      
      //get config for data url and schema and then query to get data
      queryConfig().then(function(configdata){
        configdata = configdata || {};
        console.log("got config: ", configdata.locatorMapConfig);
        
        $scope.pageConfigProperties.idField = configdata.locatorMapConfig.idField;
        $scope.pageConfigProperties.url = configdata.locatorMapConfig.inventoryUrl;
        
        console.log("$scope.pageConfigProperties: ", $scope.pageConfigProperties);
        getEditFeature();
      });
      
      function getEditFeature(){
        queryInventorySites($scope.pageConfigProperties).then(function(feature){
          $scope.editFeature = feature;
          console.log("editFeature: ", feature);
        });
      }
    });
})(angular);