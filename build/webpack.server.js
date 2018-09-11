'use strict'

const webpack = require('webpack')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './src/entry-server.js'
  },
  target: 'node',
  devtool: isProd ? false : '#source-map',
  output: {
    path: path.join(process.cwd(), 'dist/index'),
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.es6$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
    ]
  },
  externals: nodeExternals({
    whitelist: /\.css$/,
    'Vue': true
  }),
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
};
