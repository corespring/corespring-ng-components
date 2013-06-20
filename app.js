//The node express server example app
var fs = require('fs'),
  http = require('http'),
  packageInfo = require('./package'),
  _ = require('underscore'),
  express = require('express');

var app = express();

var files = fs.readdirSync('./examples');

var examples = _.filter(files, function(f){
   var isDir = fs.lstatSync('./examples/' + f).isDirectory();
   return isDir && f != 'components';
});

app.set('views', __dirname + '/examples');
app.set('view engine', 'jade');

//Bootstrap gets a special mapping
app.use('/components', express.static(__dirname + '/examples/components'));
app.use(express.bodyParser());

app.get('/examples/:path', function(req,res, next){

  var handleTemplate = function(err, html){
    if(err) {
      res.status(404).contentType('text/plain').send('Cannot GET /examples/' + req.params.path);
    } else {
      res.end(html);
    }
  };

  res.render(req.params.path, {path: req.params.path}, handleTemplate );
});

var handleAsset = function(suffix, req, res, next){
  var p = req.params.path.replace(suffix, "");
  res.sendfile('./examples/' + p + '/index' + suffix);
}

app.get('/corespring-ng-components.js', function(req,res,next){
  res.sendfile('./build/corespring-ng-components.js');
});

app.get('/examples/js/:path', function(req,res,next){
  handleAsset(".js", req, res, next);
});
app.get('/examples/css/:path', function(req,res,next){
  handleAsset(".css", req, res, next);
});

app.get('/', function(req, res){
  res.render('index', {
    version: packageInfo.version,
    description: packageInfo.description,
    prefix: '/examples',
    examples: examples});
})

var port = process.env.PORT || 5000;
app.set('port', port);
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + port);
});