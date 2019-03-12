const VideoStreamMerger = require('video-stream-merger');
const html2canvas = require('html2canvas');
const path = require('path');
const fs = require('fs');
const mimeTypes = require('mime-types');

let record = null;
let saveCallback = null;

function save(fileName, data) {
  const reader = new FileReader();
  reader.onload = function() {
    const buffer = new Buffer.from(reader.result);

    const pathName = path.resolve(__dirname, './.tmp');

    if (!fs.existsSync(pathName)) {
      fs.mkdirSync(pathName);
    }
    const destName = path.join(pathName, fileName);
    fs.writeFile(destName, buffer, {}, (err, _) => {
      if (err) {
        return;
      }
      _;
    });
  };
  reader.readAsArrayBuffer(data);
}

/**
 * Generates a canvas element for wrapping the screen recording
 * for aesthetic purposes
 *
 * @param {Number} width The width of the canvas to frame
 * @param {Number} height The height of the canvas to frame
 * @param {Number} padding The border padding
 * @param {Number} frameSize Size of title bar of the frame
 * @param {Number} frameRadius Radius (in pixels) of the frame corners
 */
function generateFrame(width, height, padding, frameSize, frameRadius) {
  const { backgroundColor } = window.store.getState().ui;

  /* Import frame markup and hyper logo */
  const frameMarkup = fs.readFileSync(
    path.join(__dirname, 'frame-markup.html'),
    'utf-8',
  );
  const hyperLogoSVG = fs.readFileSync(
    path.join(__dirname, 'hyper-logo.svg'),
    'utf-8',
  );

  /* Create Frame & Mount to DOM */
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
      :root {
          --orama-size: ${frameSize}px;
          --orama-button-size: calc(var(--orama-size) / 3.5);
          --orama-title-size: var(--orama-size);
          --orama-window-height: ${height}px;
          --orama-window-width: ${width}px;
          --orama-title-radius: ${frameRadius}px;
          --orama-window-color: ${backgroundColor};
          --orama-close-color: rgb(255, 95, 86);
          --orama-max-color: rgb(255, 189, 46);
          --orama-min-color: rgb(39, 201, 63);
      }
    </style>
    ${frameMarkup}`;
  document.body.appendChild(frame);

  // Create Canvas for drawing
  const baseCanvas = document.createElement('canvas');
  baseCanvas.height = height + frameSize + padding * 2;
  baseCanvas.width = width + padding * 2;

  /* Create shadow behind terminal window */
  const baseCtx = baseCanvas.getContext('2d');
  baseCtx.fillStyle = 'white';
  baseCtx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
  baseCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  baseCtx.shadowBlur = width / 10;
  baseCtx.fillStyle = backgroundColor;
  baseCtx.fillRect(padding, padding + frameSize, width, height - frameRadius);

  /* Paint Frame onto Canvas */
  return html2canvas(document.getElementById('orama-frame'), {
    backgroundColor: null,
    height: height + frameSize + padding * 2,
    width: width + padding * 2,
    allowTaint: true,
    logging: false,
    scale: 1,
  }).then(htmlCanvas => {
    /* Draw frame onto base canvas */
    baseCtx.drawImage(htmlCanvas, 0, frameSize);
    /* Return promise to canvas with Hyper logo painted */
    return new Promise((resolve, reject) => {
      const hyperLogo = new Image();
      hyperLogo.onload = function() {
        const [logo_w, logo_h] = [frameSize / 2.5, (frameSize * 14) / 47];
        const [logo_x, logo_y] = [
          width / 2 + padding - logo_w / 2,
          padding + frameSize / 2 - logo_h / 2,
        ];
        baseCtx.shadowBlur = 0;
        baseCtx.drawImage(hyperLogo, logo_x, logo_y, logo_w, logo_h);
        resolve(baseCanvas);
      };
      hyperLogo.onerror = function() {
        reject(undefined);
      };
      hyperLogo.src = `data:image/svg+xml,${encodeURI(hyperLogoSVG).replace(
        /#/g,
        '%23',
      )}`;
    });
  });
}

function _getCanvas(canvases, className) {
  for (var canvas of canvases) {
    if (canvas.className === className) {
      return canvas;
    }
  }
  return null;
}

exports.startRecording = function(canvases, fileName) {
  const getMax = param => {
    return canvases.reduce((max, val) =>
      Math.max(max[param], val[param]) ? max : val,
    )[param];
  };

  /* Determine video information */
  const fps = 10;
  const height = getMax('height');
  const width = getMax('width');

  /* Setup recording frame */
  const { fontSize } = window.store.getState().ui;
  const frameSize = fontSize * 6;
  const frameRadius = fontSize / 1.5;
  const framePadding = 150;

  generateFrame(width, height, framePadding - 50, frameSize, frameRadius).then(
    frameCanvas => {
      const frameStream = frameCanvas.captureStream(fps);
      const textStream = (
        _getCanvas(canvases, 'xterm-text-layer') || _getCanvas(canvases, '')
      ).captureStream(fps);
      const cursorStream = _getCanvas(
        canvases,
        'xterm-cursor-layer',
      ).captureStream(fps);

      /* Merge tracks into a single stream */
      let stream;
      const merger = new VideoStreamMerger({
        width: width + framePadding * 2,
        height: height + frameSize + framePadding * 2,
        fps,
        clearRect: false,
      });
      merger.addStream(frameStream, {
        x: 0,
        y: 0,
        width: width + framePadding * 2,
        height: height + frameSize + framePadding * 2,
        mute: true,
      });
      merger.addStream(textStream, {
        x: framePadding,
        y: framePadding + frameSize / 1.25,
        width,
        height,
        mute: true,
      });
      merger.addStream(cursorStream, {
        x: framePadding,
        y: framePadding + frameSize / 1.25,
        width,
        height,
        mute: true,
      });

      /* Begin the video streams */
      merger.start();
      stream = merger.result;
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      }
      record = new MediaRecorder(stream, { mimeType });
      record.start();

      /* Handle data from streams */
      const chunks = new Array();
      record.ondataavailable = chunk => {
        chunks.push(chunk.data);
      };

      /* Teardown */
      record.onstop = () => {
        merger.destroy();
        const blob = new Blob(chunks, { type: mimeType });
        var fullName = `${fileName}.${mimeTypes.extension(mimeType)}`;
        save(fullName, blob);
        saveCallback(fullName);
        saveCallback = null;
      };
    },
  );
};

exports.stopRecording = function(callback) {
  saveCallback = callback;
  record.stop();
  /* Remove recording frame */
  const frame = document.getElementById('orama-frame');
  frame.parentNode.removeChild(frame);
};
