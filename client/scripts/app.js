// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox/",
  username: window.location.search.substr(10) || "anonymous",
  chat: $('.chat'),
  roomList: {},
  // define room
  friends: [],
  // implement init
  init: function() {
    // check room
    // load messages
  },

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

  // add argument to fetch to distinguish room
  fetch: function(roomName){
    var currentDate = new Date().toISOString();
  // set up so that each time fetch is called, date is updated
    $.ajax({ 
      type: 'GET', 
      url: app.server, 
      data: {
        roomname: roomName || 'lobby',
        order: '-createdAt',
        limit: 20
      },
      dataType: 'json',
      success: function (data){
        var room;
        $('.chat').empty();
        _.each(data.results, function(message) {
          app.addMessage(message);
          room = message.roomname;
          if (!app.roomList[room]) {
            app.addRoom(room);
            app.roomList[room] = true;
          }
        });
      },
      error: function(response) {
        console.log("chatterbox: Failed to fetch messages:", response);
      }
    });
  },

  clearMessages: function(){
    $('.chat').empty();
  },

  addMessage: function(message){
    message.text = escape(message.text) || escape(message.message);
    if (message.text.match(/%/g) !== undefined) {
      message.text.replace(/%/g, ' ');
    }
    var timeStamp = new Date(message.createdAt);
    var date = timeStamp.getDate();
    var month = ' ' + (timeStamp.getMonth() + 1) + '/';
    var time = timeStamp.toLocaleTimeString();
    $(".chat").append('<div class="messages"><a href="#" class="username">' + message.username + '</a> ' + month + date + ' at ' + time + '<br>' + message.text + '</div>');
  },
  // selectRoom: function(){
  //   <#roomSelect option> 
  // }
  // change up functionality - add to roomSelect as "option"
  addRoom: function(roomName){
    $("#roomSelect").append('<option>' + roomName + '</option>');
  },

  addFriend: function(name){
    app.friends.push(name);
  },
  //this is our message form that allows users to submit message and prepend it to the page
  handleSubmit: function(message){
    // app.addMessage(message);
    // delete message.createdAt;
    app.send(message);
  }
};

$(document).ready(function() {
  //ADD FRIEND BUTTON
  ///This allows us to click on username and add them to
  //our firends array.
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
      room: "lobby"
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
    setInterval(function() {
      app.fetch($(this).val());
    }, 3000);
  });

  setInterval(function() {
    app.fetch();
  }, 3000);
});