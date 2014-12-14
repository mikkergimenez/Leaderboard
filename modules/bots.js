module.exports.setUpDummyUsers = function() {
  var Users = require('./models/User');
  
  for (i = 1; i <= 100; i++) { 
    User.findOneOrCreate({ name: 'Bot'+i }, { name: 'Bot'+i, points: 0 }, function(err, person) {
      console.log(person);
    });
    text += cars[i] + "<br>";
  }
  
}


get_random_color = function() {
  colors = ['red', 'blue', 'green']
  rand_int = Math.floor((Math.random() * 3));
  if (rand_int > 2( {
    rand_int = 2;
  }
  if (rand_int < 0) {
    rand_int = 0;
  }
  return colors[rand_int]
}

runBotLogicOne = function(winColor, loseColor) {
  // if bot one loses he will change, if he wins he will stay the same
  for (i = 1; i <= 33; i++) { 
    bot = User.findOne({ name: 'Bot'+i })
    if (bot.voteColor == loseColor) {
      bot.voteColor = winColor;
    }
    if (bot.voteColor != winColor && bot.voteColor != loseColor) {
      bot.voteColor = get_random_color();
    }
    bot.save()
  }
}

runBotLogicTwo = function(winColor, loseColor) {
  // if bot two wins he will change, if he loses he will stay the same
  for (i = 34; i <= 66; i++) {
    bot = User.findOne({ name: 'Bot'+i })
    if (bot.voteColor == winColor) {
      bot.voteColor = loseColor;
    }
    if (bot.voteColor != winColor && bot.voteColor != loseColor) {
      bot.voteColor = get_random_color();
    }
  }
}

runBotLogicThree = function(winColor, loseColor) {
  // bot three will always change randomly
  for (i = 67; i <= 100; i++) { 
    bot = User.findOne({ name: 'Bot'+i })
    
    bot.voteColor = get_random_color();
  }
}

module.exports.runBotLogic = function(winColor, loseColor) {
    runBotLogicOne(winColor);
    runBotLogicTwo(winColor);
    runBotLogicThree(winColor);
}