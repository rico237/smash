var canvas, ctx, mousePos;
var start = null;
// Autres joueurs
var allPlayers = {};

function init() {
  // Definition des varibales
  initCanvas();
  // Ajout des ecouteurs
  ajoutDesListeners();
  // Debut de l'animation
  anime();
}

function ajoutDesListeners(){
  canvas.addEventListener("mousedown", traiteMouseDown);
  canvas.addEventListener("mousemove", traiteMouseMove);
}

function initCanvas(){
  canvas = document.querySelector("#myCanvas");
  var canvasContainer = document.querySelector("#canvasContainer");
  var sideBarDiv = document.querySelector('#sideChat');
  canvas.width = canvasContainer.offsetWidth-30; // 30 is for padding
  canvas.height = canvas.width/1.2;
  sideBarDiv.style.height = canvas.height-79-15+"px";
  ctx = canvas.getContext('2d');
}

function traiteMouseDown(evt) {
  console.log("mousedown");
}

function traiteMouseMove(evt) {
  // console.log("mousemove");
  
  mousePos = getMousePos(canvas, evt);
  // console.log(mousePos.x + " " + mousePos.y); 
  
  allPlayers[username].x = mousePos.x;
  allPlayers[username].y = mousePos.y; 

  // console.log("On envoie sendPos");
  var pos = {'user':username, 'pos':mousePos}
  socket.emit('sendpos', pos);
}

function updatePlayerNewPos(newPos) {
  allPlayers[newPos.user].x = newPos.pos.x;
  allPlayers[newPos.user].y = newPos.pos.y;
}
// Mise à jour du tableau quand un joueur arrive
// ou se deconnecte
function updatePlayers(listOfPlayers) {
  allPlayers = listOfPlayers;
}

function drawPlayer(player) {
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 10;
  ctx.strokeRect(player.x, player.y, 100, 100);
}

function drawAllPlayers() {
  for(var name in allPlayers) {
    drawPlayer(allPlayers[name]);
  }
}

function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
   };
}

function anime() {
  if(username != undefined ) {
    // 1 On efface l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2 On dessine des objets
    drawAllPlayers();
  }
  
  // 4 On rappelle la fonction d'animation à 60 im/s
  requestAnimationFrame(anime);
}