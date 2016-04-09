/**
 * Created by mainadmin on 29.02.16.
 */



var express = require('express'),
    //exphbs = require('express-handlebars'),
    session = require('express-session'),
    browserify = require('browserify-middleware'),
    babelify = require('babelify'),
    //expressLess = require('express-less'),
    hbsfy = require('hbsfy');
var path = require('path');

var app = express(),
    server = require('http').Server(app);


var sessionMid = session({
    secret: '8W92p90pv7pw3KtlqeSohHj4gX8r9c',
    resave: false,
    saveUninitialized: true
});
app.use(sessionMid);

app.set('view engine', 'handlebars');
app.use('/js', browserify(__dirname + '/view/js'));
app.use('/libs', browserify(__dirname + '/view/libs'));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/html/index.html');
});

server.listen(3000);

