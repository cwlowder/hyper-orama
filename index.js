const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { shell } = require('electron');
const ncp = require('copy-paste');
const recording = require('./recording');
const del = require('del');

exports.decorateTerms = (Terms, { React }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.terms = null;
      this.fileName = `terminal-session-${performance.now()}.webm`;
      this.onDecorated = this.onDecorated.bind(this);
      this.state = {
        isRecording: false,
      };
    }

    componentDidUpdate(_, prevState) {
      if (!this.state.isRecording && prevState.isRecording) {
        const dir = path.resolve(__dirname, './.tmp');

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }

        // Write a `now.json` in this directory
        const nowConfig = {
          version: 2,
          builds: [{ src: this.fileName, use: '@now/static' }],
        };

        fs.writeFileSync(dir + '/now.json', JSON.stringify(nowConfig, null, 2), 'utf8');
        const pathToTmp = path.resolve(__dirname, './.tmp/');
        var child = spawn(path.resolve(__dirname, './node_modules/now/download/dist/now'), [pathToTmp]);

        child.stdout.on('data', data => {
          this._notifyVideoUploaded(`${data}/${this.fileName}`);
        });

        child.stderr.on('data', () => {});

        child.on('close', () => {
          del(pathToTmp, { force: true });
        });
      }
    }

    _notifyVideoUploaded(nowVideo) {
      ncp.copy(nowVideo);

      let videoNotification = new Notification('Your "video" is online at', {
        body: nowVideo,
      });

      videoNotification.onclick = () => {
        shell.openExternal(nowVideo);
      };
    }

    componentWillUnmount() {
      clearTimeout(this.timeOutId);
    }

    onDecorated(terms) {
      this.terms = terms;

      this.terms.registerCommands({
        'window:togglerecord': e => {
          // e parameter is React key event
          e.preventDefault();
          if (!this.state.isRecording) {
            recording.startRecording(this.fileName);
          } else {
            recording.stopRecording();
          }
          this.setState(prevState => ({ isRecording: !prevState.isRecording }));
        },
      });

      // Don't forget to propagate it to HOC chain
      if (this.props.onDecorated) this.props.onDecorated(terms);
    }

    render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          Terms,
          Object.assign({}, this.props, {
            onDecorated: this.onDecorated,
          }),
        ),
        this.state.isRecording &&
          React.createElement('div', {
            className: 'IsRecording',
            style: {
              animation: 'blink-motion 1s infinite',
              position: 'absolute',
              borderRadius: '50%',
              top: document.querySelector('.header_appTitle')
                ? document.querySelector('.header_appTitle').getBoundingClientRect().top + 2
                : 'initial',
              left: document.querySelector('.header_appTitle')
                ? document.querySelector('.header_appTitle').offsetLeft - 16
                : 'initial',
              width: 9,
              height: 9,
              border: '1px solid black',
              boxShadow: '0 0 5px red',
              backgroundColor: 'red',
            },
          }),
        React.createElement(
          'style',
          null,
          `@keyframes blink-motion { 0% { opacity: .1; } 50% { opacity: 1; } 100% { opacity: 0.1; } }`,
        ),
      );
    }
  };
};

// Adding Keymaps
exports.decorateKeymaps = keymaps => {
  const newKeymaps = {
    'window:togglerecord': 'ctrl+alt+r',
  };
  return Object.assign({}, keymaps, newKeymaps);
};
