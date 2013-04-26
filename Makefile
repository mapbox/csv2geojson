all: csv2geojson.js

csv2geojson.js: index.js package.json
	browserify -s csv2geojson index.js > csv2geojson.js
