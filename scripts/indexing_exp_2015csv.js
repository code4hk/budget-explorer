var parse = require('csv-parse');
var fs = require('fs');
var _ = require('underscore');
var url =
  'https://docs.google.com/spreadsheets/d/13jMkUNgkszuJGxuwsnwBMMhqKYqnAE0OOXe8rs8WYPM/export?format=csv';
var reques = require('request');
var fileStream = fs.createReadStream('../raw/csv/des.csv', {
  start: 0
});

var headMap = require('./head_mapping_chi.json');

var parser = parse({
  delimiter: ','
}, function(err, data) {
  // console.log(data);
  var docs = [];
  data.forEach(function(row) {
    var doc2015 = transformer.transform(row, transformMapping2015, {
      "year": 2014
    });
    docs.push(doc2015);
    // var doc2014 = transformToDoc(row, 2014);
    // docs.push(doc2014);
  })
  console.log(docs);
});

//key to put:
//if number: which row index to take
//e.g {value:3} will have doc["value"]=row[3]
//if string: which key to load from context
//e.g. {headKey:headKey} will have doc["headKey"]=context["headKey"]

var transformMapping2015 = {
  "headId": 0,
  "head": "headKey",
  "year": "year",
  "composition": 5,
  "key": 2,
  "value": function(row) {
      return row[3] * 1000;
    } //most dynamic field
}

var context2015 = {

}

var transformMapping2014 = _.clone(transformMapping2015);

transformMapping2014["value"] = function(row) {
  return row[6] * 1000;
};

// var _transformToDoc = function(row,mapping, context){}
var transformer = {};
transformer._getValueByMethod = function(row, mappingMethod, context) {
  switch (typeof mappingMethod) {
    case 'function':
      return mappingMethod(row);
    case 'string':
      return row[mapping[mappingMethod]];
    case 'number':
      return row[mappingMethod];
    default:
      throw new Error('Wrong Mapping!' + typeof mappingMethod);
  }
}

transformer.transform = function(row, mapping, context) {
  var doc = [];
  Object.keys(mapping).forEach(function(key) {
    var value = transformer._getValueByMethod(row, mapping[key], context);
    doc[key] = value;
  });
  return doc;
}

//TODO sync w/ legacy years transfomrer
var transformToDoc = function(row, year) {
  var doc = {
    headId: row[0],
    headKey: headMap[row[0]],
    key: row[2]
  }
  if (year === 2014) {
    doc["value"] = row[3];
  } else if (year === 2015) {
    doc["value"] = row[6] * 1000; //From the column. TODO detect from column header
    doc["composition"] = row[5];
    doc['key_not_analyzed'] = doc.headKey + "_" + doc.key;
  }
  doc["year"] = year;
  doc["head"] = doc.headKey;
  return doc;
}


fileStream.pipe(parser);
