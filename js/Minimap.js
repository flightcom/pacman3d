var Minimap = Class.create({

	initialize: function(width, height, reduc, bgCol, id){

		this.id = id || 'minimap';
		this.bgCol = bgCol;
		this.reduc = reduc;
		this.width = parseInt(width/reduc);
		this.height = parseInt(height/reduc);
		this.domElement = this.createDomElem();
		// Format objet :
		/* {
			type: line || plot
			thickness: en px
			color: format #XXXXXX
			points: [x,y], ...
		} */

		this.obj = [];

		// document.body.appendChild(this.domElement);
		this.setCanvas();

	},

	createDomElem: function(){

		var domE = document.createElement('canvas');
		domE.setAttribute('id', this.id);
		domE.style.backgroundColor = this.bgCol;
		domE.style.width = this.width+'px';
		domE.style.height = this.height+'px';
		domE.style.position = 'absolute';
		domE.style.top = '0px';
		domE.style.right = '0px';

		return domE;
	},

	getCanvas: function(){

		return this.domElement.getContext('2d');

	},

	setCanvas: function(){

		this.context = this.domElement.getContext('2d');
		this.context.canvas.width = this.width;
		this.context.canvas.height = this.height;

	},

	// drawLine: function(obj){

	// 	if(!obj.isStatic)
	// 		this.context.beginPath();

	// 	this.context.save();

	// 	for(var i = 0; i < obj.points.length; i++){
	// 		obj.points[i].x = parseInt(obj.points[i].x/this.reduc)+0.5;
	// 		obj.points[i].y = parseInt(obj.points[i].y/this.reduc)+0.5;
	// 	}

	// 	// this.context.save();
	// 	// this.context.beginPath();
	// 	this.context.lineWidth = obj.thickness;
	// 	this.context.strokeStyle = obj.color;
	// 	// console.log(obj.color);
	// 	this.context.moveTo(obj.points[0].x, obj.points[0].y);
	// 	for(var i = 1; i < obj.points.length; i++){
	// 		// console.log('draw line');
	// 		this.context.lineTo(obj.points[i].x, obj.points[i].y);
	// 	}
	// 	this.context.stroke();

	// 	if(!obj.isStatic){
	// 		this.context.closePath();
	// 		// console.log('save line');
	// 	}
	// },

	// drawPlot: function(obj){

	// 	if(!obj.isStatic)
	// 		this.context.beginPath();

	// 	// this.context.save();

	// 	obj.point.x = parseInt(obj.point.x/this.reduc)+0.5;
	// 	obj.point.y = parseInt(obj.point.y/this.reduc)+0.5;
	// 	// this.context.beginPath();
	// 	this.context.fillStyle = obj.color;
	// 	this.context.moveTo(obj.point.x, obj.point.y);
	// 	this.context.arc(obj.point.x, obj.point.y, obj.thickness, 0, 2 * Math.PI, true);
	// 	this.context.fill();

	// 	// this.context.restore();

	// 	if(!obj.isStatic){
	// 		// console.log('save plot');
	// 		this.context.closePath();
	// 	}

	// }

	drawLine: function(obj){

		var ctx = this.getCanvas();

		// if(!obj.isStatic)
		// 	this.context.beginPath();

		// this.context.save();

		for(var i = 0; i < obj.points.length; i++){
			obj.points[i].x = parseInt(obj.points[i].x/this.reduc)+0.5;
			obj.points[i].y = parseInt(obj.points[i].y/this.reduc)+0.5;
		}

		// this.context.save();
		// this.context.beginPath();
		ctx.lineWidth = obj.thickness;
		ctx.strokeStyle = obj.color;
		// console.log(obj.color);
		ctx.moveTo(obj.points[0].x, obj.points[0].y);
		for(var i = 1; i < obj.points.length; i++){
			// console.log('draw line');
			ctx.lineTo(obj.points[i].x, obj.points[i].y);
		}
		ctx.stroke();

		// console.log('ok');

		// ctx.drawImage(this.createDomElem(), 0, 0);
		// ctx.restore();

		// if(!obj.isStatic){
		// 	this.context.closePath();
		// 	// console.log('save line');
		// }
		document.body.appendChild(this.domElement);
	},

	drawPlot: function(obj){

		var ctx = this.getCanvas();

		// if(!obj.isStatic)
		// 	this.context.beginPath();

		// this.context.save();

		obj.point.x = parseInt(obj.point.x/this.reduc)+0.5;
		obj.point.y = parseInt(obj.point.y/this.reduc)+0.5;
		// this.context.beginPath();
		ctx.fillStyle = obj.color;
		ctx.moveTo(obj.point.x, obj.point.y);
		ctx.arc(obj.point.x, obj.point.y, obj.thickness, 0, 2 * Math.PI, true);
		ctx.fill();

		// ctx.drawImage(this.createDomElem(), 0, 0);
		// ctx.restore();
		// this.context.restore();

		// if(!obj.isStatic){
		// 	// console.log('save plot');
		// 	this.context.closePath();
		// }
		document.body.appendChild(this.domElement);

	}
});