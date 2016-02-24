// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');

var config = {
    entry: {
        demo: [ path.resolve(__dirname, 'demo/demo.js') ],
    },
    output: {
        path: path.resolve(__dirname, 'demo/dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {}
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                  plugins: ['transform-runtime'],
                  presets: ['es2015', 'stage-0']
                }
            },
            {
                include: /\.json$/, loaders: ["json-loader"],
                extensions: ['', '.json', '.jsx', '.js']
            }
        ],
    }
};

module.exports = config;