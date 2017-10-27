(function() {
  var margin = { top: 30, left: 50, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 780 - margin.left - margin.right;

  console.log("Building chart 1");

  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create a time parser
  var parseTime = d3.timeParse("%Y-%m-%d")

  // Create your scales
  var xPositionScale = d3.scaleLinear().range([0, width])
  var yPositionScale = d3.scaleLinear().range([height, 0])

  // Create a d3.line function that uses your scales
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.datetime)
    })
    .y(function(d) {
      return yPositionScale(d.Close)
    })

  // Now we read in our data
  // with .defer, this time we're adding a THIRD argument
  // instead of just.defer(d3.csv, "AAPL.csv")
  // it does converting and cleaning of each data point
  // as we read it in
  d3.queue()
    .defer(d3.csv, "AAPL.csv", function(d) {
      // d.Date is a string to begin with, but we can
      // imagine treating a date like a string doesn't
      // work well. So instead we use parseTime (which we
      // created up above) to turn it into a date.
      d.datetime = parseTime(d.Date);
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {
    // Update your scales
    var dates = datapoints.map(function(d) {return d.datetime})
    var closes = datapoints.map(function(d) {return +d.Close})

    var closeMin = d3.min(closes)
    var closeMax = d3.max(closes)
    var dateMin = d3.min(dates)
    var dateMax = d3.max(dates)

    xPositionScale.domain([dateMin, dateMax])
    yPositionScale.domain([closeMin, closeMax])

    // Draw your dots
    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.datetime)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.Close)
      })

    // Draw your single
    svg.append("path")
      .datum(datapoints)
      .attr("d", line)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none")

    // Add your axes
    var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat("%m/%d/%y"));
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