# Hyper-Orama

A screen recorder for the hyper terminal

![EXAMPLE-OUT](https://tmp-j3lhgp7nw.now.sh/terminal-session-632.6999999946565.webm)

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

![EXAMPLE-IN](https://share.pulley.host/nay411.mp4)

## Contributing

* _TODO_
