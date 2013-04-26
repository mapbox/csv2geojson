if (typeof require !== 'undefined') {
    expect = require('expect.js');
    csv2geojson = require('../');
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
});
