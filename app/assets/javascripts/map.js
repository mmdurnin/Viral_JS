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
            'circle-color': [
            'match',
                ['get', 'name'],
                'tb', '#fbb03b',
                'chlamydia', '#223b53',
                'Hepatitis  A', '#e55e5e',
                'Acute Viral Hepatitis B', '#3bb2d0',
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
            ]
        }
    })

    document.getElementById('disease-form').addEventListener("change", function (e) {
        if (e.target.checked === true) {
            e.target.value = true
            console.log(e.target)
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
            diseaseTemp = diseaseFilters[i]
            if (diseaseTemp.value === "true") {
                dName = diseaseTemp.name.split("_").join(" ")
                console.log(dName)
                diseaseDisplay.push(dName)
            }
        }
        playTimeLapse();
    })

    function filterBy(year, diseaseArr) {
        diseaseArr.unshift('name')
        diseaseArr.unshift('in')
        console.log(diseaseArr)

        var filters = ['all', ['==', 'year', year], diseaseArr]
        map.setFilter('pop-points', filters)
        diseaseArr.shift()
        diseaseArr.shift()
        diseaseArr = [];

    }


    document.getElementById('slider').addEventListener('input', function (e) {
        var year = parseInt(e.target.value, 10);
        filterBy(year, diseaseDisplay);
    });

    filterBy(1990, []);
    

    
    function playTimeLapse() {
        console.log(diseaseDisplay)
        console.log("this is playTimeLapse") 
        let ticker_pop = 2000; 
        const keepSpreading = setInterval(function () {
            const ticker = document.getElementById('slider');
            ticker_pop += 1
            filterBy(ticker_pop, diseaseDisplay);
            ticker.stepUp();
            if (ticker_pop > 2017) {
                clearInterval(keepSpreading)
            }
        }, 85);
    }
}

