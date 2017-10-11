const webpackConfig = require('./webpack.config');
const webpack = require('webpack');

const app = express();
const compiler = webpack(webpackConfig);

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
});

app.use(devMiddleware);
app.use(require('connect-history-api-fallback')());

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})


console.log('> Starting dev server...')
app.listen(3000)