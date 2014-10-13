'use strict';
var Menu = function(game) {
  this.startButton = null;
  this.logTween = null;
};

Menu.prototype = {

  preload: function() {},
  create: function() {
    this.game.time.advancedTiming = true;
    true
    var style = {
      font: "30px Arial",
      fill: "#ffffff"
    };
    var centerX = this.game.world.centerX;
    var centerY = this.game.world.centerY;
    this.add.image(0, 0, 'background');

    this.startButton = this.game.add.button(centerX, centerY,
      'logo',
      function() {
        this.game.state.start('GameBoard');
      });
    this.startButton.anchor.setTo(0.5);
    this.logTween = this.game.add.tween(this.startButton)
      .to({
          y: centerY - 50
        },
        500,
        Phaser.Easing.Sinusoidal.InOut, true, 0, 9999, true);

    this.add.sprite(200, 200, 'res');

  },
  update: function() {

  },
  render: function() {
    this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
  }

};