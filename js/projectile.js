/*
	Degat infligés = Puissance de feu * Temps de chargement 
	Nombre d'utilisation
*/
class Projectile{
	constructor(player, utilisation){
		this.x = player.x+player.width+1;
		this.y = player.y+player.heihgt/2;
		this.width = 5;
		this.heihgt = 2;
		this.puissanceFeu = 10;
		this.tmpChargement = 0.3; // en seconde
		this.direction = player.direction;
		this.nombreUtilisation = (utilisation)? utilisation: -10; // -10 = utilisation infinie
	}
}