const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['@babel/polyfill', './src/js/app.js'],

    devServer: {
        contentBase: './dist'
    },
    plugins: [  // used to copy the html from src to dist
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                // look for all the .js files not in node_modules folder
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}