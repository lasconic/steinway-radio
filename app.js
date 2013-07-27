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

app.get('/playlist/push', function(req, res){
  var url = req.url;
  if(url) {
    resolveScore(url, 
      function(resp) {
        if(resp.statusCode == 200) {
          var data = '';
          resp.on('data', function(chunk) {   
                data += chunk;
          }).on('error', function(e) {  
                console.log("Got error: " + e.message); 
                res.send('Cannot read score metadata')  
          });
          resp.on('end', function() {
            var score = JSON.parse(data); 
            console.log(score.id + ' - ' + score.secret + ' - ' + score.metadata.pages);                                    
            var scoreSave = {id:score.id, secret : score.secret, pageCount:score.metadata.pages};
            client.lpush("playlist", JSON.stringify(scoreSave), function() {
              //publish new score to connected client
              //bayeux.getClient().publish('/' + sessionId + '/action', {
              //  command:"loadscore",
              // id:score.id
              //});
              res.send('Done');
            }); 
          });
        }
      },
      function() {res.send('Not a Musescore.com URL');})
  }
});

app.get('/playlist/pop', function(req, res){
  client.rpop("playlist", function (err, reply) {
        console.log(reply);
        var body = "";
        if(reply)
          body = reply;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', body.length);
        res.end(body);
  });
});



var resolveScore = function(msurl, endfunction, errorfunction) {
 var options = {  
             host: 'api.musescore.com',   
             port: 80,   
             path: '/services/rest/resolve.json?url=' + encodeURIComponent(msurl) + '&oauth_consumer_key=musichackday'  
        };
   var req = http.get(options, function(response302) {  
        if (response302.statusCode == 302) {
          var scoreURL = urlUtils.parse(response302.headers.location);
          options = {host: scoreURL.hostname,
                port:80,
                path:scoreURL.pathname + scoreURL.search
                };
          http.get(options, endfunction); 
        }  
   }).on('error', function(e) {  
        console.log("Got error: " + e.message);
        errorfunction();   
   }); 
}

app.listen(3000);
console.log('Listening on port 3000');