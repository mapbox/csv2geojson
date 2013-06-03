# csv2geojson

Does what it says on the tin.

## Using as a binary:

    npm install -g csv2geojson
    csv2geojson geodata.csv > geodata.geojson

## Using in nodejs

    npm install --save csv2geojson

```js
var csv2geojson = require('csv2geojson');

var geoJson = csv2geojson(csvString);
```

## Using in webpages

    wget https://raw.github.com/tmcw/csv2geojson/gh-pages/csv2geojson.js

Looks for fields like `/^Lat/i`.

Includes part of [d3js](http://d3js.org/) for CSV parsing.

## See Also

* [topojson](https://github.com/mbostock/topojson/) supports joining data in CSV
* [gdal](http://www.gdal.org/) supports specific CSV structures to and from other data formats
