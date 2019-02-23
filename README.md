# hyper-orama
A screen recorder for the hyper terminal

To add this plugin for development in the hyper terminal:


## Setup
For initial setup, follow: https://github.com/zeit/hyper/blob/master/PLUGINS.md#create-a-dev-config-file

  *MAC NOTE:* 
    the plugin directory is automatically created in `~/.hyper-plugins/local/` on mac, use this instead of `.hyper-plugins/local/`

Clone the repository into `.hyper-plugins/local/`:

```bash 
cd <repository_root>/.hyper-plugins/local/
git clone git@github.com:cwlowder/hyper-orama.git
```

Add `hyper-orama` to the localPlugins array in `.hyper.js`

Your `hyper.js` file should look like this: 
```javascript
  // ... 
  localPlugins: ['hyper-orama'],
  // ... 

```

## Activate Plugin

Press `Control+Shift+r`
 

