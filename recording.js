const { spawn } = require('child_process');

const path = require('path');
const fs = require('fs');

let recordText = null;
let recordCursor = null;

function save(fileName, data) {
  const reader = new FileReader();
  reader.onload = function() {
    console.log("FUCK YOU")
    const buffer = new Buffer.from(reader.result);
   
    const pathName = path.resolve(__dirname,'./.tmp')
    console.log(pathName)

    if (!fs.existsSync(pathName)) {
      fs.mkdirSync(pathName);
    }
    const destName = path.join(pathName, fileName);
    fs.writeFile(destName, buffer, {}, (err,res) => {
      if (err) {
        console.log("ERROR FUCK YOU")
        return;
      }
      console.log("FILE " + fileName + " SAVED!")
    });
  }
  reader.readAsArrayBuffer(data);
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
  const fps = 10;
  var textChunks = [];
  var cursorChunks = [];
  textStream = canvases[2].captureStream(fps);
  cursorStream = canvases[1].captureStream(fps);

  recordText = new MediaRecorder(textStream)
  recordCursor = new MediaRecorder(cursorStream)
  recordText.start(fps)
  recordCursor.start(fps)
  /* Merge tracks into a single stream */


  recordText.ondataavailable = chunk => {
    console.log("TEXT")
    textChunks.push(chunk.data);
  };
  recordCursor.ondataavailable = chunk => {
    console.log("CURSOR")
    cursorChunks.push(chunk.data);
  };

  recordText.onstop = () => {
    console.log('recording stopped');
    const blob = new Blob(textChunks, { type: 'video/webm' });
    save('text.webm',blob);
  };
  recordCursor.onstop = () => {
    console.log('recording stopped');
    const blob = new Blob(cursorChunks, { type: 'video/webm' });
    save('cursor.webm',blob);
  };
};

exports.stopRecording = function() {
  recordText.stop();
  recordCursor.stop();

  console.log('recorder stopped');
  const pathName = path.resolve(__dirname,'./.tmp')

  const textFile = path.join(pathName, 'text.webm')
  const cursorFile = path.join(pathName, 'cursor.webm')
  const outFile = path.join(pathName, 'out.webm')

  setTimeout(()=>{
   console.log('SAVING vid.webm')

   `ffmpeg -i .\text.webm -i .\cursor.webm -filter_complex "[1:v]colorkey=0x000000:1:0[ckout];[0:v][ckout]overlay[out]" -map '[out]' .\out.webm -y`
   var args = `-i ${textFile} -i ${cursorFile} -filter_complex \"[1:v]colorkey=0x000000:.9:.2[ckout];[0:v][ckout]overlay[out]\" -map '[out]' ${outFile} -y`.split(' ')
   console.log(args)
   var child = spawn(
        'ffmpeg',
        args
      );
  }, 100);
};