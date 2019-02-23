const path = require('path');
const fs = require('fs');

function saveStream(stream) {
  // Logic to save blob to fs

  handleStream(stream)
    .then(blob => {
      const reader = new FileReader();
      reader.onload = function() {
        const buffer = new Buffer.from(new Uint8Array(reader.result));
        const appPath = path.resolve(__dirname, './.tmp');
        const downloadsFolderName = '';
        const downloadsPathName = path.join(appPath, downloadsFolderName);
        // const downloadsPathName = appPath;
        if (!fs.existsSync(downloadsPathName)) {
          fs.mkdirSync(downloadsPathName);
        }
        const pathName = path.join(downloadsPathName, 'my-clip.webm');
        fs.writeFile(pathName, buffer, (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('video saved');
        });
      };

      reader.readAsArrayBuffer(blob);
    })
    .catch(e => {
      console.error(e);
    });
}

exports.startRecording = function(canvases) {
  const getMax = param => {
    return canvases.reduce((max, val) =>
      Math.max(max[param], val[param]) ? max : val
    )[param];
  };

  const height = getMax('height');
  const width = getMax('width');

  console.log(height, width);

  const composite = document.createElement('canvas');
  composite.width = width;
  composite.height = height;
  const compCTX = composite.getContext('2d');

  for (canvas of canvases) {
    // compCTX.drawImage(canvas, 0, 0);
    console.log(canvas);
    console.log(canvas.toDataURL(0, 0, width, height));
  }
};

exports.stopRecording = function() {
  console.log(mediaRecorder.state);
  console.log('recorder stopped');
};
