(function() {
  // DO NOT EDIT ANYTHING IN THIS FILE
  d3.queue()
    .defer(d3.csv, "fake-data.csv")
    .await(ready)

  var width = 400,
    height = 100

  var svg = d3.select("#chart4")
    .append("svg")
    .attr("width", 400)
    .attr("height", 100)
    .style("background", "red")

  // DO NOT EDIT ANYTHING IN THIS FILE
  function ready(error, datapoints) {
    // DO NOT EDIT ANYTHING IN THIS FILE
    svg.style("background", "green")
  }
})()