'use strict'

const {production} = require('./webpack.vars')

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        include: /(sprites|icons)/,
        loader: 'svg-sprite-loader?name=[name]_[hash]'
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        exclude: /(sprites|icons)/,
        loader: `file-loader?path=img&name=[name]${production ? '.[hash]' : ''}.[ext]`
      }
    ]
  }
}
