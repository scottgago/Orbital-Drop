// instantiate socket.io
var socket = io();
angular.module('OrbitalDrop.console', [])

.controller('ConsoleController', function ($scope, state) {

  $scope.chatRoom = []
  $scope.users;
  $scope.client;

  $.get('/api/user_profiles',function(response){
      var userId = response.id;

      $scope.client = response;
      var username = response.login;
      socket.emit('createUser', userId, username, response);
  })

  socket.on('updateUsers',function(users){
    
    $scope.users = users;
      
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
        profile: user,
        packages: [{thumb:'apple.jpg'}]
      }
    }
    $scope.users = angularUsers;
    
    $scope.$apply();// angular stupid rerender when new data hack

  })

  socket.on('refreshChat', function(value){
    console.log(value)
    $scope.chatRoom = value
    $scope.$apply();
  })

  socket.on('requestTransfer',function(response){
      var senderUserId = response.senderUserId
      var filename = response.filename
      
      /**

        user will choose accept or reject.  
        1. A decision will be emitted
        2. Accept will cause a forced get request. Reject will send a delete 
           request for file.
      */
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

  })


    $scope.sendMessage = function(message){
      var messageObj = {
        user: state.user,
        message : message
      } 
      socket.emit('sendChatMessage', messageObj)
    }
})
.factory('state', function(){
  return {
    chat : [],
    user: {},

  }
})

