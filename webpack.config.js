const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './src/main',
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/',
    },
    resolve: {
        alias: {
            'create-api': './create-api-client.js'
        }
    },
    devtool: isProd ? false : 'source-map',
    module: {
        noParse: /es6-promise\.js/,
        rules: [
            {
                test: /\.vue$/,
                loader: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: process.env.NODE_ENV === 'production',
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['transform-runtime'],
                        presets: ['es2015'],
                    },
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]',
                },
            },
            {
                test: /\.css$/,
                use: isProd ? ExtractTextPlugin.extract({
                    use: 'css-loader?minimize',
                    fallback: 'vue-style-loader',
                }) :
                    ['vue-style-loader', 'css-loader'],
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        port: 3000,
    },
    performance: {
        maxEntrypointSize: 300000,
        hints: isProd ? 'warning' : false,
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].css'
        })
    ]
} else {
    module.exports.plugins = [
        // strip dev-only code in vue source
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new FriendlyErrorsPlugin(),
        // extract vendor chunks for better caching
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                return (
                    /node_modules/.test(module.context) &&
                    ~/\.css$/.test(module.request)
                );
            }
        }),
        // extract webpack runtime & manifest to avoid vendor chunk hash changing
        // on every build.
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
        }),
    ]
}

module.exports.plugins = module.exports.plugins.concat([
    new HtmlWebpackPlugin({
        chunksSortMode: 'dependency',
        template: 'index.html',
        filename: path.resolve(__dirname, 'dist/index.html'),
        inject: true,
    })
]);