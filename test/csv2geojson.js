var test = require('tape'),
    csv2geojson = require('../'),
    fs = require('fs');

function textFile(f) {
    return fs.readFileSync('./test/data/' + f, 'utf8');
}

function jsonFile(f) {
    return JSON.parse(fs.readFileSync('./test/data/' + f, 'utf8'));
}

test('csv2geojson', function(t) {
    t.test('#isLat', function(t) {
        t.test('detects latitude fields', function(t) {
            t.deepEqual(csv2geojson.isLat('latitude'), true);
            t.deepEqual(csv2geojson.isLat('lat'), true);
            t.deepEqual(csv2geojson.isLat('Lat'), true);
            t.deepEqual(csv2geojson.isLat('Latitude'), true);
            t.end();
        });
        t.test('prefixed and postfixed', function(t) {
            t.deepEqual(csv2geojson.isLat('is_lat'), true);
            t.deepEqual(csv2geojson.isLat('is_lat_field'), true);
            t.end();
        });
        t.test('does not accept false positives', function(t) {
            t.deepEqual(csv2geojson.isLat('nothingoftheabove'), false);
            t.deepEqual(csv2geojson.isLat('some other thing'), false);
            t.end();
        });
    });

    t.test('#csv', function(t) {
        t.test('handles empty input', function(t) {
            t.deepEqual(csv2geojson.csv(''), []);
            t.end();
        });

        t.test('handles simple fields', function(t) {
            t.deepEqual(csv2geojson.csv('a,b\n1,2'), [{a: '1', b: '2'}]);
            t.end();
        });
    });

    t.test('#sexagesimal', function(t) {
        t.test('degrees', function(t) {
            csv2geojson.csv2geojson(textFile('degrees.csv'), function(err, data) {
                t.deepEqual(data, jsonFile('degrees.geojson'));
                t.end();
            });
        });
        t.test('minutes', function(t) {
            csv2geojson.csv2geojson(textFile('minutes.csv'), function(err, data) {
                t.deepEqual(data, jsonFile('minutes.geojson'));
                t.end();
            });
        });
    });

    t.test('#csv2geojson', function(t) {
        t.test('handles empty input', function(t) {
            csv2geojson.csv2geojson('', function(err, data) {
                t.deepEqual(data, {
                    type: 'FeatureCollection',
                    features: []
                });
                t.end();
            });
        });

        t.test('detects lat and lon', function(t) {
            csv2geojson.csv2geojson(textFile('simple.csv'), function(err, data) {
                t.deepEqual(data, jsonFile('simple.geojson'));
                t.end();
            });
        });

        t.test('with space before columns', function(t) {
            csv2geojson.csv2geojson(textFile('space_column.csv'), function(err, data) {
                t.deepEqual(data, jsonFile('simple_space.geojson'));
                t.end();
            });
        });

        t.test('with lng instead of lon', function(t) {
            csv2geojson.csv2geojson(textFile('lng.csv'), function(err, data) {
                t.deepEqual(data, jsonFile('lng.geojson'));
                t.end();
            });
        });

        t.test('with includeLatLon option', function(t) {
            csv2geojson.csv2geojson(textFile('includeLatLon.csv'), { includeLatLon: true }, function(err, data) {
                t.deepEqual(data, jsonFile('includeLatLon.geojson'));
                t.end();
            });
        });

        t.test('delimiters', function(t) {
            t.test('|', function(t) {
                csv2geojson.csv2geojson(textFile('simple.pipe.dsv'), { delimiter: '|' },
                function(err, data) {
                    t.deepEqual(data, jsonFile('simple.geojson'));
                    t.end();
                });
            });
            t.test(',', function(t) {
                csv2geojson.csv2geojson(textFile('simple.csv'), { delimiter: ',' },
                function(err, data) {
                    t.deepEqual(data, jsonFile('simple.geojson'));
                    t.end();
                });
            });
            t.test(';', function(t) {
                csv2geojson.csv2geojson(textFile('simple.semicolon.dsv'), { delimiter: ';' },
                function(err, data) {
                    t.deepEqual(data, jsonFile('simple.geojson'));
                    t.end();
                });
            });
            t.test('tab', function(t) {
                csv2geojson.csv2geojson(textFile('simple.tsv'), { delimiter: '\t' },
                function(err, data) {
                    t.deepEqual(data, jsonFile('simple.geojson'));
                    t.end();
                });
            });
            t.test('auto', function(t) {
                ['simple.tsv', 'simple.semicolon.dsv', 'simple.csv', 'simple.pipe.dsv'].forEach(function(f) {
                    t.test('auto with ' + f, function(t) {
                        csv2geojson.csv2geojson(textFile(f), { delimiter: 'auto' },
                        function(err, data) {
                            t.deepEqual(data, jsonFile('simple.geojson'));
                            t.end();
                        });
                    });
                });

                t.test('no match', function(t) {
                    csv2geojson.csv2geojson('', { delimiter: 'auto' },
                    function(err, data) {
                        t.deepEqual(err, {
                            type: 'Error',
                            message: 'Could not autodetect delimiter'
                        });
                        t.deepEqual(data, undefined);
                        t.end();
                    });
                });
            });
        });

        t.test('#auto', function(t) {
            ['simple.tsv', 'simple.semicolon.dsv', 'simple.csv', 'simple.pipe.dsv'].forEach(function(f) {
                t.test('auto with ' + f, function(t) {
                    t.deepEqual(csv2geojson.auto(textFile(f)), jsonFile('simple.json'));
                    t.end();
                });
            });

            t.test('no match', function(t) {
                t.deepEqual(csv2geojson.auto(''), null);
                t.end();
            });
        });

        t.test('#auto->csv2geojson', function(t) {
            ['simple.tsv', 'simple.semicolon.dsv', 'simple.csv', 'simple.pipe.dsv'].forEach(function(f) {
                t.test('auto and then csv2 with ' + f, function(t) {
                    csv2geojson.csv2geojson(csv2geojson.auto(textFile(f)), function(err, data) {
                        t.deepEqual(data, jsonFile('simple.geojson'));
                        t.end();
                    });
                });
            });
        });

        t.test('toLine', function(t) {
            t.test('converts a list of points to a line', function(t) {
                csv2geojson.csv2geojson(csv2geojson.auto(textFile('line.csv')), function(err, data) {
                    t.deepEqual(csv2geojson.toLine(data), jsonFile('line.geojson'));
                    t.end();
                });
            });
        });

        t.test('toPolygon', function(t) {
            t.test('converts a list of points to a polygon', function(t) {
                csv2geojson.csv2geojson(csv2geojson.auto(textFile('polygon.csv')), function(err, data) {
                    t.deepEqual(csv2geojson.toPolygon(data), jsonFile('polygon.geojson'));
                    t.end();
                });
            });
        });

        t.test('custom field names', function(t) {
            csv2geojson.csv2geojson('y|x|name\n1|2|3', {
                delimiter: '|',
                latfield: 'y',
                lonfield: 'x'
            }, function(err, data) {
                t.deepEqual(data, {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: { name: '3' },
                        geometry: {
                            type: 'Point',
                            coordinates: [2, 1]
                        }
                    }]
                });
                t.end();
            });
        });

        t.test('accepts a parsed object', function(t) {
            csv2geojson.csv2geojson(csv2geojson.csv(textFile('simple.csv')), function(err, data) {
                t.deepEqual(data, jsonFile('simple.geojson'));
                t.end();
            });
        });

        t.test('reports bad coordinates', function(t) {
            csv2geojson.csv2geojson(csv2geojson.csv(textFile('bad_coord.csv')), function(err, data) {
                t.deepEqual(data, {
                    type: 'FeatureCollection',
                    features: []
                });
                t.deepEqual(err, jsonFile('bad_coord.error.json'));
                t.end();
            });
        });

        t.test('returns an error on not finding fields', function(t) {
            csv2geojson.csv2geojson(csv2geojson.csv('name\nfoo'), function(err, data) {
                t.deepEqual(err, {
                    type: 'Error',
                    message: 'Latitude and longitude fields not present',
                    data: [{name:'foo'}],
                    fields: ['name']
                });
                t.end();
            });
        });
    });
});
