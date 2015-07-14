// YOUR CODE HERE:
var update = function(){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function(data){
      display(data);
      console.log(data);
    },
    error: function(data){
      console.log('chatterbox: Fail to recieve data')
    }
  });
}

var display = function(data){
  var $display = $('.display');
  var messages = $('.message');
  var rooms = {};

  var results = data.results;
  if(messages.length > 100){
    var diff = messages.length - 100;
    for(var i=0;i<diff;i++){
      messages[i].remove();      
    }
  }
  for(var i=0;i<results.length;i++){
    // debugger;
    var username = parseHTML(results[i].username);
    var text = parseHTML(results[i].text);
    rooms[parseHTML(results[i].roomname)] = true;
    // console.log(rooms);
    $display.append('<div class="message">'+username+': <br>'+text+'</div>');
  }
  for(var key in rooms) {
    var id = "#"+key.split(' ').join('');
    // console.log(id);
    console.log(document.getElementById(id));
    if(document.getElementById(id) === null){
      var option = $("<option id='"+id+"'>" + key + "</option>");
      $("#rooms").append(option);
    }
  }
}

var parseHTML = function(info){
  var dangerousChars = {
    '<' : '&lt',
    '>' : '&gt',
    '&' : '&amp',
    '"' : '&quot',
    "'" : '&quot',
    '/' : '&#47'
  }
  // debugger;
  var stringInfo = String(info).split('');
  for(var i=0;i<stringInfo.length;i++){
    if(dangerousChars.hasOwnProperty(stringInfo[i])){
      stringInfo[i] = dangerousChars[stringInfo[i]];
    }
  }
  return stringInfo.join('');
}

setInterval(update,1000);

var submit = function(){
  var message = {
    username: 'BossMan',
    text: document.getElementById('userMessage').value.toString(),
    roomname: 'lobby'
  };

  console.log(message);
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