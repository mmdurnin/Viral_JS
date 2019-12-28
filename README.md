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

The heart of the project lives on map.js. The map has 3 layers: the map, the state boundaries, and the disease data. The disease data are retrieved from the backend in JSON format as randomized coordinates. Each set of randomized coordinates is linked with a year and a disease. Mapbox has a variety of tools for data representation. Here, each coordinate is expressed as type circle and each type of disease is given a unique color. For scalability, diseases with higher rates are expressed as rate per 10,000 and are given a larger radius. Most of the diseases here are expressed as rate per 100,000.

### <a id="search"></a>Filtered Search ###

Viral allows users to select which diseases they are interested in seeing on the map. When the map first loads, all of the disease coordinates are retrieved from the backend. On clicking the filters button, a menu opens from the side with each disease as a checkbox item. <img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/snippets/disease_array.png" width="40%" align="left" > On submit, the diseases are filtered by selected diseases and year. First, an event listener on the submit button triggers a function to create an array of selected diseases. Later on, this array will be given to a filter function. The filter function handles rendering of coordinates that match 2 criteria: 1. The set of coordinates must be linked with a disease included in this array, and 2. The coordinates must match a year.


<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/gifs/v.play.gif" width="100%" align="center" >

<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/snippets/automated_filter.png" width="50%" align="right" >

### <a id="timeframe"></a>Timeframe Animation ###

As mentioned above, the second argument given to the filter function is a year. The year is initially set to 1990 so that all coordinates are hidden (currently there is no disease matching the year 1990). As the above snippet shows, the function that is executed when a user clicks submit calls another function: playTimeLapse. PlayTimeLapse handles the automated re-rendering with a setInterval. At each 500ms interval, the year ("tickerPop") is incremented by one and two other functions are called: fadeCircles and filterBy. The fadeCircles function is in place to create a more smooth transition between map renders using circle opacity transitions. The filterBy function is given the incremented year and the disease array triggers a re-render. 

### <a id="design"></a>Responsive Design & Smooth Animation Displays ###

<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/gifs/v.resize.gif" width="48%" align="left" >

<img src="https://github.com/mmdurnin/Viral_JS/blob/master/app/assets/images/functionality_screenshots/gifs/v.modal.gif" width="48%" >

#### Responsive Design
Viral is user-friendly across devices. This is achieved with media queries and fluid sizing. The height and width of the filters menu and the buttons are set to fit content. The width of the year slider is set to 70% of the screen. At a screen width of 1000px or less, the key is hidden and replaced with a button. When the button is clicked, the key appears. Rather than changing displays, the button and key are given z-indexes depending on their status.

#### Smooth Animation Displays
When a user selects the filter menu, it slides in from the left. This is achieved through the CSS transform property. When a user clicks on the filters button, a class is added to the menu which shifts its "left" property into the window display. 

When a user selects "About Viral", a modal opens with information on the project. The modal transitions into display slowly. First, the borders appear one by one and then the inner content fades in. This was achieved through CSS animations. When keyframes are set to 0%, all borders are transparent. At 5%, the top border is set to appear, the left at 30% and so on. At 70% all borders are given the property of 3px solid white and the background color is set to an opacity of .5. By 100% the modal is fully visible. This happens over a duration of 1.5 seconds.


## <a id="Technologies"></a>Technologies ##
* PostgreSQL & PostGIS
* RGeo 
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
