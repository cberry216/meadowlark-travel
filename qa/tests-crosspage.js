var Browser = require('zombie'),
    assert = require('assert');

var browser; // instantiate zombie browser

browser = new Browser(); 

describe('Cross-Page Tests', function() {

    // executed before each test
    beforeEach(function() {
        browser = new Browser();
    });

    it('requesting a group rate quote from the hood river tour page ' +
        'should populate the referrer field', function() {
        var referrer = 'http://localhost:3000/tours/hood-river';
        browser.visit(referrer, function() {
            browser.clickLink('.requestGroupRate', function(done) {
                assert.equal(browser.field('referrer').value, referrer);
                done();
            });
        });
    });

    it('requesting a group rate quote from the oregon coast tour page ' + 
        'should populatte the referrer field', function() {
        var referrer = 'http://localhost:3000/tours/oregon-coast';
        browser.visit(referrer, function() {
            browser.clickLink('.requestGroupRate', function(done) {
                assert.equal(browser.field('referrer').value, referrer);
                done();
            });
        });
    });

    it('visiting the "request group rate" page should directly result ' +
        'in an empty referrer field', function() {
        browser.visit('http://localhost:3000/tours/request-group-rate', function() {
            assert.equal(browser.field('referrer').value, '');
        });
    });
});

// suite('Cross-Page Tests', function() {

//     // executed before each test
//     setup(function() {
//         browser = new Browser(); // init zombie browser
//     });

//     test('requesting a group rate quote from the hood river tour page ' +
//             'should populate the referrer field', function() {
//         var referrer = 'http://localhost:3000/tours/hood-river';
//         browser.visit(referrer, function() {
//             browser.clickLink('.requestGroupRate', function(done) {
//                 assert(browser.field('referrer').value === referrer);
//                 done();
//             });
//         });
//     });

//     test('requesting a group rate quote from the oregon coast tour page ' +
//             'should populate the referrer field', function() {
//         var referrer = 'http://localhost:3000/tours/oregon-coast';
//         browser.visit(referrer, function() {
//             browser.clickLink('.requestGroupRate', function(done) {
//                 assert(browser.field('referrer').value === referrer);
//                 done();
//             });
//         });
//     });

//     test('visiting the "request group rate" page should directly result ' +
//             'in an empty referrer field', function() {
//         browser.visit('http://localhost:3000/tours/request-group-rate', function() {
//             assert(browser.field('referrer').value === '');
//         });
//     });
// });