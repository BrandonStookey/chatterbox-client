// YOUR CODE HERE:

var app = {
  friends: [],
  init: function() {},

  send: function(message) {
    return $.ajax({
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
    return $.ajax({
        url: app.server,
        type: 'GET',
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
  //if anythings ever breaks, it might be me
  clearMessages: function(){
    $('#chats').empty();
  },

  addMessage: function(message) {
    $("#chats").append('<div class="messages"><a href="#" class="username">' + message.username + '</a>: ' + message.text + '</div>');
  },

  addRoom: function(room) {
    $("#roomSelect").append('<div class="rooms">' + room + '</div>');
  },

  addFriend: function(name){
    this.friends.push(name);
  }

};

$(document).ready(function() {
  $("body").on('click', '.username', function(e){
    console.log("I have been clicked!");
    console.log(e);
    app.addFriend(this.innerHTML);
  });
});

// $("body").on("click", '.squareDancer', function(event){
//      //$(this).css("background-size", "1120px");
//     var topValue =$(this).position().top;
//     var leftValue = $(this).position().left;
//     var maxleft = $(this).position().left+250; //200     
//     var minleft = $(this).position().left-150;  //0
//     var maxtop = $(this).position().top+200;  //200
//     var mintop = $(this).position().top-200;  //0

//    // console.log(topValue, leftValue, maxleft,minleft,maxtop,mintop);
//     console.log($(this));
//     var arr = [];
//     var move = function(x){
//     // this.oldStep();
//     // this.$node.toggle();
//      $(x).addClass('animated infinite bounce');
//     };