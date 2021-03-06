const path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, '../public/app.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  }
};
