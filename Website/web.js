const app = require('express')();
const path = require('path');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/main.html'));
});

app.listen('55578')