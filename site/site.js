var map = L.mapbox.map('map', 'tmcw.map-ajwqaq7t')
    .setView([40, -74.50], 9);

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

var gjLayer = null;

$go.click(function() {
    csv2geojson.csv2geojson($input.val(), {
        lonfield: $lon.val(),
        latfield: $lat.val()
    }, function(err, geojson_content) {
        if (geojson_content.features) {
            if ($(this).data('type') === 'line') {
                geojson_content = csv2geojson.toline(geojson_content);
            }
            if ($(this).data('type') === 'polygon') {
                geojson_content = csv2geojson.topolygon(geojson_content);
            }
            $output.val(JSON.stringify(geojson_content, null, 4));
            if (gjLayer) {
                map.removeLayer(gjLayer);
                gjLayer = null;
            }
            gjLayer = L.geoJson(geojson_content.features);
            map.addLayer(gjLayer);
            map.fitBounds(gjLayer.getBounds());
        } else {
            $('#manual').show();
            $lat.empty();
            for (var i = 0; i < err.fields.length; i++) {
                $('<option></option>')
                    .appendTo($lon)
                    .text(geojson_content[i])
                    .attr('value', geojson_content[i]);
            }
            $lat.html($lon.html());
        }
    });
});

$("*:visible").live('dragenter dragover', function(event) {
    $('#overlay').show();
});

$("#page").live('dragleave dragexit',function(event) {
    $('#overlay').hide();
});

if (typeof(window.FileReader) !== 'undefined') {
    $('#dragdrop-enabled').show();
}

$('#page').on('drop', function(e) {
    console.log('here');
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
