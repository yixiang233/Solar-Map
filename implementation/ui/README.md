<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>OptiSolar</title>
<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
<link href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js"></script>
<style>
body { margin: 0; padding: 0; }
#map { position: absolute; top: 0; bottom: 0; width: 100%; }
</style>
</head>
<body>
<!-- Load the `mapbox-gl-geocoder` plugin. -->
<script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js"></script>
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css" type="text/css">

<div id="map"></div>

<script>
	mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vubm55IiwiYSI6ImNscGhoajJ4dzA3dWEyanFxdmxudTdjcjAifQ.rIMnqAvCY0W2ikfw3H158Q';
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-75.162229, 39.947957],
        zoom: 1
    });

    // Add the control to the map.
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            reverseGeocode:true
        })
    );
    
    map.on('load', () => {
      // Add a data source containing GeoJSON data.
      map.addSource('philly', {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
        'type': 'Polygon',
        // These coordinates outline a block in Philly.
        // Coordinates for the center of the block: 39.94735833582525, -75.16205090524745
        // Shortened coordinates for center of block: 39.94735, -75.16205
        'coordinates': [
            [
            [-75.162598, 39.946793],
            [-75.162335, 39.947907],
            [-75.16161102299857, 39.94781071470789],
            [-75.16184705737602, 39.94666742412209],
            [-75.162598, 39.946793]
            ]
        ]
        }
      }
      });
      
      // Add a new layer to visualize the polygon.
      map.addLayer({
      'id': 'philly',
      'type': 'fill',
      'source': 'philly', // reference the data source
      'layout': {},
      'paint': {
      'fill-color': '#FFA500', // orange color fill
      'fill-opacity': 0.5
      }
      });
      // Add an orange outline around the polygon.
      map.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': 'philly',
      'layout': {},
      'paint': {
      'line-color': '#FFA500',
      'line-width': 3
      }
      });

      map.addSource('ny', {
      'type': 'geojson',
      'data': {
      'type': 'Feature',
      'geometry': {
      'type': 'Polygon',
      // These coordinates outline a block in Philly.
      // Coordinates for the center of the block: 40.75158561428345, -73.98127380158728
      // Shortened coordinates for center of block: 40.75158, -73.98127
      'coordinates': [
        [
          [-73.98215356608505, 40.751597805677136],
          [-73.98071590214968, 40.75098823325359],
          [-73.98032429965983, 40.75152872108327],
          [-73.98177269243054, 40.75211390596038],
          [-73.98215356608505, 40.751597805677136]
        ]
      ]
      }
      }
      });
      
      // Add a new layer to visualize the polygon.
      map.addLayer({
      'id': 'ny',
      'type': 'fill',
      'source': 'ny', // reference the data source
      'layout': {},
      'paint': {
      'fill-color': '#00FF00', // green color fill
      'fill-opacity': 0.5
      }
      });
      // Add a green outline around the polygon.
      map.addLayer({
      'id': 'nyoutline',
      'type': 'line',
      'source': 'ny',
      'layout': {},
      'paint': {
      'line-color': '#00FF00',
      'line-width': 3
      }
      });
    });
    
</script>

</body>
</html>