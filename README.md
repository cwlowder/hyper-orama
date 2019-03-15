# Hyper-Orama
[![All Contributors](https://flat.badgen.net/github/contributors/cwlowder/hyper-orama)](#contributors)

A beautiful screen recorder for ZEIT's Hyper terminal. All captured sessions are automatically published to [now.sh](https://zeit.co/now) or saved locally. Share snippets of your work easily with the press of a button! 

![hyper-orama-demo](https://user-images.githubusercontent.com/35539750/54399585-10efe100-468d-11e9-9822-e0220a8e3152.gif)

## Usage

```sh
hyper i hyper-orama
```

or, in `.hyper.js`:

```json
// ...
plugins: [ /* ... */, 'hyper-orama' ]
// ...
```

Use `Ctrl+Alt+R` to start/stop recording.

## Setup

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

## Recording Videos

To start/stop recording:

* `Ctrl+Alt+R` (Windows/Linux)
* `Control+Option+R` (Mac).

After recording, the video will be processed and uploaded. The link will be copied to your clipboard, and a notification will appear in the lower right of the terminal.

The pulsing red light indicates recording in progress, and the white dot indicates upload in progress.

![hyper-orama-recording-demo](https://user-images.githubusercontent.com/35539750/54399586-10efe100-468d-11e9-9079-9730878956a0.gif)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/7193187?v=4" width="100px;" alt="Logan Pulley"/><br /><sub><b>Logan Pulley</b></sub>](https://github.com/lpulley)<br />[📖](https://github.com/cwlowder/hyper-orama/commits?author=lpulley "Documentation") [🤔](#ideas-lpulley "Ideas, Planning, & Feedback") [👀](#review-lpulley "Reviewed Pull Requests") | [<img src="https://avatars2.githubusercontent.com/u/1410520?v=4" width="100px;" alt="Juan Campa"/><br /><sub><b>Juan Campa</b></sub>](https://github.com/juancampa)<br />[📋](#eventOrganizing-juancampa "Event Organizing") [🤔](#ideas-juancampa "Ideas, Planning, & Feedback") [🚇](#infra-juancampa "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-juancampa "Reviewed Pull Requests") [⚠️](https://github.com/cwlowder/hyper-orama/commits?author=juancampa "Tests") | [<img src="https://avatars1.githubusercontent.com/u/35539750?v=4" width="100px;" alt="Rio Martinez"/><br /><sub><b>Rio Martinez</b></sub>](https://www.linkedin.com/in/rio-martinez/)<br />[💻](https://github.com/cwlowder/hyper-orama/commits?author=rioam2 "Code") [🎨](#design-rioam2 "Design") [🐛](https://github.com/cwlowder/hyper-orama/issues?q=author%3Arioam2 "Bug reports") [⚠️](https://github.com/cwlowder/hyper-orama/commits?author=rioam2 "Tests") | [<img src="https://avatars2.githubusercontent.com/u/17896701?v=4" width="100px;" alt="Kevin Mui"/><br /><sub><b>Kevin Mui</b></sub>](http://pages.cs.wisc.edu/~mui/)<br />[💻](https://github.com/cwlowder/hyper-orama/commits?author=kmui2 "Code") [👀](#review-kmui2 "Reviewed Pull Requests") [⚠️](https://github.com/cwlowder/hyper-orama/commits?author=kmui2 "Tests") | [<img src="https://avatars2.githubusercontent.com/u/17357997?v=4" width="100px;" alt="Curtis Lowder"/><br /><sub><b>Curtis Lowder</b></sub>](https://github.com/cwlowder)<br />[📖](https://github.com/cwlowder/hyper-orama/commits?author=cwlowder "Documentation") [🤔](#ideas-cwlowder "Ideas, Planning, & Feedback") [🐛](https://github.com/cwlowder/hyper-orama/issues?q=author%3Acwlowder "Bug reports") [💻](https://github.com/cwlowder/hyper-orama/commits?author=cwlowder "Code") | [<img src="https://avatars0.githubusercontent.com/u/8135112?v=4" width="100px;" alt="Josh Martin"/><br /><sub><b>Josh Martin</b></sub>](https://cjoshmartin.com)<br />[💻](https://github.com/cwlowder/hyper-orama/commits?author=cjoshmartin "Code") [💬](#question-cjoshmartin "Answering Questions") [🐛](https://github.com/cwlowder/hyper-orama/issues?q=author%3Acjoshmartin "Bug reports") [📖](https://github.com/cwlowder/hyper-orama/commits?author=cjoshmartin "Documentation") [🚧](#maintenance-cjoshmartin "Maintenance") | [<img src="https://avatars1.githubusercontent.com/u/9947422?v=4" width="100px;" alt="Tejas Kumar"/><br /><sub><b>Tejas Kumar</b></sub>](https://twitter.com/tejaskumar_)<br />[📋](#eventOrganizing-TejasQ "Event Organizing") [🤔](#ideas-TejasQ "Ideas, Planning, & Feedback") [🚇](#infra-TejasQ "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-TejasQ "Reviewed Pull Requests") [⚠️](https://github.com/cwlowder/hyper-orama/commits?author=TejasQ "Tests") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

