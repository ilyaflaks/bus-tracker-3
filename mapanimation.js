var map;
var markers = [];

var url =
  "https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip";
let busNumber = 0;
async function inputFunc() {
  busNumber = document.getElementById("input").value;
  busDisplayed = document.getElementById("bus-badge");
  var noRouteUrl =
    "https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=&include=trip";
  var newUrl = noRouteUrl.slice(0, 88) + busNumber + noRouteUrl.slice(88);

  url = newUrl;
  var busData = await getBusLocations();

  if (busNumber > 120) {
    console.log("There are not that many busses in the city of Boston");
    alert("There are not that many busses in the city of Boston");
  } else if (busData.length === 0) {
    alert("No such bus exists in the city of Boston");
  } else {
    busDisplayed.innerHTML = busNumber;
    //console.log("bus number entered: " + busNumber);

    for (let i = 0; i < busData.length; i++) {
      markers.forEach((mark) => {
        if (busData[i].id !== mark.id) {
          markers.splice(markers.indexOf(mark), 1);
        }
      });
    }
  }
  //init() rewritten without the recursive call to avoid duplicate API fetching
  let myOptions = {
    zoom: 12,
    center: { lat: 42.35335, lng: -71.091525 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  let element = document.getElementById("map");
  map = new google.maps.Map(element, myOptions);
  let locations = await getBusLocations();

  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });
}

// load map
function init() {
  var myOptions = {
    zoom: 12,
    center: { lat: 42.35335, lng: -71.091525 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  var element = document.getElementById("map");
  map = new google.maps.Map(element, myOptions);
  addMarkers();
}

// Add bus markers to map
async function addMarkers() {
  var locations = await getBusLocations();

  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });

  console.log(new Date());

  setTimeout(addMarkers, 15000);
}

async function getBusLocations() {
  var response = await fetch(url);
  var json = await response.json();
  return json.data;
}

function addMarker(bus) {
  var icon = getIcon(bus);
  var marker = new google.maps.Marker({
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude,
    },
    map: map,
    icon: icon,
    id: bus.id,
  });

  markers.push(marker);
}

function getIcon(bus) {
  if (bus.attributes.direction_id === 0) {
    return "red.png";
  }
  return "blue.png";
}

function moveMarker(marker, bus) {
  var icon = getIcon(bus);
  marker.setIcon(icon);
  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude,
  });
}

function getMarker(id) {
  var marker = markers.find(function (item) {
    return item.id === id;
  });
  return marker;
}

window.onload = init;
