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
  return (r * 0.3 + g * 0.59 + b * 0.11) | 0;
}

function getAvg(r, g, b) {
  return (r + g + b) / 3;
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
      var avg = getAvg(r, g, b);

      if (avg >= 90) {
        data[f + (4 * n)]     = 255;
        data[f + (4 * n + 1)] = 255;
        data[f + (4 * n + 2)] = 255;
      } else {
        data[f + (4 * n)]     = 0;
        data[f + (4 * n + 1)] = 0;
        data[f + (4 * n + 2)] = 0;
      }

      if (temp.length > 0) {
        var tAvg = getAvg(temp[0], temp[1], temp[2]);
        if (tAvg < 90 && avg < 90) {
          data[f + (4 * n)]     = 255;
          data[f + (4 * n + 1)] = 255;
          data[f + (4 * n + 2)] = 255;
        } else if (avg >= 90 && tAvg < 90) {
          data[f + (4 * n - 4)]     = 0;
          data[f + (4 * n + 1 - 4)] = 0;
          data[f + (4 * n + 2 - 4)] = 0;
        }
      }

      temp = [r, g, b];
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
