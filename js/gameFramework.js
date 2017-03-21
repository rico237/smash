var plateformePrincipale; // Grande plateforme du bas
var players = [];
var petitePlateformes = [];
var inputStates = [];

var GF = function(){
  var canvas, ctx, w, h, fpsContainer, lastTime;  
  var frameCount = fps = delta = 0;
  var oldTime = performance.now();
  var debug = true;
  var nbrJoueurs = 2;
  var numJoueurSurPlateforme = 1;
  var zoneAttackPlateau = {};
  var gameStates = {
    mainMenu: 0,
    gameRunning: 1,
    gameOver: 2
  };

  var currentGameState = gameStates.gameRunning;
  var currentLevel = 1;

  var gamePadHandler = new GamePadHandler();
  gamePadHandler.start();

  var ajoutDesListeners = function(){
    // Mouse event listeners
    canvas.addEventListener('mousemove', function (evt) {
      inputStates.mousePos = getMousePos(evt);
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
      inputStates.mousedown = true;
      inputStates.mouseButton = evt.button;
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
      inputStates.mousedown = false;
    }, false); 
    // Bouton enfoncé
    window.addEventListener('keydown', handleKeydown, false);
    // Bouton relaché
    window.addEventListener('keyup', handleKeyup, false);
    // window.addEventListener('resize', function(event){start();});
  };
  var chooseRespawn = function(plateforme){
    var plat = plateforme.physicalPlateforme;
    var minX, maxX;
    // 1 = spawn coté gauche & 0 = coté droit
    if (numJoueurSurPlateforme%2 == 1) {
      minX = plat.x+50;
      maxX = canvas.width/2;
    }else if(numJoueurSurPlateforme%2 == 0){
      minX = canvas.width/2;
      maxX = plat.x + plat.width - 50;
    }
    var minY = plat.y-100;
    return{
      x: parseInt(Math.random()*(maxX - minX) + minX),
      y: parseInt(Math.random()*(200+10 - minY) + minY)
    };
  };
  var init = function(){
    canvas = document.querySelector("#myCanvas");
    var canvasContainer = document.querySelector("#canvasContainer");
    var sideBarDiv = document.querySelector('#sideChat');
    fpsContainer = document.querySelector('#fps-count');
    // canvas.width = w =  canvasContainer.offsetWidth-30; // 30 is for padding
    // canvas.height = h = canvas.width/1.2;
    canvas.width = w = 770;
    canvas.height = h = 640;
    sideBarDiv.style.height = canvas.height-79-15+"px";
    ctx = canvas.getContext('2d'); 
    clearCanvas();
    initElements();
    ajoutDesListeners();
  };
  var initElements = function(){
    var plateformeWidth = 140; var plateformeHeight = 25;
    plateformePrincipale = new PlateformePrincipale(canvas.width, canvas.height, 487, 188);
    plateformeSecondaireGauche = new PlateformeSecondaire(170, 370, plateformeWidth, plateformeHeight, "gauche");
    plateformeSecondaireMilieu = new PlateformeSecondaire(canvas.width/2-(plateformeWidth/2), canvas.height/2-(plateformeHeight/2), plateformeWidth, plateformeHeight, "milieu");
    plateformeSecondaireDroite = new PlateformeSecondaire(450, 370, plateformeWidth, plateformeHeight, "droite");

    petitePlateformes.push(plateformeSecondaireGauche);
    petitePlateformes.push(plateformeSecondaireMilieu);
    petitePlateformes.push(plateformeSecondaireDroite);

    zoneAttackPlateau={x:0, y:170, width:canvas.width, height:plateformePrincipale.y-150};

    for (var i = 1; i <= nbrJoueurs; i++) {
      var spawn = chooseRespawn(plateformePrincipale);
      var didAdd = addPlayer(new Champion(spawn.x,spawn.y, numJoueurSurPlateforme));
      if (didAdd) console.log("Joueur "+ i +" ajouté avec success");
    }
  };
  var restartGame = function(){
    players = [];
    numJoueurSurPlateforme=1;
    init();
    currentGameState = gameStates.gameRunning;
  };
  var addPlayer = function (player){
    if (players.length<2) {
      numJoueurSurPlateforme++;
      players.push(player);
      return true;
    }
    return false;
  };
  var handleKeydown = function (evt){inputStates[evt.keyCode] = true;/*console.log(evt.keyCode)*/};
  var handleKeyup = function (evt) {inputStates[evt.keyCode] = false;};
  var measureFPS = function(newTime){
    // test for the very first invocation
    if(lastTime === undefined) {
      lastTime = newTime; 
      return;
    }
    //calculate the difference between last & current frame
    var diffTime = newTime - lastTime; 
    if (diffTime >= 1000) {
      fps = frameCount;    
      frameCount = 0;
      lastTime = newTime;
    }
    fpsContainer.innerHTML = 'FPS: ' + fps; 
    frameCount++;
  };
  var gameOver = function(){
    clearCanvas();
    ctx.save();
    ctx.font="50px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("Game Over !", canvas.width/2, canvas.height/2);
    ctx.fillText("Press ENTER to start again",canvas.width/2, canvas.height/2+50);
    ctx.restore();
    // Touche Entree
    if (inputStates[13]) {
      restartGame();
    }
  };
  var debugFunction = function(time){
    measureFPS(time);
    ctx.save();
    ctx.beginPath();
    // ctx.moveTo(0, canvas.height/2);
    // ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
    ctx.beginPath();
    // ctx.moveTo(canvas.width/2, 0);
    // ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.font="15px Georgia";
    ctx.fillText("W : "+ canvas.width +" H : "+ canvas.height+" du canvas." ,5,20);
    // ctx.fillText("/ : "+ canvas.width/2 +" / : "+ canvas.height/2 ,5,40);
    // Zone de lancement de missiles affectant la vie du personnage
    ctx.fillText("Zone de lancement des missiles par le GameFramework", zoneAttackPlateau.x+10, zoneAttackPlateau.y+20);
    ctx.rect(zoneAttackPlateau.x, zoneAttackPlateau.y, zoneAttackPlateau.width, zoneAttackPlateau.height);
    ctx.stroke();
    if (inputStates.mousePos) {
      ctx.fillText("x = " + inputStates.mousePos.x + " y = " + inputStates.mousePos.y, 5, 55);
    }
    ctx.restore();
  };
  var getMousePos = function (evt) {
    // necessary to take into account CSS boudaries
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };
  // clears the canvas content
  var clearCanvas = function() {ctx.clearRect(0, 0, w, h);};
  var mainLoop = function(time){
    delta = time - oldTime;
    // On efface le canvas
    clearCanvas();
    if (debug) debugFunction(time);

    switch (currentGameState) {
      case gameStates.gameRunning:
      // Gestion de la manette
      gamePadHandler.padLoop();
      // Anime les elements
      plateformePrincipale.animate(ctx, canvas);
      for (var j = 0; j < petitePlateformes.length; j++) {
        petitePlateformes[j].animate(ctx, canvas);
      }
      for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if(player.isDead){
          currentGameState = gameStates.gameOver;
        }
        else{
          // On arrete l'animation sur les autres champion si le jeu est en mode over
          if(currentGameState != gameStates.gameOver)
            player.animate(ctx, canvas, inputStates, delta);
        }
      }
      break;
      case gameStates.mainMenu:
      // TO DO! We could have a main menu with high scores etc.
      break;
      case gameStates.gameOver:
      gameOver();
      break;
    }

    oldTime = time;
    // Start the animation
    requestAnimationFrame(mainLoop); 
  };

  var start = function(){
    mainLoop();
  };
  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start,
    init: init
  };
};