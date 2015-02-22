require('./vendor/angular-1.3.13');
angular.module('budgetExplorer', ['dangle', 'elasticsearch', 'nvd3'])
  .service('client', function(esFactory) {
    return esFactory({
      host: 'localhost:9200',
      apiVersion: '1.2',
      log: 'trace'
    });
  });



angular.module('budgetExplorer')
  .controller('MainCtrl', function($scope, client) {

    function _searchSavedBarChart() {
      client.search({
        index: 'budget',
        body: ejs.Request()
          .query(ejs.QueryStringQuery('緊急求救召喚數目'))
          // .facet(ejs.TermsFacet('tags').field('tags'))
      }, function(error, response) {
        // handle response
        console.log(response);
        $scope._rawResults = response.hits.hits;

        $scope.data = barChartFromData(response.hits.hits);
      });

    }

    function barChartFromData(hits) {
      var values = [];

      hits.forEach(function(hit) {
        console.log(hit);
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
      })

      $scope.data = [{
        key: "Cumulative Return",
        values: values
      }]
      return $scope.data;
    }

    _searchSavedBarChart();

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

angular.bootstrap(document, ["budgetExplorer"]);
