(function(angular){
  "use strict";
  
  angular.module("pbacMapServices", [])
    .factory("layerQueryService", function(){
      return {
        getClosestFeature: function(extent, features){
          function getClosest(identFeats, mappt){
            var i, f, closest,
              dist;
            
            
            identFeats = identFeats || [];
            if (identFeats.length === 1){
              return {
                feat: identFeats[0]
              };
            }
            for(i = 0; i < identFeats.length; i++){
              f = identFeats[i];
              if(!f.visible){
                continue;
              }
              dist = getDistance(f.geometry, mappt);
              if(!closest || dist < closest.distance){
                closest = {
                  feat: f,
                  distance: dist
                };
              }
            }
//            if(closest && closest.feat){
//              closest.feat.hide();
//              console.log("closest: ", closest);
//            }
            return closest;
          }

          function getDistance(pt1, pt2){
            var dist = 99,
              dx, dy;

            if (pt1 && pt2){
              dx = pt1.x - pt2.x;
              dy = pt1.y - pt2.y;
              dist = Math.sqrt(dx*dx + dy*dy);
            }
            return dist;
          }

          var i, g,
            qresults = [],
            mappt = extent.getCenter(),
            closest;
          for(i = 0; i < features.length; i++){
            g = features[i];
            if (g.visible && extent.intersects(g.geometry)){
              qresults.push(g);
            }
          }

          closest = getClosest(qresults, mappt);
          return closest;
        }
      };
    })
    
    .factory("featureService", function(){
      return {
        
      };
    });
})(angular);
