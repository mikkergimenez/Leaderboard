$(document).ready(function() {

  // Place JavaScript code here...
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });

  $('.vote-box').on('click', function() {
    $('.vote-box').removeClass('selected');
    color = $( this ).data('color');
    url = '/vote/color/' + color,
    console.log(url)
    $( this ).addClass('selected');
    $.post(url, function() {
      console.log('Voted ' + color);
    });
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
