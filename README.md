# hyper-orama
A screen recorder for the hyper terminal

To use repo in your hyper terminal do the following:

```bash 
mkdir ~/.hyper-plugins # create these follows if they don't exist
mkdir ~/.hyper-plugins/local/ 

```

```bash 

cd ~/.hyper-plugins/local/
git clone git@github.com:cwlowder/hyper-orama.git
```


Add the following the lines to your `.hyper.js`:

```javascript

  // in development, you can create a directory under
  // `~/.hyper_plugins/local/` and include it here
  // to load it and avoid it being `npm install`ed
  // ... 
  localPlugins: ['hyper-orama'],
  // ... 

```

## Activate Plugin

Press `Control+Option+r`
 

