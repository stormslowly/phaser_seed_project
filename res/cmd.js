var pjson = require('./baseResource.json');

var getPairs = function (str) {
  var x = str.replace(/{/g, '[').replace(/}/g, ']');
  return JSON.parse(x);
}


var framesObject = pjson.frames;
var frames = [];

var i = 0;
for (var key in framesObject) {

  var _frame = framesObject[key];
  var sourceRec = getPairs(_frame.sourceColorRect);
  var sourceSize = getPairs(_frame.sourceSize);
  var offset = getPairs(_frame.offset);
  var frame = getPairs(_frame.frame);
  console.log(_frame.frame, frame);
  frames[i++] = {
    "filename": key,
    "frame": {"x": frame[0][0], "y": frame[0][1],
              "w": frame[1][0], "h": frame[1][1]},
    "rotated": _frame.rotated,
    "trimmed": true,
    "spriteSourceSize": {"x": sourceRec[0][0],
      "y": sourceRec[0][1],
      "w": sourceRec[1][0],
      "h": sourceRec[1][1]},
    "sourceSize": {"w":sourceSize[0],"h":sourceSize[1]}
  }

}

var obj = {frames:frames}
console.log(obj);

var fs = require('fs');
fs.writeFileSync('altas.json',JSON.stringify(obj));
