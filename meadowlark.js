// include node modules
var express = require('express');
var fortune = require('./lib/fortune.js')
var handlebars = require('express3-handlebars');

// initialize express app
var app = express();

// set up handlebars view engine
handlebars.create({defaultLayout: 'main'});   // by setting a default layout, main.handlebars will be the layout used, by default

// set view engine to handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set port
app.set('port', process.env.PORT || 3000);

// establish public directories
app.use(express.static(__dirname + '/public'));

/**********
 | Routes |
 **********/

// route for home page
app.get('/', function(req, res) {
    res.render('home');
});

// route for about page
app.get('/about', function(req, res) {
    res.render('about', {fortune: fortune.getFortune()});
});

// route custom 404 page
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// route custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// start listening to connections
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + 
        app.get('port') + '; press Ctrl-C to terminate.');
});