document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWR1cm5pbiIsImEiOiJjazNjaHkxZjEweXg3M2lvMWtnZDh0M3g5In0.ND3SU3mXL1jlXr5EEWMyug';

    var map = new mapboxgl.Map({
        container: 'mapViralId',
        // style: 'mapbox://styles/mapbox/streets-v11',
        style: {
            version: 8,
            sources: {

            },
            layers: [
                {
                    id: 'background',
                    type: 'background',
                    paint: { 'background-color': 'rgb(173,193,217)' }
                }
            ]

        },
        center: [-100.486052, 37.830348],
        // pitch: 45, // pitch in degrees
        // bearing: 10, // bearing in degrees
        zoom: 3
    });

    $.ajax({
        url: `/api/states`,
        method: 'GET'
    }).then((states) => decorateMap(states, map));

    $.ajax({
        url: '/api/diseases',
        method: 'GET'
    }).then((pops) => populateMap(pops, map));

})


function decorateMap(states, map) {
    
    var hoveredStateId = null;

    const json = JSON.parse(JSON.stringify(states))

    map.addSource("states", {
        "type": "geojson",
        "data": json
    });
    
    map.touchZoomRotate.disableRotation();

    map.addLayer({
        "id": "state-fills",
        "type": "fill",
        "source": "states",
        "layout": {},
        "paint": {
            "fill-color": "rgb(247,246,247)",
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
            "line-color": "white",
            "line-width": 3
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
}



function populateMap(pops, map) {
    const tb_2000 = pops["tb"]["2000"]
    const json_tb_2000 = JSON.parse(JSON.stringify(tb_2000))

    const ch_2000 = pops["chlamydia"]["2000"]
    const json_ch_2000 = JSON.parse(JSON.stringify(ch_2000))

    map.addSource("tb", {
        "type": "geojson",
        "data": json_tb_2000
    })

    map.addSource("ch", {
        "type": "geojson",
        "data": json_ch_2000
    })

    map.addLayer({
    "id": "tb-pop-points",
    "type": "circle",
    "source": "tb",
    "layout": {},
    "paint": {
        "circle-color": "rgba(137,0,2,.8)",
        "circle-radius": {
            'base': .5,
            'stops': [[4, 2], [11, 7], [16, 16]]
        }
    }})

    map.addLayer({
    "id": "ch-pop-points",
    "type": "circle",
    "source": "ch",
    "layout": {},
    "paint": {
        "circle-color": "rgba(255,204,6,.8)",
        "circle-radius": {
            'base': 2,
            'stops': [[4, 4], [11, 15], [16, 40]]
        }
    }})
}

    // const year = pops["1990"]

    // const json = JSON.parse(JSON.stringify(year))

    // map.addSource("populations", {
    //     "type": "geojson",
    //     "data": json
    // })

    // map.addLayer({
    //     "id": "pop-points",
    //     "type": "circle",
    //     "source": "populations",
    //     "layout": {},
    //     "paint": {
    //         "circle-color": "rgba(255,204,6,.5)",
    //         "circle-radius": {
    //             'base': 1.75,
    //             'stops': [[3, 3], [11, 15], [16, 40]]
    //         }
    //     }
    // })