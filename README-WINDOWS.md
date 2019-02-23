# hyper-orama
A screen recorder for the hyper terminal

To add this plugin for development in the hyper terminal:

For initial setup, follow: https://github.com/zeit/hyper/blob/master/PLUGINS.md#setup-your-plugin

Clone the repository into `.hyper-plugins/local/`:

```bash 
cd <repository_root>/.hyper-plugins/local/
git clone https://github.com/cwlowder/hyper-orama
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
 

