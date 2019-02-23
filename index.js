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
				this.setState((prevState) => ({ isRecording: !prevState.isRecording }))
			}
		}
	);

	  // Don't forget to propagate it to HOC chain
	  if (this.props.onDecorated) this.props.onDecorated(terms);
	}

	render() {
	  return React.createElement(
		Terms,
		Object.assign({}, this.props, {
		  onDecorated: this.onDecorated
		})
	  );
	  // Or if you use JSX:
	  // <Terms onDecorated={this.onDecorated} />
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