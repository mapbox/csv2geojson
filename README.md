# csv2geojson

Does what it says on the tin.

    npm install -g csv2geojson
    csv2geojson geodata.csv > geodata.geojson

Looks for fields like `/^Lat/i`.

Includes part of [d3js](http://d3js.org/) for CSV parsing.

## See Also

* [topojson](https://github.com/mbostock/topojson/) supports joining data in CSV
* [gdal](http://www.gdal.org/) supports specific CSV structures to and from other data formats
