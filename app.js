var fs      = require('fs');
var async   = require('async');
var express = require('express');
var config  = require('./config');
var app     = express();
var path    = require('path');
var hbs     = require('hbs');

async.waterfall([
  loadMiddleware,
  loadModules,
  startServer
]);

function loadMiddleware(done) {
  async.each(config.middleware, function(m, next) {
    console.log('Loading middleware:', m);
    app.use(require('./middleware/' + m));
    next();
  }, done);
}

function loadModules(done) {
  async.each(config.modules, function(module, next) {
    console.log('Loading module:', module.name);
    loadModuleApi(module, function() {
      loadModuleController(module, next);
    });
  }, done);
}

function loadModuleApi(module, next) {
  var apiFile = './modules/' + module.name + '/api.js';
  fileExists(apiFile, function(exists) {
    if(exists) {
      var apiRoute = '/api' + module.route;
      console.log('  => api:', apiRoute);
      app.use(apiRoute, require(apiFile));
    }
    return next();
  });
}

function loadModuleController(module, next) {
  var controllerFile = './modules/' + module.name + '/controller.js';
  fileExists(controllerFile, function(exists) {
    if(exists) {
      console.log('  => controller:', module.route);
      app.use(module.route, require(controllerFile))
    }
    return next();
  });
}

function fileExists(file, done) {
  fs.stat(file, function(err, stat) {
    if(err && err.code == 'ENOENT') return done(false); 
    return done(true);
  });
}

function startServer() {
  
  // view engine
  app.set('view engine', 'hbs');
  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', path.join(__dirname, 'public'));

  // pass hbs local env
  hbs.localsAsTemplateData(app);
  app.locals.env = process.env.NODE_ENV;
  
  // start server
  var server = app.listen(config.port || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s in %s mode',  host, port, config.env);
  });
}