const { desktopCapturer, app } = require('electron');
const path = require('path');
const fs = require('fs');
const prompt = require('electron-prompt');
let mediaRecorder;
let title;

function handleStream(stream) {
  document.title = `[RECORDING] ${title}`;
  mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.start();
  console.log(mediaRecorder.state);
  console.log('recorder started');
  mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
  };

  /* Return promise to stream buffer if successful */
  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      document.title = title;
      console.log('recorder stopped');
      resolve(
        new Blob(chunks, {
          type: 'video/webm'
        })
      );
    };

    /* Reject recording if longer than 10min */
    setTimeout(() => reject(null), 10 * 60 * 1000);
  });
}

function saveStream(stream) {
  // Logic to save blob to fs

  handleStream(stream)
    .then(blob => {
      // saveAs(blob, 'test.webm');
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

function handleUserMediaError(e) {
  console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
}

exports.startRecording = function() {
  title = document.title;
  document.title = `[STARTING VIDEO CAPTURE] ${title}`;
  desktopCapturer.getSources({ types: ['window', 'screen'] }, function(
    error,
    sources
  ) {
    for (let source of sources) {
      if (source.name === document.title) {
        console.log('starting');
        console.log(source);
        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
          },
          saveStream,
          handleUserMediaError
        );
        return;
      }
    }
  });
};

exports.stopRecording = function() {
  mediaRecorder.stop();
  console.log(mediaRecorder.state);
  console.log('recorder stopped');
};
