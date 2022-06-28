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
        zoom: 3.5
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

// Draws the US map onto the page
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
            "line-width": 1
        }
    });

    // Add shading to state on hover
    map.on("mousemove", "state-fills", function (e) {
        if (e.features.length > 0) {
            // If the mouse has moved but remains on the same state, keep current state set
            if (hoveredStateId && hoveredStateId === e.features[0].id) {
                return;
            }
            // If was previously hovering over different state, unset it
            if (hoveredStateId) {
                map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
            }
            // Set new state being hovered over
            hoveredStateId = e.features[0].id;
            map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: true });
        }
    });

    // Remove shading from state on mouse leave
    map.on("mouseleave", "state-fills", function () {
        if (hoveredStateId) {
            map.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false });
        }
        hoveredStateId = null;
    })

    // Zoom into state on click (this does not interfere with map dragging)
    map.on("click", "state-fills", function (e) {
        if (e.features.length > 0) {
            let coordsArray = e.features[0].geometry.coordinates[0];
            coordsArray = coordsArray.length === 1 ? coordsArray[0] : coordsArray;
            const topLeftCoord = coordsArray[0];
            const bottomRightCoord = coordsArray[Math.floor(coordsArray.length / 2)];
            const xCoord = (topLeftCoord[0] + bottomRightCoord[0]) / 2;
            const yCoord = (topLeftCoord[1] + bottomRightCoord[1]) / 2;
            const center = [xCoord, yCoord]
            map.flyTo({center, zoom:5});
        }
    })
}


// Prepares disease data that will populate the map when filters are set
function populateMap(pops, map) {

    const json = JSON.parse(JSON.stringify(pops))

    map.addSource("disease_pops", {
        "type": "geojson",
        "data": json
    });

    map.addLayer({
        "id": "pop-points",
        "type": "circle",
        "source": "disease_pops",
        "layout": {},
        "paint": {
            'circle-opacity': 0.2,
            'circle-opacity-transition': {duration: 800},
            'circle-color': [
            'match',
                ['get', 'name'],
                'tb', '#fbb03b',
                'chlamydia', '#3bb2d0',
                'Hepatitis  A', '#e55e5e',
                'Acute Viral Hepatitis B', '#223b53',
                '#ccc'
            ],
            "circle-radius": [
                'match',
                    ['get', 'name'],
                    'tb', 2,
                    'chlamydia', 3,
                    'Hepatitis  A', 2,
                    'Acute Viral Hepatitis B', 2,
                    2
            ],
            "circle-radius-transition": {duration: 800},
        }
    })

    document.getElementById('disease-form').addEventListener("change", function (e) {
        if (e.target.checked === true) {
            e.target.value = true
        } else {
            e.target.value = false
        }
    });

    let diseaseDisplay = [];
    document.getElementById('submit-filters').addEventListener('click', function (e) {
        diseaseDisplay = [];
        e.preventDefault();
        const diseaseFilters = document.getElementById('disease-form').elements

        for (let i = 0; i < diseaseFilters.length; i++) {
            currentDisease = diseaseFilters[i]
            if (currentDisease.value === "true") {
                dName = currentDisease.name.split("_").join(" ")
                diseaseDisplay.push(dName)
            }
        }
        playTimeLapse();
    })

    function filterBy(year, diseaseArr) {
        diseaseArr.unshift('name')
        diseaseArr.unshift('in')

        var filters = ['all', ['==', 'year', year], diseaseArr]
        map.setFilter('pop-points', filters)
        diseaseArr.shift()
        diseaseArr.shift()
        diseaseArr = [];
    }

    const ticker = document.getElementById('slider');

    function clearMap(){
        ticker.value = 2000;
        filterBy(1990, []);
    }


    ticker.addEventListener('input', function (e) {
        var year = parseInt(e.target.value, 10);
        filterBy(year, diseaseDisplay);
    });
    clearMap();

    function fadeCircles() {
        setTimeout(function() {
            map.setPaintProperty('pop-points', 'circle-opacity', 1);
        }, 100);
        setTimeout(function () {
            map.setPaintProperty('pop-points', 'circle-opacity', .6);
        }, 500);
    }

    
    function playTimeLapse() {
        let ticker_pop = 2000; 
        const keepSpreading = setInterval(function () {
            ticker_pop += 1
            fadeCircles();
            filterBy(ticker_pop, diseaseDisplay);
            ticker.stepUp();
            if (ticker_pop >= 2017) {
                clearInterval(keepSpreading)
                clearMap();
            }
        }, 500);
    }
}

