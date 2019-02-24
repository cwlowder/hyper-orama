const VideoStreamMerger = require('video-stream-merger');
const html2canvas = require('html2canvas');
const path = require('path');
const fs = require('fs');

const saveAs = require('file-saver').saveAs;

let record = null;

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

/**
 * Generates a canvas element for wrapping the screen recording
 * for aesthetic purposes
 *
 * @param {Number} width The width of the canvas to frame
 * @param {Number} height The height of the canvas to frame
 * @param {Number} padding The border padding
 */
function generateFrame(width, height, padding) {
  padding;
  /* Create Frame */
  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = width + padding * 2;
  baseCanvas.height = height + padding * 2;

  const { backgroundColor, foregroundColor } = window.store.getState().ui;
  console.log(backgroundColor);

  const frame = document.createElement('div');
  frame.id = 'orama-frame';
  frame.style = `
    position: fixed;
    z-index: -99999;
    top: -99999px;
    height: ${height + padding * 2}px;
    width: ${width + padding * 2}px;
    padding: ${padding}px;
  `;
  frame.innerHTML = `
      <style>
        .orama-window {
          position: absolute;
          margin: 0 auto;
          z-index: 0;
          display: block;
          height: ${height + 40}px;
          width: ${width}px;
          bottom: 0;
          right: 0;
          left: 0;
          top: calc(50% - 20px);
          overflow: hidden;
          transform: translateY(-50%);
          background-color: ${backgroundColor};
          color: ${foregroundColor};
          -webkit-box-shadow: 0px 5px 41px -4px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 5px 41px -4px rgba(0,0,0,0.75);
          box-shadow: 0px 5px 41px -4px rgba(0,0,0,0.75);
          border-radius: 8px;
        }
        .orama-title {
          position: absolute;
          display: block;
          top: 0;
          left: 0;
          width: 100%;
          height: 40px;
          background-color: ${backgroundColor};
          padding: 10px;
        }
        .orama-dot {
          position: absolute;
          left: 0;
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 100%;
          background-color: white;
        }
        .orama-close {
          left: 10px;
          background-color: #ff704c;
        }
        .orama-max {
          left: 40px;
          background-color: #fff94c;
        }
        .orama-min {
          left: 70px;
          background-color: #4dff35;
        }
    </style>
    <div class="orama-window">
      <div class="orama-title">
        <div class="orama-dot orama-close"></div>
        <div class="orama-dot orama-max"></div>
        <div class="orama-dot orama-min"></div>
      </div>
    </div>
  `;
  document.body.appendChild(frame);

  /* Paint baseCanvas */
  return html2canvas(document.getElementById('orama-frame'), {
    canvas: baseCanvas,
    height: height + padding * 2,
    width: width + padding * 2,
    scale: 1,
    logging: false
  }).then(canvas => {
    const context = canvas.getContext('2d');
    context.shadowColor = 'black';
    context.shadowBlur = width / 10;
    context.fillStyle = backgroundColor;
    context.fillRect(padding, padding, width, height);
    return canvas;
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
  const framePadding = 150;

  /* Gram tracks from canvases */
  const chunks = new Array();
  const fps = 10;
  generateFrame(width, height, framePadding - 50).then(frameCanvas => {
    const frameStream = frameCanvas.captureStream(fps);
    const textStream = canvases[2].captureStream(fps);
    const cursorStream = canvases[1].captureStream(fps);

    /* Merge tracks into a single stream */
    let stream;
    const merger = new VideoStreamMerger({
      width: width + framePadding * 2,
      height: height + framePadding * 2,
      fps,
      clearRect: false
    });
    merger.addStream(frameStream, {
      x: 0,
      y: 0,
      width: width + framePadding * 2,
      height: height + framePadding * 2,
      mute: true
    });
    merger.addStream(textStream, {
      x: framePadding,
      y: framePadding,
      width,
      height,
      mute: true
    });
    merger.addStream(cursorStream, {
      x: framePadding,
      y: framePadding,
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
  });
};

exports.stopRecording = function() {
  record.stop();
  /* Remove recording frame */
  const frame = document.getElementById('orama-frame');
  frame.parentNode.removeChild(frame);
  console.log('recorder stopped');
};
