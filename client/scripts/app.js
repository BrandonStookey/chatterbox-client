// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox/",
  username: window.location.search.substr(10) || "anonymous",
  room: 'lobby',
  roomList: {},
  friends: [],

  init: function() {},

  send: function(message) {
    $.ajax({
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
      success: function (data) {
        console.log('message sent:', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },

  fetch: function(roomName){
    if (roomName === undefined) {
      $.ajax({ 
        type: 'GET', 
        url: app.server, 
        data: {
          order: '-createdAt',
          limit: 20
        },
        dataType: 'json',
        success: function (data){
          $('.chat').empty();
          _.each(data.results, function(message) {
            app.addMessage(message);
            });
        },
        error: function(response) {
          console.log("chatterbox: Failed to fetch messages:", response);
        }
      });
    } else {
      $.ajax({ 
        type: 'GET', 
        url: app.server, 
        data: {
          where: JSON.stringify({roomname: roomName}),
          order: '-createdAt',
          limit: 20
        },
        dataType: 'json',
        success: function (data){
          $('.chat').empty();
          _.each(data.results, function(message) {
            app.addMessage(message);
          });
        },
        error: function(response) {
          console.log("chatterbox: Failed to fetch messages:", response);
        }
      });
    }
  },

  clearMessages: function(){
    $('.chat').empty();
  },

  addMessage: function(message){
    message.text = escape(message.text) || escape(message.message);
    if (message.text.match(/%|[0-9]+/)) {
      message.text = message.text.replace(/%|[0-9]+/g, ' ');
    }
    var timeStamp = new Date(message.createdAt);
    var date = timeStamp.getDate();
    var month = ' ' + (timeStamp.getMonth() + 1) + '/';
    var time = timeStamp.toLocaleTimeString();
    $(".chat").append('<div class="messages"><a href="#" class="username">' + message.username + '</a> ' + month + date + ' at ' + time + '<br>' + message.text + '</div>');
  },

  addRoom: function(roomName){
    $("#roomSelect").append('<option>' + roomName + '</option>');
  },

  addFriend: function(name){
    // $("#roomSelect").append('<option>' + roomName + '</option>')
    // $('.messages').css({color:'red'}).appendTo(.username);
    app.friends.push(name);
  },
  //this is our message form that allows users to submit message and prepend it to the page
  handleSubmit: function(message){
    app.send(message);
  }
};

$(document).ready(function() {
  //ADD FRIEND BUTTON
  //This allows us to click on username and add them to
  //our friends array.
  $("body").on('click', '.username', function(e){
    app.addFriend(this.innerHTML);
  });

  //USER SUBMIT MESSAGE BUTTON!
  //this will allow a user to write and submit a message to the chat
  $("body").on('click', '.submitButton', function(e){
    var msg = $('input.submit').val();
    var message = {
      username: app.username,
      text: msg,
      roomname: app.room
    };
    app.handleSubmit(message);
    $('input.submit').val('');
  });

  //NEW ROOM SUBMIT BUTTON
  //this is the button, that allows us to create a new
  //room in the room form and add it to roomSelect
  $("body").on('click', '.addRoom', function(e){
    var room = $('input.roomField').val();
    app.addRoom(room);
    $('input.roomField').val("");
  });

//SELECT ROOM BUTTON
  $("select").change(function() {
    $('.chat').empty();
    app.room = $(this).val();
    clearInterval(interval1);
    interval1 = setInterval(function() {
      app.fetch(app.room);
    }, 3000);
  });

  var interval1 = setInterval(function() {
    app.fetch();
  }, 3000);
});