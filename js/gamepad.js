

var GamePadHandler = function(){
  var buttonStatusDiv, analogicValueProgressBar, directionDiv, gamepad;
  var crossStates = buttonStates = {};

  
  var start = function(){
    buttonStatusDiv = document.querySelector("#buttonStatus");
    analogicValueProgressBar = document.querySelector("#buttonValue");
    directionDiv = document.querySelector("#direction"); 
    addEventListeners();
  };

  var addEventListeners = function(){
    window.addEventListener("gamepadconnected", function(e) {
      // now as a global var
      gamepad = e.gamepad;
      var index = gamepad.index;
      var id = gamepad.id;
      var nbButtons = gamepad.buttons.length;
      var nbAxes = gamepad.axes.length;
      console.log("Gamepad No " + index + ", with id " + id + " is connected. It has " + nbButtons + " buttons and " + nbAxes + " axes");
    });
    window.addEventListener("gamepaddisconnected", function(e) {
      var gamepad = e.gamepad;
      var index = gamepad.index;
      console.log("Gamepad No " + index + " has been disconnected");
    });
  };

  var padLoop = function(){
    scangamepads();
    checkButtons(gamepad)
    checkAxes(gamepad);
    updatePlayerPosition();
  };

  var scangamepads = function(){
    var gamepads = navigator.getGamepads();
    
    for (var i = 0; i < gamepads.length; i++) {
      if(gamepads[i])
        gamepad = gamepads[i]; 
    }
  };

  var checkButtons = function(gamepad){
    if(gamepad === undefined) return;
    if(!gamepad.connected) return;
    var appuyeSurX = false;
    var atLeastOneButtonPressed = false;
    for (var i = 0; i < gamepad.buttons.length; i++) {  
      var b = gamepad.buttons[i];

      if(b.pressed) {

        atLeastOneButtonPressed = true;
        // 15 = Droite, 14 = Gauche, 12 = Haut, 13 = Bas
        // Saut
        if (i === 0) {
          inputStates[90] = true;
          appuyeSurX = true;
        }
        if (i === 12) {
          inputStates[90] = true;
        }
        switch(i){
          // Attack
          case 2:
          inputStates[32] = true;
          break;
          // Defense
          case 1:
          inputStates.mousedown = true;
          break;
          case 15:
          inputStates[68] = true;
          break;
          case 14:
          inputStates[81] = true;
          break;
          case 13:
          inputStates[83] = true;
          break;
        }
        buttonStatusDiv.innerHTML = "Button " + i + " is pressed<br>";
        if(b.value !== undefined)
          analogicValueProgressBar.value = b.value;

      }else{
        if (i === 0) {
          inputStates[90] = false;
          appuyeSurX = false;
        }
        if(i === 12 && appuyeSurX ===false){
          inputStates[90] = false;
        }
          switch(i){
          // Attack
          case 2:
          inputStates[32] = false;
          break;
          // Defense
          case 1:
          inputStates.mousedown = false;
          break;
          case 15:
          inputStates[68] = false;
          break;
          case 14:
          inputStates[81] = false;
          break;
          case 13:
          inputStates[83] = false;
          break;
        }
      }
    }


    if(!atLeastOneButtonPressed) {
      buttonStatusDiv.innerHTML = "Aucun boutton appuyé <br>";
      analogicValueProgressBar.value = 0;
    }
  };

  var checkAxes = function(gamepad){
    if(gamepad === undefined) return;
    if(!gamepad.connected) return;

    var axisValueProgressBars = document.querySelectorAll(".axe");

    // update progress bar values
    for (var i=0; i<gamepad.axes.length; i++) {
      var progressBar = axisValueProgressBars[i];
      progressBar.innerHTML = i + ": " + gamepad.axes[i].toFixed(4);
      progressBar.setAttribute("value", gamepad.axes[i] + 1);
    }

    // Set inputStates.left, right, up, down
    inputStates.left = inputStates.right = inputStates.up = inputStates.down = false;

    // all values between [-1 and 1]
    // Horizontal detection
    if(gamepad.axes[0] > 0.3) {
      inputStates.right=true;
      inputStates.left=false;
    } else if(gamepad.axes[0] < -0.3) {
      inputStates.left=true;
      inputStates.right=false;
    } 

    // vertical detection
    if(gamepad.axes[1] > 0.3) {
      inputStates.down=true;
      inputStates.up=false;
    } else if(gamepad.axes[1] < -0.3) {
      inputStates.up=true;
      inputStates.down=false;
    } 

    inputStates.angle = Math.atan2(-gamepad.axes[1], gamepad.axes[0]);
  };

  var updatePlayerPosition = function(){
    directionDiv.innerHTML += "";
    if(inputStates.left) {
      directionDiv.innerHTML = "Moving left";
    } 
    if(inputStates.right) {
      directionDiv.innerHTML = "Moving right";
    } 
    if(inputStates.up) {
      directionDiv.innerHTML = "Moving up";
    } 
    if(inputStates.down) {
      directionDiv.innerHTML = "Moving down";
    } 
  };

  return{
    start: start,
    padLoop: padLoop
  };
};

//----------------------------------
// gamepad utility code
//----------------------------------



