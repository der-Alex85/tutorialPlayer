$(document).ready(function() {


	var socket = io.connect();
  if (typeof console !== 'undefined') {
    console.log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {
		console.log('socket.on connect');

		io.socket.get('/foliensatz/subscribe');

		io.socket.on('foliensatz', function(obj){
      if (obj.verb == 'created') {
         var data = obj.data;
         console.log('User '+data.name+' has been created.');
         console.log('connect > foliensatz > created');
      } else {
      	console.log('blabla');
      }
    });

	});


/*
	io.socket.get('/hello', function serverResponded (body, JWR) {

      // JWR ==> "JSON WebSocket Response"
      console.log('Sails responded with: ', body);
      console.log('with headers: ', JWR.headers);
      console.log('and with status code: ', JWR.statusCode);

      // first argument `body` === `JWR.body`
      // (just for convenience, and to maintain familiar usage, a la `JQuery.get()`)
  });
*/

});