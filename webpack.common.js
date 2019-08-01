const path = require('path');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
    entry: './src/js/app.js',
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
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:5].[ext]',
                        outputPath: './images/'
                    }
                }
            },
            {
                test: /\.svg$/,
                use: {
                    loader: 'svg-sprite-loader',
                    options: {
                      extract: true,
                      spriteFilename: 'sprite.[hash].svg',
                      publicPath: '/svg/'
                    }
                }
            }
        ]
    }
}