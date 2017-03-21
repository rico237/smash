class Champion{
	constructor(x,y, numJoueur){
		this.x = x; this.y = y;
		this.respawnCoord1 = {x:x, y:y};
		this.vx = this.vy = 0;
		this.numJoueur = numJoueur;
		this.resistanceAuDegats = 5;
		this.width = 20; this.height = 20;
		this.speed = 3; this.gravity = .14; this.friction = .8;
		this.isJumping = false; 
		this.username = "J-"+numJoueur;
		if (numJoueur==1) this.directionTire = "droite";
		else if (numJoueur==2) this.directionTire = "gauche";
		this.isOnPlateforme = false; // Pouvoir descendre / traverser une plateforme scondaire
		this.isDead = false; this.health = 100; this.nombreVie = 5;
		this.images = {};
		this.projectiles = [];
		this.helper = Helper();
		this.init();
		this.plopSound;
	}
	init(){
		this.loadAssets(function(){});
		// this.helper.loadImage("leftArm", this.images);
	}
	attack(){
		var proje = new Projectile(this, -10);
		this.projectiles.push(proje);
		console.log(this.projectiles);
	}
	moinsDeVie(number){
		this.height -= number;
	}
	plusDeVie(number){
		this.health += number;
	}
	defense(context){
		context.save();
		context.beginPath();
		context.arc(this.x+this.width/2, this.y+this.height/2, this.width, 0, 2 * Math.PI, false);
		context.fillStyle = 'rgba(255, 255, 255, 0.5)';
		context.fill();
		context.restore();
		// Ajouter un fonction de reduction des dégats
	}
	afficherNombreDeVie(canvas,ctx){
		ctx.save();
		for (var i = 0; i < this.nombreVie; i++) {
			if (this.numJoueur===1) {
				ctx.fillText("Vie : J-"+this.numJoueur, 10, canvas.height-40);
				ctx.fillRect(10+i*20, canvas.height-30, 10, 10);
			}else if(this.numJoueur === 2){
				ctx.fillText("Vie : J-"+this.numJoueur, canvas.width-50, canvas.height-40);
				ctx.fillRect(canvas.width-15-i*20, canvas.height-30, 10, 10);
			}
			
		}
		ctx.restore();
	}
	render(canvas,context){
		var x = this.x; var y = this.y;var images = this.images; var width = this.width; var height = this.height;
		context.save(); 
		// context.drawImage(images["leftArm"], x + 40, y - 42);
		if (this.numJoueur===1) {
			context.fillStyle="#FF0000";
		}else if(this.numJoueur===2){
			context.fillStyle="#55C863";
		}
		context.fillText("J-"+this.numJoueur, x, y-10);
		context.fillRect(x, y, width, height);
		// context.restore();
		// click de souris
		if(this.numJoueur == 1 && inputStates.mousedown ){
			this.defense(context);
		}
		this.afficherNombreDeVie(canvas,context);
		context.restore();
	}
	animate(ctx, canvas, inputStates, delta){

		if (this.nombreVie === 0) {
			this.isDead = true;
		} else {
			/*
			32 = Espace
			90 = Z; 38 = UP; 68 = D; 39 = RIGHT; 37 = LEFT; 40 = DOWN; 81 = Q; 83 = S;
			*/
			if(this.numJoueur==1 && inputStates[32]){
				this.attack();
			}
			// saut = up ou espace
			if (this.numJoueur==1 && inputStates[90] /*|| inputStates[32]*/ || this.numJoueur==2 && inputStates[38]) {
				if(!this.isJumping){
					this.isJumping = true; 
					this.isOnPlateforme = false;
					this.vy = -this.speed*2;
				}
			}
		    // deplacement droite
		    if (this.numJoueur==1 && inputStates[68]|| this.numJoueur==2 && inputStates[39]) {
		    	if (this.vx < this.speed) {             
		    		this.vx++;         
		    	}     
		    }     
        	// deplacement gauche
        	if (this.numJoueur == 1 && inputStates[81] || this.numJoueur == 2 && inputStates[37]) {               
        		if (this.vx > -this.speed) {
        			this.vx--;
        		}
        	}
        	// fleche bas = passer a travers plateforme secondaire  	= en cours
        	if (this.numJoueur == 1 && inputStates[83] || this.numJoueur == 2 && inputStates[40]) {
        		// this.vy = this.speed*2;
        		var arrayPlat = petitePlateformes;
        		for (var i = 0; i < petitePlateformes.length; i++) {
        			var secondaire = petitePlateformes[i].physicalPlateforme;
					// Test de collision entre le personnage et la plateforme principale
					if(this.helper.rectsOverlap(this, secondaire)){
						if (this.y < secondaire.y) {
							this.y = secondaire.y+secondaire.height;
						}
					}
				}
			}
        	// friction pour les déplacements horizontaux
        	this.vx *= this.friction;
        	// gravite pour les déplacements verticaux
        	this.vy += this.gravity;
        	if(!isNaN(delta)){
        		// console.log(this.vy)
				// déplacer le personnage
				this.x += this.calcDistanceToMove(delta, this.vx);
				this.y += this.calcDistanceToMove(delta, this.vy);
			}
			// Batterie de tests de collisions
			this.testSurCollision(canvas, ctx);
		}
		// redessine sur le canvas
		this.render(canvas,ctx);
	}
	calcDistanceToMove(delta, speed) {
		return (speed * delta)*(60/ 1000); 
		// return (speed * delta)/ 1000; 
	}	
	testSurCollision(canvas, ctx){
		this.testCollisionWithOtherPlayers();
		this.testCollisionWithPlateformePrincipale();
		this.testCollisionWithPlateformeSecondaire();
		this.testCollisionWithWalls(canvas, ctx);
	}
	testCollisionWithPlateformePrincipale(){
		var principal = plateformePrincipale.physicalPlateforme;
		// Test de collision entre le personnage et la plateforme principale
		if(this.helper.rectsOverlap(this, principal)){
			// Le joueur est arrivé d'en haut
			if (this.y < principal.y) {
				this.y = principal.y - this.height;	
				this.vy = 0;
				this.isJumping = false;
			}
			// Le joueur est sous la plateforme principale
			if(this.y > principal.y) {
				this.y = principal.y+principal.height;
			}
		}
	}
	testCollisionWithPlateformeSecondaire(){
		for (var i = 0; i < petitePlateformes.length; i++) {
			var secondaire = petitePlateformes[i].physicalPlateforme;
			// Test de collision entre le personnage et les plateformes secondairs
			if(this.helper.rectsOverlap(this, secondaire)){
				// Permet de détecter que le joueur est en chute libre
				var newPosY = this.y + this.vy;
				if (parseInt(newPosY - this.y) > 0 && !this.isOnPlateforme)
					this.isOnPlateforme = true;
				// Permet d'annuler la velocité du joueur en X si il cogne les cotes de la plateforme
				var dir = this.helper.colCheck(this, secondaire);
				if (dir === "l" || dir === "r") this.vx = 0;

				// Le joueur est bien arrivé d'en haut donc on bloque ses coordonees sur la plateforme
				if (this.y < secondaire.y && this.isOnPlateforme) {
					this.y = secondaire.y - this.height;	
					this.vy = 0;
					this.isJumping = false;
				}
			}
		}
	}
	respawn(){
		this.vy = this.vx = 0;
		this.isJumping = false;
		this.x = this.respawnCoord1.x;
		this.y = this.respawnCoord1.y;
		this.nombreVie--;
		this.plopSound.play();
		console.log("Joueur n°"+this.numJoueur +" possède "+ this.nombreVie +" vies avec "+ this.health +" points de sante");
	}
	loadAssets(callback) {
        // simple example that loads a sound and then calls the callback. We used the howler.js WebAudio lib here.
        // Load sounds asynchronously using howler.js
        this.plopSound = new Howl({
        	urls: ['http://mainline.i3s.unice.fr/mooc/plop.mp3'],
        	autoplay: false,
        	volume: 1,
        	onload: function () {callback();}
        });
    }
    testCollisionWithOtherPlayers(){
    	var mainPlayer = players[0];
    	var arrayWithouth = players.slice(1);
    	for (var i = 0; i < arrayWithouth.length; i++) {
    		var otherPlayer = arrayWithouth[i];
			// si colision entre deux joueur
			if(this.helper.rectsOverlap(mainPlayer, otherPlayer)){
				// on obtient la direction de la colision
				var dir = this.helper.colCheck(mainPlayer, otherPlayer);
				// if (dir === "b") mainPlayer.y = otherPlayer.y-mainPlayer.height;
				if (dir === "l") mainPlayer.x = otherPlayer.x+otherPlayer.width;
				if (dir === "r") mainPlayer.x = otherPlayer.x -mainPlayer.width;
			}
		}
	}
	testCollisionWithWalls(canvas, ctx){
		// collision mur de droite
		if (this.x >= canvas.width-this.width) {
        	// this.x = canvas.width-this.width;
        	this.respawn();
        } 
        // collision mur de gauche
        else if (this.x <= 0) {         
        	// this.x = 0;     
        	this.respawn();
        } 

        var principal = plateformePrincipale.physicalPlateforme;
		// Frontiere du bas
		if (this.y > canvas.height - this.height) {
			// this.y = principal.y - this.height;
			this.respawn();
		}
	}
}