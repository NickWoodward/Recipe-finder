const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = merge(common, {
    mode: "development",
    output: {
        // when using devServer it injects into the html and will look in the path below
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.ejs',
            favicon: './src/assets/favicon.png',
        }),
        new SpriteLoaderPlugin()
    ]

});