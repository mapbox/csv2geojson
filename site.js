var po = org.polymaps;
var svg = document.getElementById("map").appendChild(po.svg("svg"));
svg.style.width = 640 + 'px';
svg.style.height = 300 + 'px';

function bounds(features) {
  var i = -1,
      n = features.length,
      geometry,
      bounds = [{lon: Infinity, lat: Infinity}, {lon: -Infinity, lat: -Infinity}];
  while (++i < n) {
    geometry = features[i].geometry;
    if (geometry.type === 'GeometryCollection') {
        for (var j = 0; j < geometry.geometries.length; j++) {
            boundGeometry[geometry.geometries[j].type](bounds, geometry.geometries[j].coordinates);
        }
    } else {
        boundGeometry[geometry.type](bounds, geometry.coordinates);
    }
  }
  return bounds;
}

function boundPoint(bounds, coordinate) {
  var x = coordinate[0], y = coordinate[1];
  if (x < bounds[0].lon) bounds[0].lon = x;
  if (x > bounds[1].lon) bounds[1].lon = x;
  if (y < bounds[0].lat) bounds[0].lat = y;
  if (y > bounds[1].lat) bounds[1].lat = y;
}

function boundPoints(bounds, coordinates) {
  var i = -1, n = coordinates.length;
  while (++i < n) boundPoint(bounds, coordinates[i]);
}

function boundMultiPoints(bounds, coordinates) {
  var i = -1, n = coordinates.length;
  while (++i < n) boundPoints(bounds, coordinates[i]);
}

var boundGeometry = {
  Point: boundPoint,
  MultiPoint: boundPoints,
  LineString: boundPoints,
  MultiLineString: boundMultiPoints,
  Polygon: function(bounds, coordinates) {
    boundPoints(bounds, coordinates[0]); // exterior ring
  },
  MultiPolygon: function(bounds, coordinates) {
    var i = -1, n = coordinates.length;
    while (++i < n) boundPoints(bounds, coordinates[i][0]);
  }
};

var map = po.map()
    .container(svg);

var g = po.geoJson()
    .features([])
    .on('load', po.stylist()
        .attr('r', 10));

map.add(po.image()
    .url(po.url("http://a.tiles.mapbox.com/v3/tmcw.map-u5tnqr3f/{Z}/{X}/{Y}.png")));

map.add(g);

var $input = $('#input'),
    $output = $('#output'),
    $go = $('.go'),
    $lat = $('#lat'),
    $lon = $('#lon');

$('#close').click(function() {
    $('#manual').hide();
    $lat.html('');
    $lon.html('');
});

$go.click(function() {
    var geojson_content = parse($input.val(), $lon.val(), $lat.val());
    if (geojson_content.features) {
        if ($(this).data('type') === 'line') {
            geojson_content = toline(geojson_content);
        }
        if ($(this).data('type') === 'polygon') {
            geojson_content = topolygon(geojson_content);
        }
        $output.val(JSON.stringify(geojson_content, null, 4));
        g.features(geojson_content.features);
        map.extent(bounds(g.features()));
    } else {
        $('#manual').show();
        $lat.empty();
        for (var i = 0; i < geojson_content.length; i++) {
            $('<option></option>')
            .appendTo($lon)
            .text(geojson_content[i])
            .attr('value', geojson_content[i]);
        }
        $lat.html($lon.html());
    }
});

$("*:visible").live('dragenter dragover', function(event){
    $('#overlay').show();
});

$("#page").live('dragleave dragexit',function(event){
    $('#overlay').hide();
});

if (typeof(window.FileReader) !== 'undefined') {
    $('#dragdrop-enabled').show();
}

$(window).on('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();
    $('#overlay').hide();
    var f = e.originalEvent.dataTransfer.files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(e) {
        $input.val(e.target.result);
        $go.click();
    };
    reader.readAsText(f);
});
