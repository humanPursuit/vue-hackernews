const fs = require('fs');
const path = require('path');
const MFS = require('memoryfs');
const wepback = require('webpack');
const chokidar = require('chokidar');
const config = require('../webpack.config.js');

const readFile = (fs, file) => {
    try {
        return fs.readFileSync(path.join(config.output.path, file), 'utf-8')
    } catch (e) {
    }
}

module.exports = function setupDevServer(app, templatePath, cb) {
    let bundle
    let template
    let clientManifest

    let ready
    const readyPromise = new Promise(r => { ready = r });
    const update = () => {
        if (bundle && clientManifest) {
            ready()
            cb(bundle, {
                template,
                clientManifest,
            })
        }
    }

    template = fs.readFileSync(templatePath, 'utf-8');
    chokidar.watch(templatePath).on('change', function () {
        template = fs.readFileSync(templatePath, 'utf-8');
        console.log('template index.html updated.');
        update();
    });

    config.entry.app = ['webpack-hot-middleware/client', config.entry.app];
    config.output.filename = '[name].js';
    config.plugins.push([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugins(),
    ]);

    const compiler = webpack(config);
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true,
    });
    app.use(devMiddleware);
    compiler.plugin('done', stats => {
        stats = stats.toJSON();
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
        if (stats.errors.length) return
        clientManifest = JSON.parse(readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json'))
        update()
    })

    app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

    return readyPromise;
}
