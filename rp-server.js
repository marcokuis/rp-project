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

//wanneer listener een Get request ontvangt
app.get('/gameLoad', function (req, res) {
    Game.find(function (err, gamedata) {
        console.log("server call load");
        if (err) res.send(err);
        else console.log(gamedata);res.json(gamedata);
    });
});

app.post('/gameSave', function (req, res) {
    console.log("incoming at save" + req.body);

    var newGame = new Game({
        title: req.body.title,
        contentStory: req.body.story,
        contentPlayers: req.body.players
    })

    console.log("server call save");
    console.log(newGame);

    newGame.save(function (err) {
        if (err) res.send(err);
        res.status(200).end();
    });



    /*var query = { 'username': req.user.username };
    req.newData.username = req.user.username;
    MyModel.findOneAndUpdate(query, req.newData, { upsert: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send("succesfully saved");
    });*/
});