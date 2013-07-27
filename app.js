var express = require('express')  
, routes = require('./routes');
var app = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var redis = require("redis"),
client = redis.createClient();

app.get('/', routes.index);

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/playlist/push/:id/:secret', function(req, res){
  var body = req.params.id + " - " + req.params.secret;
  client.lpush("playlist", req.params.id + ";" + req.params.secret)
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});

app.get('/playlist/pop', function(req, res){
  client.rpop("playlist", function (err, reply) {
        console.log(reply);
        var body = "";
        if(reply)
          body = reply;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', body.length);
        res.end(body);
  });
});

app.listen(3000);
console.log('Listening on port 3000');