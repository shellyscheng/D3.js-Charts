(function() {
  var margin = { top: 30, left: 50, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 2");

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create your scales
  var xPositionScale = d3.scaleLinear().range([0, width]).domain([2000, 2009])
  var yPositionScale = d3.scaleLinear().range([height, 0]).domain([0, 15])
  var colorScale = d3.scaleOrdinal().range(['orange','green','purple','blue','yellow'])

  // Create a d3.line function that uses your scales
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.TIME)
    })
    .y(function(d) {
      return yPositionScale(d.Value)
    })

  d3.queue()
    .defer(d3.csv, "alcohol-consumption.csv")
    .await(ready);

  function ready(error, datapoints) {
    // Draw your dots

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.TIME)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.Value)
      })
      .attr("fill", function(d) {
        return colorScale(d.LOCATION)
      })


    var nested = d3.nest()
    .key(function(d) {
      return d.LOCATION
    })
    .entries(datapoints)

    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("d", function(d) {
        return line(d.values)
      })
      .attr("stroke", function(d) {
        return colorScale(d.key)
      })
      .attr("stroke-width", 2)
      .attr("fill", "none")
    
    // Draw your single line

    // Add your axes
    var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format("d"))

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    }
})();