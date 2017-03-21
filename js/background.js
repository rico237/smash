class Background{
	constructor(canvas){
		this.x = 0; 
		this.y = 0;
		this.speed = 1;
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		this.images = {};
	}	
	animate(canvas, ctx){
		// Pan background
		this.y += this.speed;
		this.images["bg"] = new Image();
	  	this.images["bg"].src = "images/bg.png";
		ctx.drawImage(this.images["bg"], this.x, this.y, this.canvasWidth, this.canvasHeight);
		
		// Draw another image at the top edge of the first image
		ctx.drawImage(this.images["bg"], this.x, this.y-this.canvasHeight, this.canvasWidth, this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
		// this.render(canvas, ctx);
	}
}