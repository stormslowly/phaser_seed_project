'use strict';
var Boost = function(game) {};

Boost.prototype = {
  preload: function() {
    this.load.image('background', 'res/background.jpg');
    this.load.image('preloaderBar', 'res/preload.png');
  },

  create: function() {
    this.state.start('Preloader');
  }

};