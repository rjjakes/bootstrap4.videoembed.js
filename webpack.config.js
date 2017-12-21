const path = require('path')
const webpack = require('webpack')

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
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.BannerPlugin({
            banner: `Copyright https://github.com/rjjakes
Repository: https://github.com/rjjakes/bootstrap4.videoembed.js
License: MIT

Includes:
https://www.npmjs.com/package/string-includes
https://www.npmjs.com/package/whatwg-fetch
`,
            entryOnly: true
        })
    ]
}