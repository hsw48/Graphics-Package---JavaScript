function main(btx,bty,bsx,bsy,sxp,syp,rot,rotx,roty)
{
	/*  Set Canvas Up  */
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height = canvas.height = window.outerHeight;
		context.scale(1,1);

		/* Get random ints for triangle points */
		let max = 700,
			min = 0;
		/*
		var x0 = getRandomInt(min,max); 
		var x1 = getRandomInt(min,max);
		var x2 = getRandomInt(min,max);
		var y0 = getRandomInt(min,max);
		var y1 = getRandomInt(min,max);
		var y2 = getRandomInt(min,max);
		*/
		var x0 = 290,
			x1 = 340,
			x2 = 440,
			y0 = 275,
			y1 = 190,
			y2 = 275;

		/* Set point matrices */
		var pt1 = [x0,y0,1],
			pt2 = [x1,y1,1],
			pt3 = [x2,y2,1];

		/* Matrices for all Transformations  */

		var translateMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			translateMatrix[2][0] = btx;
			translateMatrix[2][1] = bty;

		var reverseTranslateMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			reverseTranslateMatrix[2][0] = btx;
			reverseTranslateMatrix[2][1] = bty;

		var scaleMatrix = [[1,0,0],[0,1,0],[0,0,1]];
		if(bsx != 0) {scaleMatrix[0][0] = bsx;}
		if(bsy != 0) {scaleMatrix[1][1] = bsy;}

		var scaleTranslateMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			scaleTranslateMatrix[2][0] = -sxp;
			scaleTranslateMatrix[2][1] = -syp;

		var reverseScaleTransMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			scaleTranslateMatrix[2][0] = sxp;
			scaleTranslateMatrix[2][1] = syp;

			
		var rad = rot*(Math.PI/180),
			s = Math.sin(rad),
			c = Math.cos(rad);

		var rotateMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			rotateMatrix[0][0] = c;
			rotateMatrix[0][1] = -s;
			rotateMatrix[1][0] = s;
			rotateMatrix[1][1] = c;

		var rotTranslateMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			rotTranslateMatrix[2][0] = -rotx;
			rotTranslateMatrix[2][1] = -roty;

		var reverseRotTransMatrix = [[1,0,0],[0,1,0],[0,0,1]];
			reverseRotTransMatrix[2][0] = rotx;
			reverseRotTransMatrix[2][1] = roty;


	drawTriangleBasic(x0,y0,x1,y1,x2,y2);	
	applyTransformation();
	
	function basic(x0,y0,x1,y1) // basic algorithm using y = mx+b
	{
			var dx = x1-x0, // get change in x and change in y
				dy = y1-y0;
			var m = dy/dx; // slope
			
			var i = x0, // set initial values
				j = y0;

			var yintercept = y0 - m*x0;

			if(dx!=0) // make sure it is not a vertical line
			{
				var neg = false;
				if(dy<0) 
					{dy*=-1;
					neg = true;}
				if(dx>dy)
				{
					while(i!=x1)
					{
						context.fillRect(i,j,1,1); // fill in pixel
						i++;
						j = m*i+yintercept;
					}
				}
				else
				{
					while(j!=y1)
					{
						context.fillRect(i,j,1,1); // fill in pixel
						if(neg) {j--;}
						else {j++;}
						i = (j-yintercept)/m;
					}
				}
			}
			else // if it is a vertical line, do this
			{
				while(j!=y1)
				{
					context.fillRect(i,j,1,1);
					j++;
				}
			}
	}
		/*  Draw Triangle with Basic Alg  */
	function drawTriangleBasic(xx0,yy0,xx1,yy1,xx2,yy2)
	{
		basic(xx0,yy0,xx1,yy1);
		basic(xx0,yy0,xx2,yy2);
		basic(xx1,yy1,xx2,yy2);
	}

	/*  Get Random Integers  */
	function getRandomInt(min,max)
	{
		return Math.floor(Math.random() * (max-min-1)) + min;
	}

	function multiplyMatrix(a,b)
	{
		var aNumRows = a.length, aNumCols = a[0].length,
			bNumRows = b.length, bNumCols = b[0].length;
		var	m = new Array(aNumRows);
		for (var r = 0; r < aNumRows; r++) 
		{
    		m[r] = new Array(bNumCols); // initialize the current row
    		for (var c = 0; c < bNumCols; c++) 
    		{
      			m[r][c] = 0;             // initialize the current cell
      			for (var i = 0; i < aNumCols; i++)
      			{
        			m[r][c] += a[r][i] * b[i][c];
      			}
   			}
  		}
  	return m;
	}
	function multiplyM(a,b)
	{
		var m = [0,0,0];
		for(var c = 0;c < 3; c++)
		{
			for(var i = 0; i < 3; i++)
			{
				m[c] += a[i] * b[i][c];
			}	
		}
		return m;
	}

	function applyTransformation()
	{	
		var ot = multiplyMatrix(translateMatrix,scaleTranslateMatrix)
			ot = multiplyMatrix(ot,scaleMatrix);
			ot = multiplyMatrix(ot,reverseScaleTransMatrix);
			ot = multiplyMatrix(ot,rotTranslateMatrix);
			ot = multiplyMatrix(ot,rotateMatrix);
			ot = multiplyMatrix(ot,reverseRotTransMatrix);

		var npt1 = multiplyM(pt1,ot),
			npt2 = multiplyM(pt2,ot),
			npt3 = multiplyM(pt3,ot);

		var x0n = Math.floor(npt1[0]),
			y0n = Math.floor(npt1[1]),
			x1n = Math.floor(npt2[0]),
			y1n = Math.floor(npt2[1]),
			x2n = Math.floor(npt3[0]),
			y2n = Math.floor(npt3[1]);

			console.log("new pts");
			console.log(x0n);
			console.log(y0n);
			console.log(x1n);
			console.log(y1n);
			console.log(x2n);
			console.log(y2n);

	drawTriangleBasic(x0n,y0n,x1n,y1n,x2n,y2n);
	}

}
	