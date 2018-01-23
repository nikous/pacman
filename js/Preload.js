var Pacman = Pacman || {};
 
//loading the game assets
Pacman.Preload = function(){};
 
Pacman.Preload.prototype = {
  preload: function() {
  	//show logo in loading screen
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);
 
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
 
    this.load.setPreloadSprite(this.preloadBar);
 
  	//load game assets
    this.load.baseURL = 'https://nikous.github.io/pacman/';
    this.load.crossOrigin = 'anonymous';
    this.load.image('dot', 'assets/dot.png');
    this.load.image('dot2', 'assets/dot2.png');//2
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('tiles', 'assets/pacman-tiles1.png');
    this.load.spritesheet('pacman', 'assets/pacman.png', 40, 34);
    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('map2', 'assets/Level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.spritesheet('alien', 'assets/invader.png', 32, 32);
    this.load.spritesheet('ghost', 'assets/Enemy2.png', 32, 32);
    this.load.spritesheet('kaboom', 'assets/kaboom.png', 32, 32);
    this.load.image('heart', 'assets/Heart.png');
    this.load.audio('boden', ['assets/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/bodenstaendig_2000_in_rock_4bit.ogg']);
  },
 
  create: function() {

    this.state.start('MainMenu');
  	
  }
};