(function(angular){
  "use strict";

  angular.module("pbacInventoryLocator")
    .factory("queryInventorySites", function($http, $q){
      var _data,
        _dict = {},
        _idField = "district_id";

      return function(queryParams){
        //console.log("queryParams: ", queryParams);
        if(queryParams.hasOwnProperty("idField")){
          _idField = queryParams.idField;
        }
        
        var qdefer = $q.defer(),
          urlsuffix = "/query?f=json&where=1=1&includeGeometery=true&outFields=*",
          svcurl = queryParams.url,
          id = queryParams.id;

        function processRequest(){
          if(!angular.isUndefined(id) && !angular.equals(id, null)){
            qdefer.resolve(_dict[id]);
          }
          else{
            qdefer.resolve(_data);
          }
        }

        if(_data){
          processRequest();
        }
        else{
          _data = [];
          if(!svcurl){
            processRequest();
          }
          else{
            svcurl += urlsuffix;
            $http.get(svcurl).success(function(data){
              //console.log("data: ", data);
              data = data || {};
              var feats = data.features || [],
                i, feat, featId;
              for (i = 0; i < feats.length; i++){
                feat = feats[i];
                featId = feat.attributes[_idField];
                _data.push(feat);
                _dict[featId] = feat;
              }
              processRequest();
            });
          }
        }
        return qdefer.promise;
      };
    });
})(angular);
