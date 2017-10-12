const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const express = require('express');

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

app.use(devMiddleware);
app.use(require('connect-history-api-fallback')());
app.use('/dist', express.static('./dist'))

console.log('> Starting dev server...')
app.listen(3000)