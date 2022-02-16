const path = require('path');

module.exports = {
  // Development mode for NodeJS
  mode: 'development',

  // Entry point for the compilation
  entry: './src/index.js',

  // Output config
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },

  // Use source map for debugging
  devtool: 'inline-source-map',

  // Dev server config
  devServer: {
    // Enable webpack hot module replacement without reloading, when possible
    hot: true,
    // Open browser on server start
    open: true,
    // Statit directory for non-compilable items
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
};
