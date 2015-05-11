(function(angular){
  "use strict";

  angular.module("pbacApp")

  .controller("pbacAppController", function($scope, $location, $window, $document, $q, $timeout, queryConfig){
    $scope.userAgentStr = (navigator.userAgent);
    //console.log("USER AGENT STRING VAL", $scope.userAgentStr);

    $scope.handleNavBtnBack = function(){
      $window.history.back();
    };

    //get config info for application
    queryConfig().then(function(data){
      console.log("got config data: ", data);
    });

    //function to check if runtime device is iPhone, iPad or iPod
    $scope.isAppleDevice = function(){
      /*
      if(navigator.userAgent.match(/(iPhone|iPad|iPod)/i) ){
        return true;
      } else {
        return false;
      }
      */
      return false;
    }();

    //function to check if device is a phone. THIS IS A HACK
    $scope.isPhone = function(){
      var isphone = true,
        w, h;
      if(navigator.userAgent.match(/(iPad)/i)){
        isphone = false;
      }
      else{
        if ($document.body && $document.body.offsetWidth) {
          w = $document.body.offsetWidth;
          h = $document.body.offsetHeight;
        }
        if ($document.compatMode ==="CSS1Compat" &&
          $document.documentElement &&
          $document.documentElement.offsetWidth ) {
          w = document.documentElement.offsetWidth;
          h = document.documentElement.offsetHeight;
        }
        if ($window.innerWidth && $window.innerHeight) {
          w = $window.innerWidth;
          h = $window.innerHeight;
        }
        //check width and height of screen
        w = Math.max(w, h);
        h = Math.min(w, h);
        isphone = (w < 1000 && h < 600);
      }
      return isphone;
    };

    //function to see if device is in landscape
    $scope.deviceIsLandscape = function(){
      var islandscape,
        w, h;

        if ($document.body && $document.body.offsetWidth) {
          w = $document.body.offsetWidth;
          h = $document.body.offsetHeight;
        }
        if ($document.compatMode ==="CSS1Compat" &&
          $document.documentElement &&
          $document.documentElement.offsetWidth ) {
          w = document.documentElement.offsetWidth;
          h = document.documentElement.offsetHeight;
        }
        if ($window.innerWidth && $window.innerHeight) {
          w = $window.innerWidth;
          h = $window.innerHeight;
        }
        //check width and height of screen
        islandscape = (w > h);

      return islandscape;
    };

  });
})(angular);

