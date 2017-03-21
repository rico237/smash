	var username = prompt("What's your name?");
	// var username = "Rico";
	var conversation, data, datasend, users;

	var socket = io.connect();

	// on connection to server, ask for user's name with an anonymous callback
	socket.on('connect', function(){
		// call the server-side function 'adduser' and send one parameter (value of prompt)
		socket.emit('adduser', username);
		// socket.emit('adduser', prompt("What's your name?"));  
	});

	// listener, whenever the server emits 'updatechat', this updates the chat body 
	socket.on('updatechat', function (username, data) {
		var chatMessage = "<b>" + username + ":</b> " + data + "<br>";
		conversation.innerHTML += chatMessage; 
	});

    // just one player moved
    socket.on('updatepos', function (username, newPos) {
    	updatePlayerNewPos(newPos);
    });

	// listener, whenever the server emits 'updateusers', this updates the username list
	socket.on('updateusers', function(listOfUsers) {
		users.innerHTML = "";
		for(var name in listOfUsers) {
			var userLineOfHTML = '<div>' + name + '</div>';
			users.innerHTML += userLineOfHTML;
		}
	});

	// update the whole list of players, useful when a player
	// connects or disconnects, we must update the whole list
	socket.on('updatePlayers', function(listOfplayers) {
		// updatePlayers(listOfplayers);
	});

	// on load of page
	window.addEventListener("load", function(){
		// get handles on various GUI components
		conversation = document.querySelector("#conversation");
		data = document.querySelector("#data");
		datasend = document.querySelector("#datasend");
		users = document.querySelector("#users");

  		// Listener for send button
  		datasend.addEventListener("click", function(evt) {
  			sendMessage();
  		});

		// detect if enter key pressed in the input field
		data.addEventListener("keypress", function(evt) {
    		// if pressed ENTER, then send
    		if(evt.keyCode == 13) {
    			this.blur();
    			sendMessage();
    		}
    	});

  		// sends the chat message to the server
  		function sendMessage() {
  			var message = data.value;
  			data.value = "";
			// tell server to execute 'sendchat' and send along one parameter
			socket.emit('sendchat', message);
		}		
	});