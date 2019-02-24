# Hyper-Orama

A screen recorder for the hyper terminal. It publishes all captured sessions to [now.sh](https://zeit.co/now)

![EXAMPLE-OUT](demo-out.gif)

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

![EXAMPLE-IN](demo-in.gif)

## Contributing

* _TODO_
