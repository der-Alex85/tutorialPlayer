/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

log('app js client');

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }


  io.socket.on('user', function messageReceived(message) {
console.log(message.verb);
    switch (message.verb) {
        case 'created': log('created!!'); break;
        case 'destroyed': log('destroyed!!'); break;
        default: return;
    }
  });




  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('user', cometmessageReceivedFromServer);

    console.log(socket);


    // Subscribe to the user model classroom and instance room
    //socket.get('/user/subscribe');


    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );

  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);

function cometmessageReceivedFromServer(message){
  console.log("Here's the message: ", JSON.stringify(message));
  var userId = message.id;
  console.log('cometmessageReceivedFromServer');
  updateUserInDom(userId, message);
  
  if(message.verb !== "destroyed") {
      displayFlashActivity(message);  
  } 

}

function displayFlashActivity(message) {
  $('#chatAudio')[0].play();
  $(".navbar").after("<div class='alert alert-success'>" + message.data.name + message.data.action + "</div>");
  $(".alert").fadeOut(5000);
}

function updateUserInDom(userId, message) {
  var page = document.location.pathname;
  page = page.replace(/(\/)$/, '');
  switch(page) {
    // if we are on the user administration page
    case '/user':
      // message comming from publishUpdate
      if(message.verb === 'updated') {
        console.log('updateUserInDom');
        UserIndexPage.updateUser(userId, message);
      }
      if(message.verb === 'created') {
        UserIndexPage.addUser(message);
      }
      if(message.verb === 'destroyed') {
        UserIndexPage.destroyUser(userId);
      }

      break;
  }
}

var UserIndexPage = {
  updateUser: function(id, message){
    var userRows = $('tr[data-id="' + id + '"] td:first-child img');
    if (message.data.loggedIn) {
      $.each(userRows, function(index,value){
        userRows.attr('src', "/images/icon-online.png");  
      });
    } else {
      $.each(userRows, function(index,value){
        userRows.attr('src', "/images/icon-offline.png");  
      });
    }
  }, 
  addUser: function(user) {
    var obj = {
      user: user.data
      //,_csrf: window.overlord.csrf || ''
    };
    console.log('test jst');
    $( 'tr:last' ).after(
      
      // This is the path to the templates file
      JST['assets/templates/addUser.ejs']( obj )
    );
  }, 
  destroyUser: function(id) {
    $('tr[data-id="' + id + '"]').remove();
  }


}
