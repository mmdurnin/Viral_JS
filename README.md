# <img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/icon.png" height="57" align="left" > Welcome to Viral!
-------------

Viral is a data visualization tool for viewing annual disease trends from state-to-state. The data are represented as points across the United States map. To learn more about the data represention and to see the visualization in action, visit [Viral](http://viral-map.herokuapp.com/#/).

<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/viral_screenshot.png" width="100%" align="center" >

## Table of Contents
* [Features & Highlights](#Features-&-Highlights)
  * [Virality Display](#visualization)
  * [Filtered Search](#search)
  * [Timeframe Animation](#timeframe)
  * [Responsive Design & Animated Displays](#design)
* [Technologies](#Technologies)
* [Future Directions](#future)
* [Sources](#Sources)
* [Links](#Links)

## <a id="Features-&-Highlights"></a>Features & Highlights ##

### <a id="visualization"></a>Virality Display / Data Visualization ###

This project uses the JavaScript Mapbox library for map rendering. Rather than using an external API, all state coordinate information and disease rate information is stored on the backend. PostGIS was used for storing and working with geographic information on the database level with PostgreSQL. 
<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/snippets/map_addlayer.png" width="30%" align="left" > The data used in this project are represented as randomized points confined within state boundaries. These randomized coordinates were generated with PostGIS and are also stored in the database. RGeo was used for formatting geographic data. 

The heart of the project lives on map.js. The map has 3 layers: the map, the state boundaries, and the disease data. The disease data are retrieved from the backend in JSON format as randomized coordinates. Mapbox has a variety of tools for data representation. Here, each coordinate is expressed as type circle and each type of disease is given a unique color. For scalability, diseases with higher rates are expressed as rate per 10,000 and are given a larger radius. Most of the diseases here are expressed as rate per 100,000.

### <a id="search"></a>Filtered Search ###

Viral allows users to select which diseases they are interested in seeing on the map. When the map first loads, all of the disease coordinates are retrieved from the backend. On clicking the filters button, a menu opens from the side with each disease as a checkbox item. On submit, a function to render the filtered data is executed.

<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/gifs/v.play.gif" width="50%" align="right" >

### <a id="timeframe"></a>Timeframe Animation ###

### <a id="design"></a>Responsive Design & Smooth Animation Displays ###

## <a id="Technologies"></a>Technologies ##
* PostgreSQL & PostGIS
* RGeo library that handles JSON formatting of geographic data
* Ruby on Rails
* Javascript
* Mapbox
* CSS3

## <a id="future"></a>Future Directions ##
The next crucial step for this project will be collecting more data on disease rates. This includes geographic coverage (both expanding and refining to county-specific rates), the collection of represented diseases, and timeframe. With a larger scale dataset, the project will ideally convey discernable morbidity trends linked to important health practices, e.g., vaccinations, sexual health, access to safe drinking water, etc. 

## <a id="Sources"></a>Sources ##
Disease rate information for this project was collected from the [World Health Organization](https://www.who.int/)

## <a id="Links"></a>Links ##
Visit [Viral](http://viral-map.herokuapp.com/#/)
