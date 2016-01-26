// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox/",

  friends: [],

  init: function() {},

  send: function(message) {
    $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },

  fetch: function(){
    var currentDate = new Date().toISOString();
    $.ajax({ 
      type: 'GET', 
      url: this.server, 
      data: {
        where: JSON.stringify({
          createdAt: {
            $gte: {
              __type: "Date", 
              iso: '2016-01-26T05:00:00.000Z'
            }
          }
        }),
        limit: 20, 
        order: "createdAt"}, 
      dataType: 'json',
      success: function (data){
        console.log(data);
        _.each(data.results, function(message) {
          app.addMessage(message);
        });
      }
    });
  },

  clearMessages: function(){
    $('.chat').empty();
  },

  addMessage: function(message){
    message.text = message.text || message.message;
    var timeStamp = new Date(message.createdAt);
    var date = timeStamp.getDate();
    var month = ' ' + (timeStamp.getMonth() + 1) + '/';
    var time = timeStamp.toLocaleTimeString();
    $(".chat").prepend('<div class="messages"><a href="#" class="username">' + message.username + '</a> ' + month + date + ' at ' + time + '<br>' + message.text + '</div>');
  },

  addRoom: function(roomName){
    $("#roomSelect").append('<option>' + roomName + '</option>');
  },

  addFriend: function(name){
    this.friends.push(name);
  },

  handleSubmit: function(message){
    this.send(message);
  }

};

$(document).ready(function() {
  $("body").on('click', '.username', function(e){
    app.addFriend(this.innerHTML);
  });

  $("body").on('submit', function(e){
    console.log('clicked');
    app.handleSubmit($('#message').val());
  });

  $("body").on('click', '.updates', function(){
    app.fetch();
  });

  $("body").on('click', '.addRoom', function(e){
    var room = $('input.roomField').val();
    app.addRoom(room);
    $('input.roomField').val("");
  });
});





