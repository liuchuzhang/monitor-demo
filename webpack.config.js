const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const packagejson = require('./package.json');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
  name: 'app',
  entry: {
    // listen: './src/listenError.js',
    index: './src/index.js'
  },
  // 将编译后的代码映射回原始源代码
  devtool: 'source-map',
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
      template: 'index.html',
      chunks: ['index']
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(path.resolve(__dirname, 'dist', 'vendor.manifest.json')),
      name: 'vendor_library'
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dist', '*_dll.js')
    }),
    // 清理 /dist 文件夹
    // new CleanWebpackPlugin(),
    // vue loader
    new VueLoaderPlugin(),
    new webpack.HashedModuleIdsPlugin()
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]_library'
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
