const VideoStreamMerger = require('video-stream-merger');
const path = require('path');
const fs = require('fs');

const saveAs = require('file-saver').saveAs;

let record = null;

function saveStream(fileName) { return function reallySaveStream(stream) {
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
        const pathName = path.join(downloadsPathName, fileName);
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
}

exports.startRecording = function(canvases) {
  const getMax = param => {
    return canvases.reduce((max, val) =>
      Math.max(max[param], val[param]) ? max : val
    )[param];
  };

  const height = getMax('height');
  const width = getMax('width');

  /* Gram tracks from canvases */
  const chunks = new Array();
  const fps = 10;
  const textStream = canvases[2].captureStream(fps);
  const cursorStream = canvases[1].captureStream(fps);

  /* Merge tracks into a single stream */
  let stream;
  const merger = new VideoStreamMerger({
    width,
    height,
    fps,
    clearRect: false
  });
  merger.addStream(textStream, {
    x: 0,
    y: 0,
    width,
    height,
    mute: true
  });
  merger.addStream(cursorStream, {
    x: 0,
    y: 0,
    width,
    height,
    mute: true
  });
  merger.start();
  stream = merger.result;

  record = new MediaRecorder(stream);
  record.start();

  record.ondataavailable = chunk => {
    chunks.push(chunk.data);
  };

  record.onstop = () => {
    console.log('recording stopped');
    merger.destroy();
    const blob = new Blob(chunks, { type: 'video/webm' });
    saveAs(blob);
  };
};

exports.stopRecording = function() {
  record.stop();
  console.log('recorder stopped');
};
