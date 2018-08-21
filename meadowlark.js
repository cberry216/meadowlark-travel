var express = require('express');
var fortune = require('./lib/fortune.js')

var app = express();

// set up handlebars view engine
var handlebars = require('express3-handlebars')
                    .create({defaultLayout: 'main'});   // by setting a default layout, main.handlebars will be the layout used, by default
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

// establish public directorys
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/about', function(req, res) {
    res.render('about', {fortune: fortune.getFortune()});
});

// custom 404 page
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + 
        app.get('port') + '; press Ctrl-C to terminate.');
});