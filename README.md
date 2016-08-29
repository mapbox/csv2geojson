[![Build Status](https://travis-ci.org/mapbox/csv2geojson.png)](https://travis-ci.org/mapbox/csv2geojson)

# csv2geojson

Converts [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) and [TSV](http://en.wikipedia.org/wiki/Tab-separated_values)
files into [GeoJSON](http://www.geojson.org/) data suitable for maps..

## Using as a binary:

    npm install -g csv2geojson
    csv2geojson geodata.csv > geodata.geojson

```
➟ csv2geojson
Usage: csv2geojson --lat [string] --lon [string] --line [boolean] --delimiter [string] FILE

Options:
  --lat        the name of the latitude column
  --lon        the name of the longitude column
  --line       whether or not to output points as a LineString  [default: false]
  --delimiter  the type of delimiter                            [default: ","]
```

## Using in nodejs

    npm install --save csv2geojson

```js
var csv2geojson = require('csv2geojson');

var geoJson = csv2geojson.csv2geojson(csvString, function(err, data) {
    // err has any parsing errors
    // data is the data.
});
```

## api

```js
csv2geojson.csv2geojson(csvString, {
    latfield: 'LATFIELDNAME',
    lonfield: 'LONFIELDNAME',
    delimiter: ','
}, function(err, data) {
});
```

Parse a CSV file and derive a [GeoJSON](http://www.geojson.org/) 
[`FeatureCollection`](http://geojson.org/geojson-spec.html#feature-collection-objects)
object from it. Err is non-falsy if latitude and longitude values cannot be 
detected or if there are invalid rows in the file. Delimiter can be ',' 
for CSV or '\t' for TSV or '|' and other delimiters.

Delimiter can also be `auto`, and it will try `, \t | ;` and choose the 'best'.

```js
csv2geojson.dsv(delimiter).parse(dsvString);
```

The [dsv](https://github.com/mbostock/dsv) library for barebones DSV parsing.

```js
csv2geojson.auto(dsvString);
```

Automatically choose a delimiter to parse a dsv string with, and do it.

```js
csv2geojson.toPolygon(gj);
csv2geojson.toLine(gj);
```

Given a GeoJSON file consisting of points, derive one consisting of a polygon
or line that has the coordinates of those points, in the order given.

## Using in webpages

The latest build will be at

    https://npmcdn.com/csv2geojson@latest/csv2geojson.js

Open that path in a browser to be redirected to the lastest pinned version.

Looks for fields like `/^Lat/i`.

## See Also

* [topojson](https://github.com/mbostock/topojson/) supports joining data in CSV
* [gdal](http://www.gdal.org/) supports specific CSV structures to and from other data formats

This is what powers the CSV/TSV import of [geojson.io](http://geojson.io/).
