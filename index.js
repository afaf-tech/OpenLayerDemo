var map = new ol.Map({
  target: "map",
  /* layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ], */
  view: new ol.View({
    center: [
      12550043.026061378,
      -808212.7492250042
    ] /* ol.proj.fromLonLat([112.4142,6.9646]) */ ,
    zoom: 8,
    maxZoom: 10,
    minZoom: 4,
    rotation: 0.5
  })
});
/* map.on('click',function(e){
    //console.log(e);
    var cordinate= e.coordinate;
    var [la,lo] = e.coordinate;
    console.log(`this is lon:  ${la} and this is lat ${lo}`)
    cordinate.forEach(element => {
        console.log(element)
    });
    //alert(e.coordinate)
  }); */

//Base map

const openStreetMapStandard = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: false,
  title: "OSMStandard"
});
const openStreetMapHumanitarian = new ol.layer.Tile({
  source: new ol.source.OSM({
    url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  }),
  visible: false,
  title: "OSMHumanitarian"
});

const stamenTerrain = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: "http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg",
    attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: true,
  title: "StamenTerrain"
});

//Layer Group
const baseLayerGroup = new ol.layer.Group({
  layers: [openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain]
});
map.addLayer(baseLayerGroup);

// Layer Switcher logic
const side = document.querySelector(".sidebar");
const baseLayerEl = side.querySelectorAll("input[type=radio]");
console.log(baseLayerEl);
for (let baseLayerel of baseLayerEl) {
  //console.log(baseLayerel);
  baseLayerel.addEventListener("change", function () {
    let baseLayerElValue = this.value;
    // base lay group
    var layGroup = baseLayerGroup.getLayers(); // get the collection of layers on the baseLayerGroup
    layGroup.forEach((el, index, array) => {
      let baseLayTitle = el.get("title");
      el.setVisible(baseLayTitle === baseLayerElValue);
      //console.log(`base layer title is ${baseLayTitle} and baselayervalue is ${baseLayerElValue}`)
      console.log(el.get("title"), el.get("visible"));
    });
  });
}

// Vector layers
const fillStyle = new ol.style.Fill({
  color: [84, 118, 255, 1]
});
const strokeStyle = new ol.style.Stroke({
  color: [46, 45, 45, 1],
  width: 1.2
});

const circleStyle = new ol.style.Circle({
  fill: new ol.style.Fill({
    color: [255, 49, 5, 1]
  }),
  radius: 7,
  stroke: strokeStyle
});
//
const EaCityGeoJson = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    url: "./map/map.geojson",
    format: new ol.format.GeoJSON()
  }),
  visible: true,
  title: "City in EAJava JSON",
  style: new ol.style.Style({
    fill: fillStyle,
    stroke: strokeStyle,
    image: circleStyle
  })
});

map.addLayer(EaCityGeoJson);

// Vector Feature Popup Logic
const overlayContainerElement = document.querySelector(".overlay-container");
const overlayLayer = new ol.Overlay({
  element: overlayContainerElement
});
map.addOverlay(overlayLayer);

overlayFeatureName = document.getElementById("feature-name");
overlayFeatureAddInfo = document.getElementById("feature-additionalInfo");

infoBoxFeatureName = document.querySelector('.featureName');
infoBoxFeatureAddInfo = document.querySelector('.AddInfo');



console.log(overlayFeatureName, overlayFeatureAddInfo);

map.on("click", function (e) {
  overlayLayer.setPosition(undefined);
  map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
    //console.log(feature.getKeys());
    let clickedCoordinate = e.coordinate;
    console.log(`e coordinate : ${clickedCoordinate}`);
    //console.log(layer);
    // show feature of e e.pixel from geojson.map
    let clickedFeatureName = feature.get("name");
    let clickedFeatureAdditioanlInfo = feature.get("additional info");
    //console.log(clickedFeatureName, clickedFeatureAdditioanlInfo);
    overlayLayer.setPosition(clickedCoordinate);
    overlayFeatureName.innerHTML = clickedFeatureName;
    overlayFeatureAddInfo.innerHTML = clickedFeatureAdditioanlInfo;
    infoBoxFeatureName.innerHTML = `Info FeatureName : ${clickedFeatureName}`;
    infoBoxFeatureAddInfo.innerHTML = `Additional Info : ${clickedFeatureAdditioanlInfo}`;
  });
});

/*,
    {
      layerFilter: layercandidate => {
        const boo = layercandidate.get("title") == "EaCityGeoJson";
        console.log(layercandidate);
        console.log("boo : " + boo);
        return ;
      }
    } */