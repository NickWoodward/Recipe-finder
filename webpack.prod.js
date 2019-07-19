const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common, {
    mode: "development",
    output: {
        // when using devServer it injects into the html 
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.[contentHash].js'
    }

});