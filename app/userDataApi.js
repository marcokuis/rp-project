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
        var newUser = new User({
            username: req.body.name,
            password: req.body.pw,
            games: []
        })
        /*if (!req.body.username || !req.body.password) {
            console.log("name or pw not accepted");
            res.send('Username and password both required');
            return;
        }*/
        var pwHash = crypto.createHash("md5")
              .update(req.body.pw)
              .digest("hex");
        newUser.password = pwHash;

        newUser.save(function (err) {
            if (err) res.send(err);
            res.status(200).end();
        });
    })
    
    
    app.post('/loginUser', function (req, res) {
        console.log(req.body.pw + req.body.name);
        if (typeof(req.body.pw) === "undefined" | typeof(req.body.name) === "undefined") {
            console.log('No Username or Password');
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
        User.update(query, { games: req.body.games }, function (err) {
            if (err) res.send(err);
            res.status(200).end();
            
        });
    });
}