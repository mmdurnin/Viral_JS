$.ajax({
    url: `/api/states`,
    method: 'GET'
}).then((states) => decorateMap(states));

function decorateMap(states, map) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWR1cm5pbiIsImEiOiJjazNjaHkxZjEweXg3M2lvMWtnZDh0M3g5In0.ND3SU3mXL1jlXr5EEWMyug';
    var map = new mapboxgl.Map({
        container: 'mapViralId',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-100.486052, 37.830348],
        zoom: 3
    });

    var hoveredStateId = null;

    const json = JSON.parse(JSON.stringify(states))

    map.on('load', function () {
        map.addSource("states", {
            "type": "geojson",
            "data": json
        });

        // map.dragRotate.disable();

        map.touchZoomRotate.disableRotation();

        map.addLayer({
            "id": "state-fills",
            "type": "fill",
            "source": "states",
            "layout": {},
            "paint": {
                "fill-color": "#0F1358",
                "fill-opacity": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    .75,
                    1
                ]
            }
        })

        map.addLayer({
            "id": "state-borders",
            "type": "line",
            "source": "states",
            "layout": {},
            "paint": {
                "line-color": "#F4F5F6",
                "line-width": 1
            }
        });

        map.on("mousemove", "state-fills", function (e) {
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: true });
            }
        });

        map.on("mouseleave", "state-fills", function () {
            if (hoveredStateId) {
                map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = null;
        })
    })
}