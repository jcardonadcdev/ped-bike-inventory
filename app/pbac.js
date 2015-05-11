(function(angular){
  "use strict";

  angular.module("pbacApp", [
    "mobile-angular-ui",
    "mobile-angular-ui.gestures",
    "ngRoute",
    "pbacServices",
    "pbacMapServices",
    "pbacInventoryLocator",
    "pbacLanding",
    "pbacEditor"
  ])

  .config(function($routeProvider, $httpProvider, $sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist([
        "self",
        "http://player.vimeo.com/video/**",
        "http://vimeo.com/**"
      ]);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    
    $routeProvider
      .when("/landing", {
        templateUrl: "pbacLanding/landing.html",
        controller: "pbacLandingController"
      })
      .when("/map", {
        controller: "pbacInventoryLocatorController",
        templateUrl: "pbacMap/inventoryLocator.html",
        reloadOnSearch: false
      })
      .when("/edit", {
        controller: "pbacEditorController",
        templateUrl: "pbacEditor/pbacEditor.html",
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: "/landing"
      });
  });
})(angular);