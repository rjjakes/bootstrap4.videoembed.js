const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: ['whatwg-fetch', 'string-includes', './source/bootstrap4.videoembed.js'],
    output: {
        path: path.resolve(__dirname, 'distribution'),
        filename: 'bootstrap4.videoembed.min.js'
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
    },
    plugins: [
        new UglifyJsPlugin()
    ]
}