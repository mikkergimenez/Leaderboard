/**
 * GET /
 * Home page.
 */
var User = require('models/User');
    
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home',
    players: {},
    //users: {}
    users: User.all()
  });
};
