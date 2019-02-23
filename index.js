exports.decorateTerms = (Terms, {React}) => {
return class extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.terms = null;
		this.onDecorated = this.onDecorated.bind(this);
		this.state = {
			isRecording: false
		}
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
					top: document.querySelector('.header_appTitle').getBoundingClientRect().top + 2,
					left: document.querySelector('.header_appTitle').offsetLeft - 16,
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
	"window:togglerecord": "ctrl+shift+r"
  };
  return Object.assign({}, keymaps, newKeymaps);
};