// TODO: Create loading state
let isLoading = true;

const END_RADIUS = 50;
const RADIUS_STEP = .25;
const START_OPACITY = 1;
const END_OPACITY = 0;
const OPACITY_STEP = .02;

const COLOR_MAP = {
    tb: ['rgb(232,213,247)', 'rgb(168,144,227)', 'rgb(161,122,228)'],
    chlamydia: ['rgb(253,194,133)', 'rgb(255,165,121)', 'rgb(249,137,118)'],
    'Hepatitis  A': ['rgb(210,241,163)', 'rgb(184,229,165)', 'rgb(123,203,162)', 'rgb(70,174,159)'],
    'Acute Viral Hepatitis B': ['rgb(31,122,121)', 'rgb(14,88,97)', 'rgb(7,64,81)'],
    COVID: ['#ccc'],

}
const RADIUS_MAP = {
    tb: [1,2,3],
    chlamydia: [2,3,4],
    'Hepatitis  A': [1,2,3],
    'Acute Viral Hepatitis B': [1,2,3],
    COVID: [1,2,3],
}

function getColor(diseaseName) {
    return COLOR_MAP[diseaseName][Math.floor(Math.random() * COLOR_MAP[diseaseName].length)]
}
function getRadius(diseaseName) {
    return RADIUS_MAP[diseaseName][Math.floor(Math.random() * RADIUS_MAP[diseaseName].length)]
}

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
                    paint: { 'background-color': 'rgb(10,0,38)' }
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
    if (isLoading) {
        document.getElementById("nav-button").style.cursor = "wait";
        document.getElementById("nav-button").disabled = true;
        console.log('Loading...')
    }

    let hoveredStateId = null;

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
            "fill-color": "rgb(241,230,222)",
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
            "line-color": "rgb(101,114,146)",
            "line-width": 1,
            "line-dasharray": [1, 1],
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
            // Index into coordinates, NOTE: Some states have an additional layer of coordinate nesting
            let coordsArray = e.features[0].geometry.coordinates[0];
            coordsArray = coordsArray.length === 1 ? coordsArray[0] : coordsArray;
            // Determine the middle of the clicked state 
            // Note: coords array always starts and ends top left. To get bottom right, 
            // we derive the coordinates from the middle of the coords array
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
    isLoading = false;
    console.log("Finished loading")
    document.getElementById("nav-button").style.cursor = "pointer";
    document.getElementById('nav-button').disabled = false;

    const json = JSON.parse(JSON.stringify(pops))
    const ticker = document.getElementById('slider');
    let selectedDisease = null;

    map.addSource("disease_pops", {
        "type": "geojson",
        "data": json
    });

    function fadeCircles(layerId, startingRadius) {
        let currentRadius = startingRadius;
        let currentOpacity = START_OPACITY;
        function expandRadius() {
            currentRadius+= RADIUS_STEP;
            currentOpacity-= OPACITY_STEP;
            if (map.getLayer(layerId) && currentOpacity > 0) {
                map.setPaintProperty(layerId, 'circle-radius', currentRadius);
                map.setPaintProperty(layerId, 'circle-opacity', currentOpacity);
            }
            if (currentRadius < END_RADIUS && currentOpacity > 0) {
                window.requestAnimationFrame(expandRadius)
            }
        }
        const animation = window.requestAnimationFrame(expandRadius)

        setTimeout(function() {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId)
                window.cancelAnimationFrame(animation)
            }
        }, 2000)
    }

    function addFilteredLayer(year) {
        const id = `pop-points-${year}`
        const radius = getRadius(selectedDisease)

        if (selectedDisease === null) return

        map.addLayer({
            id,
            type: "circle",
            source: "disease_pops",
            layout: {},
            filter: [
                'all',
                ['==', 'year', year],
                ['==', 'name', selectedDisease],
            ],
            paint: {
                'circle-opacity': 1,
                'circle-color': getColor(selectedDisease),
                "circle-radius": radius,
            }
        })

        fadeCircles(id, radius)
    }

    // Advance ticker on an automatic timelapse
    function playTimeLapse() {
        let tickerPop = 2000; 
        const keepSpreading = setInterval(function () {
            tickerPop += 1
            addFilteredLayer(tickerPop);
            ticker.stepUp();
            if (tickerPop >= 2017) {
                clearInterval(keepSpreading)
                ticker.value = 2000;
            }
        }, 500);
    }

    // Handle checking filters off/on
    document.getElementById('disease-form').addEventListener("change", function (e) {
        if (e.target.checked === true) {
            selectedDisease = e.target.dataset.name.split("_").join(" ")
            e.target.value = true
        } else {
            e.target.value = false
        }
    });

    // Handle filter submission
    document.getElementById('submit-filters').addEventListener('click', function (e) {
        e.preventDefault();

        if (selectedDisease) {
            playTimeLapse(); 
        }
    })

    // Handle cases where ticker is manually moved
    ticker.addEventListener('input', function (e) {
        var year = parseInt(e.target.value, 10);
        addFilteredLayer(year);
    });
}

