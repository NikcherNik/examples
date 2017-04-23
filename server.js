var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.sendfile('index.html');
});
app.listen(8080);
console.log('Сервер стартовал!');
