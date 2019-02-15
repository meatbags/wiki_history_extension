var path = require('path');
var webpack = require('webpack');

// modules
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var BabelUglifyPlugin = require('webpack-plugin-babel-uglify');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// path
var appName = 'CLM';
var pathJS = './src/app.js';
var pathSCSS = './style/main.js';
var pathOutput = 'dist';

module.exports = [{
    entry: {'app.min': pathJS},
    output: {
      library: appName,
      libraryTarget: 'var',
      path: path.resolve(__dirname, pathOutput),
      filename: '[name].js'
    },
    devtool: 'cheap-module-source-map',
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {loader: "babel-loader"}
      }]
    },
    plugins: [
      //new BabelUglifyPlugin(undefined)
    ],
    stats: {colors: true, warnings: false}
  },{
    entry: {'style.webpack': pathSCSS},
    output: {
      path: path.resolve(__dirname, pathOutput),
      filename: '[name].js'
    },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {importLoaders: 2, sourceMap: true}
          }, {
            loader: 'sass-loader',
            options: {sourceMap: true}
          }
        ]
      }]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    plugins: [new MiniCssExtractPlugin({filename: './style.css', allChunks: true})]
  }
];
