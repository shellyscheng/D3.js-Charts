(function() {
  var margin = { top: 60, left: 50, right: 150, bottom: 30},
  height = 600 - margin.top - margin.bottom,
  width = 450 - margin.left - margin.right;

  //console.log("Building chart 11");

  var svg = d3.select("#chart-11")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create your scales
  var xPositionScale = d3.scalePoint()
    .domain(['2015', '2016'])
    .range([0, width])
  var yPositionScale = d3.scaleLinear().domain([0, 36]).range([height, 0])
  var colorScale = d3.scaleOrdinal()
    .domain(["Maryland", "Delaware", "Maine", "Florida", "Illinois", "Alaska", "Arkansas", "Colorado", "Indiana", "Iowa", "Kentucky", "Louisiana", "Minnesota", "Missouri", "Nebraska", "North Dakota", "Texas", "Virginia", "Washington", "Wyoming"])
    .range(['#4cc1fc','#4cc1fc','#4cc1fc','#4cc1fc','#4cc1fc','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333','#333333'])

  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.year)
    })
    .y(function(d) {
      return yPositionScale(d.deaths_per_100k)
    })

  d3.queue()
    .defer(d3.csv, "data/overdoses.csv", function(d) {
      d.deaths_per_100k = Math.round(d.deaths / d.population / 10)
      return d
    })
    .await(ready)

  // Import your data file using d3.queue()

  function ready(error, datapoints) {

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.year)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.deaths_per_100k)
      })
      .attr("fill", function(d) {
        return colorScale(d.state)
      })


    var nested = d3.nest()
      .key(function(d) {
        return d.state
      })
      .entries(datapoints)

    svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("stroke", function(d) {
        return colorScale(d.key)
      })
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("d", function(d) {
        return line(d.values)
      })

    svg.selectAll("text")
      .data(nested)
      .enter().append("text")
      .attr("font-size", 12)
      .attr("fill", '#333333')
      .attr("x", xPositionScale('2016'))
      .attr("dx", 5)
      .attr("y", function(d) {
        console.log(d.values[1].deaths_per_100k)
        return yPositionScale(d.values[1].deaths_per_100k)
      })
      .text(function(d) {
        return d.values[1].deaths_per_100k + " " + d.key
      })
      .attr("dy", function(d) {
        if(d.key === "Texas") {
          return 18
        }
        if(d.key === "Virginia") {
          return -12
        }
        return 3
      })
      
    var xAxis = d3.axisBottom(xPositionScale)

    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .lower() // move to the bottom of the stack

    var yAxis = d3.axisLeft(yPositionScale)
      .tickValues([5, 10, 15, 20, 25, 30, 35])
      .tickSize(-width)

    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)
      .lower() // move to the bottom of the stack

    svg.selectAll(".y-axis path").remove()
    svg.selectAll(".y-axis text").remove()
    svg.selectAll(".y-axis line")
          .attr("stroke-dasharray", 2)
          .attr("stroke", "grey")

    }
})();