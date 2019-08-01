const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const Dotenv = require('dotenv-webpack');


module.exports = merge(common, {
    mode: "production",
    output: {

        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.[contentHash].js'
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(), // this overrides the default js minimizer
            new TerserPlugin()
        ] 
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,  // extract rather than inject css
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/index.ejs',
            favicon: './src/assets/favicon.png',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),
        new SpriteLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[contentHash].css"
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./js/*', './svg/*', './images/*']
        }),
        new Dotenv()
    ]
});