const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const packagejson = require('./package.json');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    index: ['./src/index.js'],
    dll: Object.keys(packagejson.dependencies)
  },
  // 将编译后的代码映射回原始源代码
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  // 代码分割
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         name: 'vendor',
  //         chunks: 'initial',
  //         minChunks: 2
  //       }
  //     }
  //   }
  // },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code',
      template: 'index.html'
    }),
    // new webpack.DllPlugin({
    //   path: path.join(__dirname, 'dist', '[name]-manifest.json'),
    //   name: '[name]_[hash]'
    // }),
    // new webpack.DllReferencePlugin({
		// 	context: path.join(__dirname, "..", "dll"),
		// 	manifest: require("./dist/dll-manifest.json") // eslint-disable-line
		// }),
    // 清理 /dist 文件夹
    new CleanWebpackPlugin(),
    // vue loader
    new VueLoaderPlugin()
  ],
  output: {
    path: path.join(__dirname, "dist"),
		filename: "dll.[name].js",
		library: "[name]_[hash]"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  }
};
