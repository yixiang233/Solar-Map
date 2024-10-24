import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import MapGL, {Source, Layer} from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import services from './services/services'

// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2Vubm55IiwiYSI6ImNscGhoajJ4dzA3dWEyanFxdmxudTdjcjAifQ.rIMnqAvCY0W2ikfw3H158Q';

const Map = () => {
  const [bldInfo, setBldInfo] = useState({})
  const [weatherInfo, setWeatherInfo] = useState({})
  const [firstRender, setFirstRender] = useState(true)
  const [geojson, setGeojson] = useState({
    'type': 'Feature',
        'geometry': {
        'type': 'Polygon',
        // These coordinates outline a block in Philly.
        // Coordinates for the center of the block: 39.94735833582525, -75.16205090524745
        // Shortened coordinates for center of block: 39.94735, -75.16205
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
})
  const [layer, setLayer] = useState(
        {
        'id': 'philly',
        'type': 'fill',
        'source': 'philly', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#FFA500', // orange color fill
            'fill-opacity': 0.5
        }
    })
  const [rating, setRating] = useState()
  const [viewport, setViewport] = useState({
    latitude: 39.94735,
    longitude: -75.16205,
    zoom: 17
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const handleSearch = useCallback(
    (result) => {
        const coords = result.result.center;
        const newViewport = {
            latitude: coords[1],
            longitude: coords[0],
            zoom: 17
        }
        const params = {
            location: 
            {
                lat: coords[1],
                lng: coords[0]
            },
            requiredQuality: "HIGH"
        }
        services
        .getBuildingInsights(params)
        .then(res => {setBldInfo(
            {
                bndBox: res.boundingBox,
                center: res.center,
                sunshine: res.solarPotential.maxSunshineHoursPerYear,
            }
        )
        console.log(res);
        })
        .catch(e => console.log("No building found near here. Error: ", e))

        services
        .getWeatherInfo(params.location)
        .then(res => setWeatherInfo(
            {
                cloudCoverAvg: res.timelines.daily[0].values.cloudCoverAvg, 
                snowAccumulationLweAvg: res.timelines.daily[0].values.snowAccumulationLweAvg
            }
        ))

        setViewport(newViewport);
    },
    []
  );

  useEffect(() => {
    const paramsToSend = {
        bndBox: bldInfo.bndBox,
        center: bldInfo.center,
        sunshine: bldInfo.sunshine,
        cloudCover: weatherInfo.cloudCoverAvg,
        snowAcc: weatherInfo.snowAccumulationLweAvg
    }
    console.log(paramsToSend);
    services
    .sendParams(paramsToSend)
  },[bldInfo, weatherInfo])

  useEffect(() => {
    let geojson = {}
    console.log(bldInfo);
    /*if (firstRender && bldInfo != {}) {
        geojson = {
            'type': 'Feature',
                'geometry': {
                'type': 'Polygon',
                // These coordinates outline a block in Philly.
                // Coordinates for the center of the block: 39.94735833582525, -75.16205090524745
                // Shortened coordinates for center of block: 39.94735, -75.16205
                'coordinates': [
                    [
                        [bldInfo.bndBox["ne"].longitude, bldInfo.bndBox["ne"].latitude],
                        [bldInfo.bndBox["sw"].longitude, bldInfo.bndBox["ne"].latitude],
                        [bldInfo.bndBox["sw"].longitude, bldInfo.bndBox["sw"].latitude],
                        [bldInfo.bndBox["ne"].latitude, bldInfo.bndBox["sw"].latitude],
                        [bldInfo.bndBox["ne"].latitude, bldInfo.bndBox["ne"].latitude]
                    ]
                ]
                }
        }
    } else {*/
        geojson = {
            'type': 'Feature',
                'geometry': {
                'type': 'Polygon',
                // These coordinates outline a block in Philly.
                // Coordinates for the center of the block: 39.94735833582525, -75.16205090524745
                // Shortened coordinates for center of block: 39.94735, -75.16205
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
    //}
    
    const layer = ({
        'id': 'philly',
        'type': 'fill',
        'source': 'philly', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#FFA500', // orange color fill
            'fill-opacity': 0.5
        }
        });
  }, [rating])

  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onLoading={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        <Geocoder
          mapRef={mapRef}
          onResult={handleSearch}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-right"
          reverseGeocode={true}
        />
        <Source id="philly" type="geojson" data={geojson}>
            <Layer {...layer} />
        </Source>
      </MapGL>
    </div>
  );
};

export default Map