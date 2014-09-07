var express = require('express')
var app = express.createServer(express.logger())
var pg = require('pg').native

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/dailyjs'
var start = new Date()
var port = process.env.PORT || 3000

var client;
client = new pg.Client(connectionString);
client.connect();

app.get('/', function(req, res) {
  var date = new Date();

  client.query('INSERT INTO visits(date) VALUES($1)', [date]);

  query = client.query('SELECT COUNT(date) AS count FROM visits WHERE date = $1', [date]);
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
      return res.send('No data found');
    } else {
      res.send('Visits today: ' + result.count);
    }
  });
});

app.listen(port, function() {
  console.log('Listening on:', port);
});