(function(angular){
  "use strict";

  angular.module("pbacInventoryLocator")
    .directive("pbacInventoryLocatorMap", function(queryInventorySites){
      return {
        compile: function($element, $attrs){
          // remove the id attribute from the main element
          $element.removeAttr("id");

          // append a new div inside this element, this is where we will create our map
          $element.append("<div id=" + $attrs.id + "></div>");

          // since we are using compile we need to return our linker function
          // the 'link' function handles how our directive responds to changes in $scope
          return function (scope, element, attrs, controller) {
            // link function
            //watch dataLoaded variable so can load map
            scope.$watch("pageConfigProperties.configLoaded", function(newVal){
              if (newVal && !scope.pageConfigProperties.mapLoaded){
                scope.idField = scope.pageConfigProperties.idField;
                queryInventorySites({url: scope.locatorMapConfig.inventoryUrl}).then(function(data){
                  //console.log("got inventory: ", data);
                  data = data || [];
                  controller.initializeMap(data);
                  //$scope.pageConfigProperties.inventorySites = data;
                  //.pageConfigProperties.configLoaded = true;
                });
              }
            });
          };
        },
        controller: "pbacInventoryLocatorMapController"
      };
    })
    .controller("pbacInventoryLocatorMapController", function($scope, $element, $attrs, $q, $timeout, queryInventorySites, layerQueryService){
      var esriMap,
        inventoryLayer,
        self = this,
        defaultMapProperties = {
          zoom: 13,
          sliderPosition: "bottom-left",
          center: [-77.347, 38.955],
          basemap: "topo"
        };

      //default selection info
      $scope.mapSelectionInfo = {
        memorialUnitGraphic: null,
        selectedMemorial: null
      };

      this.initializeMap = function(inventorySites){
        //console.log("Initializing map");
        //get selected memorial unit if it was set on url and map not initialized yet
        if($scope.pageConfigProperties.selectedUnitId && angular.isUndefined(esriMap)){
          esriMap = null;
          queryInventorySites({id: $scope.pageConfigProperties.selectedUnitId}).then(function(data){
            //set map center and zoom
            defaultMapProperties.center = data.geometry;

            //set selected unit info - the feature
            $scope.mapSelectionInfo.selectedMemorial = data;
            self.initializeMap(inventorySites);
          });
          return;
        }
        require([
          "esri/map",
          "esri/layers/FeatureLayer",
          "esri/layers/ArcGISTiledMapServiceLayer",
          "esri/layers/LabelLayer",
          
          "esri/renderers/SimpleRenderer",
          "esri/renderers/UniqueValueRenderer",
          "esri/renderers/jsonUtils",
          
          "esri/symbols/TextSymbol",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/SimpleLineSymbol",
          
          "esri/graphic",
          "esri/geometry/Extent",
          "esri/geometry/webMercatorUtils",
          "esri/Color"
        ], function(Map, FeatureLayer, ArcGISTiledMapServiceLayer, LabelLayer,
          SimpleRenderer, UniqueValueRenderer, rndJsonUtils,
          TextSymbol, SimpleMarkerSymbol, SimpleLineSymbol, 
          Graphic, Extent, webMercatorUtils, Color) {
          // create the map object
          var mapid = $attrs.id,
            mapcenter = defaultMapProperties.center;

          //inner function for adding memorial points to map
          function loadMapPoints(){
            var lm,
              g, i;
            //console.log("$scope.pageConfigProperties.inventorySites.length: ", $scope.pageConfigProperties.inventorySites.length);
            for(i = 0; i < inventorySites.length; i++){
              lm = inventorySites[i];
              //console.log("lm: ", lm);
              g = new Graphic(lm);
              g.geometry.setSpatialReference(esriMap.spatialReference);
              inventoryLayer.add(g);
            }
          }

          //function to make renderer
          /*function makeRenderer(){
            var rend = rndJsonUtils.fromJson($scope.locatorMapConfig.featureCollectionSchema.drawingInfo.renderer);
            return rend;
          }*/

          //set center
          if(mapcenter && !angular.isArray(mapcenter)){
            defaultMapProperties.center = webMercatorUtils.xyToLngLat(mapcenter.x, mapcenter.y);
            defaultMapProperties.zoom = 5;
            //console.log("$scope.defaultMapProperties.center: ", $scope.defaultMapProperties.center);
          }

          esriMap = new Map(mapid, defaultMapProperties);

          //add inventory layer
          esriMap.on("load", function(evt) {
            self.resizeMap();

            //make feature layer using feature collection for schema
            var fColl = {
              layerDefinition: $scope.locatorMapConfig.featureCollectionSchema,
              featureSet: {
                geometryType: "esriGeometryPoint",
                features: []
              }
            };
            //var renderer = makeRenderer();
            inventoryLayer = new FeatureLayer(fColl, {
              id: "inventory"
            });

           /* //css used to symbolize points, so graphic-draw event used to set data-attribute of graphic node
            inventoryLayer.on("graphic-node-add", function(evt){
              //console.log("drawing");
              var category = evt.graphic.attributes.type.toString();
              evt.node.setAttribute("data-lmtype", category);
            });*/

            //add feature layer to map and load the data
            esriMap.addLayer(inventoryLayer);
            //console.log("loading map points");
            loadMapPoints();
            
            // create a text symbol to define the style of labels
            var inventoryLabel = new TextSymbol().setColor(new Color([0, 0, 0]));
            inventoryLabel.font.setSize("10pt");
            inventoryLabel.font.setFamily("arial");
            var inventoryLabelRenderer = new SimpleRenderer(inventoryLabel);
            
            //create label layer
            var labels = new LabelLayer({ id: "labels" });
            
            // tell the label layer to label the inventory feature layer 
            // using the field named "district_id"
            labels.addFeatureLayer(inventoryLayer, inventoryLabelRenderer, "{district_id}");
            
            // add the label layer to the map
            esriMap.addLayer(labels);

            //add graphic for showing selected memorial unit
            var smsMemorial = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 30, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.2])),
              gMemorial,
              geom;

            if($scope.mapSelectionInfo.selectedMemorial){
              geom = $scope.mapSelectionInfo.selectedMemorial.geometry;
              geom.spatialReference = {
                wkid: esriMap.spatialReference.wkid
              };
              gMemorial = new Graphic({
                geometry: geom
              }).setSymbol(smsMemorial);
            }
            else{
              gMemorial = new Graphic({
                geometry: {x: 0,
                  y: 0,
                  spatialReference: {
                    wkid: 102100
                  }}
              }).setSymbol(smsMemorial);
              gMemorial.hide();
            }
            //console.log("adding selection graphic: ", gMemorial);
            esriMap.graphics.add(gMemorial);
            $scope.mapSelectionInfo.memorialUnitGraphic = gMemorial;

            esriMap.on("click", function(evt){
              //console.log("map click: ", evt);
              //make extent to use for query
              var mappt = evt.mapPoint,
                ext = new Extent(mappt.x - 200, mappt.y - 200, mappt.x + 200, mappt.y + 200, mappt.spatialReference),
                garray = inventoryLayer.graphics,
                selectedFeature;
              
              selectedFeature = layerQueryService.getClosestFeature(ext, garray);
              console.log("selectedFeature: ", selectedFeature);
              self.setLocatorPosition(selectedFeature);
            });
          });
        });
      };

      this.setLocatorPosition = function(memorialFeature){
        var geom,
          newId;
        if(!memorialFeature || !memorialFeature.feat){
          $scope.mapSelectionInfo.memorialUnitGraphic.hide();
          newId = null;
        }
        else{
          newId = memorialFeature.feat.attributes[$scope.idField];
          geom = $scope.mapSelectionInfo.memorialUnitGraphic.geometry;
          geom.update(memorialFeature.feat.geometry.x, memorialFeature.feat.geometry.y);
          $scope.mapSelectionInfo.memorialUnitGraphic.setGeometry(geom);
          $scope.mapSelectionInfo.memorialUnitGraphic.show();
        }
        $timeout(function(){
          $scope.pageConfigProperties.selectedUnitId = newId;
        });
      };

      this.resizeMap = function(){
        esriMap.resize();
        esriMap.reposition();
      };
    });
})(angular);
