// JavaScript source code
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://rpadmin:rolewithit@ds013579.mlab.com:13579/rpdb');       //verbinding maken met mongo database rpdb. LET OP MONGO SERVER MOET DRAAIEN OP LOCALHOST
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

app.use(express.static('public'));

//app luistert naar requests op port 13579
app.listen(13579, function () {
    console.log('todo app on port 13579');
});

require('./app/gameDataApi')(app);
require('./app/userDataApi')(app);