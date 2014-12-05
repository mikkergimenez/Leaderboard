$(document).ready(function() {

  // Place JavaScript code here...
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });

  $('.vote-box').on('click', function() {
    $('.vote-box').removeClass('selected');
    $( this ).addClass('selected');
  });

  subtractOne = function() {
    time = $('.countdown-timer').html()
    if (time == 0) {
        time = 61
    }
    $('.countdown-timer').html(time - 1)
  }

  setInterval(subtractOne, 1000);
});
