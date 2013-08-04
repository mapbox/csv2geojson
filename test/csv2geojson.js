if (typeof require !== 'undefined') {
    expect = require('expect.js');
    csv2geojson = require('../index');
}

describe('csv2geojson', function() {
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
            expect(csv2geojson.csv2geojson('')).to.eql({
                type: 'FeatureCollection',
                features: []
            });
        });

        it('detects lat and lon', function() {
            expect(csv2geojson.csv2geojson('lat,lon,name\n1,2,3')).to.eql({
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

        it('accepts a parsed object', function() {
            expect(csv2geojson.csv2geojson(csv2geojson.csv('lat,lon,name\n1,2,3'))).to.eql({
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

        it('returns an error on not finding fields', function() {
            expect(csv2geojson.csv2geojson(csv2geojson.csv('name\nfoo'))).to.eql({
                type: 'Error',
                message: 'Latitude and longitude fields not present',
                data: [{name:'foo'}]
            });
        });
    });
});
