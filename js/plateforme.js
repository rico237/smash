class PlateformePrincipale{
	constructor(canvasW,canvasH, w, h){
		this.x = canvasW/2 - w/2;
		this.y = canvasH - h;
		this.width = w; this.height = h;  
		this.images = this.physicalPlateforme = {};
		this.helper = Helper();
		this.init();
	}
	init(){
		this.helper.loadImage("Plateforme", this.images);
		this.physicalPlateforme.x = this.x+13;
		this.physicalPlateforme.y = this.y+23;
		this.physicalPlateforme.width = this.width-27;
		this.physicalPlateforme.height = 10;
	}
	render(context){
		var x = this.x; var y = this.y;var images = this.images; var width = this.width; var height = this.height;
		context.save(); 
		context.drawImage(images["Plateforme"],x,y, width, height);
		context.restore();
	}
	animate(ctx, canvas){
		this.render(ctx);
		// ctx.fillRect(this.physicalPlateforme.x, this.physicalPlateforme.y, this.physicalPlateforme.width, this.physicalPlateforme.height);
	}
}

class PlateformeSecondaire{
	constructor(x,y, w, h, type){
		this.x = x; this.y = y;
		this.width = w; this.height = h;  
		this.images = this.physicalPlateforme = {};
		this.helper = Helper();
		this.type = type;
		this.init();
	}
	init(){
		this.helper.loadImage(this.type, this.images);
	}
	render(context){
		var x = this.x; var y = this.y;var images = this.images; var width = this.width; var height = this.height;
		context.save(); 
		context.drawImage(images[this.type],x,y, width, height);
		context.restore();
	}
	animate(ctx, canvas){
		this.render(ctx);
		this.physicalPlateforme.x = this.x;
		this.physicalPlateforme.y = this.y+5;
		this.physicalPlateforme.width = this.width;
		this.physicalPlateforme.height = 7;
		// ctx.fillRect(this.physicalPlateforme.x, this.physicalPlateforme.y, this.physicalPlateforme.width, this.physicalPlateforme.height);
	}
}