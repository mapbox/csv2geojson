var expect = require('expect.js'),
    csv2geojson = require('../'),
    fs = require('fs');

function textFile(f) {
    return fs.readFileSync('./test/data/' + f, 'utf8');
}

function jsonFile(f) {
    return JSON.parse(fs.readFileSync('./test/data/' + f, 'utf8'));
}

describe('csv2geojson', function() {
    describe('#isLat', function() {
        it('detects latitude fields', function() {
            expect(csv2geojson.isLat('latitude')).to.eql(true);
            expect(csv2geojson.isLat('lat')).to.eql(true);
            expect(csv2geojson.isLat('Lat')).to.eql(true);
            expect(csv2geojson.isLat('Latitude')).to.eql(true);
        });
        it('prefixed and postfixed', function() {
            expect(csv2geojson.isLat('is_lat')).to.eql(true);
            expect(csv2geojson.isLat('is_lat_field')).to.eql(true);
        });
        it('does not accept false positives', function() {
            expect(csv2geojson.isLat('nothingoftheabove')).to.eql(false);
            expect(csv2geojson.isLat('some other thing')).to.eql(false);
        });
    });

    describe('#csv', function() {
        it('handles empty input', function() {
            expect(csv2geojson.csv('')).to.eql([]);
        });

        it('handles simple fields', function() {
            expect(csv2geojson.csv('a,b\n1,2')).to.eql([{a: '1', b: '2'}]);
        });
    });

    describe('#sexagesimal', function() {
        it('degrees', function(done) {
            csv2geojson.csv2geojson(textFile('degrees.csv'), function(err, data) {
                expect(data).to.eql(jsonFile('degrees.geojson'));
                done();
            });
        });
        it('minutes', function(done) {
            csv2geojson.csv2geojson(textFile('minutes.csv'), function(err, data) {
                expect(data).to.eql(jsonFile('minutes.geojson'));
                done();
            });
        });
    });

    describe('#csv2geojson', function() {
        it('handles empty input', function() {
            csv2geojson.csv2geojson('', function(err, data) {
                expect(data).to.eql({
                    type: 'FeatureCollection',
                    features: []
                });
            });
        });

        it('detects lat and lon', function(done) {
            csv2geojson.csv2geojson(textFile('simple.csv'), function(err, data) {
                expect(data).to.eql(jsonFile('simple.geojson'));
                done();
            });
        });

        it('with space before columns', function(done) {
            csv2geojson.csv2geojson(textFile('space_column.csv'), function(err, data) {
                expect(data).to.eql(jsonFile('simple_space.geojson'));
                done();
            });
        });

        it('with lng instead of lon', function(done) {
            csv2geojson.csv2geojson(textFile('lng.csv'), function(err, data) {
                expect(data).to.eql(jsonFile('lng.geojson'));
                done();
            });
        });

        it('with includeLatLon option', function(done) {
            csv2geojson.csv2geojson(textFile('includeLatLon.csv'), { includeLatLon: true }, function(err, data) {
                expect(data).to.eql(jsonFile('includeLatLon.geojson'));
                done();
            });
        });

        describe('delimiters', function() {
            it('|', function(done) {
                csv2geojson.csv2geojson(textFile('simple.pipe.dsv'), { delimiter: '|' },
                function(err, data) {
                    expect(data).to.eql(jsonFile('simple.geojson'));
                    done();
                });
            });
            it(',', function(done) {
                csv2geojson.csv2geojson(textFile('simple.csv'), { delimiter: ',' },
                function(err, data) {
                    expect(data).to.eql(jsonFile('simple.geojson'));
                    done();
                });
            });
            it(';', function(done) {
                csv2geojson.csv2geojson(textFile('simple.semicolon.dsv'), { delimiter: ';' },
                function(err, data) {
                    expect(data).to.eql(jsonFile('simple.geojson'));
                    done();
                });
            });
            it('tab', function(done) {
                csv2geojson.csv2geojson(textFile('simple.tsv'), { delimiter: '\t' },
                function(err, data) {
                    expect(data).to.eql(jsonFile('simple.geojson'));
                    done();
                });
            });
            describe('auto', function() {
                ['simple.tsv', 'simple.semicolon.dsv', 'simple.csv', 'simple.pipe.dsv'].forEach(function(f) {
                    it('auto with ' + f, function(done) {
                        csv2geojson.csv2geojson(textFile(f), { delimiter: 'auto' },
                        function(err, data) {
                            expect(data).to.eql(jsonFile('simple.geojson'));
                            done();
                        });
                    });
                });

                it('no match', function(done) {
                    csv2geojson.csv2geojson('', { delimiter: 'auto' },
                    function(err, data) {
                        expect(err).to.eql({
                            type: 'Error',
                            message: 'Could not autodetect delimiter'
                        });
                        expect(data).to.eql(undefined);
                        done();
                    });
                });
            });
        });

        describe('#auto', function() {
            ['simple.tsv', 'simple.semicolon.dsv', 'simple.csv', 'simple.pipe.dsv'].forEach(function(f) {
                it('auto with ' + f, function() {
                    expect(csv2geojson.auto(textFile(f))).to.eql(jsonFile('simple.json'));
                });
            });

            it('no match', function() {
                expect(csv2geojson.auto('')).to.eql(null);
            });
        });

        describe('#auto->csv2geojson', function() {
            ['simple.tsv', 'simple.semicolon.dsv', 'simple.csv', 'simple.pipe.dsv'].forEach(function(f) {
                it('auto and then csv2 with ' + f, function(done) {
                    csv2geojson.csv2geojson(csv2geojson.auto(textFile(f)), function(err, data) {
                        expect(data).to.eql(jsonFile('simple.geojson'));
                        done();
                    });
                });
            });
        });

        describe('toLine', function() {
            it('converts a list of points to a line', function(done) {
                csv2geojson.csv2geojson(csv2geojson.auto(textFile('line.csv')), function(err, data) {
                    expect(csv2geojson.toLine(data)).to.eql(jsonFile('line.geojson'));
                    done();
                });
            });
        });

        describe('toPolygon', function() {
            it('converts a list of points to a polygon', function(done) {
                csv2geojson.csv2geojson(csv2geojson.auto(textFile('polygon.csv')), function(err, data) {
                    expect(csv2geojson.toPolygon(data)).to.eql(jsonFile('polygon.geojson'));
                    done();
                });
            });
        });

        it('custom field names', function(done) {
            csv2geojson.csv2geojson('y|x|name\n1|2|3', {
                delimiter: '|',
                latfield: 'y',
                lonfield: 'x'
            }, function(err, data) {
                expect(data).to.eql({
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
                done();
            });
        });

        it('accepts a parsed object', function() {
            csv2geojson.csv2geojson(csv2geojson.csv(textFile('simple.csv')), function(err, data) {
                expect(data).to.eql(jsonFile('simple.geojson'));
            });
        });

        it('reports bad coordinates', function() {
            csv2geojson.csv2geojson(csv2geojson.csv(textFile('bad_coord.csv')), function(err, data) {
                expect(data).to.eql({
                    type: 'FeatureCollection',
                    features: []
                });
                expect(err).to.eql(jsonFile('bad_coord.error.json'));
            });
        });

        it('returns an error on not finding fields', function() {
            csv2geojson.csv2geojson(csv2geojson.csv('name\nfoo'), function(err, data) {
                expect(err).to.eql({
                    type: 'Error',
                    message: 'Latitude and longitude fields not present',
                    data: [{name:'foo'}],
                    fields: ['name']
                });
            });
        });
    });
});
