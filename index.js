const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ncp = require('copy-paste');
const recording = require('./recording');
const del = require('del');

exports.reduceUI = (state, action) => {
  switch (action.type) {
    case 'CONFIG_LOAD':
    case 'CONFIG_RELOAD': {
      const config = action.config.hyperOrama;
      return state.set('hyperOrama', config);
    }
    default:
      return state;
  }
};

function addNotificationMessage(text, url = null, dismissable = true) {
  return {
    type: 'NOTIFICATION_MESSAGE',
    text,
    url,
    dismissable,
  };
}

exports.decorateTerms = (Terms, { React }) => {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.terms = null;
      this.fileName = `terminal-session-${performance.now()}.webm`;
      this.onDecorated = this.onDecorated.bind(this);
      this.state = {
        isRecording: false,
        canvases: [],
      };
    }

    componentDidMount() {
      const { document } = window;

      /**
       * Grabs the terminal canvases for recording
       */
      const canvasListener = () => {
        const canvasCollection = document.querySelectorAll(
          '.xterm-screen canvas',
        );
        if (canvasCollection.length >= 3) {
          const canvases = new Array();
          document.body.removeEventListener(
            'DOMSubtreeModified',
            canvasListener,
          );
          for (let canvas of canvasCollection) canvases.push(canvas);
          this.setState({ ...this.state, canvases });
        }
      };
      document.body.addEventListener('DOMSubtreeModified', canvasListener);
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

        fs.writeFileSync(
          path.join(dir, '/now.json'),
          JSON.stringify(nowConfig, null, 2),
          'utf8',
        );

        const pathToTmp = path.resolve(__dirname, './.tmp/');
        var child = spawn(
          path.resolve(__dirname, './node_modules/now/download/dist/now'),
          [pathToTmp],
        );

        child.stdout.on('data', data => {
          this._notifyVideoUploaded(`${data}/${this.fileName}`);
        });

        child.on('close', () => {
          del(pathToTmp, { force: true });
        });
      }
    }

    _notifyVideoUploaded(nowVideo) {
      ncp.copy(nowVideo);
      window.store.dispatch(
        addNotificationMessage('Your video is online', nowVideo, true),
      );
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
            this.titleElement = document.querySelector('header');
            recording.startRecording(this.state.canvases, this.fileName);

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
      const relativeLeft =
        document.querySelector('.header_appTitle') ||
        document.querySelector('.tabs_title');

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
              top: document.querySelector('.header_windowHeader')
                ? document
                    .querySelector('.header_windowHeader')
                    .getBoundingClientRect().height / 2
                : this.titleElement
                ? this.titleElement.getBoundingClientRect().height / 2
                : 'initial',
              transform: 'translateY(-50%)',
              left: relativeLeft
                ? relativeLeft.getBoundingClientRect().left - 16
                : this.titleElement
                ? this.titleElement.getBoundingClientRect().width / 2
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
          `@keyframes blink-motion { 0% { opacity: .1; } 50% { opacity: 1; } 100% { opacity: 0.1; } }
		  
		  .tabs_title {
		  display: block;
		  width: fit-content;
		  margin: 0 auto !important;
		  padding: 0 !important;
		  } `,
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
