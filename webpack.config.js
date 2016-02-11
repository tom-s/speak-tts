// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.js');
var pathToVendors =  path.resolve(__dirname, 'src/js/vendors/');

var config = {
    entry: {
        app: [ path.resolve(__dirname, 'src/js/app.js') ],
        vendors: []
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {}
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?stage=1&optional=runtime'
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass?outputStyle=expanded=includePaths[]=" + node_modules + "/bootstrap-sass/assets/stylesheets/"
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            },
            {
                include: /\.json$/, loaders: ["json-loader"],
                extensions: ['', '.json', '.jsx', '.js']
            }
        ],
        noParse: [pathToReact, pathToVendors]
    }
};

module.exports = config;