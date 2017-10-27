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
  var xPositionScale = d3.scaleLinear()
    .range([0, width])
    .domain([2010, 2014])

  var yPositionScale = d3.scaleLinear()
    .range([height, 0])
    .domain([1000, 11000])

  var colorScale = d3.scaleOrdinal()
    .range(['#1b9e77', '#d95f02', '#e7298a', '#66a61e', '#e6ab02'])

  // Create a d3.line function that uses your scales
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.year)
    })
    .y(function(d) {
      return yPositionScale(d.deaths)
    })

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Death:</strong> <span>" + d.deaths + "</span>";
    })

  svg.call(tip)


  d3.queue()
    .defer(d3.csv, "drug.csv")
    .await(ready);

  function ready(error, datapoints) {
    // Draw your dots

    svg.selectAll("circle")
      .data(datapoints)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", function(d) {
        return xPositionScale(d.year)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.deaths)
      })
      .attr("fill", function(d) {
      	return colorScale(d.drug)
      })
      .on("click", function(d) {
        // d3, go get the
        // element and make
        // the radius 30

        var element = d3.select(this)

        if(element.attr("r") === '20') {
          element.transition().attr("r", 3)
        } else {
          element.transition().attr("r", 20)
        }
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)


    var nested = d3.nest()
    .key(function(d) {
    	return d.drug
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
    // svg.append("path")
    //   .datum(datapoints)
    //   .attr("d", line)

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