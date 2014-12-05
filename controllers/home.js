/**
 * GET /
 * Home page.
 */
var User = require('../models/User');
    
exports.index = function(req, res) {
  User.find(function(err, users) {
    console.log(users);
    res.render('home', {
        title: 'Home',
        players: {},
        //users: {}
        users: users
    });  
  });
};
