Pacman.MainMenu = function(){};
 
Pacman.MainMenu.prototype = {
    init: function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
            this.physics.startSystem(Phaser.Physics.ARCADE);
        },
  create: function() {
  	//show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'dot');
    
    //give it speed in x
    this.background.autoScroll(-20, 0);
 
    //start game text
    var text = "Click to begin";
    var style = { font: "60px Arial", fill: "#000000", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('Game');
    }
  }
};
