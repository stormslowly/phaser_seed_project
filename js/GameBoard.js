'use strict';

function create2DArray(rows) {
  var arr = [];

  for (var i = 0; i < rows; i++) {
    arr[i] = [];
  }

  return arr;
}

function VisualTimer(opts) {
  this.type = 'down';
  if (opts.type) {
    this.type = opts.type;
  }
  this.totalTime = opts.seconds;
  this.game = opts.game;
  this.onComplete = opts.onComplete;
  var key = 'timer';
  if (opts.key) {
    key = opts.key;
  }
  // this.game.add.sprite(opts.x, opts.y, key, 1);
  this.sprite = this.game.add.sprite(opts.x, opts.y, key, 0);
  this.fullWidth = this.sprite.width;
  this.reset();
}

VisualTimer.prototype = {
  reset: function() {
    if (this.timer) {
      this.timer.stop();
    }
    var self = this;
    this.hasFinished = false;
    this.timer = this.game.time.create(true);
    this.timer.repeat(Phaser.Timer.SECOND, this.totalTime, timerTick, this);
    this.timer.onComplete.add(function() {
      self.hasFinished = true;
      if (self.onComplete) {
        self.onComplete();
      }
    });
    this.rect = new Phaser.Rectangle(0, 0, 0, this.sprite.height);
    if (this.type === 'down') {
      this.sprite.crop(null);
    } else {
      this.sprite.crop(this.rect);
    }
  },

  setTime: function(seconds) {
    this.totalTime = seconds;
    this.reset();
  },

  start: function() {
    this.reset();
    this.timer.start();
  },

  stop: function() {
    this.timer.stop();
  },

  pause: function() {
    this.timer.pause();
  },

  resume: function() {
    this.timer.resume();
  },

  remainingTime: function() {
    return this.totalTime - this.timer.seconds;
  }
};


function timerTick() {
  /*jshint validthis:true */
  console.log('ticking', this.rect.width);
  var myTime = (this.type === 'down') ? this.remainingTime() : this.timer.seconds;
  this.rect.width = Math.max(0, (myTime / this.totalTime) * this.fullWidth);
  this.sprite.crop(this.rect);
  // this.sprite.updateCrop();
}


var GameBoard = function(game) {

  this.ROWS = this.COLS = 6;
  this.SIZE = 50;
  this.blocks = create2DArray(this.COLS);
  this.clickedBlock = null;
  this.yOffset = 100;
  this.xOffset = 10;
  this.timer = null;

};

GameBoard.prototype = {

  doubleSwapAnimate: function(block1, block2) {
    var oldx1 = block1.getExpectX();
    var oldy1 = block1.getExpectY();

    var oldx2 = block2.getExpectX();
    var oldy2 = block2.getExpectY();

    var move1 = game.add.tween(block1);
    move1
      .to({
        x: oldx2,
        y: oldy2
      }, 200, Phaser.Easing.Linear.None, true)
      .to({
        x: oldx1,
        y: oldy1
      }, 200, Phaser.Easing.Linear.None, true)
      .onComplete.add(function() {
        game.tweens.remove(move1);
      });

    var move2 = game.add.tween(block2);
    move2
      .to({
        x: oldx1,
        y: oldy1
      }, 200, Phaser.Easing.Linear.None, true)
      .to({
        x: oldx2,
        y: oldy2
      }, 200, Phaser.Easing.Linear.None, true)
      .onComplete.add(function() {
        game.tweens.remove(move2);
      });
  },

  singleSwapAnimate: function(block1, block2) {
    var oldx1 = block1.x;
    var oldy1 = block1.y;
    var oldx2 = block2.x;
    var oldy2 = block2.y;

    var move1 = this.game.add.tween(block1);
    move1.to({
      x: oldx2,
      y: oldy2
    }, 200, Phaser.Easing.Linear.None, true);
    move1.onComplete.add(function() {
      this.game.tweens.remove(move1);
    }, this);

    var move2 = this.game.add.tween(block2);
    move2.to({
      x: oldx1,
      y: oldy1
    }, 200, Phaser.Easing.Linear.None, true);
    move2.onComplete.add(function() {
      this.game.tweens.remove(move2);
    }, this);
  },

  swapBlocks: function(block1, block2) {
    var tempRow = block1.row;
    var tempCol = block1.col;

    block1.row = block2.row;
    block1.col = block2.col;
    block2.row = tempRow;
    block2.col = tempCol;

    this.blocks[block1.row][block1.col] = block1;
    this.blocks[block2.row][block2.col] = block2;
  },

  genBlock: function(row, col, texture, type) {

    var xOffset = this.xOffset;
    var yOffset = this.yOffset;
    var size = this.SIZE;

    var block = this.add.sprite(xOffset + col * this.SIZE, yOffset + row * this.SIZE, 'res');
    block.frameName = texture;
    block.face = texture;
    block.type = type;
    block.row = row;
    block.col = col;

    block.animations.add('explode',
      Phaser.Animation.generateFrameNames('pattern_explode_', 0, 16, '', 2), 30
    ).onComplete.add(function() {
      block.frameName = texture;
    });


    block.getExpectX = function() {
      return xOffset + this.col * size;
    };

    block.getExpectY = function() {
      return yOffset + this.row * size;
    };


    block.dropToAnimation = function(row, col) {

      var expectX = xOffset + col * size;
      var expectY = yOffset + row * size;

      if (this.x === expectX && this.y === expectY) {
        return;
      }

      var t = game.add.tween(block);
      t.to({
        x: expectX,
        y: expectY
      }, 200, Phaser.Easing.Linear.None, true);

      t.onComplete.add(function() {
        game.tweens.remove(t);
      });
    };



    return block;
  },

  gameOver: function() {
    console.log('game over');
    this.state.start('Gameover');
  },

  create: function() {

    this.game.time.advancedTiming = true;
    this.game.stage.scaleMode = Phaser.scaleModes.LINEAR;
    this.game.stage.scale.minWidth = 320;
    this.game.stage.scale.minHeight = 480;
    this.game.stage.scale.pageAlignHorizontally = true;
    //    this.game.stage.scale.setScreenSize(true);

    var processbarBack = this.game.add.sprite(this.game.world.centerX, 430, 'processbarBack');
    processbarBack.anchor.setTo(0.5, 0.5);



    this.timer = new VisualTimer({
      x: this.game.world.centerX - 128,
      y: 420,
      key: 'processbarFront',
      game: this.game,
      seconds: 60,
      onComplete: this.gameOver.bind(this)
    });

    this.timer.start();

    for (var r = 0; r < this.ROWS; r++) {
      for (var c = 0; c < this.COLS; c++) {
        var type = Math.floor(Math.random() * 7);
        var texture = 'cocos0' + type;
        console.log(texture);
        var block = this.genBlock(r, c, texture, type);
        this.blocks[r][c] = block;
      }
    }

    var self = this;
    this.game.input.onDown.add(function(p) {
      self.clickedBlock = self.getBlockFromWorldXY(p.x, p.y);

      console.log('i am ', self.clickedBlock.row, self.clickedBlock.col, self.clickedBlock.type);
    });

    this.game.input.onUp.add(function(p) {

      if (!self.clickedBlock) {
        return;
      }
      var hoveredBlock = self.getBlockFromWorldXY(p.x, p.y);

      if (!hoveredBlock) {
        return;
      }

      var direct = {
        x: hoveredBlock.row - self.clickedBlock.row,
        y: hoveredBlock.col - self.clickedBlock.col
      };

      var neiborBlock = self.getNeighborByDirect(self.clickedBlock, direct);

      if (self.tryDestroyBlocks(self.clickedBlock, neiborBlock)) {

        // self.singleSwapAnimate(self.clickedBlock, neiborBlock);
        self.swapBlocks(self.clickedBlock, neiborBlock);
        self.needUpdate = true;
        console.log('go update');
        //        self.clickedBlock.animations.play('explode');
      } else {
        self.doubleSwapAnimate(self.clickedBlock, neiborBlock);
      }
    });
    console.log('just create');
    this.printBlocks();
    this.needUpdate = true;
  },

  getSameTypeBlocks: function(block) {

    var centerX = block.row;
    var centerY = block.col;
    var type = block.type;
    var directs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];

    var count = [0, 0, 0, 0];
    for (var di = 0; di < 4; di++) {
      var dx = directs[di][0];
      var dy = directs[di][1];
      var currentBlock = null;
      var row = centerX,
        col = centerY;
      var c = -1;

      do {
        row += dx;
        col += dy;
        currentBlock = this.getBlockByRowCol(row, col);
        c += 1;
      } while (currentBlock && (currentBlock.type === type) && c < 2);
      count[di] = c;
    }
    console.log('row', centerX, centerY);
    console.log('cnt', count);
    if ((count[0] + count[1]) >= 2 || (count[2] + count[3]) >= 2) {
      return true;
    } else {
      return false;
    }
  },

  tryDestroyBlocks: function(block1, block2) {
    if (block1.type === block2.type) {
      return false;
    }
    var canDestroy = false;

    this.swapBlocks(block1, block2);
    canDestroy = this.getSameTypeBlocks(block1) || this.getSameTypeBlocks(block2);
    this.swapBlocks(block1, block2);

    return canDestroy;
  },

  getNeighborByDirect: function(fromBlock, direct) {
    var dx = normalize(direct.x);
    var dy = normalize(direct.y);
    var ox = fromBlock.row;
    var oy = fromBlock.col;
    console.log('neirbog', ox, oy, dx, dy);
    return this.getBlockByRowCol(ox + dx, oy + dy);
  },

  getBlockByRowCol: function(row, col) {
    if (col >= 0 && col < this.COLS && row >= 0 && row < this.ROWS) {
      //      console.log('debug', row, col);
      return this.blocks[row][col];
    }

    return null;
  },

  getBlockFromWorldXY: function(worldX, worldY) {
    var x = worldX - this.xOffset;
    var y = worldY - this.yOffset;

    var col = Math.floor(x / this.SIZE);
    var row = Math.floor(y / this.SIZE);

    return this.getBlockByRowCol(row, col);
  },

  clearMap: function() {
    var result = [];
    var row, col;
    var block1, block2, block3;
    for (row = 0; row < this.ROWS; row++) {
      for (col = 0; col < this.COLS - 2; col++) {
        block1 = this.getBlockByRowCol(row, col);
        block2 = this.getBlockByRowCol(row, col + 1);
        block3 = this.getBlockByRowCol(row, col + 2);
        if (block1 && block2 && block3 && (block1.type === block2.type) && (block1.type === block3.type)) {
          result.push(block1);
          result.push(block2);
          result.push(block3);
        }
      }
    }

    for (col = 0; col < this.COLS; col++) {
      for (row = 0; row < this.ROWS - 2; row++) {
        block1 = this.getBlockByRowCol(row, col);
        block2 = this.getBlockByRowCol(row + 1, col);
        block3 = this.getBlockByRowCol(row + 2, col);
        if (block1 && block2 && block3 && (block1.type === block2.type) && (block1.type === block3.type)) {
          result.push(block1);
          result.push(block2);
          result.push(block3);
        }
      }
    }

    return result;
  },

  printBlocks: function() {
    var __map = function(i) {
      var t;
      if (!i) {
        t = 9;
      } else {
        t = i.type;
      }
      return t;
    };
    console.log('===============');
    for (var i = 0; i < this.ROWS; i++) {
      console.log(this.blocks[i].map(__map));
    }
  },

  update: function() {
    var i, j, l;

    while (this.needUpdate) {
      this.printBlocks();

      var blocks = this.clearMap();
      console.log('blocks', blocks);
      if (blocks.length === 0) {
        this.needUpdate = false;
      }

      for (i = 0, l = blocks.length; i < l; i++) {
        var row = blocks[i].row;
        var col = blocks[i].col;
        blocks[i].animations.play('explode', null, false, true);
        this.blocks[row][col] = null;
      }

      this.dropBlocks();

      for (i = 0; i < this.ROWS; i++) {
        for (j = 0; j < this.COLS; j++) {
          var block = this.getBlockByRowCol(i, j);
          block && block.dropToAnimation(i, j);

        }
      }

      this.fillBlanks();


    }

    // clear map

    // drop
  },

  fillBlanks: function() {
    var block = null;
    for (var row = 0; row < this.ROWS; row++) {
      for (var col = 0; col < this.COLS; col++) {
        block = this.getBlockByRowCol(row, col);
        if (!block) {
          var type = Math.floor(Math.random() * 7);
          var texture = 'cocos0' + type;
          block = this.genBlock(row, col, texture, type);
          block.x = this.xOffset + col * 50;
          block.y = this.yOffset - 1 * 50;
          this.blocks[row][col] = block;
          block.dropToAnimation(row, col);
        }
      }
    }
  },

  dropBlocks: function() {

    for (var col = 0; col < this.COLS; col++) {
      var drops = 0;
      for (var row = this.ROWS - 1; row >= 0; row--) {
        var block = this.getBlockByRowCol(row, col);
        if (block) {
          if (drops > 0) {
            console.log('drop');
            // block.dropToAnimation(row + drops, col);
            block.row = row + drops;
            this.blocks[row][col] = null;
            this.blocks[block.row][block.col] = block;
          }
        } else {
          drops += 1;
        }
      }
    }
  },

  render: function() {
    this.game.debug.text('down ' + this.down + ' up' + this.up + this.called, 30, 30, '#ff0000');
    this.game.debug.text(this.game.time.fps, 2, 14, '#00ff00');
  }



};