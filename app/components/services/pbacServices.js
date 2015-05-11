(function(angular){
  "use strict";

  //service to query against memorial landmarks - benches and points of interest
  angular.module("pbacServices", [])

  //get config info
  .factory("queryConfig", function($http, $q){
    var _config;
    return function(){
      var qdefer = $q.defer();
      if(!_config){
        $http.get("./config.json").success(function(data){
          _config = data || {};
          qdefer.resolve(_config);
        });
      }
      else{
        qdefer.resolve(_config);
      }
      return qdefer.promise;
    };
  });
})(angular);
