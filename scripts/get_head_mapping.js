var parse = require('csv-parse');
var request = require('request');
var fs = require('fs');
// var fileStream = fs.createReadStream('../raw/csv/fin_provision.csv', {
//   start: 0
// });
var fs = require('fs');

var url =
  "https://docs.google.com/spreadsheets/d/13jMkUNgkszuJGxuwsnwBMMhqKYqnAE0OOXe8rs8WYPM/export?gid=387534240&format=csv";


// https://docs.google.com/spreadsheets/d/13jMkUNgkszuJGxuwsnwBMMhqKYqnAE0OOXe8rs8WYPM/?format=csv
var mapping = {};
var engMapping = {};

var parser = parse({
  delimiter: ','
}, function(err, data) {
  // console.log(data);
  data.forEach(function(row) {
    if (row[0] === '總目 / Head (Code)') {
      return;
    }
    mapping[parseInt(row[0])] = row[1];
    engMapping[parseInt(row[0])] = row[3];
    // var doc2014 = transformToDoc(data, 2015);
  })
  fs.writeFile('head_mapping_chi.json', JSON.stringify(
    mapping));
  fs.writeFile('head_mapping_eng.json', JSON.stringify(
    engMapping));

});

request
  .get(url, function(err, response, body) {
    // console.log(response.headers['content-type']) // 'image/png'
    // console.log(response);
    console.log(body);
  }).pipe(parser);
//
