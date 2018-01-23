var Pacman = Pacman || {};

//title screen
Pacman.Level2 = function(game){
        this.map = null;
        this.layer = null;
        this.pacman = null;
        this.alien = null;
        this.safetile = 14;
        this.gridsize = 16;
        this.speed = 150;
        this.threshold = 5;
        this.marker = new Phaser.Point();
        this.turnPoint = new Phaser.Point();
        this.directions = [ null, null, null, null, null ];
        this.opposites = [ Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP ];
        this.current = Phaser.NONE;
        this.turning = Phaser.NONE;
};

var score=0;
var scoreString='';
var scoreText;
var lives;
var music;
var livesCounter=3;
var liveTime=0;
var explosions;
var fireButton;
var stateText;
var stateText2;
var bullets;
var bulletTime=0;
var enemyTime=0;
var mark;
var teleButton;
var teleText;

Pacman.Level2.prototype = {
  create: function() {
    
     this.game.world.setBounds(0, 0, 1920, 1920);
  	 this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//	use spacebar
            this.teleButton = game.input.keyboard.addKey(Phaser.Keyboard.E);// use .E key
            this.map = this.add.tilemap('map2');
            this.map.addTilesetImage('pacman-tiles1', 'tiles');
            this.layer = this.map.createLayer('Pacman');
            this.dots = this.add.physicsGroup(); //	group with dots(dot,dot2)
            this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);  // put dot and dot2
            this.map.createFromTiles(15, this.safetile, 'dot2', this.layer, this.dots);// in map in tiles 7 which is walkable
            //  The dots will need to be offset by 6px to put them back in the middle of the grid
            this.dots.setAll('x', 2, false, false, 1);
            this.dots.setAll('y', 2, false, false, 1);
            //  Pacman should collide with everything except the safe tile
            this.map.setCollisionByExclusion([this.safetile], true, this.layer);
            //  Position Pacman at grid location 14x17 (the +8 accounts for his anchor)
            //	Pacman
            this.pacman = this.add.sprite((16 * 16) + 8, (19 * 16) + 8, 'pacman', 0); 
            this.pacman.anchor.set(0.5);
            this.pacman.animations.add('munch', [0, 1, 2, 3,4,5,6,7,8,9], 20, true);
            this.physics.arcade.enable(this.pacman);
            this.pacman.body.setSize(16, 16, 0, 0);
            this.cursors = this.input.keyboard.createCursorKeys();
            this.pacman.play('munch');
            this.move(Phaser.LEFT);
            //	Group of bullets
            this.bullets = game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(30, 'bullet');
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 1);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('checkWorldBounds', true);
            //	Group of explosions
            this.explosions = this.add.group();
            this.explosions.createMultiple(30, 'kaboom');
            //	Text
            stateText = game.add.text(260,260,' ', { font: '60px Arial', fill: '#fff' }); 
            stateText.anchor.setTo(0.5, 0.5);
            stateText.visible = false;
            //Play Again text
            stateText2 = game.add.text(260,260,' ', { font: '40px Arial', fill: '#fff' }); 
            stateText2.anchor.setTo(0.5, 0.5);
            stateText2.visible = false;
            //  The score
            scoreString = 'Score : ';
            scoreText = game.add.text(2, 0, scoreString + score, { font: '20px Arial', fill: '#fff' });
            //  Lives
            lives = game.add.physicsGroup();
            game.add.text(410, 0, 'Lives : ', { font: '20px Arial', fill: '#fff' });
            for (var i = 0; i < 3; i++) 
             {
                var heart =lives.create(525 -50 + (20 * i), 13, 'heart');//  Create lives for the game 
                heart.anchor.setTo(0.5, 0.5);
            }
            //	The alien
            this.alien = game.add.sprite((16 * 5) + 8, (19 * 16) + 8, 'alien', 0);
            this.alien.anchor.set(0.5);
            this.alien.animations.add('munch', [0, 1, 2, 3], 10, true);
            this.physics.arcade.enable(this.alien);
            this.alien.body.setSize(16, 16, 0, 0);
            this.alien.play('munch');

            //The ghost
            this.ghost = game.add.sprite((16 * 5) + 8, (19 * 16) + 8, 'ghost', 0);
            this.ghost.anchor.set(0.5);
            this.ghost.animations.add('munch', [0, 1, 2, 3], 10, true);
            this.physics.arcade.enable(this.ghost);
            this.ghost.body.setSize(16, 16, 0, 0);
            this.ghost.play('munch');
            //  Mark
            this.mark = game.add.graphics(); //  To marker the tile i'll teleport
            teleText = game.add.text(200, 511, 'Press space to shoot and E to teleport', { font: '15px Arial', fill: '#fff' });
    },
 followRobot: function() //  Simple pattern for my enemy to follow me.
         {
         	var alien_speed=60;
            if (this.pacman.body.x < this.alien.body.x) 
            {
                this.alien.body.velocity.x = alien_speed * -1;
            }
            else
            {
                this.alien.body.velocity.x = alien_speed;
            }
            if (this.pacman.body.y <this.alien.body.y)
            {
                this.alien.body.velocity.y =alien_speed * -1;
            }
            else
            {
                this.alien.body.velocity.y =alien_speed;
            }
        },

     followRobot2: function() //  Simple pattern for my  other enemy to follow me with lower speed.
         {
            var ghost_speed=30;
            if (this.pacman.body.x < this.ghost.body.x) 
            {
                this.ghost.body.velocity.x = ghost_speed * -1;
            }
            else
            {
                this.ghost.body.velocity.x = ghost_speed;
            }
            if (this.pacman.body.y <this.ghost.body.y)
            {
                this.ghost.body.velocity.y =ghost_speed * -1;
            }
            else
            {
                this.ghost.body.velocity.y =ghost_speed;
            }
        },
      


        checkKeys: function ()
        {
            if (this.cursors.left.isDown && this.current !== Phaser.LEFT)
            {
                this.checkDirection(Phaser.LEFT);
            }
            else if (this.cursors.right.isDown && this.current !== Phaser.RIGHT)
            {
                this.checkDirection(Phaser.RIGHT);
            }
            else if (this.cursors.up.isDown && this.current !== Phaser.UP)
            {
                this.checkDirection(Phaser.UP);
            }
            else if (this.cursors.down.isDown && this.current !== Phaser.DOWN)
            {
                this.checkDirection(Phaser.DOWN);
            }
            else
            {
                //  This forces them to hold the key down to turn the corner
                this.turning = Phaser.NONE;
            }
        },



        checkDirection: function (turnTo) 
        {
            if (this.turning === turnTo || this.directions[turnTo] === null || this.directions[turnTo].index !== this.safetile)
            {
                //  Invalid direction if they're already set to turn that way
                //  Or there is no tile there, or the tile isn't index 1 (a floor tile)
                return;
            }
            //  Check if they want to turn around and can
            if (this.current === this.opposites[turnTo])
            {
                this.move(turnTo);
            }
            else
            {
                this.turning = turnTo;
                this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
                this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
            }
        },
        turn: function () 
        {
            var cx = Math.floor(this.pacman.x);
            var cy = Math.floor(this.pacman.y);
            //  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
            if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold))
            {
                return false;
            }
            //  Grid align before turning
            this.pacman.x = this.turnPoint.x;
            this.pacman.y = this.turnPoint.y;
            this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);
            this.move(this.turning);
            this.turning = Phaser.NONE;
            return true;
        },
        move: function (direction) 
        {
            var speed = this.speed;
            if (direction === Phaser.LEFT || direction === Phaser.UP)
            {
                speed = -speed;
            }
            if (direction === Phaser.LEFT || direction === Phaser.RIGHT)
            {
                this.pacman.body.velocity.x = speed;
            }
            else
            {
                this.pacman.body.velocity.y = speed;
            }
            //  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
            this.pacman.scale.x = 1;
            this.pacman.angle = 0;
            if (direction === Phaser.LEFT)
            {
                this.pacman.scale.x = -1;
            }
            else if (direction === Phaser.UP)
            {
                this.pacman.angle = 270;
            }
            else if (direction === Phaser.DOWN)
            {
                this.pacman.angle = 90;
            }
            this.current = direction;
        },  
        
        eatDot: function (pacman, dot)// Function to eat the pokeballs 
        {
            dot.kill(); 
            score +=1;                // Count score for each dot i eat
            scoreText.text=scoreString + score; // And print it 
            if (this.dots.total === 0)
            {
                this.dots.callAll('revive'); //  Fill the map with dots again
            }
        },
        
        eatDot2: function (pacman, dot2,)//  Function to eat the other pokeballs
        {
            
            dot2.kill();

            score +=10;						
            scoreText.text=scoreString + score;
         
            if (this.dots.total === 0)
            {
                this.dots.callAll('revive');
            }
        },
        enemyhit: function(enemy,player)
        {
            var live;
            live = lives.getFirstAlive();//  When enemy ''hits me'' i start losing lives.
			if(game.time.now>liveTime)// I set a time limit to have time to slip through
			{
    			if (live)
    			{
       			 	live.kill();
       			 	livesCounter--;
        		 	liveTime=game.time.now+1000;
            	}
       	    }
            if(livesCounter<1)// If I dont have lives I die and if I want I restart the game 
            {
    			player.kill();
            	var explosion = this.explosions.getFirstExists(false);
            	explosion.reset(player.body.x, player.body.y);
            	explosion.play('kaboom', 30, false, true);
           		stateText.text=" GAME OVER \n Click to restart";
            	stateText.visible = true;
           		game.input.onTap.addOnce(this.restart,this);
            }
        },



    fireBullet: function ()// Function for my Bullets
    {

   		//  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime)
    	{
        	//  Grab the first bullet we can from the pool
       		bullet = this.bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(this.pacman.x, this.pacman.y + 20);
            bullet.body.velocity.y = -100;
            bulletTime = game.time.now + 200;
        }
    	}
    },



    hitEnemy: function(enemy,bullet)// When i hit the enemy with the bullets.Both kill 
    {
        enemy.kill();              //  And reset the enemy to his start position
        bullet.kill();
        score +=100;
        scoreText.text=scoreString + score;
    	enemy.reset((16 * 5) + 8, (19 * 16) + 8);
    },



    teleport: function() // Function to teleport in the map.
    {
       	this.pacman.kill();
       	this.pacman.reset(this.mark.x,this.mark.y);
    },



    restart: function()// Function to restart the Game after player dies
    {
        this.explosions.callAll('kill');
        //resets the life count
        lives.callAll('revive');
        livesCounter=3;
        //revives the player
        this.pacman.reset((16 * 16) + 8, (19 * 16) + 8);
        stateText.visible = false;
	score=0;
	},

    
     YouWin: function(){ //Function to play Again
         stateText2.text=" Congratulations \n Click to play again";
         stateText2.visible = true;
         score=0;

    },


    update: function () 
    {
        this.physics.arcade.collide(this.pacman, this.layer);
        this.physics.arcade.collide(this.alien, this.layer);
        this.physics.arcade.collide(this.ghost, this.layer);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot2,null,this);// Overlap to eat the dots 
        this.physics.arcade.overlap(this.alien, this.bullets, this.hitEnemy,null,this);// Overlap to hit the enemy
        this.physics.arcade.overlap(this.ghost, this.bullets, this.hitEnemy,null,this);
        this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot,this);
        this.physics.arcade.overlap(this.alien, this.pacman,this.enemyhit,null,this);// Overlap so enemy could hit me 
        this.physics.arcade.overlap(this.ghost, this.pacman,this.enemyhit,null,this);
        this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
        this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
        //  Update our grid sensors
        this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
        this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
        this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
        this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
        this.checkKeys();
        if (this.turning !== Phaser.NONE)
        {
            this.turn();
        }
        this.followRobot();
        this.followRobot2();
        if (this.fireButton.isDown)// if button pressed fire bullets
        {
            this.fireBullet(); 
        }
        this.mark.x = this.layer.getTileX(game.input.activePointer.worldX-150) * 32;
    	this.mark.y= this.layer.getTileY(game.input.activePointer.worldY-210) * 32;
        

    	if(this.teleButton.isDown)// if button pressed you can choose where to teleport in the map
    	{						 //  It has a problem because when i teleport to the new position i cant move my player
    		this.mark.lineStyle(2, 0x000000, 1); // Draw a square to show me in which tile i will teleport
   			this.mark.drawRect(0, 0, 32, 32);
    		game.input.onTap.addOnce(function(){ this.teleport()},this); //Just click to teleport

		}  
         if(score==1000){
            this.YouWin();
             game.input.onTap.addOnce(function(){this.state.start('Game')},this);

        }
    },
}; 