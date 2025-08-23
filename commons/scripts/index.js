/**
* SNAKE GAME 2013
* 
* @author Kuniyoshi Nishimura
* 
* http://studd.jp/
* 
* Game logic adapted from the following tutorial:
* http://www.strille.net/tutorials/snake/index.php
* 
*/

var wallArray;
var yearArray = [26,46,66,86,87,88,89,69,49,29,30,31,32,52,72,92,126,127,128,129,130,131,132,152,172,192,191,190,189,188,187,186,166,146,226,246,247,248,249,250,251,252,286,306,326,346,347,348,289,309,329,349,350,351,352,332,312,292]
var textArray =[109,129,149,169,189,209,229,249,269,289,288,287,286,285,284,283,263,243,223,203,183,163,143,123,103,83,84,85,86,87,88,89,90,91,92,93,94,95,96,116,136,156,176,196,216,236,256,276,296,316,315,314,312];
var t;
var counter = 0;
var noticeWaitTime = 10;
var yearSpeed = 0.1;
var allboxSpeed = 0.001;
var textBoxSpeed = 0.05;
//
var stage;
var x;
var y;
var map;
var turnQueue;
//
var blockSize = 24;
var gameWidth  = 20;
var gameHeight = 20;
var SNAKE_BLOCK = 1;
var xVelocity = [-1, 0, 1, 0];
var yVelocity = [0, -1, 0, 1];
//
var foodCounter;
var snakeBlockCounter;
var currentDirection;
var snakeEraseCounter;
var score;
var gameRunning;
//
var w;
var s;
var f;
var boxArray;
var timerID;
var isFirst = true;
//
var framerate = 10;
	
$(function ()
{	
	init();
});

$(document).keydown(function(e)
{
	var keyCode = e.which;
	//
	if (keyCode > 36 && keyCode < 41) 
	{ 
		if (timerID != undefined) 
		{
			if (keyCode-37 != turnQueue[0]) 
			{
				turnQueue.unshift(keyCode-37);				
			}
		}	
	} else if (keyCode == 32) {
		if (!gameRunning) {
			startGame();
		}	
	}
});

function init()
{
	stage = Sprite3D.stage();
	//
	startNotice();		
}

function startNotice()
{
	$("#notice").fadeIn(1000);	
	//
	setTimeout( endNotice, noticeWaitTime*1000 );		
}

function endNotice()
{
	$("#notice").fadeOut(1000);	
	//
	$('body').stop().animate({backgroundColor:'#daebc7'},1000);
			
	createWall();
	//
	setTimeout( showYear, 1000 );	
}

function createWall()
{
	w = stage.appendChild( Sprite3D.create().update() );			
	w.position(-blockSize*gameWidth*0.5,-blockSize*gameHeight*0.5,0).rotationX( 0 ).update();
	//
	wallArray = new Array();
	//	
	for (var i=0; i<gameWidth; i++) 
	{
		for( var j=0; j<gameHeight; j++)
		{
			var wall = w.appendChild( Sprite3D.box(23,".wall"), 0).update();	
			wall.position(i*blockSize, j*blockSize, 800).update();	
			wallArray.push( wall )
		}		
	}
}

function showYear() 
{
	timerID = setInterval( run, 1000*yearSpeed );		
}

function run()
{
	if( counter < yearArray.length)
	{
		wallArray[yearArray[counter]].css(
			"Transition",
			"all 0.1s ease-in-out",
			true
		).rotate(360,0,0).z(240).update();
		//
		counter++;
	}else{
		clearInterval(timerID);	
		//
		showAllBox();	
	}
}

function showAllBox()
{
	counter = 0;
	//
	timerID = setInterval( run_2, 1000*allboxSpeed );	
}

function run_2()
{
	if( counter < wallArray.length)
	{
		wallArray[counter].z(-blockSize).update();
		//
		counter++;
	}else{
		clearInterval(timerID);	
		//
		moveWall();	
	}
}

function moveWall(moveWall) 
{
	w.css(
		"Transition",
		"all 1s ease-in-out",
		true
	).rotate(
		45, 
		0, 
		0
	).update();
	//
	setTimeout( createTextBox, 1000 );
}

function createTextBox()
{
	//
	t = stage.appendChild( Sprite3D.create().update() );			
	t.position(-blockSize*gameWidth*0.5,-blockSize*gameHeight*0.5,0).rotationX( 45 ).update();
	//	
	counter = 0;
	//
	timerID = setInterval( run_3, 1000*textBoxSpeed );	
}

function run_3()
{
	if( counter < textArray.length)
	{
		var index = textArray[counter];
		var x = Math.floor(index/20);
		var y = index - x*20;
		//
		if( counter != textArray.length -1 )
		{
			t.appendChild( Sprite3D.box(blockSize,".box1").position(x*(blockSize), y*(blockSize), 0).update() );	
		}else{
			t.appendChild( Sprite3D.box(blockSize,".food").position(x*(blockSize), y*(blockSize), 0).update() );	
		}
		//
		counter++;		
	}else{
		clearInterval(timerID);	
		//
		$("#header").fadeIn(1000);			
		//
		$("#play").fadeIn(1000);								
	}
}

function startGame() 
{	
	//
	$("#play").fadeOut(10);		
	//
	x = 0;
	y = 0;
	//
	map = new Array();
	for (var i=0; i<gameWidth; i++) 
	{
		map[i] = new Array();
	}
	//
	turnQueue = new Array();
	//
	initStage();
	//
	foodCounter = 0;
	snakeBlockCounter = 0;
	currentDirection = 3;
	snakeEraseCounter = -1 - 5;
	score = 0;
	//
	placeFood("new");
	//
	timerID = setInterval( main, 1000/framerate );		
	gameRunning = true;
}

function initStage()
{	
	//
	if(!isFirst)
	{
		stage.removeChild(s);	
		stage.removeChild(f);		
		s = null;
		f = null;
	}else{
		stage.removeChild(t);		
		t = null;	
		//
		isFirst = false;	
	}
	//
	var angle = 45;	
	//
	s = stage.appendChild( Sprite3D.create().update() );			
	s.position(-blockSize*gameWidth*0.5,-blockSize*gameHeight*0.5,0).rotationX( angle ).update();	
	//	
	f = stage.appendChild( Sprite3D.create().update() );			
	f.position(-blockSize*gameWidth*0.5,-blockSize*gameHeight*0.5,0).rotationX( angle ).update();	
	//
	boxArray = [];	
}

function main()
{
	if (turnQueue.length > 0) 
	{
		var dir = turnQueue.pop();
		if (dir % 2 != currentDirection % 2) {
			currentDirection = dir;
		}
	}
	//
	x += xVelocity[currentDirection];
	y += yVelocity[currentDirection];
	//
	if( map[x]!= undefined )
	{
		if (map[x][y] != SNAKE_BLOCK && x > -1 && x < gameWidth && y > -1 && y < gameHeight) 
		{ 
			var box = s.appendChild( Sprite3D.box(blockSize,".box1").position(x*(blockSize), y*(blockSize), 0).update() );	
			boxArray.push(box)	
			snakeBlockCounter++;
			//
			if (typeof(map[x][y]) == "object") 
			{
				score += 10;
				snakeEraseCounter -= 5; 
				placeFood(map[x][y]);
			}
			//
			map[x][y] = SNAKE_BLOCK;
			//
			var tailMC = boxArray[snakeEraseCounter];
			//
			if (tailMC!=null) 
			{
				delete map[tailMC.x()/blockSize][tailMC.y()/blockSize];
				s.removeChild(tailMC);
				boxArray[snakeEraseCounter] = null;
			}
			snakeEraseCounter++;	
		} else {
			gameOver();
		}
	}else{
		gameOver();		
	}
};

function gameOver() 
{	
	clearInterval(timerID);
	gameRunning = false;
	//
	$("#play").fadeIn(500);
}

function placeFood(foodMC) 
{
	do {
		var xFood = Math.floor( Math.random()*gameWidth );
		var yFood = Math.floor( Math.random()*gameHeight );
	} while (map[xFood][yFood]);
	//
	if (foodMC == "new") 
	{
		var foodMC = f.appendChild( Sprite3D.box(blockSize,".food"), foodCounter).update();		
		foodCounter++;
	}
	//
	foodMC.position(xFood*blockSize, yFood*blockSize, 0).update();
	//
	map[xFood][yFood] = foodMC;
}