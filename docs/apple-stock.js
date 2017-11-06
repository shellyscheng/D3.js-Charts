(function() {
  var margin = { top: 40, left: 50, right: 50, bottom: 40},
  height = 350 - margin.top - margin.bottom,
  width = 700 - margin.left - margin.right;

  console.log("Building chart 10");

  var svg = d3.select("#chart-10")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create a time parser
  var parseTime = d3.timeParse("%Y-%m-%d")

  var dateFormat = d3.timeFormat("%b %Y")

  // Create your scales
  var xPositionScale = d3.scaleLinear().range([0, width])
  var yPositionScale = d3.scaleLinear().domain([90, 125]).range([height, 0])

  // Create a d3.line function that uses your scales
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.datetime)
    })
    .y(function(d) {
      return yPositionScale(d.Close)
    })
    .curve(d3.curveMonotoneX)


  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>" + dateFormat(d.datetime) +":</strong> <span>" + d.Close + "</span>"
    })

  svg.call(tip)

  // Now we read in our data
  // with .defer, this time we're adding a THIRD argument
  // instead of just.defer(d3.csv, "AAPL.csv")
  // it does converting and cleaning of each data point
  // as we read it in
  d3.queue()
    .defer(d3.csv, "data/AAPL.csv", function(d) {
      // d.Date is a string to begin with, but we can
      // imagine treating a date like a string doesn't
      // work well. So instead we use parseTime (which we
      // created up above) to turn it into a date.
      d.datetime = parseTime(d.Date);
      return d;
    })
    .await(ready);

  function ready(error, datapoints) {
    var dates = datapoints.map(function(d) { return d.datetime })

    var dateMax = d3.max(dates)
    var dateMin = d3.min(dates)

    xPositionScale.domain([dateMin, dateMax])

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
      .attr("fill", "#4cc1fc")
      .on("mouseover", function(d) {

        var element = d3.select(this)

        if(element.attr("r") === '3') {
          element.transition().attr("r", 5)
        }
        return tip.show(d)
      })
      .on("mouseout", function(d) {

        var element = d3.select(this)

        if(element.attr("r") === '5') {
          element.transition().attr("r", 3)
        }
        return tip.hide(d)
      })
      

    // Draw your single line
    svg.append("path")
      .datum(datapoints)
      .attr("d", line)
      .attr("stroke", "#4cc1fc")
      .attr("stroke-width", 2)
      .attr("fill", "none")

    svg.append("text")
      .text("AAPL stock price")
      .attr("x", width / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", 22)
      .attr("font-weight", "bold")

    // Add your axes
    var xAxis = d3.axisBottom(xPositionScale)
      .tickFormat(d3.timeFormat("%b %Y"))
      .ticks(5)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionScale)
      .tickValues([100, 110, 120])
      .tickSize(-width)
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    svg.selectAll(".y-axis path").remove()
    svg.selectAll(".y-axis line")
          .attr("stroke-dasharray", 2)
          .attr("stroke", "grey")

    }
})();