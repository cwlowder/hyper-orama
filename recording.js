const { desktopCapturer } = require('electron');
const path = require('path');
const fs = require('fs');
let mediaRecorder;
let title;

function handleStream(stream) {
  document.title = `[RECORDING] ${title}`;
  mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.start();
  mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
  };

  /* Return promise to stream buffer if successful */
  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      document.title = title;
      resolve(
        new Blob(chunks, {
          type: 'video/webm',
        }),
      );
    };

    /* Reject recording if longer than 10min */
    setTimeout(() => reject(null), 10 * 60 * 1000);
  });
}

function saveStream(fileName) {
  return function reallySaveStream(stream) {
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
          fs.writeFile(pathName, buffer, err => {
            if (err) {
              return;
            }
          });
        };

        reader.readAsArrayBuffer(blob);
      })
      .catch(() => {});
  };
}

function handleUserMediaError() {}

exports.startRecording = function(fileName) {
  title = document.title;
  document.title = `[STARTING VIDEO CAPTURE] ${title}`;
  desktopCapturer.getSources({ types: ['window', 'screen'] }, function(error, sources) {
    for (let source of sources) {
      if (source.name === document.title) {
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
                maxHeight: 720,
              },
            },
          },
          saveStream(fileName),
          handleUserMediaError,
        );
        return;
      }
    }
  });
};

exports.stopRecording = function() {
  mediaRecorder.stop();
};
