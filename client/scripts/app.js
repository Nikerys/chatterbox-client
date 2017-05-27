// YOUR CODE HERE:

$(document).ready(function() {
  class Chatterbox {
    constructor () {
      this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/';
      this.rooms = [];
      this.currenRoom = 'All';
      this.username;
      this.messageLimit = '200';
      
    }

    init() {
     console.log('THIS: ', this);
      const usernameLocation = window.location.search.indexOf('=');
      window.app.username = window.location.search.substring(usernameLocation+1);
       console.log('initializing' + window.app.username);
      window.app.fetch();
      $('#postMessageButton').click(window.app.handlePostMessageButtonClick.bind(this));
      $('#roomSpan').on('change', window.app.handleRoomSelectionChange);
    }

    handlePostMessageButtonClick() {
      console.log('HELLO', $('#newMessage').val());
      window.app.send(window.app.createMessage($('#newMessage').val()));
      $('#newMessage').val(' ');
    }

    handleRoomSelectionChange() {
      let roomName = $('#roomsDropDownList').val();
      window.app.fetchMessagesFromRoom(roomName);
      window.app.currenRoom = roomName;
    }

    escapeChars(str) {
      if (typeof str !== 'string')
        return str+'';
    }

    renderRoomsDropDown() {
      console.log('rendering rooms dropdown with rooms',window.app.rooms.length);

      var $selectDropDown = $('<select id="roomsDropDownList">');
      $('<option>', {value: "", text: "All"}).appendTo($selectDropDown);
      window.app.rooms.filter( unfilteredRoom => typeof unfilteredRoom === 'string').forEach( room => {
        if (room === '') room = '[unamed room]';
        $('<option>', {value: room, text: room}).appendTo($selectDropDown);
      });
 
      $('#roomSpan').append($selectDropDown);
    }

    createRoomsList(message) {
      let roomname = message.roomname;
      if (!window.app.rooms.includes(roomname))
        window.app.rooms.push(roomname);
    }

    
    send(message) {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: this.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent', data);
          window.app.renderMessage(message);

        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    
    }

    fetch() {
      console.log('fetching all messages');
       $.ajax({
        url: this.server,
        type: 'GET',
        data: {order: 'createdAt', limit: this.messageLimit},
        contentType: 'application/json',
        success: function (data) {
          window.app.renderAllMessages(data.results);
          console.log('chatterbox: Successfully fetched  all messages', data);
          window.app.renderRoomsDropDown();
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to fetch all messages', data);
        }
      });
    }

    fetchMessagesFromRoom(roomname) {
      console.log('fetching messages for room ', roomname);
      window.app.clearMessages();
     
       $.ajax({
        url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages/',
        type: 'GET',
        data: {where: {roomname:roomname}, order: 'createdAt', limit: this.messageLimit},
        contentType: 'application/json',
        success: function (data) {
          console.log(`chatterbox: Successfully fetched  all messages for room ${roomname}`);
          console.log(data.results);

          window.app.renderAllMessages(data.results);
          
        },
        error: function (data) {
          console.error(`chatterbox: Failed to fetch all messages with data ${data}`);
        }
      });
    }


    clearMessages() {
      $('#chats').empty();
    }

    renderMessage(message) {
      console.log('rendering the message ', message.text);
      let $messageDiv = $('<div class="chat"></div>');

      let $newMsg = $('<span class="message"></span');
      $newMsg.text(message.text);

      let $nameSpan = $('<span class="username"></span>');
      $nameSpan.text(message.username);

       
      $($messageDiv).append($nameSpan);
      $($messageDiv).append($('<br>'));
      $($messageDiv).append($newMsg);
      $('#chats').prepend($messageDiv);
      
      window.app.createRoomsList(message);
    }

    renderAllMessages(messages) {
      console.log('rendering all Messages', messages);
      messages.forEach( message => {
        window.app.renderMessage(message);
      });
    }

    createMessage(text) {
      return {
        username: this.username,
        text: text,
        roomname: this.currenRoom
      }
    }

    deleteAllMessages() {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: this.server,
        type: 'GET',
        data: 'order=-createdAt',
        contentType: 'application/json',
        success: function (data) {
          data.results.forEach( message => {
            window.app.deleteAMessage(message.objectId);
          });
          console.log('chatterbox: Successfully fetched  all messages', data);
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to fetch all messages', data);
        }
      });
    }

    deleteAMessage(objectId) {
      $.ajax({
          // This is the url you should use to communicate with the parse API server.
          url: this.server + objectId,
          type: 'DELETE',
          contentType: 'application/json',
          success: function (data) {
            console.log('chatterbox: Successfully deleted a  message', data);
          },
          error: function (data) {
            // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
            console.error('chatterbox: Failed to delete  a messages', data);
          }
        });
    }
    
}
  window.app = new Chatterbox();
  window.app.init();

//window.app.deleteAllMessages();
//window.app.deleteAMessage("IK1tFiKfP8");
  


}); //End of document.ready




