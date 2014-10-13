'use strict';
var Preloader = function(game) {

  this.background = null;
  this.preloadBar = null;

  this.ready = false;

};

Preloader.prototype = {

  preload: function() {

    this.background = this.add.sprite(0, 0, 'background');
    this.preloadBar = this.add.sprite(0, 100, 'preloaderBar');
    this.load.setPreloadSprite(this.preloadBar);

    this.load.atlas('res', 'res/baseResource.png', 'res/altas.json');
    this.load.image('processbarBack', 'res/ProgressBarBack.png');
    this.load.image('processbarFront', 'res/ProgressBarFront.png');
    this.load.image('logo', 'res/logo.png');

  },

  create: function() {

    this.state.start('Menu');
  }
};