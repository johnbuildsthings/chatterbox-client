// YOUR CODE HERE:
var roomName = null;
var friends = {};
var request = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function(data){
      update(data);
    },
    error: function(data){
      console.log('chatterbox: Fail to recieve data')
    }
  });
}
var once = function(array) {
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
      makeOptions(newItems);
    }
  }
}

var onceRoomName = once([]);

var update = function(data) {
  var $display = $('.display');
  var $messages = $('.message');
  var messageData = [];
  var contents = data.results;
  var roomNames = {};

  for(var i = 0; i < contents.length; i++) {
    var username = parseHTML(contents[i].username);
    var text = parseHTML(contents[i].text);
    var room = parseHTML(contents[i].roomname);
    roomNames[room] = true;
    messageData.push({username: username, text: text, room: room});
  }

  onceRoomName(Object.keys(roomNames));
  
  $display.remove();
  $('#main').append('<div class="display"> </div>')
  if(roomName === null) {
    display(messageData);
  } else {
    var roomMessage = [];
    for(var i = 0; i < messageData.length; i++) {
      if(messageData[i].room === roomName) {
        roomMessage.push(messageData[i]);
      }
    }
    display(roomMessage);
  }

};


var makeFriend = function(event){
  var username = event.target.innerText;
  friends[username] = true;
}

var display = function(array) {
  var $display = $('.display');
  for(var i = 0; i < array.length; i++) {
    var username = array[i].username;
    var text = array[i].text;
    var $text = '';
    if(friends.hasOwnProperty(username)){
      $text = "<div class='text' style='font-weight: bold'>"+text+'</div>';
    }else{
      $text = "<div class='text'>"+text+'</div>';
    }
    $display.append('<div class="message"><div class="username">'+username+'</div>'+$text+'</div>');
  }
};
$(document).on('click', '.username' , function(){makeFriend(event)});


var makeOptions = function(array){
  for(var i=0;i<array.length;i++){
    $('select').append('<option id="'+array[i]+'" value="'+array[i]+'">'+array[i]+'</option>');
  }
};


// var display = function(data){
//   var $display = $('.display');
//   var messages = $('.message');
//   var rooms = {};

//   var results = data.results;
//   if(messages.length > 100){
//     var diff = messages.length - 100;
//     for(var i=0;i<diff;i++){
//       messages[i].remove();      
//     }
//   }
//   for(var i=0;i<results.length;i++){
//     var username = parseHTML(results[i].username);
//     var text = parseHTML(results[i].text);
//     var room =  parseHTML(results[i].roomname);
//     rooms[room] = true;
//     if(room === roomName || roomName === null){
//       console.log(roomName === room);
//       // debugger;
//       $display.append('<div class="message">'+username+': <br>'+text+'</div>');
//     }
//   }
//   for(var key in rooms) {
//     var id = "#"+key.split(' ').join('');
//     // console.log(id);
//     if(document.getElementById(id) === null){
//       var option = $("<option id='"+id+"' value='"+key+"'>" + key + "</option>");
//       $("#rooms").append(option);
//     }
//   }
// }

var changeRoom = function(data){
  var selected = data.options[data.selectedIndex].value;
  roomName = selected;
  if(selected === 'New Room'){
    var newName = prompt('enter name of new room');
    var option = $("<option id='"+newName+"' value='"+newName+"''>"+newName+"</option>");
    $('#rooms').append(option);
    roomName = newName;
  }
};


var parseHTML = function(info){
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

setInterval(request,1000);


var submit = function(){
  var message = {
    username: 'BossMan',
    text: document.getElementById('userMessage').value.toString(),
    roomname: roomName
  };

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


// $.ajax({
//   // This is the url you should use to communicate with the parse API server.
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });