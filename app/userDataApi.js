// JavaScript source code
var User = require('./model/userModel');
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function (app) {

    //GET
    app.get('/userLogin/:name', function (req, res) {
        
        User.findOne({ 'username': req.params.name }, function (err, userdata) {
            if (err) { res.send(err); }
            else { delete userdata.password; res.json(userdata); }
        });
    });

    //POST
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
                else { res.status(200).end(); }
            }
        });
    });


    //PUT
}