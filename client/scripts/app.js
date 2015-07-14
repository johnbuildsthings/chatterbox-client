// YOUR CODE HERE:

var app = {}
app.init = function(){};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.roomName = null;
app.friends = {};
app.fetch = function(){
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function(data){
      app.update(data);
    },
    error: function(data){
      console.log('chatterbox: Fail to recieve data')
    }
  });
}
app.once = function(array) {
  var current = array;
  return function(newArray) {
    var newItems = [];
    for(var i = 0; i < newArray.length; i++) {
      var wasFound = false;
      for(var j = 0; j < current.length; j++) {
        if(newArray[i] === current[j]) {
          wasFound = true;
        }
      }
      if(!wasFound) {
        newItems.push(newArray[i]);
        current.push(newArray[i]);
      }
    }
    if(newItems.length > 0) {
      app.addRoom(newItems);
    }
  }
}

app.onceRoomName = app.once([]);

app.clearMessages = function(){
  var $display = $('.display');
  $display.remove();
  $('#main').append('<div id="#chats" class="display"> </div>');
}


app.update = function(data) {
  var $display = $('#chats');
  var $messages = $('.message');
  var messageData = [];
  var contents = data.results;
  var roomNames = {};

  for(var i = 0; i < contents.length; i++) {
    var username = this.parseHTML(contents[i].username);
    var text = this.parseHTML(contents[i].text);
    var room = this.parseHTML(contents[i].roomname);
    roomNames[room] = true;
    messageData.push({username: username, text: text, room: room});
  }

  this.onceRoomName(Object.keys(roomNames));
  
  this.clearMessages();

  if(this.roomName === null || this.roomName === 'Main') {
    this.addMessage(messageData);
  } else {
    var roomMessage = [];
    for(var i = 0; i < messageData.length; i++) {
      if(messageData[i].room === this.roomName) {
        roomMessage.push(messageData[i]);
      }
    }
    this.addMessage(roomMessage);
  }

};


app.addFriend = function(event){
  var username = event.target.innerText;
  this.friends[username] = true;
}

app.addMessage = function(array) {
  var $display = $('.display');
  for(var i = 0; i < array.length; i++) {
    var username = array[i].username;
    var text = array[i].text;
    var $text = '';
    if(app.friends.hasOwnProperty(username)){
      $text = "<div class='text' style='font-weight: bold'>"+text+'</div>';
    }else{
      $text = "<div class='text'>"+text+'</div>';
    }
    $display.append('<div class="message"><div class="username">'+username+'</div>'+$text+'</div>');
  }
};
$(document).on('click', '.username' , function(){app.addFriend(event)});


app.addRoom = function(array){
  for(var i=0;i<array.length;i++){
    $('select').append('<option id="'+array[i]+'" value="'+array[i]+'">'+array[i]+'</option>');
  }
};


app.changeRoom = function(data){
  var selected = data.options[data.selectedIndex].value;
  this.roomName = selected;
  if(selected === 'New Room'){
    var newName = prompt('enter name of new room');
    var option = $("<option id='"+newName+"' value='"+newName+"''>"+newName+"</option>");
    $('#rooms').append(option);
    this.roomName = newName;
  }
};


app.parseHTML = function(info){
  var dangerousChars = {
    '<' : '&lt',
    '>' : '&gt',
    '&' : '&amp',
    '"' : '&quot',
    "'" : '&quot',
    '/' : '&#47'
  }
  var stringInfo = String(info).split('');
  for(var i=0;i<stringInfo.length;i++){
    if(dangerousChars.hasOwnProperty(stringInfo[i])){
      stringInfo[i] = dangerousChars[stringInfo[i]];
    }
  }
  return stringInfo.join('');
}

setInterval(app.fetch,1000);


app.buildMessage = function(){
  var username = window.location.search.split('=')[1];
  var message = {
    username: username,
    text: document.getElementById('userMessage').value.toString(),
    roomname: this.roomName
  };
  this.send(message);
}
app.send = function(message){

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      // debugger;
      console.log('chatterbox: message sent');
    },
    error: function(data){
      console.log('chatterbox: message failed to send');
    }
  })
}

