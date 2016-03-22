 // JavaScript source code
var User = require('./model/userModel');
var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports = function (app) {

    //GET
    app.get('/', function(request, response) {
        response.redirect('/rpproject');
    });

    app.get('/rpproject', function (request, response) {
        res.sendfile('rpproject.html');
    });
    
    app.get('/userLogin/:id', function (req, res) {
        
        User.findOne({ '_id': req.params.id }, function (err, userdata) {
            if (err) { res.send(err); }
            else { delete userdata.password; res.json(userdata); }
        });
    });

    app.get('/userGetInfo/:name', function (req, res) {

        User.findOne({ 'username': req.params.name }, function (err, userdata) {
            if (err) { res.send(err); }
            else { delete userdata.password; res.json(userdata); }
        });
    });

    //POST
    app.post('/newUser', function (req, res) {
        if (typeof(req.body.pw) === "undefined" | typeof(req.body.name) === "undefined") {
            alert('Missing Username or Password!');
            res.status(404).end();
        }
        else{
            var newUser = new User({
                username: req.body.name,
                password: req.body.pw,
                games: []
            })

            var pwHash = crypto.createHash("md5")
                  .update(req.body.pw)
                  .digest("hex");
            newUser.password = pwHash;

            newUser.save(function (err) {
                if (err) res.send(err);
                res.status(200).end();
            });
        }
    })
    
    
    app.post('/loginUser', function (req, res) {
        if (typeof(req.body.pw) === "undefined" | typeof(req.body.name) === "undefined") {
            alert('Missing Username or Password!');
                res.status(404).end();
        }
        else{
            User.findOne({ 'username': req.body.name }, function (err, userdata) {
                var pwHash = crypto.createHash("md5")
                    .update(req.body.pw)
                    .digest("hex");

                if (userdata === null){
                    res.status(404).send('Incorrect Username');
                }
                else if (userdata.password !== pwHash) {
                    res.status(401).send('Incorrect Password');
                }
                else {
                    if (err) { res.send(err); }
                    else { res.status(200).end(); }
                }
            });
        }
    });


    //PUT
    app.put('/userJoin/:userid', function (req, res) {
        var userid = req.params.userid;
        var u_id = new mongoose.Types.ObjectId(userid);
        var query = { _id: u_id };
        User.findOne(query).exec(function (err, tempuser) {
            tempuser.games.push(req.body);
            tempuser.save(function (err) {
                if (err) { res.send(err); }
                else { res.status(200).end(); }
            });
        });
    });
    
    app.put('/notesEquipmentUpdate/:userid', function (req,res){
        var userid = req.params.userid;
        var u_id = new mongoose.Types.ObjectId(userid);
        var query = { _id: u_id };
        User.findOne(query).exec(function (err, tempuser) {
            var gamesArray = tempuser.games;
            for (i = 0; i < gamesArray.length; i++) {
                if (gamesArray[i].id === req.body.id) {
                    gamesArray[i] = req.body;
                }
            }
            tempuser.games = gamesArray;
            tempuser.markModified('games');
            tempuser.save(function (err) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.status(200).end();
                }
            });
        });
    });
}