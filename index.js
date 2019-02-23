const fs = require('fs');
const path = require('path')
const child_process = require('child_process')
const shell = require('electron').shell
var ncp = require("copy-paste")

exports.decorateTerms = (Terms, {React, notify}) => {
  return class extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.terms = null;
		this.onDecorated = this.onDecorated.bind(this);
		this.state = {
			isRecording: false,
		}
	}

	componentDidUpdate(_,prevState) {
		if (!this.state.isRecording && prevState.isRecording){
			// Make a temp working DIRECTORY!!!!!!!!!!
			const dir = path.resolve(__dirname, './.tmp');
			const fileName = "text.txt"

			if (!fs.existsSync(dir)){
					fs.mkdirSync(dir);
			}

			// Write the target file to disk
			fs.writeFileSync( dir + '/' + fileName, 'hello i am not a secret chicken 🐔', 'utf8')

			// Write a `now.json` in this directory
			const nowConfig = {
				version: 2,
				builds: [
					{ src: fileName, use: "@now/static" }
				]
			}

			fs.writeFileSync( dir + '/now.json', JSON.stringify(nowConfig, null, 2), 'utf8')	

			// Run `now`
			/** @todo handle the case where a user isn't logged in */
			child_process.execSync(
				path.join(__dirname, `node_modules/.bin/now ${path.join(__dirname, '.tmp')} > ${path.join(__dirname, '.tmp/CHICKENS.txt')}`), 
				{ stdio: 'inherit'}
			);

			// Get the output of `now`
			const nowVideo = fs.readFileSync(path.join(__dirname, '.tmp/CHICKENS.txt'), 'utf8') + "/" + fileName
			this.setState({ deployedUrl: nowVideo })

			ncp.copy(nowVideo)

			let videoNotification = new Notification('Your "video" is online at', {
				body: nowVideo
			  })
			  
			  videoNotification.onclick = () => {
				shell.openExternal(nowVideo)
			  }
			
		}
	}

	componentWillUnmount(){
		clearTimeout(this.timeOutId)
	}

	onDecorated(terms) {
		this.terms = terms;

		this.terms.registerCommands({
			"window:togglerecord": e => {
				// e parameter is React key event
				e.preventDefault();
				console.log("PRESSED")
				this.setState((prevState) => ({ isRecording: !prevState.isRecording }))
			}
		});

		// Don't forget to propagate it to HOC chain
		if (this.props.onDecorated) this.props.onDecorated(terms);
	}

	render() {
	  return [
			React.createElement(
				Terms,
				Object.assign({}, this.props, {
					onDecorated: this.onDecorated,
					key: 1,
				})
			),
			this.state.isRecording && React.createElement("div", {
				key: 2,
				className: "IsRecording",
				style: {
					animation: 'blink-motion 1s infinite',
					position: 'absolute',
					borderRadius: '50%',
					top: document.querySelector('.tabs_title').getBoundingClientRect().top + 4, // broken
					left: document.querySelector('.tabs_title').offsetLeft - 16,
					width: 9,
					height: 9,
					border: '1px solid black',
					boxShadow: '0 0 5px red',
					backgroundColor: 'red',
				}
			}), React.createElement('style', {key: 3}, `@keyframes blink-motion { 0% { opacity: .1; } 50% { opacity: 1; } 100% { opacity: 0.1; } }`)
		];

	}
  }
}

// Adding Keymaps
exports.decorateKeymaps = keymaps => {
  const newKeymaps = {
	"window:togglerecord": "ctrl+alt+r"
  };
  return Object.assign({}, keymaps, newKeymaps);
};