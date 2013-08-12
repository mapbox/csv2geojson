if (typeof require !== 'undefined') {
    expect = require('expect.js');
    csv2geojson = require('../');
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
            csv2geojson.csv2geojson('lat,lon,name\n1,2,3', function(err, data) {
                expect(data).to.eql({
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: { name: '3', lat: '1', lon: '2' },
                        geometry: {
                            type: 'Point',
                            coordinates: [2, 1]
                        }
                    }]
                });
                done();
            });
        });

        it('custom delimiter', function(done) {
            csv2geojson.csv2geojson('lat|lon|name\n1|2|3', {
                delimiter: '|'
            }, function(err, data) {
                expect(data).to.eql({
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: { name: '3', lat: '1', lon: '2' },
                        geometry: {
                            type: 'Point',
                            coordinates: [2, 1]
                        }
                    }]
                });
                done();
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
                        properties: { name: '3', y: '1', x: '2' },
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
            csv2geojson.csv2geojson(csv2geojson.csv('lat,lon,name\n1,2,3'), function(err, data) {
                expect(data).to.eql({
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: { name: '3', lat: '1', lon: '2' },
                        geometry: {
                            type: 'Point',
                            coordinates: [2, 1]
                        }
                    }]
                });
            });
        });

        it('reports bad coordinates', function() {
            csv2geojson.csv2geojson(csv2geojson.csv('lat,lon,name\nfoo,2,3'), function(err, data) {
                expect(data).to.eql({
                    type: 'FeatureCollection',
                    features: []
                });
                expect(err).to.eql([{
                    message: 'A row contained an invalid value for latitude or longitude',
                    row: { lat: 'foo', lon: '2', name: '3' }
                }]);
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
