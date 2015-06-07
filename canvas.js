var Canvas = require('canvas')
  , Image  = Canvas.Image
  , canvas = new Canvas(400, 650)
  , ctx    = canvas.getContext('2d');


var fs = require('fs');

var sourceWidth  = canvas.width
  , sourceHeight = canvas.height
  , dx           = 0
  , dy           = 0;


fs.readFile(__dirname + '/test.jpg', function (err, squid) {
  if (err) throw err;
  image     = new Image;
  image.src = squid;
  ctx.drawImage(image, dx, dy, sourceWidth, sourceHeight);
  foo(dx, dy, sourceWidth, sourceHeight);
});

function getGrayScale(r, g, b) {
  return (r * 38 + g * 75 + b * 15) >> 7;
}

function foo(dx, dy, sourceWidth, sourceHeight) {
  var imageData = ctx.getImageData(dx, dy, sourceWidth, sourceHeight),
      data      = imageData.data;

  var newData = [];

  // m 行
  for (var m = 0; m < sourceHeight; m++) {
    // n 列
    var f    = 4 * sourceWidth * m;
    var temp = [];
    for (var n = 0; n < sourceWidth; n++) {

      var r   = data[f + (4 * n)];
      var g   = data[f + (4 * n + 1)];
      var b   = data[f + (4 * n + 2)];
      var white = 245;
      var black = 50; 
      var grayScale = getGrayScale(r, g, b);

//      if (grayScale >= 90) {
//        data[f + (4 * n)]     = 255;
//        data[f + (4 * n + 1)] = 255;
//        data[f + (4 * n + 2)] = 255;
//      } else {
//        data[f + (4 * n)]     = 0;
//        data[f + (4 * n + 1)] = 0;
//        data[f + (4 * n + 2)] = 0;
//      }
//
//      if (temp.length > 0) {
//        var tGrayScale = getGrayScale(temp[0], temp[1], temp[2]);
//        if (tGrayScale < 90 && grayScale < 90) {
//          data[f + (4 * n)]     = 255;
//          data[f + (4 * n + 1)] = 255;
//          data[f + (4 * n + 2)] = 255;
//        } else if (grayScale >= 90 && tGrayScale < 90) {
//          data[f + (4 * n - 4)]     = 0;
//          data[f + (4 * n + 1 - 4)] = 0;
//          data[f + (4 * n + 2 - 4)] = 0;
//        }
//      }
//
//      temp = [r, g, b];
					data[f +  (4*n)] = grayScale;
					data[f +  (4*n + 1)] = grayScale;
					data[f + (4*n + 2)] = grayScale;    
    }
  }
  ctx.putImageData(imageData, dx, dy);

  var out    = fs.createWriteStream(__dirname + '/text.png')
    , stream = canvas.pngStream();

  stream.on('data', function (chunk) {
    out.write(chunk);
  });

  stream.on('end', function () {
    console.log('saved png');
  });
}
