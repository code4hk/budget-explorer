require('./vendor/angular-1.3.13');
angular.module('budgetExplorer', ['elasticsearch', 'nvd3'])
  .service('client', function(esFactory) {
    //TODO extract
    var HOST = "localhost:9200";
    return esFactory({
      host: HOST,
      apiVersion: '1.2',
      log: 'trace'
    });
  });

function _getHeadAndTitle(key) {
  var splitKey = key.split("_")
  return {
    "title": splitKey[1],
    "head": splitKey[0]
  }
}

angular.module('budgetExplorer')
  .controller('MainCtrl', function($scope, client) {

    function setBarChartData(hits) {
      var values = [];

      hits.forEach(function(hit) {
        var result = hit._source;
        if (!result) {
          return;
        }
        if (result.value === '') {
          return;
        }
        value = {
          "label": result.year,
          "value": result.value
        };
        values.push(value);
      });

      return [{
        key: "Cumulative Return",
        values: values
      }]
    }

    function _searchSavedBarChart(key) {

      //TODO this concat key search is weired. use filtered FieldQuery search is better
      client.search({
        index: 'budget',
        body: ejs.Request()
          .query(ejs.QueryStringQuery(key).fields([
            'key_not_analyzed'
          ])).size(100).sort(ejs.Sort("year"))
      }, function(error, response) {
        // handle response
        $scope._rawResults = response.hits.hits;
        $scope.totalResultsCount = response.hits.hits.length;
        $scope.data = setBarChartData(response.hits.hits);
      });
    }

    $scope.$on('queryChart', function($event, key) {
      _searchSavedBarChart(key);
    })
  })
  .controller('ResultsCtrl', function($scope) {
    $scope.options = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function(d) {
          return d.label;
        },
        y: function(d) {
          return d.value;
        },
        showValues: true,
        valueFormat: function(d) {
          return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        }
      }
    };

  })
  .directive('searchBar', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        // suggestionInfo: '='
        queryInfo: '='
      },
      templateUrl: 'templates/search-bar.html',
      link: function(scope, element) {
        scope.name = 'Jeff';
        // scope.suggestions = [{
        //   "category": "Charts", //type
        //   "results": [{
        //     "title": "緊急求救召喚數目",
        //     "head": "警務處"
        //   }]
        // }];
        scope.suggestions = [];
        scope.$watch('queryInfo.query', function(newVal) {
          console.log('testing' + newVal);
          //TODO debounce
          scope.$emit('searchSuggestions');
        });
        //seems event is better than scope inherit & watch collection here;
        scope.$on('suggestionsUpdated', function($event, suggestions) {
          scope.suggestions = suggestions;
        })

        function _showSuggestions() {

        }

        scope.queryChart = function(result) {
          console.log(result.head);
          scope.$emit('queryChart', result.head + "_" + result.title)
        }

      }
    };
  })
  .controller('QueryCtrl', function($scope, client, $timeout) {
    $scope.MAX_RESULTS = 5;
    $scope.queryInfo = {
      query: ""
    };

    $timeout(function() {
      $scope.queryInfo.query = "舉報";
    }, 2000);

    $scope.$on('searchSuggestions', function($event) {
      _searchForKeys();
    })

    function _searchForKeys() {
      var suggestions = [];
      // TermsAggregation
      // headId
      // convert headId into string for fuzzy match
      //need english key
      client.search({
        index: 'budget',
        body: ejs.Request()
          .query(ejs.QueryStringQuery($scope.queryInfo.query).fields([
            'key',
            'head'
          ]))
          .agg(ejs.TermsAggregation("unique").field("key_not_analyzed"))
          // .facet(ejs.TermsFacet('tags').field('tags'))
      }, function(error, response) {
        // handle response
        console.log(response.aggregations.unique.buckets);
        $scope.keyResults = response.aggregations.unique.buckets.map(
          function(bucket) {
            return bucket.key;
          });

        var suggestion = {
          "category": "Charts", //type
          "results": []
        };

        suggestion["results"] = $scope.keyResults
          .map(
            function(key) {
              return _getHeadAndTitle(key);
            });
        suggestions.push(suggestion);
        $scope.$broadcast('suggestionsUpdated', suggestions);

        // response.aggregations.unique.buckets;
      });
    }



    // _searchForKeys();
    // _searchSavedBarChart();


  })

angular.bootstrap(document, ["budgetExplorer"]);
