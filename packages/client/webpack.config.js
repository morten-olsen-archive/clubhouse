const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'clubhouse-protocol': path.join(__dirname, '../protocol/src/index.ts'),
      'clubhouse-hooks': path.join(__dirname, '../hooks/src/index.ts'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.tsx?/,
      loader: 'babel-loader',
    }],
  },
};

module.exports = config;
