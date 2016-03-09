// JavaScript source code
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/rpdb');       //verbinding maken met mongo database rpdb. LET OP MONGO SERVER MOET DRAAIEN OP LOCALHOST
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json

app.use(express.static('public'));

//app luistert naar requests op port 3000
app.listen(3000, function () {
    console.log('todo app on port 3000');
});

//schema hoe game data verwerkt moet worden in mongo
var gameSchema = new mongoose.Schema({
    title: {type: String, default: ""},
    contentStory: { type: String, default: "" },
    contentPlayers: { type: Array, default: [] }
});

//model van bovenstaand schema
var Game = mongoose.model('Game', gameSchema);

// --------------------------- REST API FUNCTIONS -----------------------------------

//GET
app.get('/gamesLoad', function (req, res) {
    Game.find({}, '_id title', function (err, gamedata) {
        if (err) res.send(err);
        else res.json(gamedata);
    });
});

app.get('/gameLoad/:gameid', function (req, res) {
    var gameid = req.params.gameid;
    var o_id = new mongoose.Types.ObjectId(gameid);
    Game.findOne({ '_id': o_id }, function (err, gamedata) {
        if (err) res.send(err);
        else res.json(gamedata);
    });
});

//POST
app.post('/gameSave', function (req, res) {

    var newGame = new Game({
        title: req.body.title,
        contentStory: req.body.story,
        contentPlayers: req.body.players
    })

    newGame.save(function (err) {
        if (err) res.send(err);
        res.status(200).end();
    });
});

//PUT
app.put('/gameUpdate/:gameid', function (req, res) {
    console.log("app put data: " + req.body.story + req.body.players);
    var gameid = req.params.gameid;
    var o_id = new mongoose.Types.ObjectId(gameid);
    var query = {_id: o_id };
    Game.update(query, { contentStory: req.body.story, contentPlayers: req.body.players }, function (err) {
        if (err) res.send(err);
        res.status(200).end();
    });
})