(function() {
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var canvas = d3.select("#chart-1")
        .append("canvas")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)

  var context = canvas.node().getContext("2d")

  // Practice using fake data
  var xPositionScale = d3.scaleLinear().range([0, width])
  var yPositionScale = d3.scaleLinear().range([height, 0])
  // var colorScale = d3.scaleLinear().range(['red', 'blue'])
  var colorScale = d3.scaleSequential().interpolator(d3.interpolateRainbow)

  d3.queue()
    .await(ready)

  function ready(error) {
    columnCount = 200
    var datapoints = d3.range(5000).map(function(i) {
      return { 
        // build into a list of rows and columns
        index: i,
        row: Math.floor(i / columnCount),
        column: i % columnCount
      }
    })

    var maxRow = d3.max(datapoints, function(d) { return d.row })
    yPositionScale.domain([0, maxRow])
    
    var maxColumn = d3.max(datapoints, function(d) { return d.column })
    xPositionScale.domain([0, maxColumn])

    var maxIndex = d3.max(datapoints, function(d) { return d.index })
    colorScale.domain([0, maxIndex])

    console.log(datapoints)

  };

})();
