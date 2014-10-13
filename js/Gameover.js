'use strict';
var Gameover = function(game) {

  this.background = null;
  this.score = 0;
  this.scoreText = null;
};

Gameover.prototype = {

  init: function(score) {
    this.score = score || 100;
  },

  preload: function() {},

  create: function() {
    this.add.image(0, 0, 'background');

    this.scoreText = this.add.text(this.world.centerX, this.world.centerY, '杀敌\n获得战神称号' + this.score, {
      font: 'bold 32px Yahei',
      fill: '#ff0044'
    });
    this.scoreText.anchor.setTo(0.5, 0.5);


  },

  update: function() {

  }

};