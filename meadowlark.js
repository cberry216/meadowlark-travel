// include node modules
var express = require('express');
var fortune = require('./lib/fortune.js');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var formidable = require('formidable');

// initialize express app
var app = express();

// set up handlebars view engine
var hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    },
    partialsDir: [
        'views/partials/',
    ],
});   // by setting a default layout, main.handlebars will be the layout used, by default

// set view engine to handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// set port
app.set('port', process.env.PORT || 3000);

// establish public directories
app.use(express.static(__dirname + '/public'));

/************
| Functions |
*************/

// spoof a weather data API
function getWeatherData() {
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ]
    };
}

/*************
| Middleware |
 *************/

// show tests if the querystring contains test=1
app.use(function(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';    // ?if test=1 show tests
    next();
});

// injecting getWeatherData into res.locals.partials
app.use(function(req, res, next) {
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherData = getWeatherData();
    next();
});

// allow body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**********
| Routes |
 **********/

// route for home page
app.get('/', function(req, res) {
    res.render('home');
});

// route for about page
app.get('/about', function(req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

// route for hood river tour
app.get('/tours/hood-river', function(req, res) {
    res.render('tours/hood-river');
});

// route for oregon coast tour
app.get('/tours/oregon-coast', function(req, res) {
    res.render('tours/oregon-coast');
});

// route for request group rate
app.get('/tours/request-group-rate', function(req, res) {
    res.render('tours/request-group-rate');
});

// route for jquery-test
app.get('/jquery-test', function(req, res) {
    res.render('jquery-test');
});

// route for nursery rhyme
app.get('/nursery-rhyme', function(req, res) {
    res.render('nursery-rhyme');
});

// route for nursery rhyme ajax
app.get('/data/nursery-rhyme', function(req, res) {
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

// route for newsletter 
app.get('/newsletter', function(req, res) {
    res.render('newsletter', {csrf: 'CSRF Token goes here'}); // learn about csrf later
});

// route for thank you
app.get('/thank-you', function(req, res) {
    res.render('thank-you');
});

// route for vacation photo submission
app.get('/contest/vacation-photo', function(req, res) {
    var now = new Date();
    res.render('contest/vacation-photo', {
        year: now.getFullYear(),
        month: now.getMonth(),
    });
});

/******************
| Form Processing |
*******************/

// process sign up for newsletter
/* USED FOR 'POST' FORM */
// app.post('/process', function(req, res) {
//     console.log('Form (from querystring): ' + req.query.form);
//     console.log('CSRF token (from hidden form field): ' + req.body._csrf);
//     console.log('Name (from visible form field): ' + req.body.name);
//     console.log('Email (from visible form field): ' + req.body.email);
//     res.redirect(303, '/thank-you'); // without this, the page would remain on /process
// });
app.post('/process', function(req, res) {
    if(req.xhr || req.accepts('json,html') === 'json') { // req.accepts determines what the best way to display the data is
        // if there were an error, we would send { error: 'error description' }
        res.send({success: true});
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) { // ':year' and ':month' are route parameters (CH14)
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

/*****************
| Error Handling |
******************/

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
