(function() {
	var margin = { top: 30, left: 30, right: 30, bottom: 30},
	height = 400 - margin.top - margin.bottom,
	width = 780 - margin.left - margin.right;

	console.log("Building chart 3");

	var svg = d3.select("#chart-3")
				.append("svg")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create your scales
	var xPositionScale = d3.scaleLinear().range([0, width]).domain([2000, 2014])
  var yPositionScale = d3.scaleLinear().range([height, 0]).domain([0, 500])
  var colorScale = d3.scaleOrdinal().range(['orange','green','purple','blue','yellow'])

	// Do you need a d3.line function for this? Maybe something similar?
	var line = d3.line()
    .x(function(d) { return xPositionScale(d.Year) })
    .y(function(d) { return yPositionScale(d.Value) })


	var area = d3.area()
    .x0(function(d) { return xPositionScale(d.Year)})
    .y0(function(d) { return yPositionScale(d.Value)})
    .x1(function(d) { return xPositionScale(d.Year)})
    .y1(function(d) { return height})

	// Import your data file using d3.queue()

	d3.queue()
    .defer(d3.csv, "air-emissions.csv")
    .await(ready)

	function ready(error, datapoints) {

		// Draw your areas
		var nested = d3.nest()
			.key(function(d) {return d.Country})
			.entries(datapoints)

		svg.selectAll("path")
      .data(nested)
      .enter().append("path")
      .attr("d", function(d) {return area(d.values)})
      .attr("stroke", "black")
      .attr("fill", function(d) {return colorScale(d.key)})
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)


		// Add your axes
		var xAxis = d3.axisBottom(xPositionScale)
    
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