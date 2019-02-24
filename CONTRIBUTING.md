# Contibuting to Hyper-Orama

## Welcome to Hyper-Orama Contributing

### Short Links to Important Resources

* [Issue tracker](https://github.com/cwlowder/hyper-orama/issues)
* [Slack channel (HackIllinois 2019)](https://hackillinois-2019.slack.com/messages/CG5URQB5K/)

## Testing

### Development environment setup

#### Hyper environment setup

See [the Hyper README](https://github.com/zeit/hyper/blob/canary/README.md#Contribute).

#### Hyper-Orama environment setup

Clone the repository into `~/.hyper-plugins/local/`:

```bash
cd ~/.hyper-plugins/local/ # move into local plugin directory
git clone git@github.com:cwlowder/hyper-orama.git # clone repo
yarn # install dependencies
```

Your `~/.hyper.js` file should look like this:

```javascript
  // ...
  localPlugins: ['hyper-orama'],
  // ...
```

```bash
  yarn -g now # Install now
  now login # create and login into your now account
```

### How to submit changes

1. Create a fork of the project
2. Commit changes to that fork
3. Create an adequately-detailed pull request for your fork

## How to report a bug

Create a ticket in the [issue tracker](https://github.com/cwlowder/hyper-orama/issues). You should start with this template from Hyper.

```md
<!--
  Hi there! Thank you for discovering and submitting an issue.

  Before you submit this; let's make sure of a few things.
  Please make sure the following boxes are ticked if they are correct.
  If not, please try and fulfil these first.
-->

<!-- Checked checkbox should look like this: [x] -->
- [ ] I am on the [latest](https://github.com/zeit/hyper/releases/latest) Hyper.app version
- [ ] I have searched the [issues](https://github.com/zeit/hyper/issues) of this repo and believe that this is not a duplicate

<!--
  Once those are done, if you're able to fill in the following list with your information,
  it'd be very helpful to whoever handles the issue.
-->

- **OS version and name**: <!-- Replace with version + name -->
- **Hyper.app version**: <!-- Replace with version -->
- **Link of a [Gist](https://gist.github.com/) with the contents of your .hyper.js**: <!-- Gist Link Here -->
- **Relevant information from devtools** _(CMD+ALT+I on macOS, CTRL+SHIFT+I elsewhere)_: <!-- Replace with info if applicable, or N/A -->
- **The issue is reproducible in vanilla Hyper.app**: <!-- Replace with info if applicable, or `Is Vanilla`. (Vanilla means Hyper.app without any add-ons or extras. Straight out of the box.) -->

## Issue
<!-- Now feel free to write your issue, but please be descriptive! Thanks again 🙌 ❤️ -->
```

## New Feature Requirements

We accept contributions to this plugin. If you want to add a new feature, create a fork and submit a pull request.

## Style Guide / Coding conventions

We use ESLint as a code linter. If you install ESLint, it will use our existing `.eslintrc` file to help you adhere to our style.

## Code of Conduct

See the [Code of Conduct](CONDUCT.md). We use the Contributor Covenant Code of Conduct.

## Recognition model

We use [All Contributors](https://www.recordnotfound.com/all-contributors-kentcdodds-149503) to highlight contributors to Hyper-Orama.

## Where can I ask for help

If you have a problem, you should create an issue in the [issue tracker](https://github.com/cwlowder/hyper-orama/issues).