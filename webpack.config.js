var webpack = require('webpack');

console.log(__dirname)
module.exports = {
    entry: './src/main',
    output: {
        filename: 'build.js',
        path: __dirname + '/static/',
        publicPath: __dirname + '/static/',
    },
    module: {
        noParse: /es6-promise\.js/,
        rules: [
            {
                test: /\.vue$/,
                loader: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            less: ['vue-style-loader', 'css-loader', {
                                loader: 'less-loader',
                                sourceMap: true,
                            }],
                        }
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist||vue-router\/|vue-hot-reload-api\//,
                loader: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['transform-runtime'],
                        presets: ['es2015'],
                    },
                },
            },

        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new webpack.optimize.OccurenceOrderPlugin()
    ]
} else {
    module.exports.devtool = 'source-map';
}