var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');

exports.postVoteColor = function(req, res, next, color) {
    var color = req.params.color;
    req.assert('color', 'Cannot be blank').isIn(['red', 'green', 'blue']);
    
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.voteColor = color || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Vote information updated.' });
            res.redirect('/');
        });
    });
}

exports.postUpdateProfile = function(req, res, next) {
  };
