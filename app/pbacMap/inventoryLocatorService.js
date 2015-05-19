(function(angular){
  "use strict";

  angular.module("pbacInventoryLocator")
    .factory("queryInventorySites", function($http, $q, $filter){
      var _data,
        _dict = {},
        _idField = "district_id",
        _parentField = "district";

      return function(queryParams){
        //console.log("queryParams: ", queryParams);
        if(queryParams.hasOwnProperty("idField")){
          _idField = queryParams.idField;
        }

        if(queryParams.hasOwnProperty("parentField")){
          _parentField = queryParams.idField;
        }

        var qdefer = $q.defer(),
          urlsuffix = "/query?f=json&where=1=1&includeGeometery=true&outFields=*",
          svcurl = queryParams.url,
          id = queryParams.id,
          parent = queryParams.parent;

        function processRequest(){
          var results = [];
          if(!angular.isUndefined(id) && !angular.equals(id, null)){
            results = $filter("filter")(_data, {
              id: id
            });
            results = results[0];
            //qdefer.resolve(_dict[id]);
          }
          else if(!angular.isUndefined(parent) && !angular.equals(parent, null)){
            results = $filter("filter")(_data, {
              parent: parent
            });
          }
          else{
            results = _data;

          }
          qdefer.resolve(results);
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
            //svcurl += urlsuffix;
            $http.get(svcurl).success(function(data){
              //console.log("data: ", data);
              data = data || {};
              var feats = data.features || [],
                i, feat, featId,
                parentId;
              for (i = 0; i < feats.length; i++){
                feat = feats[i];
                featId = feat.attributes[_idField];
                parentId = feat.attributes[_parentField];
                feat.parent = parentId;
                feat.id = featId;
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
