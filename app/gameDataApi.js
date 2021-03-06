// JavaScript source code
var Game = require('./model/gameModel');
var mongoose = require('mongoose');

module.exports = function (app) {

    //GET
    app.get('/gamesLoad', function (req, res) {
        Game.find({}, '_id title', function (err, gamedata) {
            if (err) { res.send(err); }
            else { res.json(gamedata); }
        });
    });

    app.get('/gameLoad/:gameid', function (req, res) {
        var gameid = req.params.gameid;
        var o_id = new mongoose.Types.ObjectId(gameid);
        Game.findOne({ '_id': o_id }, function (err, gamedata) {
            if (err) { res.send(err); }
            else { res.json(gamedata); }
        });
    });

    //POST
    app.post('/gameSave', function (req, res) {

        var newGame = new Game({
            title: req.body.title,
            contentStory: req.body.story,
            contentPlayers: req.body.players,
            positions: ["GM", "1", "2", "3", "4", "5", "6"]
        })

        newGame.save(function (err) {
            if (err) { res.send(err); }
            else { res.status(200).end(); }
        });
    });
    
    //PUT
    app.put('/gameUpdate/:gameid', function (req, res) {
        var gameid = req.params.gameid;
        var o_id = new mongoose.Types.ObjectId(gameid);
        var query = { _id: o_id };
        Game.update(query, {
            contentStory: req.body.contentStory,
            contentPlayers: req.body.contentPlayers,
            positions: req.body.positions
        }, function (err) {
            if (err) { res.send(err); }
            else { res.status(200).end(); }
        });
    });
}