//The node express server example app
var fs = require('fs'),
  http = require('http'),
  express = require('express');

var app = express();

app.use(require('connect-assets')({ src: __dirname + '/client/assets'}));
app.set('views', __dirname + '/examples/views');
app.set('view engine', 'jade');

//Bootstrap gets a special mapping
app.use('/components', express.static(__dirname + '/examples/components'));
app.use(express.bodyParser());

app.get('/examples/:path', function(req,res){
  res.render(req.params.path);
});

var port = process.env.PORT || 5000;
app.set('port', port);
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + port);
});