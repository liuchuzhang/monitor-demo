const path = require('path')
const webpack = require('webpack')
const packagejson = require('./package.json')

module.exports = {
  entry: {
    // 公共依赖
    vendor: Object.keys(packagejson.dependencies)
  },
  plugins: [
    // 生成 manifest.json
    new webpack.DllPlugin({
      name: '[name]_dll',
      path: path.resolve(__dirname, 'dist', '[name].manifest.json')
    })
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]_dll.js",
    library: "[name]_library"
  }
}