var parse = require('csv-parse');
var fs = require('fs');
var url =
  'https://docs.google.com/spreadsheets/d/13jMkUNgkszuJGxuwsnwBMMhqKYqnAE0OOXe8rs8WYPM/export?format=csv';
var reques = require('request');
var fileStream = fs.createReadStream('../raw/csv/des.csv', {
  start: 0
});



//TODO load from config
var headMap = require('./head_mapping.csv');

var parser = parse({
  delimiter: ','
}, function(err, data) {
  // console.log(data);
  data.forEach(function(row) {
    var doc2015 = transformToDoc(row, 2015);
    console.log(doc2015);
    // var doc2014 = transformToDoc(data, 2015);
  })
});

var transformToDoc = function(row, year) {
  var doc = {
    headId: row[0],
    key: row[2]
  }
  if (year === 2014) {
    doc["value"] = row[3];
  } else if (year === 2015) {
    doc["value"] = row[6];
  }
  doc["head"] = headMap[doc.headId];
  return doc;
}



fileStream.pipe(parser);
