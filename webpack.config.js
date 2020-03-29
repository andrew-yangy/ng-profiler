const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode:'development',
  entry: {
    'content-script': './packages/content-script',
    core: './packages/core',
    background: './packages/background',
    popup: './packages/popup/popup.ts'
  },
  devtool: 'source-map',
  cache: true,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'popup.html', to: 'popup.html' },
    ]),
  ]
};