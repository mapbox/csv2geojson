## 5.0.1

* Improved heuristic for guessing headers (thanks Yohan) https://github.com/mapbox/csv2geojson/issues/46

## 5.0.0

* Updates `dsv` dependency to `d3-dsv`

## 4.0.0

* [toLine and toPolygon now include all properties of all aggregated objects.](https://github.com/mapbox/csv2geojson/pull/29)

## 3.8.0

* `--crs` option in `csv2geojson` and in csv2geojson() to specify a specific
  coordinate reference system in output
* build with `npm run build` instead of Makefile
* update optimist and sexagesimal
* exclude test/ and site/ from npm packages

## 3.7.0

* `--line` option in `csv2geojson` binary now derives a line from a series of rows

## 3.6.1

* Improved test coverage, fixes but with one-line input

## 3.6.0

* Support stream input to the `csv2geojson` utility
