var request = require('request');

var parse = require('csv-parse');
var _ = require('lodash');

var elasticsearch = require('elasticsearch');

var headTitles = require('./head-titles.json');

var client = new elasticsearch.Client({
  host: 'localhost:9200'
});

var years = [];

for (var i = 2005; i <= 2014; i++) {
  years.push(i);
}

function transformToDoc(row, head) {
  var docs = [];
  _.forEach(years, function(y) {
    var doc = {};
    doc['key'] = row['Key'];
    doc['year'] = y;
    doc['value'] = row[y.toString()];
    doc['headId'] = head;
    doc['head'] = headTitles[head.toString()];
    console.log(doc['value']);
    docs.push(doc);
  })
  return docs;
}

function sendIndexingCommands(client, indexingCommands) {
  client.bulk({
    body: indexingCommands
  }, function(err, resp) {
    // ...
    console.log(resp);
  });
}

var head = 122;
var parser = parse({
  delimiter: ',',
  columns: true
}, function(err, data) {
  console.log('parsed');
  console.log(data);
  _.forEach(data, function(row) {
    documents = transformToDoc(row, head);
    var indexingCommands = [];

    _.forEach(documents, function(doc) {
      indexingCommands.push({
        index: {
          _index: 'budget',
          _type: head,
          id: doc.key + doc.year
        }
      });
      indexingCommands.push(doc);
    })
    console.log(indexingCommands);
    sendIndexingCommands(client, indexingCommands);

  })



});

// client.search({
//   q: 'pants'
// }).then(function(body) {
//   var hits = body.hits.hits;
// }, function(error) {
//   console.trace(error.message);
// });

console.log('send request to es');
var url =
  "https://docs.google.com/spreadsheets/d/1bAwOqDhvItp9vJDm2NgIpbdguRI7BKc5tHtRtVFUo4Y/export?format=csv";
request
  .get(url, function(err, response, body) {
    // console.log(response.statusCode) // 200
    // console.log(response.headers['content-type']) // 'image/png'
    // console.log(response);
    console.log(body);
  }).pipe(parser);



// # 1 record
// for all years ?
//
//   #more long - term 1 record 1 year then aggregate - > min, max, etc
