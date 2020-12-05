const path = require('path');
const userModel = require('../models/userModel');

exports.view = function (req, res) {
    userModel.findOne({_id: req.params.id}, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'Finding user..',
            data: user
        });
    });
};

// Handle create user actions
exports.new = function (req, res) {
    var user = new userModel();
    user.email = req.body.email;
    user.password = req.body.password;
    user.nickname = req.body.nickname;
    user.tribe = req.body.tribe;
    user.population = req.body.population;
    user.capital = req.body.capital;

    user.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'User created',
                data: user
            });
        }
    });
};

exports.update = function (req, res) {
    userModel.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        
        user.email = req.body.email;
        user.password = req.body.password;
        user.nickname = req.body.nickname;
        user.tribe = req.body.tribe;
        user.population = req.body.population;
        user.capital = req.body.capital;

        user.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'User info updated',
                data: user
            });
        });
    });
};

exports.delete = function (req, res) {
    userModel.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'User deleted',
            data: user,
        });
    });
};
