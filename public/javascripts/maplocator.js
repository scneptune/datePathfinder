var map, geoCoder, infoWindow,
    inputs = document.querySelectorAll('input[type=text]'),
    searchBtn = document.getElementById('searchGeoLocation'),
    curLat = document.getElementById('curLat'),
    curLong = document.getElementById('curLong');


  function initMap() {
      map = new google.maps.Map(document.getElementById('geoLocationMap'), {
        center: {lat: 40.759011, lng: -73.984472},
        zoom: 17
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          reverseGeolocation({'location': pos}, map, true);
          setLatLong(pos);
        }, function (err) {
          console.log(err);
          geoLocationModalFail(map.getCenter());
        }, {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000});
      } else {
        geoLocationModalFail(map.getCenter());
      }

  }
  /**
  * Use google maps reverse geoCoding location lookup to get the address from queryParam .
  * @param - queryParam (Object) - the latLong cordinates or the address in an object format
  * @param - map (function) - the map function which controls the DOM bound instance of the map.
  * @param - databind (boolean) - A boolean to rebind the reverse lookup coordinates to the input fields.
  **/
  function reverseGeolocation (queryParam, map, databind) {
    geoCoder = new google.maps.Geocoder;
    infoWindow = new google.maps.InfoWindow({map: map});
    geoCoder.geocode(queryParam, function (results, status) {
      // Check to see if we get a good response
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          map.setZoom(17);
          var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: map
          });
          infoWindow.setContent(results[0].formatted_address);
          // this sends our marker to the map and causes it to refocus on the new location.
          infoWindow.open(map, marker);

          // this is really silly, but all we are doing is normalizing the lat and long fields from the geometry object.
          var latLongObj = results[0].geometry.location;
          setLatLong({lat : latLongObj.G, lng: latLongObj.K});
          (databind ? setLocationValue(results[0], inputs) : false);
          //and for presentation sake, let's recenter around the marker's coords.
          map.setCenter(results[0].geometry.location);
        }
      }
    });
  }
  function setLatLong(latLongObj) {
    curLat.value = (latLongObj.lat),
    curLong.value = (latLongObj.lng);
  }
  function setLocationValue(locationObj, fieldsToBind) {
    [].forEach.call(fieldsToBind, function (field) {
      switch(field.name) {
        case 'address':
        field.value = locationObj.address_components[0].long_name + ' ' + locationObj.address_components[1].long_name;
        break;
        case 'city':
        field.value = locationObj.address_components[2].long_name;
        break;
        default:
        break;
      }
    });
  }

  function geoLocationModalFail (pos) {
    infoWindow = new google.maps.InfoWindow({map: map});
    $('.geolocateMd').fadeIn();
    infoWindow.setPosition(pos);
  }

  //bind the search button with to the inputs values
  searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var queryParam = {'address' : inputs[0].value + ', ' + inputs[1].value};
    console.log(queryParam);
    return reverseGeolocation(queryParam, map, false);
  });

  document.forms[0].addEventListener('onsubmit', function (e) {
    reverseGeolocation({'address' : inputs[0].value + ', ' + inputs[1].value}, map, false);
    if (inputs.length < 2) {
      e.preventDefault();
    }
    // var request = new XMLHttpRequest(),
    //     formData = new FormData(document.forms[0]);
    //     console.log(request);
    //     request.open(document.forms[0].method, document.forms[0].action, true);
    //     request.setRequestHeader('Content-Type', document.forms[0].encoding + '; charset=UTF-8');
    //     request.send(formData);
    //     console.log(request);
  });

  initMap();