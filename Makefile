all: csv2geojson.js

csv2geojson.js: index.js package.json
	browserify -t brfs -r dsv -s csv2geojson index.js > csv2geojson.js
