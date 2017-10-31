const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const express = require('express');

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

const resolve = file => require('path').resolve(__dirname, file);
const serve = (path, cache) => express.static(resolve(path));

app.use('/dist', serve('./dist'));
// app.use('/static', serve('./static'));

app.use(devMiddleware);
app.use(require('connect-history-api-fallback')());

console.log('> Starting dev server...')
app.listen(3000)