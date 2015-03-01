var parse = require('csv-parse');
var fs = require('fs');
var _ = require('underscore');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200'
});
var headMap = require('./head_mapping_chi.json');

function parse_csv_file(filename, row_handler) {
	var rs = fs.createReadStream(filename);
	rs.on('error', function(err) {
		console.log(err);
	});
	
	var parser = parse({
	  delimiter: ','
	}, function(err, data) {
		_.each(data.slice(1, 5), row_handler);
	});

	rs.pipe(parser);
}

function revenues_heads(row) {
	var structured = {
		year: row[0],
		value: row[2],
		key: 'Revenues per head',
		head: headMap[row[1]],	// undefined for under 21
		headId: row[1]
	};
}

function expenditures_heads(row) {
	var structured = {
		year: row[0],
		value: row[2],
		key: 'Expenditures per head',
		head: headMap[row[1]],
		headId: row[1]
	};
}

parse_csv_file('../raw/csv/revenues_heads_data.csv', revenues_heads);
parse_csv_file('../raw/csv/expenditures_heads_data.csv', expenditures_heads);
