
var Pacman = Pacman || {};
var game = new Phaser.Game(800, 528,Phaser.AUTO);
 
game.state.add('Boot', Pacman.Boot);
game.state.add('Preload', Pacman.Preload);
game.state.add('MainMenu', Pacman.MainMenu);
game.state.add('Game', Pacman.Game);
game.state.add('Level2', Pacman.Level2);
 
game.state.start('Boot');