var Helper = function() {
	// chargement des images du joueur
	var loadImage = function(name, images) {
	  images[name] = new Image();
	  images[name].src = "images/" + name + ".png";
	};
	var circleCollide = function(x1, y1, r1, x2, y2, r2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
	};
	// Collisions between aligned rectangles
	var rectsOverlap = function(rect1, rect2) {
	  var x1 = rect1.x; var y1 = rect1.y; var w1 = rect1.width; var h1 = rect1.height;
	  var x2 = rect2.x; var y2 = rect2.y; var w2 = rect2.width; var h2 = rect2.height;

	  if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
	    return false; // No horizontal axis projection overlap

	  if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
	    return false; // No vertical axis projection overlap
	
	  return true;    // If previous tests failed, then both axis projections
	                  // overlap and the rectangles intersect
	};
	// Collisions between rectangle and circle
	var circRectsOverlap = function(x0, y0, w0, h0, cx, cy, r) {
	   var testX=cx;
	   var testY=cy;
	   if (testX < x0) testX=x0;
	   if (testX > (x0+w0)) testX=(x0+w0);
	   if (testY < y0) testY=y0;
	   if (testY > (y0+h0)) testY=(y0+h0);
	   return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
	};
	// Savoir de quel coté le champion a fait sa collision
	var colCheck = function (shapeA, shapeB) {
		// Source = http://www.somethinghitme.com/2013/04/16/creating-a-canvas-platformer-tutorial-part-tw/
	    // get the vectors to check against
	    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
	        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	        // add the half widths and half heights of the objects
	        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
	        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
	        colDir = null;

	    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        // figures out on which side we are colliding (top, bottom, left, or right)
	        var oX = hWidths - Math.abs(vX),
	            oY = hHeights - Math.abs(vY);
	        if (oX >= oY) {
	            if (vY > 0) {
	                colDir = "t";
	                // shapeA.y += oY;
	            } else {
	                colDir = "b";
	                // shapeA.y -= oY;
	            }
	        } else {
	            if (vX > 0) {
	                colDir = "l";
	                // shapeA.x += oX;
	            } else {
	                colDir = "r";
	                // shapeA.x -= oX;
	            }
	        }
	    }
	    return colDir;
	};
	var drawEllipse = function(centerX, centerY, width, height, context) {
		context.beginPath();

		context.moveTo(centerX, centerY - height/2);

		context.bezierCurveTo(
			centerX + width/2, centerY - height/2,
			centerX + width/2, centerY + height/2,
			centerX, centerY + height/2);

		context.bezierCurveTo(
			centerX - width/2, centerY + height/2,
			centerX - width/2, centerY - height/2,
			centerX, centerY - height/2);

		context.fillStyle = "black";
		context.fill();
		context.closePath();	
	};
	return{
		loadImage : loadImage,
		circleCollide : circleCollide,
		rectsOverlap : rectsOverlap,
		circRectsOverlap : circRectsOverlap,
		colCheck : colCheck,
		drawEllipse : drawEllipse
	};
};