'use strict';
window.onload = function() {


  var game = new Phaser.Game(320, 480, Phaser.AUTO, 'game');
  // For Debug
  window.game = game;

  game.state.add('Boost', Boost);
  game.state.add('Preloader', Preloader);
  game.state.add('Menu', Menu);
  game.state.add('GameBoard', GameBoard);
  game.state.add('Gameover', Gameover);
  game.state.start('Boost');


};