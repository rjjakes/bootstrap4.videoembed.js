var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: ['whatwg-fetch', 'string-includes', './source/bootstrap4.videoembed.js'],
    output: {
        path: path.resolve(__dirname, 'distribution'),
        filename: 'bootstrap4.videoembed.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    }
}