// JavaScript source code
var Game = require('./model/gameModel');
var User = require('./model/userModel');
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function (app) {

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

    app.get('/userLogin/:name', function (req, res) {
        
        User.findOne({ 'username': req.params.name }, function (err, userdata) {
            if (err) res.send(err);
            else res.json(userdata);
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

    app.post('/newUser', function (req, res) {
        console.log("calling new user");
        var newUser = new User({
            username: req.body.name,
            password: req.body.pw
        })
        newUser.gameList = {};
        /*if (!req.body.username || !req.body.password) {
            console.log("name or pw not accepted");
            res.send('Username and password both required');
            return;
        }*/
        var pwHash = crypto.createHash("md5")
              .update(req.body.pw)
              .digest("hex");
        console.log("pwhash " + pwHash);
        newUser.password = pwHash;

        newUser.save(function (err) {
            if (err) res.send(err);
            res.status(200).end();
        });

    })


    app.post('/loginUser', function (req, res) {
        console.log("login user called with " + req.body.name);
        User.findOne({ 'username': req.body.name }, function (err, userdata) {
            var pwHash = crypto.createHash("md5")
              .update(req.body.pw)
              .digest("hex");
            console.log("login compare " + userdata + pwHash);
            if (userdata.password !== pwHash) {
                res.status(403).send('Incorrect Password');;
            }
            else {
                if (err) { res.send(err); }
                else { res.json(userdata); }
            }
        });
    });


    //PUT
    app.put('/gameUpdate/:gameid', function (req, res) {
        console.log("app put data: " + req.body.contentStory + req.body.contentPlayers);
        var gameid = req.params.gameid;
        var o_id = new mongoose.Types.ObjectId(gameid);
        var query = { _id: o_id };
        Game.update(query, { contentStory: req.body.contentStory, contentPlayers: req.body.contentPlayers }, function (err) {
            if (err) res.send(err);
            res.status(200).end();
        });
    });
}