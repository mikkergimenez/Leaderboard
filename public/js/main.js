$(document).ready(function() {

  // Place JavaScript code here...
  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });

  $('.vote-box').on('click', function() {
    
    $('.vote-box').removeClass('selected');
    $('.vote-box').each(function(index) {
      that = this;
      console.log(that);
      this_color = $ ( that ).data('color');
      $( that ).html('<center><h2>Vote ' + this_color + '</h2></center>');
    });

    color = $( this ).data('color');

    url = '/vote/color/' + color,
    console.log(url)
    $( this ).addClass('selected');
    $( this ).html('<center><h2>Voting ' + color + '</h2></center>');
    
    csrf = $("meta[name=csrf-token]").attr("content");
    console.log("CSRF: " + csrf);
    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-CSRF-Token", csrf);
      }
    });

    
    xhr = $.post(url, function() {
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
