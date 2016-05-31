// instantiate socket.io
var socket = io();
angular.module('AirDrop.console', [])

.controller('ConsoleController', function ($scope, state, stateMethods) {

  /*
  All logic resides in controller because it's angular best practice
  Definition of controller from google:
    con·trol·ler
    kənˈtrōlər/Submit
    a person or thing that directs or regulates something.
  */

  /*
    http://stackoverflow.com/questions/31454488/angularjs-why-not-write-logic-in-controller
    ^Why you're wrong
  */

  $scope.chatRoom = []
  $.get('/api/user_profiles',function(response){
      var userId = response.id;
      var username = response.login;
      state.user = response
      socket.emit('createUser', userId, username);
  })

  socket.on('updateUsers',function(users){
    // change users object format into frontend object format
    var ping = document.getElementById("ping");
    ping.play();

    var angularUsers = {};
    for(var key in users){
      var user = users[key];
      // only one file for now, integrate with rex
      var file = user.files;
      angularUsers[key] = {
        id: key,
        username: user.username,
        packages: [{thumb:'apple.jpg'}]
      }
    }
    $scope.users = angularUsers;
    // angular stupid rerender when new data hack
    $scope.$apply();

  })

  socket.on('refreshChat', function(value){
    $scope.chatRoom = value
    $scope.$apply();
  })

  socket.on('requestTransfer',function(response){
      var senderUserId = response.senderUserId
      var filename = response.filename
      
      /*** user will choose accept or reject.  
      1. A decision will be emitted
      2. Accept will cause a forced get request. Reject will send a delete 
         request for file.
      ***/
      // temporarily true, let user decide
      if (confirm('We have a special package for you... Do you want it...')) {
        window.open('/files/download');
      } else {
        $.ajax({
            url: '/files',
            type: 'DELETE',
            success: function(result) {
                console.log(result, 'should be result of deletion')
            }
        });
      }
      
      
      // socket.emit('transferChoice',{
      //                 senderUserId:senderUserId,
      //                 choice:choice
      //             })

  })

  $scope.users = {
  					// "o21ij34o1ij": {
       //        id: 'o21ij34o1ij',
       //        username: 'Rex Kelly', 
  					// 	packages:[ 
  					// 				{thumb:'apple.jpg'}, 
  					// 				{thumb:'apple.jpg'}, 
  					// 				{thumb:'apple.jpg'}
  					// 	]
  					// },
  					// "o212w0k201ij": {	
       //        id: 'o212w0k201ij',
       //        username: 'Rex Kelly', 
  					// 	packages:[ 
  					// 				{thumb:'apple.jpg'}, 
  					// 				{thumb:'apple.jpg'}, 
  					// 				{thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}
  					// 	]
  					// },
  					// "o23wqei3o1ij": {	
       //        id: 'o23wqei3o1ij',
       //        username: 'Rex Kelly', 
  					// 	packages:[ 
  					// 				{thumb:'apple.jpg'}, 
  					// 				{thumb:'apple.jpg'}, 
  					// 				{thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'},
       //              {thumb:'apple.jpg'},
       //              {thumb:'apple.jpg'}, 
       //              {thumb:'apple.jpg'}
  					// 	]
  					// }
  				}


    $scope.addConnection = function( connection ){
      $scope.users[connection.id] = connection;
    }

    $scope.closeConnection = function( event ){
      // var $el = $('#' + connection.id);
      //     $el.addClass('closed');
      //     setTimeout(function(){
      //       delete $scope.users[connection.id];
      //       $el.remove();
      //     },100);
    }

    $scope.sendMessage = stateMethods.sendMessage
    $scope.toggleChatBox = stateMethods.toggleChatBox
    state.chat.showStatus = false

})
.factory('state', function(){
  return {
    chat : [],
    user: {}
  }
})
.factory('stateMethods', function(state){

  return {
    toggleChatBox : function(){

    const toggleBody   = document.getElementsByClassName("panel-body")
    const toggleFooter = document.getElementsByClassName("panel-footer")
    const toggleHeader = document.getElementsByClassName("container-chat")
    const glyph        = document.getElementById("expand")

      if(state.chat.showStatus){
        state.chat.showStatus = false
      } else {
        state.chat.showStatus = true
      }
      if(state.chat.showStatus){
        toggleBody[0].style.display = "block"
        toggleFooter[0].style.display = "block"
        toggleHeader[0].style.width = "100%"
        glyph.className = "glyphicon glyphicon-chevron-down"
      }
      if(!state.chat.showStatus){
        toggleBody[0].style.display = "none"
        toggleFooter[0].style.display = "none"
        toggleHeader[0].style.width = "50%"
        glyph.className = "glyphicon glyphicon-chevron-up"
      }
    },
    sendMessage : function(message){

      const timeStamp = (function () {
        // Create a date object with the current time
      const       now = new Date();
        // Create an array with the current month, day and time
      const      date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
        // Create an array with the current hour, minute and second
      const      time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
        // Determine AM or PM suffix based on the hour
      const    suffix = ( time[0] < 12 ) ? "AM" : "PM";
        // Convert hour from military time
              time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
        // If hour is 0, set it to 12
              time[0] = time[0] || 12;
        // If seconds and minutes are less than 10, add a zero
        for ( var i = 1; i < 3; i++ ) {
          if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
          }
        }
        // Return the formatted string
        return date.join("/") + " " + time.join(":") + " " + suffix;
      })()

      const messageObj = {
        user: state.user,
        message : message,
        created_at: timeStamp
      } 
      socket.emit('sendChatMessage', messageObj)
    }
  }
})
