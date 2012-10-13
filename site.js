var $input = $('#input');
var $output = $('#output');
var $go = $('#go');
var $lat = $('#lat');
var $lon = $('#lon');

$('#close').click(function() {
    $('#manual').hide();
    $lat.html('');
    $lon.html('');
});

$go.click(function() {
    var geojson_content = parse($input.val(), $lon.val(), $lat.val());
    if (geojson_content.features) {
        $output.val(JSON.stringify(geojson_content, null, 4));
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

if (typeof(window.FileReader) == 'undefined') {
    $('#dragdrop-enabled').show();
}

$(document.body).on('drop', function(e) {
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
