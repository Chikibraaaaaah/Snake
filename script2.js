//Plusieurs étape ==> 1) Création du canvas dans lequel sera le serpent

window.onload = function () 
{


    var delay = 100;
    var ctx;
    
    var canvasWidth = 900;
    var canvasHeight = 600;
    var snakee;
    var blockSize = 30;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;


    init();

    function init ()
    {
        var canvas = document.createElement('canvas'); // Création du canvas  
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";// ajout du style
        canvas.style.margin = "auto auto"; 
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);// n'existe que si relier au document
        ctx = canvas.getContext('2d');
        snakee = new Snake([ [6,4] , [5,4] ,[4,4], [3,4],[2,4] ], "right");
        applee= new Apple([10,10]);
        
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas ()
    {
        snakee.advance();

        if (snakee.checkCollision ())
        {
            gameOver();
        }

            else
            {
                if(snakee.isEatingApple(applee))
                {
                    snakee.ateApple = true;
                    score ++;  
                    do{      
                        applee.setNewPosition();
                    }

                    while (applee.isOnSnake(snakee)) 
                }

                    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    drawScore();               
                    snakee.draw();              
                    applee.draw();                    
                    timeout = setTimeout(refreshCanvas, delay); // Prend en argument la fonction que l'on souhaite executer    
            }
    }

    function gameOver ()
    {
        var message = "Mets un doight dans ton cul pour recommencer";
        ctx.save();
        ctx.font = "40px solid ";
        ctx.stokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeText('Game Over Biatch',290, 300 );
        
       
        ctx.fillText(message, 80, 330);
        
        ctx.restore();

    }

    function restart ()
    {
        snakee = new Snake([ [6,4] , [5,4] ,[4,4], [3,4],[2,4] ], "right");
        applee= new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    function drawScore ()
    {
        ctx.save();
        ctx.font = "bold 50px sans-serif" ;
        ctx.fillText(score.toString (), 20, canvasHeight - 20);
        ctx.restore();
    }


    function drawBlock(ctx, position)   // Position est définie par l'array avec x et y
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction)                // Va prendre le corps de notre serpent qui sera égal au body qu'on fournira.
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false; 
        this.draw = function ()     //Ajout d'une méthode qui permet dessiner corps serrpent à l'écran dans canvas. 
        {
            ctx.save();                 // on sauvegarde contenu du canvas
            ctx.fillStyle = "#ff0000";

            for (var i = 0; i < this.body.length; i++)      // Corps du serpent est de plusieurs blocs, dont les valeurs sont définies dans array [x,y]
            {
                drawBlock(ctx, this.body[i]);          // On donne le contexte du canvas dans lequel on dessine et sa position du bloc à dessiner
            }
            ctx.restore();
        };

        this.advance = function ()
        {
            var  nextPosition = this.body[0].slice();
            
            switch(this.direction)
            {
            case "left":
                nextPosition[0] -= 1;
                break;
                case "right":
                    nextPosition[0] += 1;
                break;            
                
                case "down":
                    nextPosition[1] += 1;
                break;

                case "up":
                    nextPosition[1] -= 1;
                break;

                default:
                    throw('invalid direction');
            }
            this.body.unshift(nextPosition);

            if (!this.ateApple)
            this.body.pop();
            else
            this.ateApple = false;
        };
  
        this.setDirection = function (newDirection)
        {
            var allowedDirections;

            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up","down"];
                break;
   
                case "down":
                case "up":
                    allowedDirections = ["left","right"];
                break;

                default:
                    throw('invalid direction');
            }

            if(allowedDirections.indexOf(newDirection) > -1 && allowedDirections.indexOf(newDirection) < 2 )

            {
                this.direction = newDirection;
            }
    
        }; 

        this.checkCollision = function ()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1); // Indique que copie commence à partir du [1], ne prend pas que le [1 en compte]
            var snakeX = head[0]; 
            var snakeY= head[1]; 
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX >maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY >maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++)
            {
                if(snakeX == rest[i][0] && snakeY == rest[i][1])
                    {
                        snakeCollision = true;
                    }
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function (appleToEat)
        {
            var head =this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
            {
                return true;
            }
            else{
                return false; 
            }
        }
    }

    function Apple (position)
    {
        this.position = position;
        this.draw = function ()
        {
            ctx.save();
            ctx.style="#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        
        this.setNewPosition = function ()
        {
            var newX = Math.round(Math.random() * (widthInBlocks -1) );
            var newY = Math.round(Math.random() * (heightInBlocks -1) );
            this.position = [newX, newY];
        };

        this.isOnSnake = function (snakeToCheck)
        {
            var isOnSnake = false;

            for (var i = 0; i < snakeToCheck.body.length; i++)
            {
                if (this.position[0] === snakeToCheck.body[i][0] && position[1] === snakeToCheck.body[i][1])

                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeyDown(e)
    {
        var key = e.keyCode;
        var newDirection;
        switch (key)
        {
            case 81 :
                restart();
                return;
            case 37 :
                newDirection = "left";
                break;
            case 38 :
                newDirection = "up";
            break;  
            case 39 :
                newDirection = "right";
            break;
            case 40 :
                newDirection = "down";
            break;  

            default:
                return;
        }

        snakee.setDirection(newDirection);
    }
}
